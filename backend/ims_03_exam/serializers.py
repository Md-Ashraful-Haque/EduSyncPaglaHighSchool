
from rest_framework import serializers
from .models import *


class ExamSerializer(serializers.ModelSerializer):
    # section_name_display = serializers.CharField(source='get_section_name_display', read_only=True)
    class Meta:
        model = ExamForIMS
        fields = ['id', 'exam_name'] 
