
from django.contrib import admin
from .models import StudentSubjectResult, SubjectForResult, TypewiseMarksForSubject, SubjectHighestMarks,MarksAdjustment
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
        'student__roll_number',  # Search by student name
        'exam__exam_name',  # Search by exam name 
    ]

    # Optimize list_filter
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',  # Filter by year
        'class_instance__shift',  # Filter by year
        'class_instance__class_name',  # Filter by year
        'group__group_name', 
        'section__section_name', 
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

class TypewiseMarksForSubjectInline(admin.TabularInline):
    model = TypewiseMarksForSubject
    extra = 1
    fields = ('mark_type', 'marks')
    


@admin.register(SubjectForResult)
class SubjectForResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_student_id', 'get_subject_id', 'total_marks')  # Use IDs only
    # list_filter = ('student_from_result_table','subject')  # Remove filters
    # list_filter = ('student_from_result_table','subject')  # Remove filters
    search_fields = ('id','student_from_result_table__student__roll_number')  # Search by ID only
    inlines = [TypewiseMarksForSubjectInline]  # Comment out inline

    def get_student_id(self, obj):
        return obj.student_from_result_table.student.name  # Use the ID field directly
    get_student_id.short_description = "Student ID"

    def get_subject_id(self, obj):
        return obj.subject.subject_name  # Use the ID field directly
    get_subject_id.short_description = "Subject ID"

# @admin.register(TypewiseMarksForSubject)
# class TypewiseMarksForSubjectAdmin(admin.ModelAdmin):
#     list_display = ('get_subject','get_student_name','get_mark_type', 'marks')  # Use IDs only
    
#     search_fields = ('id','subject__student_from_result_table__student','subject__student_from_result_table__student')  # Search by ID only
#     list_filter = [
#         'subject__student_from_result_table__institute__name',
#         'subject__student_from_result_table__year__year',
#         'subject__student_from_result_table__exam__exam_name',
#         'subject__student_from_result_table__class_instance',
#         # 'subject__student_from_result_table__group',
#         # 'subject__student_from_result_table__section',
#         # 'subject__student_from_result_table__student',
#     ]
    
    
#     def get_mark_type(self, obj):
#         return obj.mark_type.mark_type  # Access the mark_type field from the related MarkTypeForSubject
#     get_mark_type.short_description = "Mark Type"  # Custom display name

#     def get_subject(self, obj):
#         return obj.subject.subject.subject_name.name  # Use the ID field directly
#     get_subject.short_description = "Subject"

#     def get_student_name(self, obj):
#         return obj.subject.student_from_result_table.student.name  # Use the ID field directly
#     get_student_name.short_description = "Student Name"

@admin.register(TypewiseMarksForSubject)
class TypewiseMarksForSubjectAdmin(admin.ModelAdmin):
    list_display = (
        'get_subject',
        'get_student_name',
        'get_mark_type',
        'marks',
    )

    search_fields = (
        'id',
        'subject__student_from_result_table__student__name',  # Search by student name
    )

    list_filter = [
        'subject__student_from_result_table__institute__name',
        'subject__student_from_result_table__year__year',
        'subject__student_from_result_table__exam__exam_name',
        'subject__student_from_result_table__class_instance',
        # 'subject__student_from_result_table__group',
        # 'subject__student_from_result_table__section',
        # 'subject__student_from_result_table__student',
    ]

    def get_mark_type(self, obj):
        return getattr(obj.mark_type, "mark_type", None)
    get_mark_type.short_description = "Mark Type"

    def get_subject(self, obj):
        try:
            return obj.subject.subject.subject_name.name
        except AttributeError:
            return None
    get_subject.short_description = "Subject"

    def get_student_name(self, obj):
        try:
            return obj.subject.student_from_result_table.student.name
        except AttributeError:
            return None
    get_student_name.short_description = "Student Name"



@admin.register(SubjectHighestMarks)
class SubjectHighestMarksAdmin(admin.ModelAdmin):
    """
    Admin configuration for SubjectHighestMarks model.
    Displays the highest marks for each subject with section and last updated timestamp.
    """
    list_display = ('id', 'subject', 'section','roll','highest_marks', 'updated_at')
    
    list_filter = ('updated_at',)  # Filter by timestamp, no JOINs required
    search_fields = ('id',)
    readonly_fields = ('updated_at',)  # Prevent manual edits to timestamp
    date_hierarchy = 'updated_at'  # Enable date-based navigation

    def get_queryset(self, request):
        """
        Optimize queryset to reduce database queries.
        """
        return super().get_queryset(request).select_related('subject', 'section')

@admin.register(MarksAdjustment)
class MarksAdjustmentAdmin(admin.ModelAdmin):
    list_display = ("target_marks", "adjustment")
    list_editable = ("adjustment",)  # allow inline editing of adjustment
    search_fields = ("target_marks",)
    ordering = ("target_marks",)