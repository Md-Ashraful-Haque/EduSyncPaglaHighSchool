import sys
sys.path.append('..')  # Adds the parent directory to the system path

import backend.wsgi
import csv, os 
from pathlib import Path


from ims_02_account.models import Student
from ims_03_exam.models import ExamForIMS
from ims_04_result.models import StudentSubjectResult, TypewiseMarksForSubject, SubjectForResult
from ims_01_institute.models import MarkTypeForSubject, Institute, Year, Class, Group, Section, ClassName, GroupName,SubjectName, SubjectForIMS

# ========== Setup ==========
# initial_shift_name='day'
initial_shift_name='morning'
# Directory containing CSV files
folder_path = '04_Demo_Marks/PHS-2025-mornning-10-Science-G-A'
# folder_path = '04_Demo_Marks/PHS-2025-day-9-ICT-VOC-A'
# folder_path = '04_Demo_Marks/PHS-2025-MORNING-6'
# folder_path = '04_Demo_Marks/PHS-2025-DAY-6'



institute = Institute.objects.get(institute_code='PHS')  # Replace with your institute code
# student_csv_file = 'students_class_10_b.csv'

# ========== Caches ==========
_year_cache = {}
_classname_cache = {}
_class_cache = {}
_groupname_cache = {}
_group_cache = {}
_section_cache = {}
_exam_cache = {}
_student_cache = {}
_subject_cache = {}
_mark_type_cache = {}

# ========== Helper Functions ==========

def get_or_create_year_cached(institute, year):
    key = (institute.id, year)
    if key not in _year_cache:
        _year_cache[key] = Year.objects.get_or_create(institute=institute, year=int(year))[0]
    return _year_cache[key]

def get_classname(code):
    if code not in _classname_cache:
        # _classname_cache[code] = ClassName.objects.get(code=code)
        _classname_cache[code] = ClassName.objects.get(code=int(code))
    return _classname_cache[code]

def get_or_create_class_cached(institute, year_obj, class_code, shift_name=initial_shift_name):
    key = (institute.id, year_obj.id, class_code, shift_name)
    if key not in _class_cache:
        class_name_obj = get_classname(class_code)
        _class_cache[key] = Class.objects.get_or_create(
            institute=institute,
            year=year_obj,
            class_name=class_name_obj,
            shift=shift_name
        )[0]
    return _class_cache[key]

def get_groupname(name):
    key = name.lower()
    if key not in _groupname_cache:
        _groupname_cache[key] = GroupName.objects.get(name__iexact=name)
    return _groupname_cache[key]

def get_or_create_group_cached(institute, year_obj, class_obj, group_name='none'):
    key = (institute.id, year_obj.id, class_obj.id, group_name.lower())
    if key not in _group_cache:
        group_name_obj = get_groupname(group_name)
        _group_cache[key] = Group.objects.get_or_create(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group_name=group_name_obj
        )[0]
    return _group_cache[key]

def get_section_cached(institute, year_obj, class_obj, group_obj, section_name):
    key = (institute.id, year_obj.id, class_obj.id, group_obj.id, section_name)
    # print(" (institute.id, year_obj.id, class_obj.id, group_obj.id, section_name): ", key)
    if key not in _section_cache:
        # for a in Section.objects.all().values():
        #     print(" Obj: ", a)
            # for key, value in a.items():
            #     print(f"  {key}: {value}",end='')
        _section_cache[key] = Section.objects.get(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section_name__name=section_name
        )
    return _section_cache[key]

def get_or_create_exam_cached(institute, year_obj, exam_name):
    key = (institute.id, year_obj.id, exam_name)
    if key not in _exam_cache:
        _exam_cache[key] = ExamForIMS.objects.get_or_create(
            institute=institute,
            year=year_obj,
            exam_name=exam_name, 
        )[0]
    return _exam_cache[key]

def get_student_cached(institute, section, roll):
    key = (institute.id, section.id, roll) 
    if key not in _student_cache: 
        try:
            _student_cache[key] = Student.objects.get(
                institute=institute,
                section_id=section.id,
                roll_number=roll
            )
        except Student.DoesNotExist:
            print(f"Student not found for institute {institute.id}, section {section.id}, roll {roll}")
            return None
        except Exception as e:
            print(f"Error fetching student: {str(e)}")
            return None
    return _student_cache[key]

def get_subject_cached(institute, class_instance,group_name, subject_name):
    key = (institute.id, class_instance.id, subject_name) 
    if key not in _subject_cache: 
        try:
            _subject_cache[key] = SubjectForIMS.objects.get(
                institute=institute,
                class_instance=class_instance,
                group=group_name,
                subject_name__name_bengali=subject_name
            )
        except SubjectForIMS.DoesNotExist:
            print(f"SubjectForIMS not found for institute {institute.id}, class_instance {class_instance}, subject_name {subject_name}")
            return None
        except Exception as e:
            print(f"Error fetching SubjectForIMS: {str(e)}")
            return None
    return _subject_cache[key]

def get_mark_type_for_subject_cached( subject_obj, mark_type):
    key = ( subject_obj, mark_type) 
    # print("( subject_obj, mark_type) : ", key)
    if key not in _mark_type_cache: 
        try:
            _mark_type_cache[key] = MarkTypeForSubject.objects.get( 
                subject=subject_obj.subject_name,
                mark_type=mark_type
            )
        except MarkTypeForSubject.DoesNotExist:
            print(f"MarkTypeForSubject not found subject_name_bengali {subject_obj}, mark_type {mark_type}")
            return None
        except Exception as e:
            print(f"Error fetching MarkTypeForSubject: {str(e)}")
            return None
    return _mark_type_cache[key]

def generate_student_id(class_obj, year_obj, group_obj, section_obj, roll_number):
    shift_code = class_obj.shift[0].upper()
    year = f"{year_obj.year:03d}"
    class_code = f"{class_obj.class_name.code:02d}"
    group_code = group_obj.group_name.code
    section_index = ord(section_obj.section_name) - ord('a') + 1
    roll = f"{int(roll_number):03d}"
    return f"{shift_code}{year}{class_code}{group_code}{section_index:02d}{roll}"

def get_or_create_subject_name(name,name_bengali,class_name,subject_code):
    return SubjectName.objects.get_or_create(
        name=name,
        name_bengali=name_bengali,
        class_name=class_name,
        code=subject_code, 
    )[0]



# Ensure the folder exists
if not os.path.exists(folder_path):
    raise FileNotFoundError(f"Directory '{folder_path}' does not exist")

# Get all CSV files in the folder
csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]

if not csv_files:
    print(f"No CSV files found in directory '{folder_path}'")
else:
    for mark_type_file in csv_files:
        file_path = os.path.join(folder_path, mark_type_file)
        print(f"Processing file: {file_path}")

        # mark_type_file = '01_PHS/bang_2_mcq.csv' 


        with open(file_path, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            marks_to_create = []
            existing_marks = []
            print("Start inserting: ")
            for row in reader:
                year_obj = get_or_create_year_cached(institute, row['year'])
                # print("Year OBJ: ", year_obj)
                class_obj = get_or_create_class_cached(institute,year_obj,  row['class_code'])
                # print("class_obj: ", class_obj)
                group_obj = get_or_create_group_cached(institute,year_obj,class_obj,row['group'])
                # print("group_obj: ", group_obj)
                
                section_obj = get_section_cached(institute,year_obj,class_obj,group_obj, row['section'])
                # print("section_obj: ", section_obj)
                exam_obj = get_or_create_exam_cached(institute,year_obj,row['exam'])
                # print("exam_obj: ", exam_obj)
                
                student_obj = get_student_cached(institute,section_obj,row['roll'])
                # print("student_obj: ", student_obj)
                
                # Prepare data
                student_info = {
                    'institute': institute,
                    'year': year_obj,
                    'class_instance': class_obj,
                    'group': group_obj,
                    'section': section_obj,
                    'exam': exam_obj,
                    'student': student_obj,
                }
                # subjectForResult OBJ
                studentResultObj, created = StudentSubjectResult.objects.update_or_create(**student_info)
                # print("studentResultObj: ", studentResultObj)
                
                subject_obj = get_subject_cached(institute,class_obj,group_obj,row['subject'])
                # print("subject_obj: ", subject_obj)
                
                subject_for_result, created = SubjectForResult.objects.update_or_create(student_from_result_table=studentResultObj, subject=subject_obj )
                # print("subject_obj: ", subject_obj)
                
                
                marks_type = get_mark_type_for_subject_cached(subject_obj, row['type'], )
                # marks_type = get_mark_type_for_subject_cached(row['subject'], row['type'], )
                # print("marks_type: ", marks_type)
                

                mark_entry_for_subject = TypewiseMarksForSubject.objects.filter( 
                    subject=subject_for_result,
                    mark_type=marks_type, 
                ).first()
                
                if mark_entry_for_subject:
                    # If exists, update the marks
                    mark_entry_for_subject.marks = int(row['marks'])
                    existing_marks.append(mark_entry_for_subject)
                else:
                    # If not exists, prepare for bulk_create
                    marks_to_create.append(
                        TypewiseMarksForSubject(subject=subject_for_result, mark_type=marks_type, marks= int(row['marks']))
                    )
            
            # Bulk insert new mark records
            if marks_to_create:
                TypewiseMarksForSubject.objects.bulk_create(marks_to_create)

            # Bulk update existing mark records
            if existing_marks:
                TypewiseMarksForSubject.objects.bulk_update(existing_marks, ['marks'])
            print("End inserting: ")