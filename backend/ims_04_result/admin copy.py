# from django.contrib import admin
# from django.apps import apps

# app_models = apps.get_app_config('ims_04_result').get_models()

# for model in app_models:
#     try:
#         admin.site.register(model)
#     except admin.sites.AlreadyRegistered:
#         pass



from django.contrib import admin
from .models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject
# from .models import StudentSubjectResult, MarksForType, SubjectForResult, TypewiseMarksForSubject



# /////////////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////// StudentSubjectResult //////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////

class StudentSubjectResultAdmin(admin.ModelAdmin):
    # Use raw_id_fields to avoid joins
    raw_id_fields = [
        'institute',
        'year',
        'class_instance',
        'group',
        'section',
        'student',
        'exam', 
    ]

    # Optimize search_fields
    search_fields = [
        'student__name',  # Search by student name
        'exam__exam_name',  # Search by exam name 
    ]

    # Optimize list_filter
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',  # Filter by year
        'exam__exam_name',  # Filter by exam name
    ]

    # Display fields in the list view
    list_display = [
        'student',
        'exam', 
        'institute',
        'year',
        'class_instance',
        'group',
        'section',
        # 'get_total_marks',  # Custom method to display total marks
    ]

    # Custom method to display total marks
    # def get_total_marks(self, obj):
    #     return obj.get_total_marks()
    # get_total_marks.short_description = "Total Marks"  # Column header for the custom method

    # Use list_select_related to reduce queries
    list_select_related = [
        'institute',
        'year',
        'class_instance',
        'group',
        'section',
        'student',
        'exam', 
    ]

# Register the StudentSubjectResult model with the custom ModelAdmin
admin.site.register(StudentSubjectResult, StudentSubjectResultAdmin)



# /////////////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////// StudentSubjectResult //////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////

# class MarksForTypeAdmin(admin.ModelAdmin):
#     # Use raw_id_fields to avoid joins
#     raw_id_fields = ['single_result']

#     # Fields to enable searching
#     search_fields = [
#         'single_result__student__name',  # Search by student name
#         'single_result__exam__exam_name',  # Search by exam name
#         'single_result__subject__subject_name',  # Search by subject name
#         'mark_type',  # Search by mark type
#     ]

#     # Fields to enable filtering
#     list_filter = [
#         'single_result__institute__name',  # Filter by institute name
#         'single_result__year__year',  # Filter by year
#         'single_result__class_instance__class_name',  # Filter by class name
#         'single_result__group__group_name',  # Filter by group name
#         'single_result__section__section_name',  # Filter by section name
#         'single_result__exam__exam_name',  # Filter by exam name
#         'single_result__subject__subject_name',  # Filter by subject name
#         'mark_type',  # Filter by mark type
#     ]

#     # Display fields in the list view
#     list_display = [
#         # 'get_institute',  # Custom method for institute
#         'get_student_name', 
#         'get_subject',  # Custom method for subject
#         'mark_type',
#         'marks',
#         'get_year',  # Custom method for year
#         'get_class_instance',  # Custom method for class
#         'get_group',  # Custom method for group
#         'get_section',  # Custom method for section
#         'get_exam',  # Custom method for exam
#     ]

#     # Custom methods for list_display fields
#     def get_institute(self, obj):
#         return obj.single_result.institute.name
#     get_institute.short_description = 'Institute'  # Column header

#     def get_student_name(self, obj):
#         return obj.single_result.student.name
#     get_student_name.short_description = 'Subject'  # Column header

#     def get_subject(self, obj):
#         return obj.single_result.subject.subject_name
#     get_subject.short_description = 'Subject'  # Column header

#     def get_year(self, obj):
#         return obj.single_result.year.year
#     get_year.short_description = 'Year'  # Column header

#     def get_class_instance(self, obj):
#         return obj.single_result.class_instance.class_name
#     get_class_instance.short_description = 'Class'  # Column header

#     def get_group(self, obj):
#         return obj.single_result.group.group_name
#     get_group.short_description = 'Group'  # Column header

#     def get_section(self, obj):
#         return obj.single_result.section.section_name
#     get_section.short_description = 'Section'  # Column header

#     def get_exam(self, obj):
#         return obj.single_result.exam.exam_name
#     get_exam.short_description = 'Exam'  # Column header

#     # Fields to be displayed in the detail view
#     fieldsets = [
#         (None, {'fields': ['single_result', 'mark_type', 'marks']}),
#     ]

#     # Use list_select_related to reduce queries
#     list_select_related = ['single_result']

#     # Custom method to display a simplified string representation
#     def __str__(self):
#         return f"{self.single_result} - {self.get_mark_type_display()} ({self.marks})"

# # Register the MarksForType model with the custom ModelAdmin
# admin.site.register(MarksForType, MarksForTypeAdmin)


class TypewiseMarksForSubjectInline(admin.TabularInline):
    model = TypewiseMarksForSubject
    extra = 1
    fields = ('mark_type', 'marks')


@admin.register(SubjectForResult)
class SubjectForResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_student_id', 'get_subject_id', 'total_marks')  # Use IDs only
    list_filter = ()  # Remove filters
    search_fields = ('id',)  # Search by ID only
    inlines = [TypewiseMarksForSubjectInline]  # Comment out inline

    def get_student_id(self, obj):
        return obj.student_from_result_table.student.name  # Use the ID field directly
    get_student_id.short_description = "Student ID"

    def get_subject_id(self, obj):
        return obj.subject.subject_name  # Use the ID field directly
    get_subject_id.short_description = "Subject ID"

@admin.register(TypewiseMarksForSubject)
class TypewiseMarksForSubjectAdmin(admin.ModelAdmin):
    list_display = ('get_subject','get_student_name','get_mark_type', 'marks')  # Use IDs only
    list_filter = ()  # Remove filters
    search_fields = ('id',)  # Search by ID only
    
    def get_mark_type(self, obj):
        return obj.mark_type.mark_type  # Access the mark_type field from the related MarkTypeForSubject
    get_mark_type.short_description = "Mark Type"  # Custom display name

    def get_subject(self, obj):
        return obj.subject.subject  # Use the ID field directly
    get_subject.short_description = "Subject"

    def get_student_name(self, obj):
        return obj.subject.student_from_result_table.student.name  # Use the ID field directly
    get_student_name.short_description = "Subject"

    # def get_subject_id(self, obj):
    #     return obj.subject_id  # Use the ID field directly
    # get_subject_id.short_description = "Subject ID"





