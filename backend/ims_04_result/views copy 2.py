



from core.utils import debug

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import StudentSubjectResultSerializer, ResultSerializer, SubjectHighestMarksSerializer, SubjectForResultSerializer
from core.utils import getUserProfile
from ims_01_institute.models import Institute, Year, Class, MarkTypeForSubject
from ims_04_result.models import *
from ims_03_exam.models import ExamForIMS
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticated
from ims_02_account.models import Student

from .utils import generate_result_year_wise, generate_result_class_wise

class SubmitMarksBySubjectView(APIView):
    def post(self, request):
        try:
            # Ensure required fields are present
            required_fields = [
                'year', 'shift', 'class_name', 'group_name_bangla', 'section_name_display',
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
                'section_id': request.data['section_name_display'],
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


#Return Saved marks for marks input field for update using student roll

class ReturnSavedMarksByStudentRoll(APIView):
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

            # Fetch students in the given section
            students = Student.objects.filter(section_id=section_id).select_related("section")
            
            # print("//////////////////// students ////////////////////////////")
            # print(students)
            # print("////////////////////////////////////////////////")

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
            
            # Fetch marks in bulk
            marks_data = TypewiseMarksForSubject.objects.filter(
                subject__in=subject_for_student, mark_type__mark_type=mark_type_id
            )
            
            # print("//////////////////// marks_data ////////////////////////////")
            # print(marks_data)
            # print("////////////////////////////////////////////////")

            # Create a lookup dictionary for fast access
            marks_lookup = {mark.subject.student_from_result_table.student.id: mark.marks for mark in marks_data}

            # Populate marks dictionary with fetched marks
            marks = {student.id: marks_lookup.get(student.id, -1) for student in students}
            
            # debug(marks)

            return Response(marks)

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
                group = request.data.get('group')
                section = request.data.get('section')
                
                year_type = request.data.get('year_type') 
                class_type = request.data.get('class_type') 
                # section_type = request.data.get('section_type') 
                
                # debug("========== year_type ========= ", year_type)
                
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

            # Check if exam exists for the institute and year
            try:
                exam = ExamForIMS.objects.get(
                    institute=institute,
                    year=year_instance,
                    id=exam_name
                )
            except ExamForIMS.DoesNotExist:
                return Response(
                    {"message": f"Exam {exam_name} does not exist for year {year} in this institute"},
                    status=status.HTTP_404_NOT_FOUND
                )

            
            # Generate result
            if year_type:
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
    def get(self, request):
        
        try:
            year = request.query_params.get('year')
            exam_name = request.query_params.get('exam_name') 
            shift = request.query_params.get('shift')
            class_name = request.query_params.get('class_name')
            group = request.query_params.get('group')
            section = request.query_params.get('section')
            
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
        
        BASE ={
            'institute__id': institute_id,
            'year__year':request.query_params.get('year'),
            
        }
        
        # FILTERS_FOR_YEAR_WISE_RESULT = BASE
        
        FILTERS_FOR_CLASS_WISE_RESULT ={
            **BASE, 
            'class_instance__id':request.query_params.get('class_name'), 
        }
        
        FILTERS_FOR_SECTION_WISE_RESULT ={
            **FILTERS_FOR_CLASS_WISE_RESULT,
            'exam': request.query_params.get('exam_name'),
            'group': request.query_params.get('group'),
            'section': request.query_params.get('section'), 
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
        
        results = StudentSubjectResult.objects.select_related(
            'institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'
        ).filter(**FILTERS_RESULT).prefetch_related(
            Prefetch('subjectforresult', queryset=SubjectForResult.objects.order_by('subject__serial_number').prefetch_related(
                Prefetch('typewisemarksforsubject', queryset=TypewiseMarksForSubject.objects.order_by('mark_type__serial_number'))
            ))
        ).order_by('total_fail_subjects', 'classwise_merit','total_obtained_marks')
        
        
        # ///////////////// this is for marksheet information about institute and exam /////////////////
        institute_obj = Institute.objects.get(id=institute_id)
        exam_obj = ExamForIMS.objects.get(id=request.query_params.get('exam_name'))
        head_teacher_signature = Teacher.objects.filter(
                designation='head_teacher', institute=institute_obj
            ).first().signature.url
        exam_and_institute_info ={
            'institute_name': institute_obj.name,
            'institute_name_eng': institute_obj.name_in_english,
            'exam_name': exam_obj.exam_name,
            'exam_name_in_english': exam_obj.exam_name_in_english,
            'year': year,
            'institute_logo' : request.build_absolute_uri(institute_obj.logo.url) if institute_obj.logo.path else None,
            'signature': request.build_absolute_uri(head_teacher_signature) if institute_obj.logo.path else None,
            'class_name': Class.objects.get(id=class_name).class_name.name_bengali if class_name else None,
        }
        
        
        serializer = ResultSerializer(results, many=True) 
        
        subjects = SubjectForIMS.objects.filter(institute__id=institute_id,
            year__year=request.query_params.get('year'),
            class_instance__id=request.query_params.get('class_name'),
            group= request.query_params.get('group'))
        
        highest_marks = SubjectHighestMarks.objects.filter(
            subject__in=subjects
        ).select_related('subject', 'section').order_by('subject__serial_number')
        
        highest_marks_serializer = SubjectHighestMarksSerializer(highest_marks, many=True)    
        
        # debug("highest_marks_serializer: ", highest_marks_serializer.data)
        
        
        
        all_subject = results[0].subjectforresult.all().order_by('subject__serial_number')
        
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
        # return Response(serializer.data)

# {'institute__id': 1, 'year__year': '2025', 'class_instance__class_name__name': 'Six', 'group__group_name': None, 'section__section_name': 'a', 'exam__exam_name': 'বার্ষিক/নির্বাচনী পরীক্ষা'}
# {'institute__id': 1, 'year__year': '2025', 'class_instance__class_name__name': '11', 'group__group_name': '6', 'section__section_name': '6', 'exam__exam_name': '1'}
