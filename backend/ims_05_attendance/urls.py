# ims_05_attendance/urls.py

from django.urls import path
from .views import AttendanceView, MonthlyAttendanceView

urlpatterns = [
    path('attendance/', AttendanceView.as_view(), name='attendance'),
    path('attendance/monthly/', MonthlyAttendanceView.as_view(), name='attendance-monthly'),
]
