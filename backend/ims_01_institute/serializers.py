
from rest_framework import serializers
from .models import *


class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ['id','year']  # Include the custom field 

class ClassSerializer(serializers.ModelSerializer):
    class_name = serializers.SerializerMethodField()  # Add a custom field

    class Meta:
        model = Class
        fields = ['institute', 'id', 'class_name', 'shift']  # Include the custom field

    def get_class_name(self, obj):
        # Access the related class_name's name field 
        return obj.class_name.name_bengali if obj.class_name else None


class ClassSerializerAdmin(serializers.ModelSerializer):
    year = serializers.PrimaryKeyRelatedField(queryset=Year.objects.none())  # Initially empty

    class Meta:
        model = Class
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.query_params.get('institute_id'):
            institute_id = request.query_params.get('institute_id')
            self.fields['year'].queryset = Year.objects.filter(institute_id=institute_id)



class GroupSerializer(serializers.ModelSerializer):
    group_name_display = serializers.CharField(source='get_group_name_display', read_only=True)
    group_name = serializers.SerializerMethodField()
    group_name_bangla = serializers.SerializerMethodField()
    class Meta:
        model = Group
        fields = ['id', 'group_name','group_name_bangla','group_name_display'] 
    
    def get_group_name(self, obj):
        # print(self,obj)
        return obj.group_name.name
    
    def get_group_name_bangla(self, obj):
        # print(self,obj)
        return obj.group_name.name_bengali

class SectionSerializer(serializers.ModelSerializer):
    # section_name = serializers.CharField(source='section.section_name.name', read_only=True)
    section_name_display = serializers.CharField(source='get_section_name_display', read_only=True)
    section_name = serializers.SerializerMethodField()
    class Meta:
        model = Section
        fields = ['id', 'section_name', 'section_name_display'] 
    def get_section_name(self, obj):
        # print(self,obj)
        return obj.section_name.name if obj.section_name else None

class SubjectSerializer(serializers.ModelSerializer):
    # section_name_display = serializers.CharField(source='get_section_name_display', read_only=True)
    subject_name_display = serializers.SerializerMethodField()
    class Meta:
        model = SubjectForIMS
        fields = ['id', 'subject_name_display'] 
    def get_subject_name_display(self, obj):
        # print(self,obj)
        return obj.subject_name.name_bengali if obj.subject_name else None
        # return obj.subject_name.name_bengali if obj.subject_name else None

# class MarkTypeSerializer(serializers.ModelSerializer):
#     mark_type_display = serializers.CharField(source='get_mark_type_display', read_only=True)
#     class Meta:
#         model = MarkTypeForSubject
#         fields = ['id','mark_type','mark_type_display'] 

class MarkTypeSerializer(serializers.ModelSerializer):
    mark_type_display = serializers.CharField(source='get_mark_type_display', read_only=True)
    class Meta:
        model = MarkTypeForSubject
        fields = ['id','mark_type','mark_type_display'] 


class InstituteSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    picture_url = serializers.SerializerMethodField()

    class Meta:
        model = Institute
        fields = [
            'id', 'name', 'name_in_english', 'institute_code','institute_eiin', 'address',
            'mobile_number', 'email', 'logo_url', 'picture_url',
            'signature_of_class_teacher', 'signature_of_class_bangla',
            'signature_of_class_guardian', 'signature_of_class_guardian_bangla',
            'signature_of_head', 'signature_of_head_bangla',
        ]

    def get_logo_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.logo.url) if obj.logo and request else None

    def get_picture_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.picture.url) if obj.picture and request else None


class MarkTypeForSubjectSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name_bengali', read_only=True)
    mark_type_display = serializers.CharField(source='get_mark_type_display', read_only=True)

    class Meta:
        model = MarkTypeForSubject
        fields = [
            'id',
            'subject',        # Foreign key ID
            'subject_name',   # Readable name
            'mark_type',      # Choice field key
            'mark_type_display',  # Choice field readable value
            'max_marks',
            'pass_marks',
            'serial_number'
        ]
