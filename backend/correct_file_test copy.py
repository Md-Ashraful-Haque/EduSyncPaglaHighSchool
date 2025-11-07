import sys
import backend.wsgi
import csv, os, re
from django.db.models import Q
from django.db.models import Prefetch
from ims_04_result.models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from ims_01_institute.models import Section
from django.db.models import ForeignKey 
from django.db.models import Prefetch, Case, When, Value, IntegerField
from django.db.models import Sum
from collections import defaultdict 
os.system('clear')

# //////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// query variable name //////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////

institute_id = 1
year = 2025
class_name = "Six"
group_name = "common"
exam_name = 'বার্ষিক/নির্বাচনী পরীক্ষা'


# //////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// main calculation //////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////

# Dictionary to store highest marks, roll number, and section for each subject
subject_highest_marks = defaultdict(lambda: (None,0.0, None, None))

results = StudentSubjectResult.objects.select_related(
    'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
).filter(
    institute__id=institute_id,
    year__year=year,
    class_instance__class_name__name=class_name,
    group__group_name='common',
    exam__exam_name=exam_name,
).order_by('student__roll_number')

print("\t\t\tFull Marks Pass Marks MCQ, Theory Total Letter Grade  Grade Point Pass/Fail")


update_result_objects = []
for result in results:
    
    
    # Calculate total marks (excluding optional subject)
    all_subjects = result.subjectforresult.all().order_by('subject__serial_number')  # Already ordered by subject__serial_number
    total_subjects = len(all_subjects) - 1  # Exclude optional subject
    total_marks = sum(subject.total_marks for subject in all_subjects[:total_subjects])
    
    all_subjects_without_optinal = all_subjects[:total_subjects]
    
    
    print("Final GPA : ", result.final_gpa)
    print("Final Grade: ", result.final_grade)
    print("Total Fail: ", result.failed_subject_count) 
    print("Total Marks: ", total_marks)
    print("---------------------------------------")

    # Update model instance fields
    result.gpa = result.final_gpa
    result.letter_grade = result.final_grade
    result.total_fail_subjects = result.failed_subject_count
    result.total_obtained_marks = total_marks
    update_result_objects.append(result)
    
    
    
    
    for subject in all_subjects_without_optinal:
        
        subject_name = subject.subject.subject_name.name
        subject_id = subject.subject.id #subject ID of SubjectForIMS Model
        
        total_marks = subject.total_marks
        roll_number = result.student.roll_number
        section_name = result.student.section
        
        # Update highest marks for this subject if current marks are higher
        if total_marks > subject_highest_marks[subject_id][1]: # index 1 is for total_marks
            subject_highest_marks[subject_id] = (subject_name, total_marks, roll_number, section_name, )
            
        print(f"{subject_name[:10]}\t\t: {subject.subject.full_marks}--{subject.subject.pass_marks}--", end='')

        #print all marks of a subject
        for mark in subject.typewisemarksforsubject.all():
            print(f"{mark.marks}--", end='')
        
        #print total marks, grade, point, and pass status of a subject
        print(f"{total_marks}--{subject.grade_and_point}--{subject.has_passed_all_mark_types}")
    
    print('------------------------------------------------------------------------------------')

# Perform bulk update for update result of a student
if update_result_objects:
    StudentSubjectResult.objects.bulk_update(
        update_result_objects,
        ['gpa', 'letter_grade', 'total_fail_subjects','total_obtained_marks']
    )

# Print highest marks, roll number, and section for each subject
print("\nHighest Marks Per Subject:")
for subject_id, (subject_name, highest_marks, roll_number, section_name) in subject_highest_marks.items():
    print(f"{subject_name[:10]}({subject_id}) \t: {highest_marks} (Roll: {roll_number}, Section: {section_name})")



# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////////  Create or update highest marks for each subject ///////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Prepare lists for bulk create and update
create_objects = []
update_objects = []

# Check existing records
existing_records = {obj.subject_id: obj for obj in SubjectHighestMarks.objects.filter(
    subject__in=subject_highest_marks.keys()
)}

for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
    if subject_id in existing_records:
        # Update existing record
        obj = existing_records[subject_id]
        obj.highest_marks = highest_marks
        obj.roll = roll
        obj.section_name = section
        obj.subject_id = subject_id  # Assuming subject_id is the ID or ForeignKey reference
        update_objects.append(obj)
    else:
        # Create new record
        create_objects.append(
            SubjectHighestMarks(
                subject_id=subject_id,
                highest_marks=highest_marks,
                roll=roll,
                section=section
            )
        )

# Perform bulk create
if create_objects:
    SubjectHighestMarks.objects.bulk_create(create_objects)

# Perform bulk update
if update_objects:
    SubjectHighestMarks.objects.bulk_update(
        update_objects,
        ['section', 'roll','highest_marks',]
    )



# //////////////////////////////////////////////////////////////
# ///////////////////// Class wise merit /////////////////////////////
# //////////////////////////////////////////////////////////////
# Step 2: Query and order results
ordered_results = StudentSubjectResult.objects.filter(
    institute__id=institute_id,
    year__year=year,
    class_instance__class_name__name=class_name,
    group__group_name='common',
    exam__exam_name=exam_name,
).order_by(
    'total_fail_subjects',
    '-gpa',       # Then highest GPA
    '-total_obtained_marks'  # Then highest total marks
)


# Step 3: Assign classwise_merit based on order
update_merit_objects = []
for index, result in enumerate(ordered_results, start=1):
    result.classwise_merit = index  # Assign merit position (1, 2, 3, ...)
    update_merit_objects.append(result)

# Step 4: Perform bulk update for classwise_merit
if update_merit_objects:
    StudentSubjectResult.objects.bulk_update(
        update_merit_objects,
        ['classwise_merit']
    )


# //////////////////////////////////////////////////////////////
# ///////////////////// section wise merit /////////////////////////////
# //////////////////////////////////////////////////////////////

# Step 3: Update sectionwise_merit for each section
sections = Section.objects.filter(
    institute__id=institute_id,
    year__year=year,
    class_instance__class_name__name=class_name,
    group__group_name='common',
)


update_sectionwise_objects = []
for section in sections:
    section_ordered_results = StudentSubjectResult.objects.filter(
        institute__id=institute_id,
        year__year=year,
        class_instance__class_name__name=class_name,
        group__group_name='common',
        section=section,
        exam__exam_name=exam_name,
    ).order_by(
        'total_fail_subjects', '-gpa', '-total_obtained_marks'
    )
    for index, result in enumerate(section_ordered_results, start=1):
        result.sectionwise_merit = index
        update_sectionwise_objects.append(result)

# Step 4: Perform bulk updates

if update_sectionwise_objects:
    StudentSubjectResult.objects.bulk_update(
        update_sectionwise_objects,
        ['sectionwise_merit']
    )

# //////////////////////////////////////////////////////////////
# /////////////////////  Print results for verification /////////////////////////////
# //////////////////////////////////////////////////////////////
# Step 5: Print results for verification
for section in sections:
    print(f"\nSection: {section.section_name}")
    section_results = StudentSubjectResult.objects.filter(
        institute__id=institute_id,
        year__year=year,
        class_instance__class_name__name=class_name,
        group__group_name='common',
        section=section,
        exam__exam_name=exam_name,
    ).order_by('sectionwise_merit')
    for result in section_results:
        print(f"Student: {result.student}, Roll: {result.student.roll_number}, "
              f"Section: {result.section.section_name}, "
              f"GPA: {result.gpa}, Grade: {result.letter_grade}, "
              f"Total Marks: {result.total_obtained_marks}, Fails: {result.total_fail_subjects}, "
              f"Classwise Merit: {result.classwise_merit}, Sectionwise Merit: {result.sectionwise_merit}")
        
