# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////// Create Subject and Subject Name if Subject name not exits ///////////////////////
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



import sys
sys.path.append('..')  # Adds the parent directory to the system path

import backend.wsgi
import csv, os

from ims_02_account.models import Student
from ims_01_institute.models import Institute, Year, Class, Group, Section, ClassName, GroupName,SubjectName, SubjectForIMS

def get_or_create_year(institute, year):
    return Year.objects.get_or_create(institute=institute, year=int(year))[0]

def get_or_create_class(institute, year_obj, class_code, shift_name='morning'):
    class_name_obj = ClassName.objects.get(code=int(class_code))
    print("shift -->: ", shift_name)
    print("class_name_obj: ", class_name_obj)
    return Class.objects.get_or_create(
        institute=institute,
        year=year_obj,
        class_name=class_name_obj,
        shift=shift_name  # Use consistent shift values
    )[0]

def get_or_create_group(institute, year_obj, class_obj, group_name='none'):
    group_name_obj = GroupName.objects.get(name__iexact=group_name)
    return Group.objects.get_or_create(
        institute=institute,
        year=year_obj,
        class_instance=class_obj,
        group_name=group_name_obj
    )[0]

def get_or_create_subject_name(name,name_bengali,class_name,subject_code,serial):
    return SubjectName.objects.get_or_create(
        name=name,
        name_bengali=name_bengali,
        class_name=class_name,
        code=subject_code, 
        serial=serial, 
    )[0]



# subject_file_name_nine_ten = '01_SubjectsName/subjects_6_7_8_morning_day.csv'
# subject_file_name_nine_ten = '01_SubjectsName/subjects_9_10_science_huma_commerce_morning_day.csv'
subject_file_name_nine_ten = '01_SubjectsName/subjects_voc_9_10_AM_ICT_Day.csv'

with open(subject_file_name_nine_ten, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    cnt = 1
    for row in reader:
        print(f"{cnt}  - ",end='')
        cnt += 1
        try:
            institute = Institute.objects.get(institute_code=row['institute'])
        except Institute.DoesNotExist:
            print("❌ Skipped: Institute not found")
            continue
        print(f"---------------------------{row['class']}---------------------------------------")
        # print("class: ", row['class'])
        year_obj = get_or_create_year(institute, row['year'])
        class_obj = get_or_create_class(institute, year_obj, row['class'], row['shift'])
        # print("class_obj: ", class_obj)
        # Science , Humanities and Commerce
        if  8 < int(row['class']) < 91 :
            group_science = get_or_create_group(institute, year_obj, class_obj, row['group_science']) if row['group_science'] else None
            group_humanities = get_or_create_group(institute, year_obj, class_obj, row['group_humanities']) if row['group_humanities'] else None
            group_commerce = get_or_create_group(institute, year_obj, class_obj, row['group_commerce']) if row['group_commerce'] else None
        elif int(row['class']) < 9: # Class Six, Seven and Eight
            group = get_or_create_group(institute, year_obj, class_obj, row['group'])
        else: #Vocational AM, ICT
            group_am = get_or_create_group(institute, year_obj, class_obj, row['group_am']) if row['group_am'] else None
            group_ict = get_or_create_group(institute, year_obj, class_obj, row['group_ict']) if row['group_ict'] else None
        # print("group_obj: ", group_obj)
        
        # print("=======================++++++ before get_or_create_subject_name ++++++++++++++++=========================")
        subject_name_obj = get_or_create_subject_name(
            row['name'], row['name_bengali'], row['class_name'], row['code'], row['serial_number']
        )
        # print("=======================+++++++++++++after get_or_create_subject_name+++++++++=========================", subject_name_obj)
        
        subject, created = SubjectForIMS.objects.get_or_create(
            class_instance=class_obj,
            subject_name=subject_name_obj,
            defaults={
                'institute': institute,
                'year': year_obj,
                'is_optional': row['is_optional'].lower() in ['1', 'true', 'yes'],
                'serial_number': int(row['serial_number']),
                'full_marks': int(row['full_marks']),
                'pass_marks': int(row['pass_marks']),
            }
        )
        # print("=== =======", subject)

        if 8 < int(row['class']) < 91:
            group_list = [group_science,group_humanities,group_commerce]
        elif int(row['class']) > 90 :
            group_list = [group_ict,group_am]
        else:
            group_list = [group]
        subject.group.set(group_list)  # M2M assignment works whether created or not

        if created:
            print(f"{cnt} ✅ Created: {subject}")
        else:
            print(f"{cnt} ⚠️ Skipped (already exists): {subject}")
        