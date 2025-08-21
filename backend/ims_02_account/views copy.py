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



# ////////////////////////////////////////////////////////////////////
# ///////////////////// it works  for development  //////////////
# ////////////////////////////////////////////////////////////////////

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

# ////////////////////////////////////////////////////////////////////
# ///////////////////// it works  for development  //////////////
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
