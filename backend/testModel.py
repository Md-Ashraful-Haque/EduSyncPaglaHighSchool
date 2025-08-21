import backend.wsgi
import os,sys
from django.db.models import Prefetch, Case, When, Value, IntegerField, Sum
from collections import defaultdict
from ims_04_result.models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from ims_01_institute.models import Class,Group, Section, SubjectForIMS
from django.db import connection


# Clear screen
os.system('cls' if os.name == 'nt' else 'clear')
print("\t\t\tFull Marks Pass Marks MCQ, Theory Total Letter Grade  Grade Point Pass/Fail")

# ///////////////////////////////////////////////////////////////
# Step 1: Query results with prefetch for efficiency
# ///////////////////////////////////////////////////////////////
def get_all_result_with_prefetch(FILTERS_RESULT):
    results = StudentSubjectResult.objects.select_related(
        'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
    ).filter(**FILTERS_RESULT).prefetch_related(
        Prefetch('subjectforresult', queryset=SubjectForResult.objects.order_by('subject__serial_number').prefetch_related(
            Prefetch('typewisemarksforsubject', queryset=TypewiseMarksForSubject.objects.order_by('mark_type__serial_number'))
            ))
    )
    return results


# Process all subject marks and find highest mark get all info of a subject 
def find_highest_marks_of_each_subject(all_subjects, result, subject_highest_marks):
    """Update highest marks for each subject and print subject details.
    
    Args:
        all_subjects: Queryset of SubjectForResult objects for a student.
        result: StudentSubjectResult object containing student and section info.
        subject_highest_marks: Dict to store (name, marks, roll, section) per subject ID.
    """
    for subject in all_subjects:
        subject_name = subject.subject.subject_name.name
        subject_id = subject.subject.id
        total_marks = subject.total_marks
        roll_number = result.student.roll_number
        section = result.section
        
        # Update highest marks for this subject
        if total_marks > subject_highest_marks[subject_id][1]:
            subject_highest_marks[subject_id] = (subject_name, total_marks, roll_number, section)
        
        # Print subject details
        print(f"{subject_name[:10]}\t\t: {subject.subject.full_marks}--{subject.subject.pass_marks}--", end='')
        for mark in subject.typewisemarksforsubject.all():
            print(f"{mark.marks}--", end='')
        print(f"{total_marks}--{subject.grade_and_point}--{subject.has_passed_all_mark_types}")


#Process all student results of a group and update result in database and find hightest marks for each subject
def process_student_results_and_update(results, update_result_objects, subject_highest_marks):
    """Process student exam results, update GPA and marks, and track highest subject marks.
    
    Args:
        results: Iterable of StudentSubjectResult objects.
        update_result_objects: List to collect results for bulk update.
        subject_highest_marks: Dict to store highest marks per subject.
    """
    for result in results:
        all_subjects = result.subjectforresult.all()
        
        # Calculate total marks (excluding optional subject)
        total_subjects = len(all_subjects) - 1
        total_marks = sum(subject.total_marks for subject in all_subjects[:total_subjects])
        
        # Update StudentSubjectResult fields
        result.gpa = result.final_gpa
        result.letter_grade = result.final_grade
        result.total_fail_subjects = result.failed_subject_count
        result.total_obtained_marks = total_marks if total_marks >= 0 else 0
        update_result_objects.append(result)
        
        # Print student results
        print(f"Final GPA: {result.final_gpa}")
        print(f"Final Grade: {result.final_grade}")
        print(f"Total Fail: {result.failed_subject_count}")
        print(f"Total Marks: {total_marks}")
        print("---------------------------------------")
        
        # find highest marks for subjects in a GROUP and store in subject_highest_marks
        find_highest_marks_of_each_subject(all_subjects, result, subject_highest_marks)
        
        print('------------------------------------------------------------------------------------')


# Define the generalized function (place this in your script, e.g., above the main logic)
def bulk_update_student_results(objects, fields):
    """Perform bulk update on StudentSubjectResult objects for specified fields.
    
    Args:
        objects: List of StudentSubjectResult objects to update.
        fields: List of field names to update (e.g., ['gpa', 'letter_grade']).
    """
    if objects:
        StudentSubjectResult.objects.bulk_update(objects, fields)


def update_subject_highest_marks(subject_highest_marks):
    """Update SubjectHighestMarks by deleting and creating records only if changes are detected.
    
    Args:
        subject_highest_marks: Dict mapping subject IDs to (name, marks, roll, section) tuples.
        
    Raises:
        ValueError: If a valid section is not found for a subject.
    """
    # Fetch section cache
    section_cache = {section.id: section for section in Section.objects.filter(
        institute__id=INSTITUTE_ID, year__year=YEAR
    )}
    
    # Fetch existing SubjectHighestMarks records
    existing_records = {obj.subject.id: obj for obj in SubjectHighestMarks.objects.filter(
        subject__id__in=subject_highest_marks.keys()
    ).select_related('section')}
    
    # Check for changes
    has_changes = False
    create_objects = []
    for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
        try:
            subject_instance = SubjectForIMS.objects.get(id=subject_id)
            section_instance = section_cache.get(section.id if section else None)
            if not section_instance:
                raise ValueError(f"No valid section found for subject {subject_name} (ID: {subject_id})")
            
            # Compare with existing record
            existing = existing_records.get(subject_id)
            if existing:
                if (existing.highest_marks != highest_marks or
                    existing.roll != roll or
                    existing.section_id != section_instance.id):
                    has_changes = True
            else:
                has_changes = True  # New record needed
            
            # Always prepare create_objects in case changes are detected
            create_objects.append(
                SubjectHighestMarks(
                    subject=subject_instance,
                    highest_marks=highest_marks,
                    roll=roll,
                    section=section_instance
                )
            )
        except SubjectForIMS.DoesNotExist:
            print(f"Warning: Subject ID {subject_id} not found for {subject_name}")
            continue
    
    # Perform delete and create only if changes are detected
    if has_changes and create_objects:
        SubjectHighestMarks.objects.filter(subject__id__in=subject_highest_marks.keys()).delete()
        SubjectHighestMarks.objects.bulk_create(create_objects)
    
    # Print highest marks per subject
    for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
        print(f"{subject_name[:10]}({subject_id}) \t: {highest_marks} (Roll: {roll}, Section: {section.section_name})")



def assign_classwise_merit(filters):
    """Assign classwise merit positions to StudentSubjectResult records based on performance.
    
    Args:
        filters (dict): Filter criteria for StudentSubjectResult queryset (e.g., institute, year, exam).
    
    Updates:
        Sets `classwise_merit` field for each StudentSubjectResult and performs bulk update.
    """
    class_ordered_results = StudentSubjectResult.objects.filter(**filters).order_by(
        'total_fail_subjects', '-gpa', '-total_obtained_marks'
    )
    update_classwise_objects = []
    for index, result in enumerate(class_ordered_results, start=1):
        result.classwise_merit = index
        update_classwise_objects.append(result)
    
    bulk_update_student_results(
        update_classwise_objects,
        ['classwise_merit']
    )
    
def assign_sectionwise_merit(result_filters, section_filters):
    """Assign sectionwise merit positions to StudentSubjectResult records and print results for verification.
    
    Args:
        result_filters (dict): Filter criteria for StudentSubjectResult queryset (e.g., institute, year, exam).
        section_filters (dict): Filter criteria for Section queryset (e.g., institute, year).
    
    Updates:
        Sets `sectionwise_merit` field for each StudentSubjectResult and performs bulk update.
    """
    # Fetch results with prefetch and order by section and performance
    results = StudentSubjectResult.objects.filter(**result_filters).prefetch_related('section').order_by(
        'section__id', 'total_fail_subjects', '-gpa', '-total_obtained_marks'
    )

    # Group results by section and assign merit positions
    update_sectionwise_objects = []
    section_results = defaultdict(list)
    for result in results:
        section_id = result.section.id if result.section else None
        section_results[section_id].append(result)

    # Assign sectionwise merit for each section
    for section_id, result_list in section_results.items():
        for index, result in enumerate(result_list, start=1):
            result.sectionwise_merit = index
            update_sectionwise_objects.append(result)

    # Perform bulk update
    bulk_update_student_results(
        update_sectionwise_objects,
        ['sectionwise_merit']
    )

    # Print results for verification
    sections = Section.objects.filter(**section_filters)
    for section in sections:
        print(f"\nSection: {section.section_name}")
        section_results = StudentSubjectResult.objects.filter(**section_filters, section=section).order_by('sectionwise_merit')
        for result in section_results:
            print(f"Student: {result.student}, Roll: {result.student.roll_number}, "
                  f"Section: {result.section.section_name}, "
                  f"GPA: {result.gpa:.2f}, Grade: {result.letter_grade}, "
                  f"Total Marks: {result.total_obtained_marks}, Fails: {result.total_fail_subjects}, "
                  f"Classwise Merit: {result.classwise_merit}, Sectionwise Merit: {result.sectionwise_merit}")
            

# ///////////////////////////////////////////////////////////////////////
# ////////////////////// Generate result Class Wise /////////////////////
# ///////////////////////////////////////////////////////////////////////


def generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, CLASS_NAME, GROUP_NAME,EXAM_NAME ):
    # Base filter parameters shared across queries
    BASE_FILTERS = {
        "institute__id": INSTITUTE_ID,
        "year__year": YEAR,
        "class_instance__class_name__name": CLASS_NAME,  # Simplified assuming class_name is a direct field
        "group__group_name": GROUP_NAME,
    }

    # Exam-specific filters
    FILTERS_RESULT = {
        **BASE_FILTERS,  # Unpack base filters
        "exam": EXAM_NAME,
    }

    # Section filters (reuses base filters without exam condition)
    FILTERS_SECTION = BASE_FILTERS

    # Dictionary to store highest marks, roll number, and section for each subject
    subject_highest_marks = defaultdict(lambda: (None, 0.0, None, None))

    # Get all result objects of a group of a class
    results = get_all_result_with_prefetch(FILTERS_RESULT)


    # Step 2: Process results and collect updates
    update_result_objects = []
    
    # Process results for a specific class and group, updating database records
    process_student_results_and_update(results, update_result_objects, subject_highest_marks)

    # Step 3: Bulk update StudentSubjectResult for updating GPA, Letter Grade, Total Fail Subject and Total Obtained Marks
    bulk_update_student_results(
        update_result_objects,
        ['gpa', 'letter_grade', 'total_fail_subjects', 'total_obtained_marks']
    )

    # Update highest marks of all subject of a group
    update_subject_highest_marks(subject_highest_marks)
    
    # Update classwise_merit
    assign_classwise_merit(FILTERS_RESULT)
    
    # Update sectionwise_merit 
    assign_sectionwise_merit(FILTERS_RESULT, FILTERS_SECTION)
    
# ///////////////////////////////////////////////
# /////////////// call for one class 
# ///////////////////////////////////////////////

# generate_result_using_institue_to_group(INSTITUTE_ID = 1,
# YEAR = 2025,
# CLASS_NAME = "Six",
# GROUP_NAME = "common",
# EXAM_NAME = "বার্ষিক/নির্বাচনী পরীক্ষা")


# ///////////////////////////////////////////////
# ///////////////  Call for Year Wise
# ///////////////////////////////////////////////
INSTITUTE_ID = 1
YEAR = 2025
EXAM_NAME = 1
# EXAM_NAME = "বার্ষিক/নির্বাচনী পরীক্ষা"

print(f"\n=== Year-Wise Result Generator for Year {YEAR} ===")
classes = Class.objects.filter(institute__id=INSTITUTE_ID, year__year=YEAR).select_related('class_name').prefetch_related('groups')
for classObj in classes:
    
    # print(classObj,'\t:',end='')
    
    for group in classObj.groups.all():
        generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, classObj.class_name.name, group.group_name,EXAM_NAME ) 
        # print(group.group_name,' ',end='') 
    # print('\n\n')

print(f"Total queries: {len(connection.queries)}")

FILTER_RESULT ={
        'institute__id':1,
        'year__year':2025,
        'class_instance__class_name__name':"Six",
        'group__group_name':'common',
        'section__section_name':'a',
        'exam__exam_name':'বার্ষিক/নির্বাচনী পরীক্ষা',
    }

# results = get_all_result_with_prefetch(FILTER_RESULT)
# # print(results)
# for result in results:
#     all_subjects = result.subjectforresult.all()
#     print(result.id, all_subjects)
