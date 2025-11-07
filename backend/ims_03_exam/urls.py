from django.urls import path
from .views import *

urlpatterns = [
    path('exams-id-name/', ExamListView.as_view(), name='exam-list'),
    path('exams-id-name-by-year/', ExamByYearListView.as_view(), name='exam-list'),
]
