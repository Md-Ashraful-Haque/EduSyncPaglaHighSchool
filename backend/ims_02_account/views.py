# ///////////////////// Rest API //////////////////////////////
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
# from rest_framework import status

from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework_simplejwt.views import TokenVerifyView
# from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
# from rest_framework import status

from rest_framework.views import APIView
# from rest_framework import generics

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import JSONParser
from rest_framework.settings import api_settings


# from rest_framework.views import APIView
# from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from rest_framework.decorators import api_view
# from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Teacher
from .serializers import TeacherCardSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model


User = get_user_model()

from .models import *
from .serializers import StudentSerializer, StudentSerializerAllFields
from django.http import JsonResponse
from datetime import timedelta
from django.conf import settings
from django.shortcuts import get_object_or_404

from django.db.models import IntegerField, Case, When, Value
from django.db.models.functions import Cast

from core.utils import getUserProfile
from .utils import add_students, IsStaffUser



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Perform the standard validation
        data = super().validate(attrs)
        
        model_name = f"{self.user.role}_profile"
        data['name'] = getattr(self.user,model_name).name
        data['role'] = self.user.get_role_display()
        data['allow_all_subject'] = getattr(self.user,model_name).allow_all_subject
        data['allow_students_info'] = getattr(self.user,model_name).allow_students_info
        data['allow_result_processing'] = getattr(self.user,model_name).allow_result_processing
        
        if  self.user.role == "teacher": 
            data['role'] = self.user.teacher_profile.get_designation_display() 
        
        return data
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        # Call the default behavior to obtain the access and refresh tokens
        response = super().post(request, *args, **kwargs)

        # Get the refresh token from the response
        refresh_token = response.data.get('refresh')

        if refresh_token:
            # Set the refresh token in a cookie for secure use
            response.set_cookie(
                key='refresh_token',
                path='/',
                domain=None,
                value=refresh_token,
                max_age=timedelta(days=7),
                expires=timedelta(days=7),
                secure=True,  # Set to True in production
                httponly=True,
                samesite='None',  # Adjust for cross-origin requests
            )
        
        return response

# ////////////////////////////////////////////////////////////////////
# ///////////////////// it works with SSL for production //////////////
# ////////////////////////////////////////////////////////////////////

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        # refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            # print("Cookies in request:", request.COOKIES)  # Debugging
            return Response({'detail': 'Refresh token not found in cookies.'}, status=401)
        request.data['refresh'] = refresh_token  # Manually set the refresh token in data
        return super().post(request, *args, **kwargs)

# ////////////////////////////////////////////////////////////////////
# ///////////////////// it works with SSL for production //////////////
# ////////////////////////////////////////////////////////////////////


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        token = request.data.get('token') or request.COOKIES.get('access_token')
        
        if not token:
            return Response({'detail': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the token using DRF Simple JWT
            RefreshToken(token)  # This will raise an exception if the token is invalid
            
            return Response({'detail': 'Token is valid.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)



class LogoutView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = []      # Disable permissions
    
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logout successful"}, status=200)
        
        response.set_cookie(
                key='refresh_token',
                value="",
                max_age=timedelta(days=0),
                expires=timedelta(days=0),
                secure=True,  # Set to True in production
                httponly=True,
                samesite='None'
                )

        return response



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        user = request.user
        model_name = f"{user.role}_profile"
        data ={ }
        data['name'] = getattr(user,model_name).name
        data['role'] = user.get_role_display()
        
        if  user.role == "teacher": 
            data['role'] = user.teacher_profile.get_designation_display()  
        
        return Response(data)



class StudentListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year') 
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group_name')
            section_id = request.query_params.get('section_name')
            # print("///////////////////////// StudentListView ///////////////////////////////////")
            # print('year: ', year, 'class_id: ', class_id, 'group_name: ', group_name, 'section_id: ', section_id)
            # print("////////////////////////////////////////////////////////////")
            

            # Filter SUbject
            # students = Student.objects.filter(institute_id=institute_id, year__year=year,class_instance__id=class_id, group__group_name=group_name, section__section_name=section_id)
            students = Student.objects.filter(section__id=section_id).annotate(
                roll_number_int=Case(
                    When(roll_number__regex=r'^\d+$', then=Cast('roll_number', IntegerField())),
                    default=Value(0),  # Non-numeric values get 0 (or another fallback)
                    output_field=IntegerField()
                )
            ).order_by('roll_number_int')
            # print('students: ', students)
            
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CustomPagination(PageNumberPagination):
    # page_size = 5  # Override default page size
    page_size_query_param = 'itemPerPage'  # Allow ?page_size=...
    # max_page_size = 5  # Enforce maximum page size
    
    def get_paginated_response(self, data):
        page_size = self.request.query_params.get('itemPerPage') 
        return Response({
            'total_items': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })




#Return all student 
class AllStudentListView(generics.ListAPIView):
    # permission_classes = [IsStaffUser]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination  # Use only CustomPagination
    serializer_class = StudentSerializerAllFields

    def get_queryset(self):
        try:
            userProfile = getUserProfile(self.request.user)
            institute_id = userProfile.institute
            year = self.request.query_params.get('year')
            class_id = self.request.query_params.get('class_name')
            group_name = self.request.query_params.get('group')
            section_id = self.request.query_params.get('section')
            

            # Build the queryset with filters
            queryset = Student.objects.filter(institute=institute_id).annotate(
                roll_number_int=Case(
                    When(roll_number__regex=r'^\d+$', then=Cast('roll_number', IntegerField())),
                    default=Value(0),  # Non-numeric values get 0 (or another fallback)
                    output_field=IntegerField()
                )
            ).order_by('roll_number_int')
            
            # Add additional filters if provided
            if year:
                queryset = queryset.filter(year__year=year)
            if class_id:
                queryset = queryset.filter(class_instance__id=class_id)
            if group_name:
                queryset = queryset.filter(group__id=group_name)
            if section_id:
                queryset = queryset.filter(section__id=section_id)

            # Optimize database query with select_related for ForeignKey fields
            return queryset.select_related('institute', 'class_instance', 'group', 'section')

        except Exception as e:
            print("Error:", str(e))
            raise serializers.ValidationError({"error": str(e)})

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class SaveStudents(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsStaffUser]
    
    def parse_insert_students(self, request):
        students = []
        i = 0
        while True:
            student = {}
            has_data = False
            for key in request.POST:
                prefix = f"insertStudents[{i}]["
                if key.startswith(prefix):
                    field = key[len(prefix):-1]
                    student[field] = request.POST.get(key)
                    has_data = True

            # Attach file if exists
            for key in request.FILES:
                prefix = f"insertStudents[{i}]["
                if key.startswith(prefix):
                    field = key[len(prefix):-1]
                    student[field] = request.FILES[key]
                    has_data = True

            if not has_data:
                break
            students.append(student)
            i += 1

        return students


    def post(self, request):
        try:
            # print("Request Data:", request.data)
            # Ensure required fields are present
            required_fields = [
                'year', 'shift', 'class_name', 'group_name_bangla','section_name', 
            ]
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Fetch related models
            year = get_object_or_404(Year, institute_id=institute_id, year=request.data['year'])
            
            # Prepare data
            student_info = {
                'institute_id': institute_id.id,
                'year_id': year.id,
                'class_instance_id': request.data['class_name'],
                'group_id': request.data['group_name_bangla'],
                'section_id': request.data['section_name'],
            }
            
            # print("Student Info:", student_info)    
            
            # new_students = request.data['insertStudents']
            new_students = self.parse_insert_students(request)
            
            result = add_students(student_info, new_students)

            if result.get("success"):
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
            # return Response(add_students(student_info, new_students))


        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class UpdateStudentsView(APIView):
    permission_classes = [IsAuthenticated] 

    def parse_insert_students(self, request):
        """Parse incoming form-data with multiple students."""
        students = []
        i = 0
        while True:
            student = {}
            has_data = False
            for key in request.POST:
                prefix = f"insertStudents[{i}]["
                if key.startswith(prefix):
                    field = key[len(prefix):-1]
                    student[field] = request.POST.get(key)
                    has_data = True

            for key in request.FILES:
                prefix = f"insertStudents[{i}]["
                if key.startswith(prefix):
                    field = key[len(prefix):-1]
                    student[field] = request.FILES[key]
                    has_data = True

            if not has_data:
                break
            students.append(student)
            i += 1

        return students

    def post(self, request):
        try:
            # Ensure required fields
            required_fields = ['year', 'shift', 'class_name', 'group_name_bangla', 'section_name']
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get user institute
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute

            # Fetch related models
            year = get_object_or_404(Year, institute_id=institute_id, year=request.data['year'])

            # Base info
            student_info = {
                "institute_id": institute_id.id,
                "year_id": year.id,
                "class_instance_id": request.data["class_name"],
                "group_id": request.data["group_name_bangla"],
                "section_id": request.data["section_name"],
            }

            # Parse students
            students_data = self.parse_insert_students(request)

            # inserted = []
            updated = []
            failed = []

            for idx, student_data in enumerate(students_data):
                # print("student_data: ", student_data)
                roll_number = student_data.get("roll_number")
                section_id = student_info["section_id"]
                
                student_data["dob"] = student_data.get("dob") or None
                student_data["picture"] = student_data.get("picture") or None

                if not roll_number:
                    failed.append(idx + 1)
                    continue

                try:
                    # Check if exists
                    student = Student.objects.filter(
                        roll_number=roll_number, section_id=section_id
                    ).first()

                    if student:
                        # 🔹 Update
                        serializer = StudentSerializerAllFields(student, data={**student_data, **student_info}, partial=True)
                        # serializer = StudentSerializer(student, data={**student_data, **student_info}, partial=True)
                        # print("serializer: ", serializer)
                        # print("serializer.is_valid(): ", serializer.is_valid())
                        if serializer.is_valid():
                            # serializer.save()
                            try:
                                instance = serializer.save()
                                # print("Saved:", instance.pk, "-> ",instance.phone_number)
                                updated.append(serializer.data)
                            except Exception as e:
                                print("Save failed:", str(e))
                                failed.append(idx + 1)
                        else:
                            print("❌ Validation failed:", serializer.errors)
                            failed.append(idx + 1)
                    else:
                        print("Not Exist")
                        failed.append(idx + 1)

                except Exception:
                    failed.append(idx + 1)

            return Response({
                "success": True, 
                "updated_count": len(updated),
                "failed_students_index": failed,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class DeleteStudentByStudentID(APIView):
    
    permission_classes = [IsStaffUser]
    
    def delete(self, request, student_id):
        # print(f"Attempting to delete student with ID: {student_id}")
        try:
            student = Student.objects.get(student_id=student_id)
            student.delete()
            return Response({'message': f'Student {student_id} deleted successfully'}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': f'Student with ID {student_id} not found'}, status=status.HTTP_404_NOT_FOUND)




class TeacherCardListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Teacher.objects.filter(is_visible=True)
        # queryset = Teacher.objects.filter(is_visible=True).order_by('designation', 'name')
        serializer = TeacherCardSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class TeacherPermission(APIView):
    # permission_classes = [AllowAny]
    permission_classes = [IsAuthenticated]
    # print("permission_classes", permission_classes)

    # def get(self, request):
    #     # print("=====================================================================")
    #     # print("request: ", request)
    #     # print("request.user: ", request.user)
    #     user = request.user
    #     model_name = f"{user.role}_profile"
    #     data ={ }
        
    #     data['allow_all_subject'] = getattr(user,model_name).allow_all_subject
    #     data['allow_students_info'] = getattr(user,model_name).allow_students_info
    #     data['allow_result_processing'] = getattr(user,model_name).allow_result_processing
    #     data['only_marks_input'] = getattr(user,model_name).only_marks_input
    #     data['image'] = getattr(user,model_name).picture.url
    #     # print("user access data: ", data)
        
    #     return Response(data)
    
    def get(self, request):
        user = request.user
        model_name = f"{user.role}_profile"
        profile = getattr(user, model_name)
        
        # print("user: ", user)
        # print("profile: ", profile)
        # print("is staff: ", profile.user.is_staff)
        # print("model_name: ", model_name)
        
        data = {
            'allow_all_subject': profile.allow_all_subject,
            'allow_students_info': profile.allow_students_info,
            'allow_result_processing': profile.allow_result_processing,
            'only_marks_input': profile.only_marks_input,
            'is_staff':  profile.user.is_staff,
            'image': request.build_absolute_uri(profile.picture.url) if profile.picture else None
        }
        
        return Response(data)

# /////////////////////////////////////////////////////////////////////
# /////////////////////////////////////////////////////////////////////
# /////////////////////////////////////////////////////////////////////
from .serializers import TeacherSerializerAllFields


class AllTeacherListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherSerializerAllFields
    pagination_class = CustomPagination  # Optional

    def get_queryset(self):
        # Fetch all teachers, optimized with related data
        return Teacher.objects.all().select_related('institute').prefetch_related(
            'educations', 'teacher_subject_assignments'
        ).filter(is_visible=True).order_by('order')

class SingleTeacherView(generics.RetrieveAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializerAllFields
    lookup_field = 'pk'


from .models import Student, Institute, Year, Class, Group, Section
from .serializers import (
    StudentUdpateSerializer, YearSerializer, ClassSerializer, 
    GroupSerializer, SectionSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser

class StudentDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve, update student details
    """
    
    queryset = Student.objects.select_related(
        'institute', 'year', 'class_instance__class_name', 
        'group__group_name', 'section__section_name'
    ).all()
    serializer_class = StudentUdpateSerializer
    lookup_field = 'student_id'

    parser_classes = (MultiPartParser, FormParser)  # ✅ Add this
    
    def get_object(self):
        student_id = self.kwargs.get('student_id')
        return get_object_or_404(Student, student_id=student_id)
    
    def update(self, request, *args, **kwargs):
        # print(request.data)  # See what React is sending
        return super().update(request, *args, **kwargs)


@api_view(['GET'])
def get_institute_years(request, institute_id):
    """
    Get all years for a specific institute
    """
    try:
        institute = get_object_or_404(Institute, id=institute_id)
        years = Year.objects.filter(institute=institute).order_by('-year')
        serializer = YearSerializer(years, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_year_classes(request, year_id):
    """
    Get all classes for a specific year
    """
    try:
        year = get_object_or_404(Year, id=year_id)
        classes = Class.objects.filter(year=year).select_related('class_name').order_by('class_name__code', 'shift')
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_class_groups(request, class_id):
    """
    Get all groups for a specific class
    """
    try:
        class_instance = get_object_or_404(Class, id=class_id)
        groups = Group.objects.filter(class_instance=class_instance).select_related('group_name').order_by('order')
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_group_sections(request, group_id):
    """
    Get all sections for a specific group
    """
    try:
        group = get_object_or_404(Group, id=group_id)
        sections = Section.objects.filter(group=group).select_related('section_name').order_by('section_name__code')
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Alternative view for getting all institute data at once (if you prefer)
@api_view(['GET'])
def get_institute_full_data(request, institute_id):
    """
    Get complete academic structure for an institute
    """
    try:
        institute = get_object_or_404(Institute, id=institute_id)
        
        # Get all years for the institute
        years = Year.objects.filter(institute=institute).order_by('-year')
        
        # Get all classes for the institute
        classes = Class.objects.filter(institute=institute).select_related('class_name').order_by('year__year', 'class_name__code', 'shift')
        
        # Get all groups for the institute
        groups = Group.objects.filter(institute=institute).select_related('group_name').order_by('class_instance__class_name__code', 'order')
        
        # Get all sections for the institute
        sections = Section.objects.filter(institute=institute).select_related('section_name').order_by('group__class_instance__class_name__code', 'section_name__code')
        
        data = {
            'institute': {
                'id': institute.id,
                'name': institute.name,
                'code': institute.institute_code
            },
            'years': YearSerializer(years, many=True).data,
            'classes': ClassSerializer(classes, many=True).data,
            'groups': GroupSerializer(groups, many=True).data,
            'sections': SectionSerializer(sections, many=True).data
        }
        
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def current_user_info(request):
    user = request.user
    # print("user: ",user )
    # print(" user.institute.id: ", user)
    return Response({
        "id": user.id,
        "username": user.username,
        "institute_id": user.institute.id
    })
