import sys
sys.path.append('..')  # Adds the parent directory to the system path

import backend.wsgi
import csv, os

from ims_02_account.models import Student
from ims_01_institute.models import MarkTypeForSubject, Institute, Year, Class, Group, Section, ClassName, GroupName, SubjectName, SubjectForIMS

def get_or_create_subject_name(name, name_bengali, class_name, subject_code):
    return SubjectName.objects.get_or_create(
        name=name,
        name_bengali=name_bengali,
        class_name=class_name,
        code=subject_code,
    )[0]

# mark_type_file = '02_mark_types/marktype_6_to_8.csv' 
# mark_type_file = '02_mark_types/marktype_9_10.csv' 
mark_type_file = '02_mark_types/voc-9-10-day-mark-types.csv' 
with open(mark_type_file, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        subject_name_obj = get_or_create_subject_name(
            row['name'], row['name_bengali'], row['class_name'], row['code']
        )

        mark_type_obj, created = MarkTypeForSubject.objects.update_or_create(
            subject=subject_name_obj,
            mark_type=row['mark_type'],
            defaults={
                'max_marks': int(row['max_marks']),
                'pass_marks': int(row['pass_marks']),
                'serial_number': int(row['serial_number']),
            }
        )

        action = "Created" if created else "Updated"
        print(f"✅ {action}: {mark_type_obj}")
