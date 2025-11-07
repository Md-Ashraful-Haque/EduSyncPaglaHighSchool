from rest_framework import serializers
from .models import StudentSubjectResult,SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks
from .models import MarksAdjustment
from ims_01_institute.models import Group

from ims_02_account.models import Student

# class MarksForTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MarksForType
#         fields = ['mark_type', 'marks']
        
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id','name', 'name_bangla','fathers_name', 'roll_number','picture', ]

class SubjectHighestMarksSerializer(serializers.ModelSerializer):
    # MarksForType = MarksForTypeSerializer(many=True) 
    section_name = serializers.CharField(source='section.section_name', allow_null=True)
    section_name_display = serializers.SerializerMethodField()
    class Meta:
        model = SubjectHighestMarks
        fields = [
            'subject',
            'section_name',
            'section_name_display',
            'roll',
            'highest_marks', 
        ]
    def get_section_name_display(self, obj):
        return obj.section.section_name.name if obj.section else None


class StudentSubjectResultSerializer(serializers.ModelSerializer):
    # MarksForType = MarksForTypeSerializer(many=True) 

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
            # 'MarksForType',
        ]

    def create(self, validated_data):
        # marks_data = validated_data.pop('MarksForType') 
        result = StudentSubjectResult.objects.create(**validated_data) 
        return result


class TypewiseMarksSerializer(serializers.ModelSerializer):
    mark_type = serializers.CharField(source='mark_type.mark_type')

    class Meta:
        model = TypewiseMarksForSubject
        fields = ['mark_type', 'marks']

class SubjectForResultSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='subject.id')
    subject_code = serializers.CharField(source='subject.subject_name.code')
    subject_name = serializers.CharField(source='subject.subject_name.name')
    subject_name_bangla = serializers.CharField(source='subject.subject_name.name_bengali')
    full_marks = serializers.CharField(source='subject.full_marks')
    pass_marks = serializers.CharField(source='subject.pass_marks')
    marks = TypewiseMarksSerializer(many=True, source='typewisemarksforsubject')
    # is_optional = serializers.CharField(source='subject.is_optional')
    # is_combined = serializers.CharField(source='subject.subject_name.is_combined')
    # is_displayed_on_marksheet = serializers.CharField(source='subject.subject_name.is_displayed_on_marksheet')
    
    is_optional = serializers.BooleanField(source='subject.is_optional')
    is_combined = serializers.BooleanField(source='subject.subject_name.is_combined')
    is_displayed_on_marksheet = serializers.BooleanField(source='subject.subject_name.is_displayed_on_marksheet')

    class Meta:
        model = SubjectForResult
        fields = [
            'id','subject_code','subject_name', 'subject_name_bangla','full_marks', 'pass_marks',
            'total_marks','combined_total_marks', 'grade_and_point','grade_and_point_tabu', 'marks','is_optional','is_displayed_on_marksheet','is_combined',
        ]

class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name')
    student_fathers_name = serializers.CharField(source='student.fathers_name')
    student_mothers_name = serializers.CharField(source='student.mothers_name')
    shift = serializers.SerializerMethodField()
    year = serializers.CharField(source='year.year')
    class_name = serializers.CharField(source='student.class_instance.class_name.name_bengali')
    class_name_in_english = serializers.CharField(source='student.class_instance.class_name.name')
    roll_number = serializers.CharField(source='student.roll_number')
    group_name = serializers.CharField(source='section.group', allow_null=True)
    group_name_in_bangla = serializers.CharField(source='section.group.group_name.name_bengali', allow_null=True)
    section_name = serializers.CharField(source='section.section_name', allow_null=True)
    section_name_display = serializers.SerializerMethodField()
    subjects = SubjectForResultSerializer(many=True, source='subjectforresult') 

    class Meta:
        model = StudentSubjectResult
        fields = [
            'id','shift', 'year', 'student_name','student_fathers_name','student_mothers_name','class_name','class_name_in_english', 'roll_number','group_name','group_name_in_bangla', 'section_name', 'section_name_display','gpa','gpa_without_optional', 'letter_grade',
            'total_obtained_marks', 'total_fail_subjects', 'classwise_merit', 'sectionwise_merit',
            'subjects', 
        ]
    def get_section_name_display(self, obj):
        return obj.section.section_name.name if obj.section else None
    
    def get_shift(self, obj):
        return obj.student.class_instance.get_shift_display()
    
# Additional serializer for better data structure
class GroupResultSerializer(serializers.ModelSerializer):
    statistics = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'name_bangla', 'statistics']
    
    def get_statistics(self, obj):
        # This would contain the calculated statistics
        # Implementation depends on your specific requirements
        return {}

class MarksAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarksAdjustment
        fields = ["target_marks", "adjustment"]