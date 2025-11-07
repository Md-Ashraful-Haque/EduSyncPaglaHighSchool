from django.urls import path,include
from .views import SubmitMarksBySubjectView,ReturnSavedMarksByStudentRoll, ResultAPIView, GenerateResult,ReturnAllTypesSavedMarksByStudentRoll
from .views import SubmitMultipleMarkTypesBySubjectView, ResultSummaryAPIView,AdmitCard,MarksAdjustmentViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'marks-adjustments', MarksAdjustmentViewSet, basename='marksadjustment')

urlpatterns = [
    path('submit-marks-by-subject/', SubmitMarksBySubjectView.as_view(), name='submit-marks-by-subject'),
    path('submit-multiple-marks-type-by-subject/', SubmitMultipleMarkTypesBySubjectView.as_view(), name='submit-marks-by-subject'),
    path('load-marks-by-roll/', ReturnAllTypesSavedMarksByStudentRoll.as_view(), name='load-marks-by-roll'), 
    
    path('generate-result/', GenerateResult.as_view(), name='generate-result'),
    path('show-result/', ResultAPIView.as_view(), name='show-result'),
    path('result-summary/', ResultSummaryAPIView.as_view(), name='result-summary'),
    path('download-admit-card/', AdmitCard.as_view(), name='admit-card'),
    # path('marks-adjustments/', MarksAdjustmentViewSet.as_view({'get': 'list'}), name='marks-adjustments'),
    path('', include(router.urls)),
]
