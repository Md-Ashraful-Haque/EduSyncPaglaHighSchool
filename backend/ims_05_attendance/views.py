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

#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Monthly Report ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
from datetime import datetime, date
import calendar
from datetime import datetime, timedelta
from django.db.models import IntegerField
from django.db.models.functions import Cast




#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Attendance View ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////

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
            # print("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
            # print("[instituteCode,teacher,year, class_id, group_id, section_id, date_str]",[instituteCode,teacher,year, class_id, group_id, section_id, date_str] )
            # print("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
            return Response(
                {"detail": "year, class_id, group_id, section_id, date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            # print("///////////////////////////Invalid date format. Use YYYY-MM-DD //////////////////////////////", status.HTTP_400_BAD_REQUEST)
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
                        status="initial",  # default
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
              "student_id": 5, from Student Model
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
            # print("+++++++++++++++++++++++++++++++++++++++++++++++++=")
            day = serializer.create_or_update()
            return Response(
                {"detail": "Attendance saved successfully"}, status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Monthwise Report ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
class MonthlyAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):

        instituteCode = request.query_params.get("instituteCode")
        shift = request.query_params.get("shift")   # ✅ Accepted safely
        year = request.query_params.get("year")
        class_id = request.query_params.get("class_name")
        group_id = request.query_params.get("group_name")
        section_id = request.query_params.get("section_name")
        date_str = request.query_params.get("date")

        if not all([instituteCode, year, class_id, group_id, section_id, date_str]):
            return Response(
                {"detail": "All params are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Safe Date Parse
        try:
            base_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Safe relationship resolution
        try:
            institute = Institute.objects.get(institute_code=instituteCode)
            year_obj = Year.objects.get(year=year)
            class_obj = Class.objects.get(id=class_id)
            group_obj = Group.objects.get(id=group_id)
            section_obj = Section.objects.get(id=section_id)
        except Exception as e:
            return Response(
                {"detail": f"Data relation error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Month date range
        first_day = base_date.replace(day=1)
        last_day = base_date.replace(
            day=calendar.monthrange(base_date.year, base_date.month)[1]
        )

        # # ✅ ✅ ✅ SAFE DAY GENERATION (NO CRASH)
        # days = []
        # current = first_day
        # while current <= last_day:
        #     days.append(current.strftime("%Y-%m-%d"))
        #     current += timedelta(days=1)
        
        # ✅ ✅ ✅ SAFE DAY GENERATION + WEEKEND COUNT
        days = []
        friday_count = 0
        saturday_count = 0

        current = first_day
        while current <= last_day:
            days.append(current.strftime("%Y-%m-%d"))

            weekday = current.weekday()  # Monday=0 ... Sunday=6

            if weekday == 4:      # ✅ Friday
                friday_count += 1
            elif weekday == 5:    # ✅ Saturday
                saturday_count += 1

            current += timedelta(days=1)

        # ✅ TOTAL COUNT
        total_weekend = friday_count + saturday_count

        # ✅ Load students
        students = Student.objects.filter(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section=section_obj,
        ).annotate(
            roll_int=Cast("roll_number", IntegerField())
        ).order_by("roll_int")

        # ✅ Load attendance days for whole month
        attendance_days = AttendanceDay.objects.filter(
            institute=institute,
            year=year_obj,
            class_instance=class_obj,
            group=group_obj,
            section=section_obj,
            date__range=[first_day, last_day]
        )

        day_map = {str(a.date): a.id for a in attendance_days}

        # ✅ Load all student attendance at once
        student_attendance_qs = StudentAttendance.objects.filter(
            attendance_day_id__in=day_map.values()
        ).select_related("student", "attendance_day")

        # ✅ Build lookup
        attendance_lookup = {}
        for sa in student_attendance_qs:
            key = (sa.student_id, str(sa.attendance_day.date))
            attendance_lookup[key] = sa.status

        # ✅ FINAL DATA BUILD
        rows = []

        for student in students:
            daily = {}
            present_count = 0
            # total_days = len(days)
            total_days = len(days) - total_weekend

            for d in days:
                status_val = attendance_lookup.get((student.id, d), "initial")
                daily[d] = status_val

                if status_val == "present":
                    present_count += 1

            attendance_percent = (
                round((present_count / total_days) * 100)
                if total_days > 0 else 0
            )

            rows.append({
                "student_id": student.id,
                "roll_number": student.roll_number,
                "name": student.name,
                "supervisor_name": "",   # ✅ SAFE: no crash
                "daily": daily,
                "present": present_count,
                "total_days": total_days,
                "attendance_percent": attendance_percent,
            })

        return Response(
            {
                "days": days,
                "rows": rows
            },
            status=status.HTTP_200_OK
        )