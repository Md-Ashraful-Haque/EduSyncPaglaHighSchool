



# from datetime import timezone
from django.utils import timezone
from django.db.models import IntegerField, Case, When, Value
from rest_framework.permissions import AllowAny
from django.db.models.functions import Cast
from core.utils import debug
from django.db.models import Count, Q, Avg, Max, Min 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import StudentSubjectResultSerializer, ResultSerializer, SubjectHighestMarksSerializer, SubjectForResultSerializer,StudentSerializer
from .serializers import MarksAdjustmentSerializer
from ims_01_institute.serializers import InstituteSerializer
from core.utils import getUserProfile
from ims_01_institute.models import Institute, Year, Class, MarkTypeForSubject
from ims_04_result.models import *
from ims_03_exam.models import ExamForIMS
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticated
from ims_02_account.models import Student

from collections import defaultdict
from ims_02_account.utils import  IsStaffUser

from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import MarksAdjustment 

from .utils import generate_result_year_wise, generate_result_class_wise

class SubmitMarksBySubjectView(APIView):
    def post(self, request):
        try:
            # Ensure required fields are present
            required_fields = [
                'year', 'shift', 'class_name', 'group_name_bangla', 'section_name',
                'exam_name', 'subject_name_display', 'mark_type_display', 'Student', 'MarksForType'
            ]
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Fetch related models
            year = get_object_or_404(Year, institute_id=institute_id, year=request.data['year'])
            # class_instance = get_object_or_404(Class, institute_id=institute_id, year=year, shift=request.data['shift'], id=request.data['class_name'])

            # Prepare data
            student_info = {
                'institute_id': institute_id.id,
                'year_id': year.id,
                'class_instance_id': request.data['class_name'],
                'group_id': request.data['group_name_bangla'],
                'section_id': request.data['section_name'],
                'exam_id': request.data['exam_name'],
                # 'subject_for_ims_id': request.data['subject_name_display']
            }
            mark_type = request.data['mark_type_display']
            students = request.data['Student']
            marks_data = request.data['MarksForType']
            
            subject_for_ims_id = request.data['subject_name_display']

            # Validate student and marks count
            if len(students) != len(marks_data):
                return Response({"error": "Mismatch between students and marks count."}, status=status.HTTP_400_BAD_REQUEST)

            # created_results = []
            marks_to_create = []
            existing_marks = []

            for index, student in enumerate(students):
                student_id = student.get('id')
                if not student_id:
                    continue  # Skip invalid student entries

                student_info['student_id'] = student_id

                # Get or create result
                result, created = StudentSubjectResult.objects.update_or_create(**student_info) 
                subject_for_ims = SubjectForIMS.objects.get(id=subject_for_ims_id)
                existingSubject, createdSubject = SubjectForResult.objects.update_or_create(student_from_result_table=result, subject=subject_for_ims)
                
                # print("////////////////////////////////////////////////")
                # print(existingSubject,"------------", createdSubject,'-----------mark_type: ',mark_type)
                # print("///////////////////////mark_type/////////////////////////")
                # print(mark_type)
                # print("////////////////////////////////////////////////")

                # MarkTypeForSubjectObj = MarkTypeForSubject.objects.get(mark_type=mark_type)
                MarkTypeForSubjectObj = MarkTypeForSubject.objects.filter(subject=subject_for_ims.subject_name, mark_type=mark_type).first()
                # print("//////////////////// MarkTypeForSubjectObj:subject_for_ims_id ////////////////////////////")
                # print(MarkTypeForSubjectObj,":", subject_for_ims_id)
                # print("////////////////////////////////////////////////")
                
                
                mark_entry_for_subject = TypewiseMarksForSubject.objects.filter(subject=existingSubject, mark_type=MarkTypeForSubjectObj).first()
                # print("//////////////////// mark_entry_for_subject ////////////////////////////")
                # print(mark_entry_for_subject)
                # print("////////////////////////////////////////////////")
                
                # Check if mark entry already exists
                # mark_entry = MarksForType.objects.filter(single_result=result, mark_type=mark_type).first()
                

                if mark_entry_for_subject:
                    # If exists, update the marks
                    mark_entry_for_subject.marks = marks_data[index]['marks']
                    existing_marks.append(mark_entry_for_subject)
                else:
                    # If not exists, prepare for bulk_create
                    marks_to_create.append(
                        TypewiseMarksForSubject(subject=existingSubject, mark_type=MarkTypeForSubjectObj, marks=marks_data[index]['marks'])
                    )

            # Bulk insert new mark records
            if marks_to_create:
                TypewiseMarksForSubject.objects.bulk_create(marks_to_create)

            # Bulk update existing mark records
            if existing_marks:
                TypewiseMarksForSubject.objects.bulk_update(existing_marks, ['marks']) #['marks'] specifies that only the marks field should be updated.

            return Response({"message": "Marks submitted successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitMultipleMarkTypesBySubjectView(APIView):
    permission_classes = [IsStaffUser]
    def post(self, request):
        try:
            # Validate required fields
            required_fields = [
                'year', 'shift', 'class_name', 'group_name_bangla', 'section_name',
                'exam_name', 'subject_name_display', 'Student', 'all_marks_with_student_id', 'all_mark_types'
            ]
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Fetch related models
            year = get_object_or_404(Year, institute_id=institute_id, year=request.data['year'])

            # Prepare base data for result creation
            student_info = {
                'institute_id': institute_id.id,
                'year_id': year.id,
                'class_instance_id': request.data['class_name'],
                'group_id': request.data['group_name_bangla'],
                'section_id': request.data['section_name'],
                'exam_id': request.data['exam_name'],
            }

            all_marks_with_student_id = request.data['all_marks_with_student_id']
            all_mark_types = request.data['all_mark_types']  # e.g. {'CA': 20, 'Theory': 30, 'Practical': 25}
            students = request.data['Student']
            subject_for_ims_id = request.data['subject_name_display']
            
            # print("all_marks_with_student_id: ", all_marks_with_student_id)
            # print("all_mark_types: ", all_mark_types)

            subject_for_ims = get_object_or_404(SubjectForIMS, id=subject_for_ims_id)

            marks_to_create = []
            existing_marks = []

            for student in students:
                student_id = student.get('id')
                if not student_id:
                    continue

                student_info['student_id'] = student_id

                # Get or create the main result entry
                result, _ = StudentSubjectResult.objects.update_or_create(**student_info)

                # Get or create the subject entry
                subject_result, _ = SubjectForResult.objects.update_or_create(
                    student_from_result_table=result,
                    subject=subject_for_ims
                )

                # Get marks for this student
                student_marks_dict = all_marks_with_student_id.get(str(student_id)) or all_marks_with_student_id.get(student_id)
                if not student_marks_dict:
                    continue  # No marks to process

                # Loop through each mark type
                for mark_type_name, mark_value in student_marks_dict.items():
                    mark_type_obj = MarkTypeForSubject.objects.filter(
                        subject=subject_for_ims.subject_name,
                        mark_type=mark_type_name
                    ).first()

                    if not mark_type_obj:
                        print("Skip unknown mark types")
                        continue  # Skip unknown mark types

                    # Check if entry exists
                    mark_entry = TypewiseMarksForSubject.objects.filter(
                        subject=subject_result,
                        mark_type=mark_type_obj
                    ).first()

                    if mark_entry:
                        mark_entry.marks = mark_value
                        existing_marks.append(mark_entry)
                    else:
                        marks_to_create.append(
                            TypewiseMarksForSubject(
                                subject=subject_result,
                                mark_type=mark_type_obj,
                                marks=mark_value
                            )
                        )

            # Bulk operations
            if marks_to_create:
                TypewiseMarksForSubject.objects.bulk_create(marks_to_create)

            if existing_marks:
                TypewiseMarksForSubject.objects.bulk_update(existing_marks, ['marks'])

            return Response({"message": "Marks submitted successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#Return Saved marks for marks input field for update using student roll

class ReturnSavedMarksByStudentRoll(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Extract query parameters
            year = request.query_params.get('year') 
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group_name')
            section_id = request.query_params.get('section_name')
            exam_id = request.query_params.get('exam_name')
            subject_id = request.query_params.get('subject_name')
            mark_type_id = request.query_params.get('mark_type_name')
            # print("mark_type_id: ", mark_type_id)

            # Fetch students in the given section
            students = Student.objects.filter(section_id=section_id).select_related("section")
            
            # print("//////////////////// students ////////////////////////////")
            # print(students)
            # print("////////////////////////////////////////////////")
            
            
            # Step 1: Get the SubjectForIMS instance
            subject_for_ims = SubjectForIMS.objects.get(id=subject_id)

            # Step 2: Get the related SubjectName
            subject_name = subject_for_ims.subject_name

            # Step 3: Get the MarkTypeForSubject for mark_type 'CA'
            mark_type_instance = MarkTypeForSubject.objects.get(subject=subject_name, mark_type=mark_type_id)

            # Step 4: Get the max_marks
            max_marks = mark_type_instance.max_marks
            
            # Fetch all results for these students in one query
            results = StudentSubjectResult.objects.filter(
                student__in=students, exam_id=exam_id,
            ).select_related("student")
            
            # print("//////////////////// results ////////////////////////////")
            # print(results)
            # print("////////////////////////////////////////////////")

            # Fetch all subject for student wise
            subject_for_student = SubjectForResult.objects.filter(
                student_from_result_table__in=results, subject=subject_id
            ).select_related("single_result")
            
            # Fetch all relevant marks in one optimized query
            marks_data = TypewiseMarksForSubject.objects.filter(
                subject__in=subject_for_student,
                mark_type__mark_type=mark_type_id
            ).select_related(
                'subject__student_from_result_table__student',
                'mark_type'
            )
            
            # debug("marks_data: ", marks_data)

            # Create a lookup dictionary for fast access
            marks_lookup = {
                mark.subject.student_from_result_table.student.id: mark.marks
                for mark in marks_data
            }

            # Populate marks dictionary with fetched marks or default -1
            marks = {student.id: marks_lookup.get(student.id, -1) for student in students}

            # Extract max marks from the first mark_type (assuming same for all)
            # max_marks = marks_data[0].mark_type.max_marks if marks_data else 1000

            return Response((marks, max_marks))

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": "An error occurred while fetching marks.", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReturnAllTypesSavedMarksByStudentRoll(APIView):
    def get(self, request):
        try:
            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Extract query parameters
            year = request.query_params.get('year')
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group_name')
            section_id = request.query_params.get('section_name')
            exam_id = request.query_params.get('exam_name')
            subject_id = request.query_params.get('subject_name')

            # Fetch students in the given section
            students = Student.objects.filter(section_id=section_id).select_related("section")

            # Step 1: Get the SubjectForIMS instance
            subject_for_ims = SubjectForIMS.objects.get(id=subject_id)

            # Step 2: Get the related SubjectName
            subject_name = subject_for_ims.subject_name

            # Step 3: Get all MarkTypeForSubject for this subject
            mark_types = MarkTypeForSubject.objects.filter(subject=subject_name).order_by('serial_number')

            # Dictionary to store max marks for each type
            max_marks_dict = {mt.mark_type: mt.max_marks for mt in mark_types}

            # Step 4: Get all StudentSubjectResult for this exam
            results = StudentSubjectResult.objects.filter(
                student__in=students,
                exam_id=exam_id,
            ).select_related("student")

            # Step 5: Get all SubjectForResult for these results + this subject
            subject_for_student = SubjectForResult.objects.filter(
                student_from_result_table__in=results,
                subject=subject_id
            ).select_related("single_result")

            # Step 6: Get all TypewiseMarksForSubject for these subjects (all mark types)
            marks_data = TypewiseMarksForSubject.objects.filter(
                subject__in=subject_for_student,
                mark_type__in=mark_types
            ).select_related(
                'subject__student_from_result_table__student',
                'mark_type'
            )

            # Create lookup: { student_id: {mark_type: marks} }
            marks_lookup = {}
            for mark in marks_data:
                student_id = mark.subject.student_from_result_table.student.id
                mtype = mark.mark_type.mark_type
                if student_id not in marks_lookup:
                    marks_lookup[student_id] = {}
                marks_lookup[student_id][mtype] = mark.marks

            # Fill missing entries with -1
            final_marks = {}
            for student in students:
                final_marks[student.id] = {}
                for mtype in max_marks_dict.keys():
                    final_marks[student.id][mtype] = marks_lookup.get(student.id, {}).get(mtype, -1)
            # print("Response:", max_marks_dict,final_marks )
            return Response({
                "max_marks": max_marks_dict,
                "marks": final_marks
            })

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": "An error occurred while fetching marks.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerateResult(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication

    def post(self, request):
        try:
            # Get user profile and institute
            try:
                user_profile = getUserProfile(request.user)
                institute = Institute.objects.get(id=user_profile.institute.id)
            except AttributeError:
                return Response(
                    {"message": "User profile is incomplete or not found"},
                    status=status.HTTP_403_FORBIDDEN
                )
            except Institute.DoesNotExist:
                return Response(
                    {"message": "Institute does not exist"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Extract and validate request data
            try:
                year = request.data.get('year')
                exam_name = request.data.get('exam_name')
                shift = request.data.get('shift')
                class_name = request.data.get('class_name') 
                
                year_type = request.data.get('year_type') 
                class_type = request.data.get('class_type') 
                
                if year_type and not all([year, exam_name, shift ]):
                    return Response(
                        {"message": "Missing required fields: Year, Exam Name or Shift"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if class_type  and not all([year, exam_name, shift, class_name ]):
                    return Response(
                        {"message": "Missing required fields: Year, Exam Name, Shift or Class"},
                        status=status.HTTP_400_BAD_REQUEST
                    ) 
            except KeyError:
                return Response(
                    {"message": "Invalid request data"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if year exists for the institute
            try:
                year_instance = Year.objects.get(institute=institute, year=year)
            except Year.DoesNotExist:
                return Response(
                    {"message": f"Year {year} does not exist for this institute"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Generate result
            if year_type:
                # debug("institute.id, year, exam_name, shift: ", f"{institute.id, year, exam_name, shift}")
                response = generate_result_year_wise(institute.id, year, exam_name, shift)
            else: 
                # debug("========== class_type ========= ",class_type )
                response = generate_result_class_wise(institute.id, year, exam_name, shift, class_name) 
            return response

        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Marksheet and Tabulation sheet API View
class ResultAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        
        try:
            year = request.query_params.get('year')
            exam_name = request.query_params.get('exam_name') 
            shift = request.query_params.get('shift')
            class_name = request.query_params.get('class_name')
            group = request.query_params.get('group')
            section = request.query_params.get('section_name')
            
            # debug("========== year ========= ", year)
            # debug("========== exam_name ========= ", exam_name)
            # debug("========== shift ========= ", shift)
            # debug("========== class_name ========= ", class_name)
            # debug("========== group ========= ", group)
            # debug("========== section ========= ", section)
            
            # year_type = request.query_params.get('year_type') 
            class_type = request.query_params.get('class_type') 
            section_type = request.query_params.get('section_type') 
            
            # if year_type == "true" and not all([year, exam_name, shift ]):
            #     return Response(
            #         {"message": "Missing required fields: Year, Exam Name or Shift"},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )
            if class_type == "true" and not all([year, exam_name, shift, class_name ]):
                return Response(
                    {"message": "Missing required fields: Year, Exam Name, Shift or Class"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if section_type == "true" and not all([year, exam_name, shift, class_name, group, section ]):
                # debug([year, exam_name, shift, class_name, group, section ])
                return Response(
                    {"message": "Missing required fields: Year, Exam Name, Shift, Class, Groupa and Section"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # debug(" Show Result: ", [year, exam_name,shift,class_name, group,section_type])
        except KeyError:
            return Response(
                {"message": "Invalid request data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        userProfile = getUserProfile(request.user)
        institute_id = userProfile.institute.id
        
        # debug("userProfile: ", institute_id )
        # debug("institute_id",institute_id )
        
        BASE ={
            'institute__id': institute_id,
            'year__year':request.query_params.get('year'),
            
        }
        
        # FILTERS_FOR_YEAR_WISE_RESULT = BASE
        
        FILTERS_FOR_CLASS_WISE_RESULT ={
            **BASE, 
            'class_instance__id':request.query_params.get('class_name'),
            'exam': request.query_params.get('exam_name'),
            'group': request.query_params.get('group'),
        }
        
        FILTERS_FOR_SECTION_WISE_RESULT ={
            **FILTERS_FOR_CLASS_WISE_RESULT,
            # 'exam': request.query_params.get('exam_name'),
            # 'group': request.query_params.get('group'),
            'section': request.query_params.get('section_name'), 
        }
        
        
        # if  year_type == "true":
        #     FILTERS_RESULT = FILTERS_FOR_YEAR_WISE_RESULT
        if class_type  == "true":
            FILTERS_RESULT = FILTERS_FOR_CLASS_WISE_RESULT
        else:
            FILTERS_RESULT = FILTERS_FOR_SECTION_WISE_RESULT 
        
        # debug( " class_type: ", class_type )
        # debug(  "section_type: ", section_type,"FILTERS_RESULT: ", FILTERS_RESULT) 
        FILTERS_RESULT = {k: v for k, v in FILTERS_RESULT.items() if v is not None}
        
        # results = StudentSubjectResult.objects.select_related(
        #     'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
        # ).filter(**FILTERS_RESULT).prefetch_related(
        #     Prefetch('subjectforresult', queryset=SubjectForResult.objects.order_by('subject__serial_number').prefetch_related(
        #         Prefetch('typewisemarksforsubject', queryset=TypewiseMarksForSubject.objects.order_by('mark_type__serial_number'))
        #     ))
        # ).order_by('total_fail_subjects', 'classwise_merit','total_obtained_marks')
        
        results = StudentSubjectResult.objects.select_related(
            'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
        ).filter(**FILTERS_RESULT).prefetch_related(
            Prefetch('subjectforresult', queryset=SubjectForResult.objects.order_by('subject__serial_number').prefetch_related(
                Prefetch('typewisemarksforsubject', queryset=TypewiseMarksForSubject.objects.order_by('mark_type__serial_number'))
            ))
        ).annotate(
                roll_number_int=Case(
                    When(student__roll_number__regex=r'^\d+$', then=Cast('student__roll_number', IntegerField())),
                    default=Value(0),  # Non-numeric values get 0 (or another fallback)
                    output_field=IntegerField()
                )
            ).order_by('roll_number_int')
        
        results_for_summary = StudentSubjectResult.objects.filter(**FILTERS_RESULT)
                
        # Calculate statistics for this group
        summary = results_for_summary.aggregate(
            total_examinee=Count("id", distinct=True),
            appeared=Count("id", filter=Q(total_obtained_marks__gt=0), distinct=True),
            total_pass=Count("id", filter=Q(total_fail_subjects=0), distinct=True),
            total_fail=Count("id", filter=Q(total_fail_subjects__gt=0), distinct=True),
            grade_a_plus=Count("id", filter=Q(letter_grade="A+"), distinct=True),
            grade_a=Count("id", filter=Q(letter_grade="A"), distinct=True),
            grade_a_minus=Count("id", filter=Q(letter_grade="A-"), distinct=True),
            grade_b=Count("id", filter=Q(letter_grade="B"), distinct=True),
            grade_c=Count("id", filter=Q(letter_grade="C"), distinct=True),
            grade_d=Count("id", filter=Q(letter_grade="D"), distinct=True),
            avg_marks=Avg("total_obtained_marks"),
            highest_marks=Max("total_obtained_marks"),
            lowest_marks=Min("total_obtained_marks"),
        )
        
        # Calculate percentages
        total_students = summary['total_examinee'] or 0
        pass_percentage = (summary['total_pass'] / total_students * 100) if total_students > 0 else 0
        attendance_percentage = (summary['appeared'] / total_students * 100) if total_students > 0 else 0
        
        summary={
            **summary,
            'pass_percentage': pass_percentage,
            'attendance_percentage': attendance_percentage
        }
        
        
        # ///////////////// this is for marksheet information about institute and exam /////////////////
        institute_obj = Institute.objects.get(id=institute_id)
        exam_obj = ExamForIMS.objects.get(id=request.query_params.get('exam_name'))
        # head_teacher_signature = Teacher.objects.filter(
        #         designation='head_teacher', institute=institute_obj
        #     ).first().signature.url
        head_teacher = Teacher.objects.filter(
            designation='head_teacher', institute=institute_obj
        ).first()

        if head_teacher and head_teacher.signature:
            head_teacher_signature = head_teacher.signature.url
        else:
            head_teacher_signature = None  # or a default image URL, e.g. "/static/default-signature.png"
        exam_and_institute_info ={
            'institute_name': institute_obj.name,
            'institute_name_eng': institute_obj.name_in_english,
            'signature_of_class_teacher': institute_obj.signature_of_class_teacher,
            'signature_of_class_bangla': institute_obj.signature_of_class_bangla,
            'signature_of_class_guardian': institute_obj.signature_of_class_guardian,
            'signature_of_class_guardian_bangla': institute_obj.signature_of_class_guardian_bangla,
            'signature_of_head': institute_obj.signature_of_head,
            'signature_of_head_bangla': institute_obj.signature_of_head_bangla,
            'exam_name': exam_obj.exam_name,
            'exam_name_in_english': exam_obj.exam_name_in_english,
            'year': year,
            'institute_logo' : request.build_absolute_uri(institute_obj.logo.url) if institute_obj.logo.path else None,
            'signature': request.build_absolute_uri(head_teacher_signature) if institute_obj.logo.path else None,
            'class_name': Class.objects.get(id=class_name).class_name.name_bengali if class_name else None,
            'education_type': Class.objects.get(id=class_name).class_name.education_type if class_name else None,
            'summary': summary,
        }
        
        # debug("exam_and_institute_info: ", exam_and_institute_info)
        
        
        serializer = ResultSerializer(results, many=True) 
        
        subjects = SubjectForIMS.objects.filter(institute__id=institute_id,
            year__year=request.query_params.get('year'),
            class_instance__id=request.query_params.get('class_name'),
            group= request.query_params.get('group'))

        # print("============ subjects: ", subjects)
        
        highest_marks = SubjectHighestMarks.objects.filter(
            subject__in=subjects, group=group,
        ).select_related('subject', 'section').order_by('subject__serial_number')
        
        # print("highest_marks: //////// ", highest_marks)
        
        highest_marks_serializer = SubjectHighestMarksSerializer(highest_marks, many=True)    
        
        # debug("highest_marks_serializer: ", highest_marks_serializer.data)
        
        if not results:
            print("No results found for the query. Cannot get subjects.")
        
        # all_subject = results[0].subjectforresult.all().order_by('subject__serial_number')
        if results.exists():
            all_subject = results[0].subjectforresult.all().order_by('subject__serial_number')
        else:
            return Response(
                "No student result found matching the filters.",
                status=status.HTTP_404_NOT_FOUND
            )
        
        all_subject_serializer = SubjectForResultSerializer(all_subject, many=True) 
        # debug("all_subject_serializer: ", all_subject_serializer)
        
        
        
        # Combine the serialized data into a single response
        response_data = {
            'exam_and_institute_info': exam_and_institute_info,
            'results': serializer.data,
            'highest_marks': highest_marks_serializer.data,
            'all_subject_serializer': all_subject_serializer.data,
        }
        return Response(response_data)


class ResultSummaryAPIView(APIView):
    def get(self, request):
        try:
            # Get query parameters
            year = request.query_params.get('year')
            exam_name = request.query_params.get('exam_name')
            shift = request.query_params.get('shift')
            class_name = request.query_params.get('class_name')
            
            # Validate required parameters
            if not all([year, exam_name, class_name]):
                return Response(
                    {"message": "Missing required parameters: year, exam_name, class_name"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {"message": f"Invalid request data: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get user profile and institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute.id
            
            # Get all groups for the given parameters
            group_filter = {
                'institute__id': institute_id,
                'year__year': year,
                'class_instance__id': class_name,
            }
            
            if shift:
                group_filter['class_instance__shift'] = shift
                
            all_groups = Group.objects.filter(**group_filter).distinct()
            
            if not all_groups.exists():
                return Response(
                    {"message": "No groups found for the given criteria"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Base filter for results
            base_filter = {
                'institute__id': institute_id,
                'year__year': year,
                'class_instance__id': class_name,
                'exam': exam_name,
            }
            
            # Process results for each group
            group_results = []
            overall_stats = {
                'total_examinee': 0,
                'appeared': 0,
                'total_pass': 0,
                'total_fail': 0,
                'grade_a_plus': 0,
                'grade_a': 0,
                'grade_a_minus': 0,
                'grade_b': 0,
                'grade_c': 0,
                'grade_d': 0,
            }
            
            for group in all_groups:
                # Filter results for this specific group
                group_filter_result = {
                    **base_filter,
                    'group': group,
                }
                
                results = StudentSubjectResult.objects.filter(**group_filter_result)
                
                # Calculate statistics for this group
                stats = results.aggregate(
                    total_examinee=Count("id", distinct=True),
                    appeared=Count("id", filter=Q(total_obtained_marks__gt=0), distinct=True),
                    total_pass=Count("id", filter=Q(total_fail_subjects=0), distinct=True),
                    total_fail=Count("id", filter=Q(total_fail_subjects__gt=0), distinct=True),
                    grade_a_plus=Count("id", filter=Q(letter_grade="A+"), distinct=True),
                    grade_a=Count("id", filter=Q(letter_grade="A"), distinct=True),
                    grade_a_minus=Count("id", filter=Q(letter_grade="A-"), distinct=True),
                    grade_b=Count("id", filter=Q(letter_grade="B"), distinct=True),
                    grade_c=Count("id", filter=Q(letter_grade="C"), distinct=True),
                    grade_d=Count("id", filter=Q(letter_grade="D"), distinct=True),
                    avg_marks=Avg("total_obtained_marks"),
                    highest_marks=Max("total_obtained_marks"),
                    lowest_marks=Min("total_obtained_marks"),
                )
                
                # Calculate percentages
                total_students = stats['total_examinee'] or 0
                pass_percentage = (stats['total_pass'] / total_students * 100) if total_students > 0 else 0
                attendance_percentage = (stats['appeared'] / total_students * 100) if total_students > 0 else 0
                
                # Add group data
                group_data = {
                    'group_id': group.id,
                    'group_name': group.name if hasattr(group, 'name') else str(group),
                    'group_name_bangla': getattr(group, 'name_bangla', ''),
                    'statistics': {
                        **stats,
                        'pass_percentage': round(pass_percentage, 2),
                        'attendance_percentage': round(attendance_percentage, 2),
                        'avg_marks': round(stats['avg_marks'] or 0, 2),
                    }
                }
                
                # Add to overall stats
                for key in overall_stats:
                    overall_stats[key] += stats.get(key, 0)
                
                group_results.append(group_data)
            
            # Calculate overall percentages
            total_overall = overall_stats['total_examinee']
            overall_pass_percentage = (overall_stats['total_pass'] / total_overall * 100) if total_overall > 0 else 0
            overall_attendance_percentage = (overall_stats['appeared'] / total_overall * 100) if total_overall > 0 else 0
            
            overall_stats['pass_percentage'] = round(overall_pass_percentage, 2)
            overall_stats['attendance_percentage'] = round(overall_attendance_percentage, 2)
            
            # Get institute and exam information
            institute_obj = get_object_or_404(Institute, id=institute_id)
            exam_obj = get_object_or_404(ExamForIMS, id=exam_name)
            class_obj = get_object_or_404(Class, id=class_name) if class_name else None
            
            exam_and_institute_info = {
                'institute_name': institute_obj.name,
                'institute_name_eng': institute_obj.name_in_english,
                'signature_of_class_teacher': institute_obj.signature_of_class_teacher,
                'signature_of_class_bangla': institute_obj.signature_of_class_bangla,
                'signature_of_class_guardian': institute_obj.signature_of_class_guardian,
                'signature_of_class_guardian_bangla': institute_obj.signature_of_class_guardian_bangla,
                'signature_of_head': institute_obj.signature_of_head,
                'signature_of_head_bangla': institute_obj.signature_of_head_bangla,
                'exam_name': exam_obj.exam_name,
                'exam_name_in_english': exam_obj.exam_name_in_english,
                'year': year,
                'institute_logo': request.build_absolute_uri(institute_obj.logo.url) if institute_obj.logo else None,
                'class_name': class_obj.class_name.name_bengali if class_obj else None,
                'education_type': class_obj.class_name.education_type if class_obj else None,
                'shift': shift,
            }
            
            # Prepare final response
            response_data = {
                'exam_and_institute_info': exam_and_institute_info,
                'overall_statistics': overall_stats,
                'group_results': group_results,
                'total_groups': len(group_results),
                'generated_at': timezone.now().isoformat(),
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Institute.DoesNotExist:
            return Response(
                {"message": "Institute not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except ExamForIMS.DoesNotExist:
            return Response(
                {"message": "Exam not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Marksheet and Tabulation sheet API View
class AdmitCard(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        
        try:
            year = request.query_params.get('year')
            exam_name = request.query_params.get('exam_name') 
            shift = request.query_params.get('shift')
            class_name = request.query_params.get('class_name')
            group = request.query_params.get('group')
            section = request.query_params.get('section_name')
            
            # debug("========== year ========= ", year)
            # debug("========== exam_name ========= ", exam_name)
            # debug("========== shift ========= ", shift)
            # debug("========== class_name ========= ", class_name)
            # debug("========== group ========= ", group)
            # debug("========== section ========= ", section)
            
            # year_type = request.query_params.get('year_type') 
            class_type = request.query_params.get('class_type') 
            section_type = request.query_params.get('section_type') 
            
            # if year_type == "true" and not all([year, exam_name, shift ]):
            #     return Response(
            #         {"message": "Missing required fields: Year, Exam Name or Shift"},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )
            if class_type == "true" and not all([year, exam_name, shift, class_name ]):
                return Response(
                    {"message": "Missing required fields: Year, Exam Name, Shift or Class"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if section_type == "true" and not all([year, exam_name, shift, class_name, group, section ]):
                # debug([year, exam_name, shift, class_name, group, section ])
                return Response(
                    {"message": "Missing required fields: Year, Exam Name, Shift, Class, Groupa and Section"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # debug(" Show Result: ", [year, exam_name,shift,class_name, group,section_type])
        except KeyError:
            return Response(
                {"message": "Invalid request data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        userProfile = getUserProfile(request.user)
        institute_id = userProfile.institute.id
        # institute_name_ban = userProfile.institute.name
        # institute_name_eng = userProfile.institute.name_in_english
        # institute_logo = userProfile.institute.institute_logo
        
        # debug("userProfile: ", institute_id )
        # debug("institute_id",institute_id ) 
        
        BASE ={
            'institute__id': institute_id,
            'year__year':request.query_params.get('year'),
            
        }
        
        # FILTERS_FOR_YEAR_WISE_RESULT = BASE
        
        FILTERS_FOR_CLASS_WISE_RESULT ={
            **BASE, 
            'class_instance__id':request.query_params.get('class_name'),
            # 'exam': request.query_params.get('exam_name'),
            'group': request.query_params.get('group'),
        }
        
        FILTERS_FOR_SECTION_WISE_RESULT ={
            **FILTERS_FOR_CLASS_WISE_RESULT,
            # 'exam': request.query_params.get('exam_name'),
            # 'group': request.query_params.get('group'),
            'section': request.query_params.get('section_name'), 
        }
        
        
        # if  year_type == "true":
        #     FILTERS_RESULT = FILTERS_FOR_YEAR_WISE_RESULT
        if class_type  == "true":
            FILTERS_RESULT = FILTERS_FOR_CLASS_WISE_RESULT
        else:
            FILTERS_RESULT = FILTERS_FOR_SECTION_WISE_RESULT 
        
        # debug( " class_type: ", class_type )
        # debug(  "section_type: ", section_type,"FILTERS_RESULT: ", FILTERS_RESULT) 
        FILTERS_RESULT = {k: v for k, v in FILTERS_RESULT.items() if v is not None}
        
        # print("FILTERS_RESULT: ", FILTERS_RESULT)
        
        student_list = Student.objects.filter(**FILTERS_RESULT).annotate(
                roll_number_int=Case(
                    When(roll_number__regex=r'^\d+$', then=Cast('roll_number', IntegerField())),
                    default=Value(0),  # Non-numeric values get 0 (or another fallback)
                    output_field=IntegerField()
                )
            ).order_by('roll_number_int')
        # student_list = Student.objects.filter(institute=1, year__year= 2025, class_instance=71, group=107,section=126)
        # student_list = Student.objects.filter(**FILTERS_RESULT)
        
        # print("student_list: ", student_list) 
        # print("==============///////////////////////////================") 
        exam_name = ExamForIMS.objects.get(id=request.query_params.get('exam_name'))
        student_common_info={}
        if student_list:
            first_student = student_list.first()
            print("first_student: ", first_student)
            student_common_info = {
                # 'institute_name_ban':institute_name_ban,
                # 'institute_name_eng':institute_name_eng,
                'exam_name':f"{exam_name.exam_name_in_english}-{exam_name.year}",
                'class': first_student.class_instance.class_name.name,
                'shift': first_student.class_instance.shift_name,
                'group': first_student.group.group_name.name,
                'section': first_student.section.section_name.name, 
            }
        # print("student info: ",student_common_info ) 
        # ///////////////// this is for marksheet information about institute and exam /////////////////
        institute_obj = Institute.objects.get(id=institute_id) 
        head_teacher = Teacher.objects.filter(
            designation='head_teacher', institute=institute_obj
        ).first()

        if head_teacher and head_teacher.signature:
            head_teacher_signature = head_teacher.signature.url
        else:
            head_teacher_signature = None  # or a default image URL, e.g. "/static/default-signature.png"
        
        
        student_list = StudentSerializer(student_list,many=True)
        # institute_obj = Institute.objects.get(id=institute_id) 
        # institute_info = InstituteSerializer(institute_obj,many=True)
        institute_info = InstituteSerializer(institute_obj, context={'request': request}, many=False)
        
        # print('student_list Data================', student_list.data, request.build_absolute_uri(head_teacher_signature) if institute_obj.logo.path else None)
        
        # Combine the serialized data into a single response
        response_data = {
            'institute_info': institute_info.data, 
            'student_common_info':student_common_info,
            'student_list': student_list.data, 
            'head_master_signature': request.build_absolute_uri(head_teacher_signature) if head_teacher_signature is not None else None,
            # 'head_master_signature': request.build_absolute_uri(head_teacher_signature) if institute_obj.logo.path else None,
        }
        return Response(response_data)



class MarksAdjustmentViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MarksAdjustment.objects.all()
    serializer_class = MarksAdjustmentSerializer