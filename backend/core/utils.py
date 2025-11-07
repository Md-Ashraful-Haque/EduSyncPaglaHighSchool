from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import inspect, re

#////////////////////////////// Rest API ///////////////////////////
from rest_framework.response import Response
from rest_framework import status 


def create_user_for_profile(profile_instance):
    User = get_user_model()
    if not profile_instance.user:
        # username = f"{profile_instance.institute.id}_{profile_instance.__class__.__name__}_{profile_instance.pk}"
        phone_number = getattr(profile_instance, 'phone_number', None)
        password =  profile_instance.password
        email = getattr(profile_instance, 'email', None) or f"{phone_number}@example.com"
        firstname = getattr(profile_instance, 'name', "Name Not Set!")
        
        user = User.objects.create_user(
            username=phone_number,
            email=email,
            password=password,
            first_name=firstname
        )
        role = profile_instance.__class__.__name__.lower()
        user.role = role 
        user.save()
        profile_instance.user = user
        profile_instance.save()




def getUserProfile(user):
    try:
        # print("getUserProfile: //////////////////////////////")
        # Dynamically construct the profile attribute name (e.g., 'admin_profile' or 'teacher_profile')
        profile_attr = f"{user.role.lower()}_profile"
        # Get the user's profile dynamically
        profile = getattr(user, profile_attr, None)
        # print("Profile Attribute:",profile) 

        if not profile:
            return Response(
                {"error": f"No profile found for the user with role '{user.role}'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return profile
    
    except Exception as e:
      # print("Error in getUserProfile")
      return Response(
          {"error": str(e)},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )






def varname(p):
  for line in inspect.getframeinfo(inspect.currentframe().f_back)[3]:
    m = re.search(r'\bvarname\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)', line)
    if m:
      return m.group(1)

def debug(var1=None, var2=None, var3=None, var4=None):
  if var1:
    print(f"=====================//// {var1} Start////======================\n")
    print(f"\t\t: {var2}")
    print(f"\n=====================//// {var1} End////======================\n\n")
  if var3:
    print(f"=====================//// {var3} Start////======================\n")
    print(f"\t\t: {var4}")
    print(f"\n=====================//// {var3} End////======================\n")
    