# from django.contrib.auth.backends import BaseBackend
# from django.contrib.auth.hashers import check_password
# from ims_02_account.models import User  # Import your custom User model

# class MobileNumberBackend(BaseBackend):
#     """
#     Custom authentication backend to authenticate users using their mobile number and password.
#     """
#     def authenticate(self, request, mobile=None, password=None, **kwargs):
#         try:
#             user = User.objects.get(mobile=mobile)
#         except User.DoesNotExist:
#             return None
        
#         # Check if the password matches
#         if user and check_password(password, user.password):
#             return user
#         return None

#     def get_user(self, user_id):
#         try:
#             return User.objects.get(pk=user_id)
#         except User.DoesNotExist:
#             return None
