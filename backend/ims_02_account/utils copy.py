# import backend.wsgi
from core.utils import debug

import os,sys, time
from django.db.models import Prefetch, Case, When, Value, IntegerField, Sum
from collections import defaultdict
from ims_04_result.models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from ims_01_institute.models import Class,Group, Section, SubjectForIMS, Institute,GroupName,ClassName,Year
from ims_03_exam.models import ExamForIMS
from ims_02_account.models import Student
from django.db import connection
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from rest_framework.renderers import JSONRenderer
from .serializers import StudentSerializer, StudentSerializerAllFields
from rest_framework.permissions import BasePermission

from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.models import User 
from datetime import datetime
class IsStaffUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
    
def getFormatedData(dob_value):
    if dob_value:
        try:
            # Try to parse the date in YYYY-MM-DD format
            dob_value = datetime.strptime(dob_value, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            # If parsing fails, ignore the value
            dob_value = None
    else:
        dob_value = None
# ///////////////////////////////////// add student //////////////////////////////////////////// 
def generate_student_id(class_obj, year_obj, group_obj, section_obj, roll_number):
    shift_code = class_obj.shift[0].upper()
    year = f"{year_obj.year:03d}"
    class_code = f"{class_obj.class_name.code:02d}"
    group_code = group_obj.group_name.code
    section_index = f"{section_obj.section_name.code:02d}"
    # print('section_index: ',section_index)
    # section_index = ord(section_obj.section_name) - ord('a') + 1
    roll = f"{int(roll_number):03d}"
    return f"{shift_code}{year}{class_code}{group_code}{section_index}{roll}"


# def add_students(student_info, student_list): 
def add_students(student_info, student_list):
    # start = time.time()
    User = get_user_model()
    users_to_create = []
    students_to_create = []
    failed_students = []
    failed_students_index = []
    institute = Institute.objects.get(id=student_info['institute_id'])

    year_obj = Year.objects.get(id=student_info['year_id'])
    class_obj = Class.objects.get(id=student_info['class_instance_id'])
    group_obj = Group.objects.get(id=student_info['group_id'])
    section_obj = Section.objects.get(id=student_info['section_id'])
    # print("student_list: ", student_list)

    for index, student in enumerate(student_list):
        print("student:", student)

        roll_number = student['roll_number']
        # print(class_obj, year_obj, group_obj, section_obj, roll_number)
        student_id = generate_student_id(class_obj, year_obj, group_obj, section_obj, roll_number)
        # print("Generated student_id:", student_id)
        
        dob_value = getFormatedData(student.get('dob', None))
        student_data = {
            'institute': institute,
            'year': year_obj,
            'class_instance': class_obj,
            'group': group_obj,
            'section': section_obj,
            'name': student['name'],
            'name_bangla': student['name_bangla'],
            'roll_number': roll_number,
            'nid':  student['nid'],
            'fathers_name':  student['fathers_name'],
            'mothers_name':  student['mothers_name'],
            'picture':  student['picture'],
            'dob':  dob_value,
            # 'dob':  student['dob'],
            'student_id': student_id,
            'email': student['email'] or f"{student['phone_number'] or student_id}@gmail.com",
            'password': student['password'] or '1234',
            'phone_number': student['phone_number'] or student_id,
        }
        # print("Generated student data:", student_data)

        student_obj = Student(**student_data)
        
        user = User(
            username= student_data['phone_number'] or student_data['student_id'],
            email= student_data['email'],
            password= student_data['password'],
            first_name= student_data['name'],
        )
        # print("User object created:", user)
        
        try:
            # print("Before full_clean")
            student_obj.full_clean()  # Validate without saving 
            # student_obj.save()
            # print("Student object is valid, proceeding to save.")
            
            students_to_create.append(student_obj)
            users_to_create.append(user)
        except Exception as e:
            print(f"❌ Failed to create student due to unique constraint: {e}")
            print(f"Failed student details: {student_data}") 
            failed_students_index.append(index)
        

    # Bulk insert only if there are valid students
    # if students_to_create:
    #     Student.objects.bulk_create(students_to_create)
    # if students_to_create:
    #     for student_data in students_to_create:
    #         student_data.save()
    
    # 2. Bulk insert Students and Users in transaction
    # with transaction.atomic():
    #     print("Creating users in bulk...")
    #     # print("users_to_create:", users_to_create)
    #     created_users = User.objects.bulk_create(users_to_create)
    #     students_to_create_final = []
    #     for student_data, user in zip(students_to_create, created_users):
    #         student_data.user = user 
    #         students_to_create_final.append(student_data)

    #     Student.objects.bulk_create(students_to_create_final)
        
    try:
        with transaction.atomic():
            print("Creating users in bulk...")
            created_users = User.objects.bulk_create(users_to_create)
            print("User Created")

            students_to_create_final = []
            for student_data, user in zip(students_to_create, created_users):
                student_data.user = user
                students_to_create_final.append(student_data)

            print("Creating studnets")
            Student.objects.bulk_create(students_to_create_final)

        return {
            'success': len(students_to_create) > 0,
            'inserted_count': len(students_to_create), 
            'failed_students_index': failed_students_index,
            'message': f"Inserted {len(students_to_create)} students successfully, {len(failed_students)} failed due to unique constraints."
        }
    except IntegrityError as e:
        return Response({"error": f"Integrity error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    


#