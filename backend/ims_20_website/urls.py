
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
    ManagingCommitteeListAPIView,
    StudentStatisticsListView,
    CardItemListAPIView,
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
    path('managing-committee/', ManagingCommitteeListAPIView.as_view(), name='managing-committee'),
    path('student-statistics/', StudentStatisticsListView.as_view(), name='student-statistics-list'),
    path('card-items/', CardItemListAPIView.as_view(), name='card-items'),

    # Custom route for contact pages by institute_code
    path("contact-pages/<str:institute_code>/", ContactPageViewSet.as_view({"get": "retrieve"}), name="contact-page-by-code"),

    path("", include(router.urls)),
]
