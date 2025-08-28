from django.urls import path
from .views import MenuListView, SliderListView, ActiveNoticeListAPIView,NoticeDetailAPIView
from .views import NoticeListAPIView, HistoryOfInstituteListAPIView, ManagingCommitteeListAPIView
from .views import ContactInformationAPIView, StudentStatisticsListView, InstituteDetailsAPIView, NoticeMarqueueListAPIView


urlpatterns = [
    path('menus/', MenuListView.as_view(), name='menu-list'),
    path('slides/', SliderListView.as_view(), name='slide-items'),
    path('notices/', ActiveNoticeListAPIView.as_view(), name='notice'),
    path("notices/<slug:slug>/", NoticeDetailAPIView.as_view(), name="notice-detail"),
    path("notices-marqueue", NoticeMarqueueListAPIView.as_view(), name="notices-marqueue"),
    
    path('all-notices/', NoticeListAPIView.as_view(), name='all_notice_list'),
    
    path('history-of-institute/', HistoryOfInstituteListAPIView.as_view(), name='history-of-institute'),
    path('managing-committee/', ManagingCommitteeListAPIView.as_view(), name='managing-committee'),
    path('contact-info/', ContactInformationAPIView.as_view(), name='contact-info'),
    path('student-statistics/', StudentStatisticsListView.as_view(), name='student-statistics-list'),
    
    path('institute/<str:code>/', InstituteDetailsAPIView.as_view(), name='institute-details'), 

]
