from django.urls import path
# from .views import CustomTokenObtainPairView, CustomTokenRefreshView, CustomTokenVerifyView, LogoutView, UserProfileView
from .views import *

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout_view'),
    
    path('students-roll-name/', StudentListView.as_view(), name='student-list'),
    path('all-students/', AllStudentListView.as_view(), name='student-list'),
    path('save-students/', SaveStudents.as_view(), name='student-list'),
    path('update-students/', UpdateStudentsView.as_view(), name="update-students"),
    
    path('delete-student/<str:student_id>/', DeleteStudentByStudentID.as_view(), name='delete-student-by-id'),
    path('teacher-cards/', TeacherCardListAPIView.as_view(), name='teacher-card-list'),
    path('user-access/', TeacherPermission.as_view(), name='user-access'),
    path('current_user/', current_user_info, name='current_user_info'),
    # path('student-detail-view/<str:student_id>/', StudentDetailView.as_view(), name='student-detail-view'),
    
    # Student CRUD operations
    path('student-detail-view/<str:student_id>/', StudentDetailView.as_view(), name='student-detail'),
    
    # Dropdown data endpoints
    path('institute-years/<int:institute_id>/', get_institute_years, name='institute-years'),
    path('year-classes/<int:year_id>/', get_year_classes, name='year-classes'),
    path('class-groups/<int:class_id>/', get_class_groups, name='class-groups'),
    path('group-sections/<int:group_id>/', get_group_sections, name='group-sections'),
    
    # Alternative: Get all data at once
    path('institute-full-data/<int:institute_id>/', get_institute_full_data, name='institute-full-data'),
    path('teachers/', AllTeacherListView.as_view(), name='teacher-list'),
    path('teachers/<int:pk>/', SingleTeacherView.as_view(), name='teacher-detail'), 
]
