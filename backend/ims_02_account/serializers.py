
from rest_framework import serializers
from .models import *
from backend.utils import MultiCroppedImageMixin

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id','name','roll_number']  # Include the custom field 


# class StudentSerializerAllFields(serializers.ModelSerializer):
class StudentSerializerAllFields(MultiCroppedImageMixin):
    # year = serializers.CharField(source='year.year')
    class_name = serializers.CharField(source='class_instance.class_name.name_bengali')
    # class_name_in_english = serializers.CharField(source='student.class_instance.class_name.name')
    # roll_number = serializers.CharField(source='student.roll_number')
    # group_name = serializers.CharField(source='group', allow_null=True)
    group_name_in_bangla = serializers.CharField(source='section.group.group_name.name_bengali', allow_null=True)
    # section_name = serializers.CharField(source='section.section_name', allow_null=True)
    section_name_display = serializers.SerializerMethodField() 
    
    class Meta:
        model = Student
        image_fields = ["picture", ] #picture_cropped_url picture_url
        crop_sizes = {
            "picture": (300, 380),      # portrait ratio 
        }
        fields = [
            'id', 'institute', 'year', 'class_name', 'group_name_in_bangla', 'section_name_display', 
            'user', 'name', 'name_bangla','fathers_name','mothers_name','nid', 'roll_number', 'student_id', 'dob', 
            'email', 'phone_number', 'guardian_mobile_number', 'address', 
        ]
    def get_section_name_display(self, obj):
        return obj.section.section_name.name if obj.section else None


# class TeacherCardSerializer(serializers.ModelSerializer):
class TeacherCardSerializer(MultiCroppedImageMixin):
    designation_display = serializers.CharField(source='get_designation_display', read_only=True)
    # picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Teacher
        image_fields = ["picture", "signature"] #picture_cropped_url picture_url
        crop_sizes = {
            "picture": (300, 380),      # portrait ratio
            "signature": (300, 100),    # small ratio
        }
        fields = [
            'id', 'name', 'bangla_name','designation', 'designation_display', 'major_subject',
            'phone_number','is_whatsapp', 'email','designation_bn',
            'dob',
            'joining_date',
            'indexing_of_mpo',
            'index_number',
            'qualification',
            'address',
            'religion',
            'blood_group', 'qualification', 'is_visible',
            # 'picture_url',
        ]

    # def get_picture_url(self, obj):
    #     request = self.context.get('request')
    #     if obj.picture and request:
    #         return request.build_absolute_uri(obj.picture.url)
    #     elif obj.picture:
    #         return obj.picture.url
    #     return None


# class TeacherCardSerializer(serializers.ModelSerializer):
#     designation_display = serializers.CharField(source='get_designation_display', read_only=True)
#     picture_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Teacher
#         fields = [
#             'id', 'name', 'bangla_name','designation', 'designation_display', 'major_subject',
#             'phone_number','is_whatsapp', 'email','designation_bn',
#             'dob',
#             'joining_date',
#             'indexing_of_mpo',
#             'index_number',
#             'qualification',
#             'address',
#             'religion',
#             'blood_group', 'qualification',
#             'picture_url', 'is_visible',
#         ]

#     def get_picture_url(self, obj):
#         request = self.context.get('request')
#         if obj.picture and request:
#             return request.build_absolute_uri(obj.picture.url)
#         elif obj.picture:
#             return obj.picture.url
#         return None


class ClassNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassName
        fields = ['id', 'name', 'name_bengali', 'code', 'education_type']

class GroupNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupName
        fields = ['id', 'name', 'name_bengali', 'code']

class SectionNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionName
        fields = ['id', 'name', 'name_bengali', 'code']

class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = ['id', 'year', 'institute']

class ClassSerializer(serializers.ModelSerializer):
    class_name = ClassNameSerializer(read_only=True)
    
    class Meta:
        model = Class
        fields = ['id', 'institute', 'year', 'class_name', 'shift']

class GroupSerializer(serializers.ModelSerializer):
    group_name = GroupNameSerializer(read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'institute', 'year', 'class_instance', 'group_name', 'order']

class SectionSerializer(serializers.ModelSerializer):
    section_name = SectionNameSerializer(read_only=True)
    
    class Meta:
        model = Section
        fields = ['id', 'institute', 'year', 'class_instance', 'group', 'section_name']


class StudentUdpateSerializer(serializers.ModelSerializer):
    # Allow FK fields to be updated via IDs
    institute = serializers.PrimaryKeyRelatedField(queryset=Institute.objects.all())
    year = serializers.PrimaryKeyRelatedField(queryset=Year.objects.all())
    class_instance = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all())

    class Meta:
        model = Student
        fields = [
            'id', 'name', 'name_bangla','fathers_name','mothers_name','nid','roll_number', 'student_id','email', 'phone_number',
            'guardian_mobile_number', 'address', 'dob', 'institute',
            'year', 'class_instance', 'group', 'section', 'picture'
        ]
class StudentDetailSerializer(StudentUdpateSerializer):
    class_instance = ClassSerializer(read_only=True)
    group = GroupSerializer(read_only=True)
    section = SectionSerializer(read_only=True)
