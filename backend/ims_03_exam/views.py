from django.shortcuts import render

#////////////////////////////// Rest API ///////////////////////////
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *

from core.utils import getUserProfile

class ExamListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            # shift = request.query_params.get('shift')
            class_id = request.query_params.get('class_name')
            group_name = request.query_params.get('group')
            if not all([ institute_id, year, class_id ]): 
                return Response(
                    {"error": "Missing parameters: institute_id, year, class_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Filter groups
            exams = ExamForIMS.objects.filter(institute_id=institute_id, year__year=year,class_instance__id=class_id)
            
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ExamByYearListView(APIView):
    def get(self, request):
        try:
            userProfile = getUserProfile(request.user)
            institute_id = userProfile.institute
            year = request.query_params.get('year')
            shift = request.query_params.get('shift')

            if not all([institute_id, year, shift]):
                return Response(
                    {"error": "Missing parameters: institute_id, year, shift"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Base queryset
            exams = ExamForIMS.objects.filter(
                institute_id=institute_id,
                year__year=year
            )

            # Apply shift filter only if shift != "all"
            if shift != "all":
                exams = exams.filter(class_instance__shift=shift)

            exams = exams.distinct()
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data)

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# class ExamByYearListView(APIView):
#     def get(self, request):
#         try:
#             userProfile = getUserProfile(request.user)
#             institute_id = userProfile.institute
#             year = request.query_params.get('year')
#             shift = request.query_params.get('shift')
            
#             if not all([ institute_id, year, shift ]): 
#                 return Response(
#                     {"error": "Missing parameters: institute_id, year, shift"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             # Filter groups
#             exams = ExamForIMS.objects.filter(institute_id=institute_id, year__year=year,class_instance__shift=shift ).distinct()
            
#             serializer = ExamSerializer(exams, many=True)
#             return Response(serializer.data)

#         except Exception as e:
#             print("Error:", str(e))
#             return Response(
#                 {"error": str(e)}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
