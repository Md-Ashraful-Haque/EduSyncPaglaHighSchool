
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactPageViewSet,
    ContactCardViewSet,
    InstituteDetailViewSet,
    # FacilityViewSet,
    # AchievementViewSet,
    # IntroductionViewSet,
    # HistoryViewSet,
    MenuListView,
    SliderListView,
    NoticeListAPIView,
    NoticeDetailAPIView,
    NoticeMarqueueListAPIView,
    # ManagingCommitteeListAPIView,
    ActiveCommitteeMembersList,
    ManagingCommitteeListView, 
    StudentStatisticsListView,
    CardItemListAPIView,
    InstituteApprovalInfoByCodeAPIView,
)


router = DefaultRouter()
router.register(r"institute-details", InstituteDetailViewSet, basename="institute-detail")
# router.register(r"facilities", FacilityViewSet, basename="facility")
# router.register(r"achievements", AchievementViewSet, basename="achievement")
# router.register(r"introductions", IntroductionViewSet, basename="introduction")
# router.register(r"histories", HistoryViewSet, basename="history")
router.register(r"contact-cards", ContactCardViewSet, basename="contactcard")

urlpatterns = [
    path('menus/', MenuListView.as_view(), name='menu-list'),
    path('slides/', SliderListView.as_view(), name='slide-items'),
    path('notices/', NoticeListAPIView.as_view(), name='notice'),
    path("notices/<str:slug>/", NoticeDetailAPIView.as_view(), name="notice-detail"),
    path("notices-marquee/", NoticeMarqueueListAPIView.as_view(), name="notices-marquee"),
    path('all-notices/', NoticeListAPIView.as_view(), name='all_notice_list'),
    # path('managing-committee/', ManagingCommitteeListAPIView.as_view(), name='managing-committee'),
    path("active-committee-members/", ActiveCommitteeMembersList.as_view(), name="active-committee-members"),
    path('committees/', ManagingCommitteeListView.as_view(), name='committee-list'), 
    
    path('student-statistics/', StudentStatisticsListView.as_view(), name='student-statistics-list'),
    path('card-items/', CardItemListAPIView.as_view(), name='card-items'),

    # Custom route for contact pages by institute_code
    path("contact-pages/<str:institute_code>/", ContactPageViewSet.as_view({"get": "retrieve"}), name="contact-page-by-code"),
    # path('approvals/', InstituteApprovalInfoDetailAPIView.as_view(), name='approvals-detail'),
    path('approvals/<str:institute_code>/', InstituteApprovalInfoByCodeAPIView.as_view(), name='approvals-by-code'),

    path("", include(router.urls)),
]



# urlpatterns = [
#     # List all managing committees
#     path('committees/', views.ManagingCommitteeListView.as_view(), name='committee-list'),
    
#     # Get specific committee details
#     path('committees/<int:pk>/', views.ManagingCommitteeDetailView.as_view(), name='committee-detail'),
    
#     # Get active committee by institute
#     path('institutes/<int:institute_id>/active-committee/', 
#          views.active_committee_by_institute, name='active-committee-by-institute'),
    
#     # Get committee members grouped by active/inactive status
#     path('committee-members/grouped/', views.committee_members_grouped, name='committee-members-grouped'),
#     path('committees/<int:committee_id>/members/grouped/', 
#          views.committee_members_grouped, name='committee-members-grouped-by-id'),
# ]

# Example API usage:
# GET /api/committees/ - List all committees
# GET /api/committees/?active=true - List only active committees
# GET /api/committees/?institute_id=1 - List committees for institute 1
# GET /api/committees/1/ - Get committee with ID 1
# GET /api/institutes/1/active-committee/ - Get active committee for institute 1
# GET /api/committee-members/grouped/?institute_id=1 - Get grouped members for institute 1's active committee
# GET /api/committees/1/members/grouped/ - Get grouped members for committee 1