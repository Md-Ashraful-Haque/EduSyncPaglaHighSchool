import backend.wsgi
import os,sys
from django.db.models import Prefetch, Case, When, Value, IntegerField, Sum
from collections import defaultdict
from ims_04_result.models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from ims_01_institute.models import Class,Group, Section, SubjectForIMS
from django.db import connection

# Clear screen
os.system('cls' if os.name == 'nt' else 'clear')

# ///////////////////////////////////////////////////////////////////////
# ////////////////////// Generate result Class Wise /////////////////////
# ///////////////////////////////////////////////////////////////////////
def generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, CLASS_NAME, GROUP_NAME,EXAM_NAME ):
    
    print('////////////////////////////////////////////////////')
    print(INSTITUTE_ID, YEAR, CLASS_NAME, GROUP_NAME,EXAM_NAME )
    print('////////////////////////////////////////////////////')
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
        "exam__exam_name": EXAM_NAME,
    }

    # Section filters (reuses base filters without exam condition)
    FILTERS_SECTION = BASE_FILTERS

    # Dictionary to store highest marks, roll number, and section for each subject
    subject_highest_marks = defaultdict(lambda: (None, 0.0, None, None))


    # ///////////////////////////////////////////////////////////////
    # Step 1: Query results with prefetch for efficiency
    # ///////////////////////////////////////////////////////////////

    results = StudentSubjectResult.objects.select_related(
        'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
    ).filter(**FILTERS_RESULT).prefetch_related(
        Prefetch('subjectforresult', queryset=SubjectForResult.objects.order_by('subject__serial_number').prefetch_related(
            Prefetch('typewisemarksforsubject', queryset=TypewiseMarksForSubject.objects.order_by('mark_type__serial_number'))
            ))
    )


    # ///////////////////////////////////////////////////////////////
    # Step 2: Process results and collect updates
    # ///////////////////////////////////////////////////////////////
    update_result_objects = []
    print("\t\t\tFull Marks Pass Marks MCQ, Theory Total Letter Grade  Grade Point Pass/Fail")

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
        
        # Process subject marks and update subject_highest_marks
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
        
        print('------------------------------------------------------------------------------------')

    # Step 3: Bulk update StudentSubjectResult for updating GPA, Letter Grade, Total Fail Subject and Total Obtained Marks
    if update_result_objects:
        StudentSubjectResult.objects.bulk_update(
            update_result_objects,
            ['gpa', 'letter_grade', 'total_fail_subjects', 'total_obtained_marks']
        )


    # ///////////////////////////////////////////////////////////////
    # Step 4: Update SubjectHighestMarks
    # ///////////////////////////////////////////////////////////////

    create_objects = []
    update_objects = []
    section_cache = {section.id: section for section in Section.objects.all()}

    existing_records = {obj.subject.id: obj for obj in SubjectHighestMarks.objects.filter(
        subject__id__in=subject_highest_marks.keys()
    )}

    for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
        try:
            # print(type(section),section)
            subject_instance = SubjectForIMS.objects.get(id=subject_id)
            section_instance = section_cache.get(section.id if section else None)
            # print(type(section_instance),section_instance)
            if not section_instance:
                print(f"Warning: Section {section.section_name if section else 'None'} not found for subject {subject_name}")
                continue
            
            if subject_id in existing_records:
                # Update existing record
                obj = existing_records[subject_id]
                obj.highest_marks = highest_marks
                obj.roll = roll
                obj.section = section_instance
                update_objects.append(obj)
            else:
                # Create new record
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

    # Perform bulk create and update for SubjectHighestMarks
    if create_objects:
        SubjectHighestMarks.objects.bulk_create(create_objects)
    if update_objects:
        SubjectHighestMarks.objects.bulk_update(update_objects, ['highest_marks', 'roll', 'section'])

    # Print highest marks per subject
    print("\nHighest Marks Per Subject:")
    for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
        print(f"{subject_name[:10]}({subject_id}) \t: {highest_marks} (Roll: {roll}, Section: {section.section_name})")


    # ///////////////////////////////////////////////////////////////
    # Step 5: Update classwise_merit
    # ///////////////////////////////////////////////////////////////

    class_ordered_results = StudentSubjectResult.objects.filter(**FILTERS_RESULT).order_by(
        'total_fail_subjects', '-gpa', '-total_obtained_marks'
    )
    update_classwise_objects = []
    for index, result in enumerate(class_ordered_results, start=1):
        result.classwise_merit = index
        update_classwise_objects.append(result)

    if update_classwise_objects:
        StudentSubjectResult.objects.bulk_update(update_classwise_objects, ['classwise_merit'])


    # ///////////////////////////////////////////////////////////////
    # Step 6: Update sectionwise_merit
    # ///////////////////////////////////////////////////////////////

    # Fetch all results with prefetch_related and iterator
    results = StudentSubjectResult.objects.filter(**FILTERS_RESULT).prefetch_related('section').order_by(
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
    if update_sectionwise_objects:
        StudentSubjectResult.objects.bulk_update(update_sectionwise_objects, ['sectionwise_merit'])

    # Step 7: Print results for verification
    sections = Section.objects.filter(**FILTERS_SECTION)
    for section in sections:
        print(f"\nSection: {section.section_name}")
        section_results = StudentSubjectResult.objects.filter(**FILTERS_SECTION, section=section).order_by('sectionwise_merit')
        for result in section_results:
            print(f"Student: {result.student}, Roll: {result.student.roll_number}, "
                f"Section: {result.section.section_name}, "
                f"GPA: {result.gpa:.2f}, Grade: {result.letter_grade}, "
                f"Total Marks: {result.total_obtained_marks}, Fails: {result.total_fail_subjects}, "
                f"Classwise Merit: {result.classwise_merit}, Sectionwise Merit: {result.sectionwise_merit}")




# ///////////////////////////////////////////////
# /////////////// call for one class 
# ///////////////////////////////////////////////

generate_result_using_institue_to_group(INSTITUTE_ID = 1,
YEAR = 2025,
CLASS_NAME = "Six",
GROUP_NAME = "common",
EXAM_NAME = "বার্ষিক/নির্বাচনী পরীক্ষা")


# ///////////////////////////////////////////////
# ///////////////  Call for Year Wise
# ///////////////////////////////////////////////
INSTITUTE_ID = 1
YEAR = 2025
EXAM_NAME = "বার্ষিক/নির্বাচনী পরীক্ষা"

print(f"\n=== Year-Wise Result Generator for Year {YEAR} ===")
classes = Class.objects.filter(institute__id=INSTITUTE_ID, year__year=YEAR).select_related('class_name').prefetch_related('groups')
for classObj in classes:
    
    print(classObj,'\t:',end='')
    
    for group in classObj.groups.all():
        generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, classObj.class_name.name, group.group_name,EXAM_NAME ) 
        print(group.group_name,' ',end='') 
    print('\n\n')

print(f"Total queries: {len(connection.queries)}")