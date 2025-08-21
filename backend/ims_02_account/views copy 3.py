from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from datetime import timedelta
from django.conf import settings

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status

from rest_framework.views import APIView
from rest_framework import generics

# ///////////////////// Rest API //////////////////////////////
from rest_framework import status
from .models import *
from .serializers import StudentSerializer, StudentSerializerAllFields

from core.utils import getUserProfile

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination

# from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Perform the standard validation
        data = super().validate(attrs)
        
        model_name = f"{self.user.role}_profile"
        data['name'] = getattr(self.user,model_name).name
        data['role'] = self.user.get_role_display()
        
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
            print("Cookies in request:", request.COOKIES)  # Debugging
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



# class StudentListView(APIView):
#     def get(self, request):
#         year = request.query_params.get('year')
#         shift = request.query_params.get('shift')
#         class_name = request.query_params.get('class_name')
#         group_name = request.query_params.get('group_name')
#         section_name = request.query_params.get('section_name')

#         students = Student.objects.filter(
#             year__year=year,
#             class_instance__id=class_name,
#             group__group_name=group_name,
#             section__section_name=section_name,
#         )
        
        
#         print(students)

#         serializer = StudentSerializer(students, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


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
            students = Student.objects.filter(section__id=section_id)
            # print('students: ', students)
            
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# class AllStudentListView(APIView):
#     def get(self, request):
#         try:
#             userProfile = getUserProfile(request.user)
#             institute_id = userProfile.institute
#             year = request.query_params.get('year') 
#             class_id = request.query_params.get('class_name')
#             group_name = request.query_params.get('group')
#             section_id = request.query_params.get('section')
#             print("///////////////////////// StudentListView ///////////////////////////////////")
#             print('year: ', year, 'class_id: ', class_id, 'group_name: ', group_name, 'section_id: ', section_id)
#             print("////////////////////////////////////////////////////////////")
            

#             # Filter SUbject
#             students = Student.objects.filter(section__id=section_id)
            
#             serializer = StudentSerializerAllFields(students, many=True)
#             # print("serializer.data: ", serializer.data)
#             return Response(serializer.data)
        

#         except Exception as e:
#             print("Error:", str(e))
#             return Response(
#                 {"error": str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class AllStudentListView(generics.ListAPIView):
    serializer_class = StudentSerializerAllFields
    pagination_class = PageNumberPagination  # Explicitly set (optional)
    # pagination_class = rest_framework.pagination.PageNumberPagination  # Explicitly set (optional)

    def get_queryset(self):
        try:
            userProfile = getUserProfile(self.request.user)
            institute_id = userProfile.institute
            year = self.request.query_params.get('year')
            class_id = self.request.query_params.get('class_name')
            group_name = self.request.query_params.get('group')
            section_id = self.request.query_params.get('section')

            print("///////////////////////// StudentListView ///////////////////////////////////")
            print('year: ', year, 'class_id: ', class_id, 'group_name: ', group_name, 'section_id: ', section_id)
            print("////////////////////////////////////////////////////////////")

            # Build the queryset with filters
            queryset = Student.objects.filter(institute=institute_id)
            
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
            return queryset.select_related('institute', 'class_instance', 'group', 'section', )

        except Exception as e:
            print("Error:", str(e))
            raise serializers.ValidationError({"error": str(e)})

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            # print("Queryset:", queryset)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                # print('Serialized Data:', serializer.data)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )