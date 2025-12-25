# import backend.wsgi
from core.utils import debug

import os,sys, time
from django.db.models import Prefetch, Case, When, Value, IntegerField, Sum
from collections import defaultdict
from ims_04_result.models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from ims_01_institute.models import Class,Group, Section, SubjectForIMS
from ims_03_exam.models import ExamForIMS
from django.db import connection
from rest_framework.response import Response
from rest_framework import status
# Clear screen
# os.system('cls' if os.name == 'nt' else 'clear')
# print("\t\t\tFull Marks Pass Marks MCQ, Theory Total Letter Grade  Grade Point Pass/Fail")

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
        group_id = subject.student_from_result_table.group.id
        total_marks = subject.total_marks
        roll_number = result.student.roll_number
        section = result.section
        
        # Update highest marks for this subject
        if total_marks > subject_highest_marks[(subject_id,group_id)][1]:
            subject_highest_marks[(subject_id,group_id)] = (subject_name, total_marks, roll_number, section)
        
        # Print subject details
        # print(f"{subject_name[:10]}\t\t: {subject.subject.full_marks}--{subject.subject.pass_marks}--", end='')
        # for mark in subject.typewisemarksforsubject.all():
        #     print(f"{mark.marks}--", end='')
        # print(f"{total_marks}--{subject.grade_and_point}--{subject.has_passed_all_mark_types}")
    # print("subject_highest_marks: ", subject_highest_marks)

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
        # total_marks = sum((subject.total_marks if subject.total_marks > 0 else 0) if not subject.subject.is_optional else 0 for subject in all_subjects)
        
        # Update StudentSubjectResult fields
        # print("-------------------- final gpa claculation start--------------")
        result.gpa = result.final_gpa #final_gpa is property
        # print("-------------------- final gpa claculation end--------------")
        result.gpa_without_optional = result.final_gpa_without_optional #final_gpa without optional property
        result.letter_grade = result.final_grade
        # result.total_fail_subjects = result.failed_subject_count_for_tabulation
        result.total_fail_subjects = result.failed_subject_count
        # result.total_obtained_marks = total_marks if total_marks >= 0 else 0
        result.total_obtained_marks = result.total_marks_of_student
        update_result_objects.append(result)
        
        # Print student results
        # print(f"Final GPA: {result.final_gpa}")
        # print(f"Final Grade: {result.final_grade}")
        # print(f"Total Fail: {result.failed_subject_count}")
        # print("-------------------/////////////////////--------------------")
        
        # find highest marks for subjects in a GROUP and store in subject_highest_marks
        find_highest_marks_of_each_subject(all_subjects, result, subject_highest_marks)
        
        # print('------------------------------------------------------------------------------------')
        # print("subject_highest_marks: ", subject_highest_marks)


# Define the generalized function (place this in your script, e.g., above the main logic)
def bulk_update_student_results(objects, fields):
    """Perform bulk update on StudentSubjectResult objects for specified fields.
    
    Args:
        objects: List of StudentSubjectResult objects to update.
        fields: List of field names to update (e.g., ['gpa', 'letter_grade']).
    """
    if objects:
        StudentSubjectResult.objects.bulk_update(objects, fields)





# def update_subject_highest_marks(INSTITUTE_ID, YEAR, subject_highest_marks):
def update_subject_highest_marks(INSTITUTE_ID, YEAR, CLASS_NAME, SHIFT_NAME, GROUP_NAME,EXAM_NAME, subject_highest_marks):
    """Update SubjectHighestMarks by deleting and creating records only if changes are detected.
    
    Args:
        subject_highest_marks: Dict mapping subject IDs to (name, marks, roll, section) tuples.
        
    Raises:
        ValueError: If a valid section is not found for a subject.
    """
    # Fetch section cache
    # section_cache = {section.id: section for section in Section.objects.filter(
    #     institute__id=INSTITUTE_ID, year__year=YEAR, class_instance__class_name__name=CLASS_NAME,class_instance__shift=SHIFT_NAME,
    # )}
    
    # print("section_cache: ",section_cache) 
    # Check for changes
    has_changes = False
    create_objects = []
    for (subject_id, group_id), (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
        try:
            subject_instance = SubjectForIMS.objects.get(id=subject_id)
            group_instance = Group.objects.get(id=group_id) 
            SubjectHighestMarks.objects.filter(subject=subject_instance, group=group_id).delete()
            # print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            # print(subject_name, highest_marks, roll, section,subject_id, group_id)
            # Always prepare create_objects in case changes are detected
            create_objects.append(
                SubjectHighestMarks(
                    subject=subject_instance,
                    group=group_instance,
                    section=section,
                    highest_marks=highest_marks,
                    roll=roll,
                )
            )
        except SubjectForIMS.DoesNotExist:
            print(f"Warning: Subject ID {subject_id} not found for {subject_name}")
            continue
    
    # Perform delete and create only if changes are detected
    if create_objects:
        SubjectHighestMarks.objects.bulk_create(create_objects)
    
    # Print highest marks per subject
    # for subject_id, (subject_name, highest_marks, roll, section) in subject_highest_marks.items():
    #     print(f"{subject_name[:10]}({subject_id}) \t: {highest_marks} (Roll: {roll}, Section: {section.section_name})")



def assign_groupwise_merit(filters):
    """Assign classwise merit positions to StudentSubjectResult records based on performance.
    
    Args:
        filters (dict): Filter criteria for StudentSubjectResult queryset (e.g., institute, year, exam).
    
    Updates:
        Sets `classwise_merit` field for each StudentSubjectResult and performs bulk update.
    """
    class_ordered_results = StudentSubjectResult.objects.filter(**filters).order_by(
        'total_fail_subjects', '-gpa', '-total_obtained_marks'
    )
    update_groupwise_objects = []
    for index, result in enumerate(class_ordered_results, start=1):
        result.classwise_merit = index
        update_groupwise_objects.append(result)
    
    bulk_update_student_results(
        update_groupwise_objects,
        ['classwise_merit']
    )
    
def assign_sectionwise_merit(result_filters):
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

def generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, CLASS_NAME, SHIFT_NAME, GROUP_NAME,EXAM_NAME ):
    # Base filter parameters shared across queries
    BASE_FILTERS = {
        "institute__id": INSTITUTE_ID,
        "year__year": YEAR,
        "class_instance__class_name__name": CLASS_NAME,  # Simplified assuming class_name is a direct field
        "class_instance__shift": SHIFT_NAME,  # Simplified assuming class_name is a direct field
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
        ['gpa','gpa_without_optional', 'letter_grade', 'total_fail_subjects', 'total_obtained_marks']
    )

    # Update highest marks of all subject of a group
    # print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    # print("GROUP_NAME: ", GROUP_NAME)
    # print("subject_highest_marks: ", subject_highest_marks)
    update_subject_highest_marks(INSTITUTE_ID, YEAR, CLASS_NAME, SHIFT_NAME, GROUP_NAME,EXAM_NAME, subject_highest_marks)
    # update_subject_highest_marks(INSTITUTE_ID, YEAR, subject_highest_marks)
    
    # Update Group Wise Merit
    assign_groupwise_merit(FILTERS_RESULT)
    
    # Update sectionwise_merit 
    assign_sectionwise_merit(FILTERS_RESULT)
    


def generate_result_year_wise(INSTITUTE_ID,YEAR,EXAM_NAME, SHIFT):
    print(f"\n=== Year-Wise Result has beed generated. {YEAR} {[INSTITUTE_ID,YEAR,EXAM_NAME, SHIFT]}===")  
    try:
        exam = ExamForIMS.objects.filter(id=EXAM_NAME).first()
        
        classes = Class.objects.filter(institute__id=INSTITUTE_ID, year__year=YEAR, shift=SHIFT, examforims=exam).select_related('class_name').prefetch_related('groups') 
        # print("classes from year wise result: ", classes)
        if not classes.exists():
            return False
        for classObj in classes:
            print(f"\n=== Class: {classObj.class_name.name}===")
            for group in classObj.groups.all():
                print(f"group: {group}")
                generate_result_using_institue_to_group(INSTITUTE_ID, YEAR, classObj.class_name.name,SHIFT, group.group_name,EXAM_NAME ) 
        # debug("Generated")
        # time.sleep(10)
        return Response(
            {"success": True, "message": f"Results generated for {classes.count()} classes"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # print(f"Total queries: {len(connection.queries)}")


def generate_result_class_wise(institute_id,year,exam, shift, class_id): 
    # print(f"\n=== Class-Wise Result has beed generated. {year} {[institute_id,year,exam, shift,class_id]}===")  
    try:
        classObj = Class.objects.get(institute__id=institute_id, year__year=year, shift=shift, examforims=exam, id=class_id)
        # debug('classObj', classObj)
        for group in classObj.groups.all():
            # debug('group', group)
            generate_result_using_institue_to_group(institute_id, year, classObj.class_name.name,shift, group.group_name,exam )
        
        return Response(
            {"success": True, "message": f"Results generated for class {classObj}."},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # print(f"Total queries: {len(connection.queries)}")

