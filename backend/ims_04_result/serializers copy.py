from rest_framework import serializers
from .models import StudentSubjectResult, MarksForType

from ims_02_account.models import Student

class MarksForTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarksForType
        fields = ['mark_type', 'marks']
        
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id',]

class StudentSubjectResultSerializer(serializers.ModelSerializer):
    MarksForType = MarksForTypeSerializer(many=True) 

    class Meta:
        model = StudentSubjectResult
        fields = [
            'institute',
            'year',
            'class_instance',
            'group',
            'section', 
            'exam',
            'student',
            'subject',
            'MarksForType',
        ]

    def create(self, validated_data):
        marks_data = validated_data.pop('MarksForType') 
        result = StudentSubjectResult.objects.create(**validated_data) 
        return result
