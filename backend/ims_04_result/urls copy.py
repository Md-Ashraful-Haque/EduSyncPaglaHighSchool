from django.urls import path
from .views import SubmitMarksBySubjectView, MarksByStudentRollListView

urlpatterns = [
    path('submit-marks-by-subject/', SubmitMarksBySubjectView.as_view(), name='submit-marks-by-subject'),
    path('load-marks-by-roll/', MarksByStudentRollListView.as_view(), name='load-marks-by-roll'),
]
