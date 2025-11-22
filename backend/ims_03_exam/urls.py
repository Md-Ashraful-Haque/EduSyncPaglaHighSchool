from django.urls import path
from .views import *
from .views import create_exam_routine


urlpatterns = [
    path('exams-id-name/', ExamListView.as_view(), name='exam-list'),
    path('exams-id-name-by-year/', ExamByYearListView.as_view(), name='exam-list'),
    path("exam-routine-create/", create_exam_routine, name="exam-routine-create"),
    path("exam-routine-list/", get_exam_routine, name="exam-routine-list"),
    path("exam-attendance/", ExamAttendanceView.as_view(), name="exam-attendance"),
]


