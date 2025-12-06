from django.shortcuts import render

# Create your views here.
# ims_05_attendance/views.py

from datetime import datetime
from django.db.models import IntegerField
from django.db.models.functions import Cast
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db import IntegrityError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import AttendanceDay, StudentAttendance
from .serializers import (
    AttendanceDaySerializer,
    AttendanceSaveSerializer,
)
from ims_02_account.models import Student,Teacher

from ims_01_institute.models import Institute, Year, Class, Group, Section


class AttendanceView(APIView):
    """
    GET  -> fetch or initialize attendance for a given day
    POST -> save attendance for a given day
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_institute(self, request):
        # adjust according to your User model
        # Example: request.user.institute
        return request.user.institute

    def get(self, request, *args, **kwargs):
        """
        Query params:
        - year (id)
        - class_id
        - group_id
        - section_id
        - date (YYYY-MM-DD)
        """
        # institute = self.get_institute(request)

        instituteCode = request.query_params.get("instituteCode")
        teacher = request.user
        year = request.query_params.get("year")
        class_id = request.query_params.get("class_name")
        group_id = request.query_params.get("group_name")
        section_id = request.query_params.get("section_name")
        date_str = request.query_params.get("date")
        
        if not all([instituteCode,teacher,year, class_id, group_id, section_id, date_str]):
            return Response(
                {"detail": "year, class_id, group_id, section_id, date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            # print("/////////////////////////////////////////////////////////")
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # print("==============qqq==============================")
        # print("============================================")
        # print([instituteCode,teacher,year, class_id, group_id, section_id, date_str, date_obj])
        # print([instituteCode,type(teacher),year, class_id, group_id, section_id, date_str, date_obj])
        # print("============================================")
        # print("============================================") 
        
        institute = Institute.objects.get(institute_code=instituteCode)
        year_obj = Year.objects.get(year=year)
        class_obj = Class.objects.get(id=class_id)
        group_obj = Group.objects.get(id=group_id)
        section_obj = Section.objects.get(id=section_id)
        teacher = Teacher.objects.get(user=teacher)

        

        # 1. Get or create AttendanceDay
        try:
            attendance_day, created = AttendanceDay.objects.get_or_create(
                institute=institute,
                year=year_obj,
                class_instance=class_obj,
                group=group_obj,
                section=section_obj,
                date=date_obj,
                defaults={
                    "attendance_type": "daily",
                    "attendance_by": teacher,
                }
            )
        except IntegrityError as e:
            print("UNIQUE ERROR:", e)
            attendance_day = AttendanceDay.objects.get(
                institute=institute,
                year=year_obj,
                class_instance=class_obj,
                group=group_obj,
                section=section_obj,
                date=date_obj,
            )
        # print("====================attendance_day=============================")
        # print("=================================================")
        # print("created: ", created)
        # print("attendance_day: ", attendance_day)
        # print("=================================================")
        # print("=================================================")
        # 2. Ensure each student has a StudentAttendance row
        students = Student.objects.filter(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section=section_obj,
        ).annotate(
            roll_int=Cast("roll_number", IntegerField())
        ).order_by("roll_int")

        existing_attendance = {
            sa.student_id: sa
            for sa in StudentAttendance.objects.filter(
                attendance_day=attendance_day
            ).select_related("student")
        }

        to_create = []
        for student in students:
            if student.id not in existing_attendance:
                to_create.append(
                    StudentAttendance(
                        attendance_day=attendance_day,
                        student=student,
                        status="absent",  # default
                    )
                )

        if to_create:
            StudentAttendance.objects.bulk_create(to_create)

        # Refresh queryset
        attendance_qs = (
            StudentAttendance.objects.filter(attendance_day=attendance_day)
            .select_related("student")
            .annotate(
                roll_int=Cast("student__roll_number", IntegerField())
            ).order_by("roll_int") 
        )

        serializer = AttendanceDaySerializer(
            attendance_day, context={"student_attendances": attendance_qs}
        )

        # Hack: override student_attendances with explicit queryset
        data = serializer.data
        from .serializers import StudentAttendanceSerializer

        data["student_attendances"] = StudentAttendanceSerializer(
            attendance_qs, many=True
        ).data

        return Response(data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """
        Body:
        {
          "attendance_day_id": 1,
          "students": [
            {
              "id": 3,           # optional for update
              "student_id": 5,
              "status": "present",
              "entry_time": "09:00:00",
              "exit_time": "15:00:00",
              "note": "Some note"
            },
            ...
          ]
        }
        """
        serializer = AttendanceSaveSerializer(data=request.data)
        if serializer.is_valid():
            day = serializer.create_or_update()
            return Response(
                {"detail": "Attendance saved successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
