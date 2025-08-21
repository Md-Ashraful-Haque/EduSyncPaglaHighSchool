from django.shortcuts import render

#////////////////////////////// Rest API ///////////////////////////
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *

from ims_02_account.models import TeacherSubjectAssignment, Teacher

from core.utils import getUserProfile
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.decorators import authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class YearListView(APIView):
    def get(self, request):
        userProfile = getUserProfile(request.user)
        institute_id = userProfile.institute 
        
        try:
            years = Year.objects.filter(institute_id=institute_id)
            serializer = YearSerializer(years, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ///////////////////////////////////////  Filter Class Name using Year and Shift Name from front End.
def AllClassListView( request):
        # print("///////////////// Front end class filter using year and shift //////////////////////////////")
        userProfile = getUserProfile(request.user)
        # print("////////////////////// ", userProfile ," /////////////////")
        
        institute_id = userProfile.institute
        
        year = request.query_params.get('year') 
        shift = request.query_params.get('shift') 
        if not all([ institute_id, year, shift]): 
            return Response(
                {"error": "Missing parameters: institute_id, year, class_id"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        try:
            classes = Class.objects.filter(institute_id=institute_id, year__year=year, shift=shift)  # Filter by institute ID
            serializer = ClassSerializer(classes, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def AllGroupListView(request):
        try:
            userProfile = getUserProfile(request.user) 
            institute_id = userProfile.institute 
            year = request.query_params.get('year')
            # shift = request.query_params.get('shift')
            class_id = request.query_params.get('class_name') 
            
            if not all([ institute_id, year, class_id]): 
                return Response(
                    {"error": "Missing parameters: institute_id, year, class_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filter groups
            groups = Group.objects.filter(institute_id=institute_id, year__year=year,class_instance__id=class_id)
            
            serializer = GroupSerializer(groups, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def AllSectionListView(request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            # shift = request.query_params.get('shift')
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group')
            
            if not all([ class_id, group_name]): 
                return Response(
                    {"error": "Missing parameters: class_id, group_name"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filter groups
            sections = Section.objects.filter(group__id=group_name)
            
            serializer = SectionSerializer(sections, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def AllSubjectListView(request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year') 
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group')
            
            if not all([ group_name,]): 
                return Response(
                    {"error": "Missing parameters: group_name"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Filter groups
            subjects = SubjectForIMS.objects.filter(group__id=group_name)
            
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class ClassListView(APIView):
    """
    API view to retrieve a filtered list of classes
    based on the logged-in teacher, year, and shift.
    """

    def get(self, request):
        try:
            # Get the user profile of the currently logged-in user
            user_profile = getUserProfile(request.user) 
            if user_profile.can_teach_all_subjects:
                return AllClassListView(request)
            institute_id = user_profile.institute.id

            # Get filter parameters from the request query string
            year_id = request.query_params.get('year')
            shift = request.query_params.get('shift')

            if not year_id or not shift:
                return Response(
                    {"error": "Both 'year' and 'shift' parameters are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve the teacher object associated with the logged-in user
            teacher = get_object_or_404(Teacher, user=request.user)

            # Get a distinct list of class IDs where the teacher is assigned
            assigned_class_ids = TeacherSubjectAssignment.objects.filter(
                teacher=teacher
            ).values_list('class_instance_id', flat=True).distinct()

            # Filter the classes based on:
            # - Institute
            # - Year
            # - Shift
            # - Class assignments to the teacher
            classes = Class.objects.filter(
                id__in=assigned_class_ids,
                institute_id=institute_id,
                year__year=year_id,
                shift=shift
            )

            # Serialize the filtered classes
            serializer = ClassSerializer(classes, many=True)

            return Response(serializer.data)

        except Exception as e:
            # Handle unexpected server errors
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GroupListView(APIView):
    """
    API view to retrieve groups assigned to the logged-in teacher,
    filtered by institute, year, and class.
    """

    def get(self, request):
        try:
            # Get user profile and institute
            user_profile = getUserProfile(request.user)
            if user_profile.can_teach_all_subjects:
                return AllGroupListView(request)
            institute_id = user_profile.institute.id

            # Get query parameters
            year = request.query_params.get('year')
            class_id = request.query_params.get('class_name')  # better to rename to class_id

            # Validate input
            if not year or not class_id:
                return Response(
                    {"error": "Both 'year' and 'class_name' parameters are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the current teacher
            teacher = get_object_or_404(Teacher, user=request.user)

            if not teacher or not class_id:
                return Response(
                    {"error": "Teacher not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            # Get assigned group IDs for the teacher
            assigned_group_ids = TeacherSubjectAssignment.objects.filter(
                teacher=teacher,
                class_instance_id=class_id,
                group__isnull=False  # Ensure group is assigned
            ).values_list('group_id', flat=True).distinct()
            
            if not assigned_group_ids or not year or not class_id:
                return Response(
                    {"error": "No groups assigned to this teacher in the specified class."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Filter groups:
            groups = Group.objects.filter(
                id__in=assigned_group_ids,
                institute_id=institute_id,
                year__year=year,
                class_instance_id=class_id
            )

            serializer = GroupSerializer(groups, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SectionListView(APIView):
    """
    API view to retrieve sections of a group in a class 
    where the logged-in teacher teaches.
    """

    def get(self, request):
        try:
            # Get logged-in user's profile
            user_profile = getUserProfile(request.user)
            if user_profile.can_teach_all_subjects:
                return AllSectionListView(request)
            institute_id = user_profile.institute.id

            # Query params
            year_id = request.query_params.get('year')
            class_id = request.query_params.get('class_name')
            group_id = request.query_params.get('group')
            
            
                # ✅ Check if values are present and valid integers
            if not all([year_id, class_id, group_id]):
                return Response(
                    {"error": "Missing parameters: year, class_name, or group."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get Teacher object
            teacher = get_object_or_404(Teacher, user=request.user)

            # Check if the teacher is assigned in this class and group
            section_ids = TeacherSubjectAssignment.objects.filter(
                teacher=teacher,
                class_instance_id=class_id,
                group_id=group_id
            ).values_list('section_id', flat=True).distinct()
            
            # If teacher is assigned, return sections of the group
            sections = Section.objects.filter(
                id__in=section_ids,
                group_id=group_id,
                class_instance_id=class_id,
                year__year=year_id,
                institute_id=institute_id
            )

            serializer = SectionSerializer(sections, many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubjectListView(APIView):
    """
    API view to retrieve the list of subjects 
    taught by the logged-in teacher in a specific 
    class and group.
    """

    def get(self, request):
        try:
            # Get logged-in user's profile
            user_profile = getUserProfile(request.user)
            if user_profile.can_teach_all_subjects:
                return AllSubjectListView(request)
            institute_id = user_profile.institute.id

            # Query params
            year_id = request.query_params.get('year')
            class_id = request.query_params.get('class_name')
            group_id = request.query_params.get('group')
            
            # Get Teacher object
            teacher = get_object_or_404(Teacher, user=request.user)

            # Find all subject IDs assigned to this teacher in the given class and group
            assigned_subject_ids = TeacherSubjectAssignment.objects.filter(
                teacher=teacher,
                class_instance_id=class_id,
                group_id=group_id
            ).values_list('subject_id', flat=True).distinct()
            
            # Filter SubjectForIMS by:
            # - Institute
            # - Year
            # - Class
            # - Group
            # - Subjects assigned to the teacher
            subjects = SubjectForIMS.objects.filter(
                institute_id=institute_id,
                year__year=year_id,
                class_instance_id=class_id,
                group__id=group_id,
                id__in=assigned_subject_ids
            ).distinct()
            
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MarkTypeListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            # shift = request.query_params.get('shift')
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group')
            subject_name = request.query_params.get('subject_name') 
            
            if not all([ subject_name, ]): 
                return Response(
                    {"error": "Missing parameters: subject_name"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            subject_instance = SubjectForIMS.objects.get(id=subject_name)
            
            # print(subject_instance , subject_instance.subject_name.mark_types.all())
            
            mark_type_for_subject = subject_instance.subject_name.mark_types.all()
            # print(mark_type_for_subject)
            
            serializer = MarkTypeSerializer(mark_type_for_subject, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
# @authentication_classes([])  # Disable authentication for this view
# @permission_classes([AllowAny])  # Allow public access
def get_years_by_institute(request):
    institute_id = request.GET.get('institute_id')
    if institute_id:
        years = Year.objects.filter(institute_id=institute_id)
        serializer = YearSerializer(years, many=True)
        return Response(serializer.data)
    return Response([])



@api_view(['GET'])
def get_classes_by_year(request):
    # print("get_classes_by_year: //////////////////////////////")
    institute_id = request.GET.get('institute_id')
    year_id = request.GET.get('year_id')
    if institute_id and year_id:
        classes = Class.objects.filter(institute_id=institute_id, year_id=year_id)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data)
    return Response([])

@api_view(['GET'])
def get_groups_by_class(request):
    institute_id = request.GET.get('institute_id')
    year_id = request.GET.get('year_id')
    class_instance_id = request.GET.get('class_instance_id')
    if institute_id and year_id and class_instance_id:
        groups = Group.objects.filter(
            institute_id=institute_id,
            year_id=year_id,
            class_instance_id=class_instance_id
        )
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    return Response([])


@api_view(['GET'])
def get_sections_by_group(request):
    institute_id = request.GET.get('institute_id')
    year_id = request.GET.get('year_id')
    class_instance_id = request.GET.get('class_instance_id')
    group_id = request.GET.get('group_id')
    if institute_id and year_id and class_instance_id and group_id:
        sections = Section.objects.filter(
            institute_id=institute_id,
            year_id=year_id,
            class_instance_id=class_instance_id,
            group_id=group_id
        )
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)
    return Response([])

@api_view(['GET'])
def get_subject_by_section(request):
    institute_id = request.GET.get('institute_id')
    year_id = request.GET.get('year_id')
    class_instance_id = request.GET.get('class_instance_id')
    group_id = request.GET.get('group_id')
    print("///////////", institute_id, year_id, class_instance_id, group_id, "///////////////////")
    if institute_id and year_id and class_instance_id and group_id:
        
        print("/////////// Before: " , "///////////////////")
        subjects = SubjectForIMS.objects.filter(
            institute=institute_id,
            year=year_id,
            class_instance=class_instance_id,
            group=group_id
        )
        print("/////////// After: ", subjects , "///////////////////")
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
    print(" Non Enter into if ")
    return Response([])


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Institute
from .serializers import InstituteSerializer

class InstituteInfoAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get("instituteCode")  # ✅ Get from query string

        try:
            if code:
                institute = Institute.objects.get(institute_code=code)
            else:
                institute = Institute.objects.first()  # fallback if code not provided

            serializer = InstituteSerializer(institute, context={'request': request})
            return Response(serializer.data)

        except Institute.DoesNotExist:
            return Response({"detail": "Institute not found"}, status=404)

