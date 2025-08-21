from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_school_info(request):
    # print(request.headers) 
    print("//////////////////////////////////////////////")
    print("//////////////////////////////////////////////")
    data = {
        "school_name": "ABC International School",
        "location": "New York",
        "students": 500
    }
    return Response(data)
