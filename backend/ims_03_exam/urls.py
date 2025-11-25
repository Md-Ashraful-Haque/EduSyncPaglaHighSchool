from django.urls import path
from .views import *
from .views import create_exam_routine


urlpatterns = [
    path('exams-id-name/', ExamListView.as_view(), name='exam-list'),
    path('exams-id-name-by-year/', ExamByYearListView.as_view(), name='exam-list'),
    path("exam-routine-create/", create_exam_routine, name="exam-routine-create"),
    path("exam-routine-list/", get_exam_routine, name="exam-routine-list"),
    path("exam-attendance/", ExamAttendanceView.as_view(), name="exam-attendance"),

    path('public-exams-id-name/', PublicExamListView.as_view(), name='public-exam-list'),
    path("public-exam-routine/", PublicExamAttendanceView.as_view(), name="public-exam-routine"),
]


