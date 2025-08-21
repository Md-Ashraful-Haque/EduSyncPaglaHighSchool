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

# ///////////////////// Rest API //////////////////////////////
from rest_framework import status
from .models import *
from .serializers import StudentSerializer

from core.utils import getUserProfile

from rest_framework.permissions import IsAuthenticated

# from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Perform the standard validation
        data = super().validate(attrs)
        
        # Include the username in the response data
        # print(data)
        data['username'] = self.user.username  # Extract username
        data['name'] = self.user.first_name  # Extract username
        data['role'] = self.user.get_role_display()  # Extract username
        # Optionally include other user fields like email, etc.
        # data['email'] = self.user.email

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
        data = {
            'first_name': user.first_name,
            'role': user.get_role_display(),  # Assuming you have a role field in your model
        }
        return Response(data)




# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         # Get the refresh token from the request body
#         refresh_token = request.data.get('refresh')
#         if not refresh_token:
#             return Response({'detail': 'Refresh token not provided.'}, status=400)

#         # Manually inject the refresh token into the request data for validation
#         request.data['refresh'] = refresh_token

#         # Pass the request to the parent method to generate the new access token
#         return super().post(request, *args, **kwargs)



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
            students = Student.objects.filter(institute_id=institute_id, year__year=year,class_instance__id=class_id, group__group_name=group_name, section__section_name=section_id)
            # print('students: ', students)
            
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
