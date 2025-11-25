from django.urls import path
from .views import *




urlpatterns = [
    path('years/', YearListView.as_view(), name='year-list'),
    path('classes/', ClassListView.as_view(), name='class-list'),
    path('groups-id-name/', GroupListView.as_view(), name='group-list'),
    path('sections-id-name/', SectionListView.as_view(), name='section-list'),
    path('subjects-id-name/', SubjectListView.as_view(), name='subjects-list'),
    path('marktype-id-name/', MarkTypeListView.as_view(), name='marktype-list'),
    # path('marktype-for-sub-name-id-name/', MarkTypeForSubNameListView.as_view(), name='marktype-for-subname-list'),
    path('public-years/', PublicYearListView.as_view(), name='public-year-list'),
    path('public-classes/', PublicClassListView.as_view(), name='public-classes-list'),
    path('public-groups-id-name/', PublicGroupListView.as_view(), name='public-group-list'),
    path('public-sections-id-name/', PublicSectionListView.as_view(), name='public-sections-id-name'),
    #for admin JS
    #API Call
    path('years-admin/', get_years_by_institute, name='get_years_by_institute'),
    path('classes-admin/', get_classes_by_year, name='get_classes_by_year'),
    path('groups-admin/', get_groups_by_class, name='get_groups_by_class'),
    path('sections-admin/', get_sections_by_group, name='get_sections_by_group'),
    path('subject-admin/', get_subject_by_section, name='get_subject_by_section'),
    path('subject-by-group/', get_subject_by_group, name='get_subject_by_group'),
    path('institute-info/', InstituteInfoAPIView.as_view(), name='institute-info'),
    path('mark-types-by-subject/', MarkTypesBySubject.as_view(), name='mark-types-by-subject'),
]
