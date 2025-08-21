import sys
sys.path.append('..')  # Adds the parent directory to the system path

import backend.wsgi  # Setup Django environment
import csv, os
import time

from ims_02_account.models import Student
from ims_01_institute.models import Institute, Year, Class, Group, Section, ClassName, GroupName

# ========== Setup ==========
institute = Institute.objects.get(institute_code='KSCR')  # Replace with your institute code
student_csv_file = 'students_class_10_b.csv'

# ========== Caches ==========
_year_cache = {}
_class_cache = {}
_group_cache = {}
_section_cache = {}
_classname_cache = {}
_groupname_cache = {}

# ========== Helper Functions ==========

def get_or_create_year_cached(institute, year):
    key = (institute.id, year)
    if key not in _year_cache:
        _year_cache[key] = Year.objects.get_or_create(institute=institute, year=int(year))[0]
    return _year_cache[key]

def get_classname(code):
    if code not in _classname_cache:
        _classname_cache[code] = ClassName.objects.get(code=int(code))
    return _classname_cache[code]

def get_or_create_class_cached(institute, year_obj, class_code, shift_name='morning'):
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

def get_or_create_section_cached(institute, year_obj, class_obj, group_obj, section_name):
    key = (institute.id, year_obj.id, class_obj.id, group_obj.id, section_name)
    if key not in _section_cache:
        _section_cache[key] = Section.objects.get_or_create(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section_name=section_name
        )[0]
    return _section_cache[key]

def generate_student_id(class_obj, year_obj, group_obj, section_obj, roll_number):
    shift_code = class_obj.shift[0].upper()
    year = f"{year_obj.year:03d}"
    class_code = f"{class_obj.class_name.code:02d}"
    group_code = group_obj.group_name.code
    section_index = ord(section_obj.section_name) - ord('a') + 1
    roll = f"{int(roll_number):03d}"
    return f"{shift_code}{year}{class_code}{group_code}{section_index:02d}{roll}"

# ========== Start Processing ==========
start = time.time()

students_to_create = []

with open(student_csv_file, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)

    for row in reader:
        year_obj = get_or_create_year_cached(institute, row['year'])
        class_obj = get_or_create_class_cached(institute, year_obj, row['class'], row['shift'])
        group_obj = get_or_create_group_cached(institute, year_obj, class_obj, row['group'])
        section_obj = get_or_create_section_cached(institute, year_obj, class_obj, group_obj, row['section'])

        roll_number = row['roll_number']
        student_id = generate_student_id(class_obj, year_obj, group_obj, section_obj, roll_number)

        student = Student(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section=section_obj,
            name=row['name'],
            roll_number=roll_number,
            student_id=student_id,
            password=row['password'] or '1234',
            phone_number=student_id,  # Optional: use student_id as default phone
        )
        students_to_create.append(student)

# Bulk insert
Student.objects.bulk_create(students_to_create)

# ========== Done ==========
print(f"✅ Inserted {len(students_to_create)} students in {time.time() - start:.2f} seconds.")
