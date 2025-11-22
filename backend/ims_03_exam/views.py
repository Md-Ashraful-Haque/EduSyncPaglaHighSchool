from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
#////////////////////////////// Rest API ///////////////////////////
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import api_view
from .models import *
from .serializers import *

from core.utils import getUserProfile

class ExamListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            # shift = request.query_params.get('shift')
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group')
            if not all([ institute_id, year, class_id ]): 
                return Response(
                    {"error": "Missing parameters: institute_id, year, class_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Filter groups
            exams = ExamForIMS.objects.filter(institute_id=institute_id, year__year=year,class_instance__id=class_id)
            
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ExamByYearListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            shift = request.query_params.get('shift')

            if not all([institute_id, year, shift]):
                return Response(
                    {"error": "Missing parameters: institute_id, year, shift"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Base queryset
            exams = ExamForIMS.objects.filter(
                institute_id=institute_id,
                year__year=year
            )

            # Apply shift filter only if shift != "all"
            if shift != "all":
                exams = exams.filter(class_instance__shift=shift)

            exams = exams.distinct()
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



@api_view(["POST"])
def create_exam_routine(request):
    serializer = ExamRoutineCreateSerializer(data=request.data)

    if serializer.is_valid():
        result = serializer.save()
        return Response(result, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def get_exam_routine(request):
    exam_id = request.GET.get("exam_id")
    class_id = request.GET.get("class_instance_id")
    group_id = request.GET.get("group_id")

    if not (exam_id and class_id and group_id):
        return Response([], status=200)

    routines = ExamRoutine.objects.filter(
        exam_id=exam_id,
        class_instance_id=class_id,
        group_id=group_id
    ).order_by("order", "exam_date")

    serializer = ExamRoutineListSerializer(routines, many=True)
    return Response(serializer.data, status=200)



# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Case, When, Value, IntegerField
from django.db.models.functions import Cast

from ims_01_institute.models import Institute
from .models import ExamForIMS, ExamRoutine
from .serializers import ExamRoutineListSerializer
from ims_02_account.models import Student
# from .serializers import StudentSerializer
# from ims_01_institute.serializers import InstituteSerializer
from ims_01_institute.serializers import  InstituteSerializer
from ims_04_result.serializers import  StudentSerializer


from core.utils import getUserProfile


class ExamAttendanceView(APIView):
    """
    Unified API for Exam Attendance:
    • Students
    • Institute Info
    • Student Common Info
    • Exam Routine
    """

    def get(self, request):

        # Required params
        exam_id = request.query_params.get("exam_name")
        year = request.query_params.get("year")
        class_id = request.query_params.get("class_name")
        group_id = request.query_params.get("group_name_bangla")
        section_id = request.query_params.get("section_name")
        print("=============================")
        print(request.query_params)
        print("=============================")
        
        # <QueryDict: {'year': ['2025'], 'shift': ['morning'], 'class_name': ['78'], 'group_name_bangla': ['120'], 'section_name': ['163'], 'exam_name': ['2'], 'subject_name_display': [''], 'isBangla': ['false'], 'mark_type_display': [''], 'group': ['120'], 'year_type': ['false'], 'class_type': ['false'], 'section_type': ['true']}>


        if not all([exam_id, year, class_id, group_id]):
            return Response(
                {"error": "Missing required parameters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # User institute
        user_profile = getUserProfile(request.user)
        institute_id = user_profile.institute.id

        # ===============================
        # 1️⃣ STUDENT LIST FILTERING
        # ===============================

        student_filter = {
            "institute_id": institute_id,
            "year__year": year,
            "class_instance_id": class_id,
            "group_id": group_id,
        }

        if section_id:
            student_filter["section_id"] = section_id
            

        students_qs = Student.objects.filter(**student_filter).annotate(
            roll_number_int=Case(
                When(roll_number__regex=r'^\d+$', then=Cast('roll_number', IntegerField())),
                default=Value(0),
                output_field=IntegerField()
            )
        ).order_by("roll_number_int")

        students_serialized = StudentSerializer(students_qs, many=True).data

        # ===============================
        # 2️⃣ STUDENT COMMON INFO
        # ===============================

        exam_obj = ExamForIMS.objects.get(id=exam_id)

        if students_qs.exists():
            first_std = students_qs.first()
            student_common_info = {
                "exam_name": f"{exam_obj.exam_name}",
                "year": f"{exam_obj.year.year}",
                "class": first_std.class_instance.class_name.name_bengali,
                # "class": first_std.class_instance.class_name.name,
                "shift": first_std.class_instance.shift_name,
                "group": first_std.group.group_name.name,
                "group_name_bengali": first_std.group.group_name.name_bengali,
                "section": first_std.section.section_name.name if section_id else "",
            }
        else:
            student_common_info = {}

        # ===============================
        # 3️⃣ INSTITUTE INFO
        # ===============================

        institute_obj = Institute.objects.get(id=institute_id)
        institute_serialized = InstituteSerializer(
            institute_obj,
            many=False,
            context={'request': request}
        ).data

        # ===============================
        # 4️⃣ EXAM ROUTINE
        # ===============================

        routine_qs = ExamRoutine.objects.filter(
            exam_id=exam_id,
            class_instance_id=class_id,
            group_id=group_id
        ).order_by("exam_date", "start_time")

        exam_routine = ExamRoutineListSerializer(routine_qs, many=True).data

        # ===============================
        # 5️⃣ FINAL RETURN
        # ===============================

        return Response({
            "institute_info": institute_serialized,
            "student_list": students_serialized,
            "student_common_info": student_common_info,
            "exam_routine": exam_routine,
        })
