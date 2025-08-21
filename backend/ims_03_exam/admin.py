
# from django.contrib import admin
# from .models import ExamForIMS

# class ExamForIMSAdmin(admin.ModelAdmin):
#     # Fields to enable searching
#     search_fields = [
#         'exam_name',  # Search by exam name
#         'institute__name',  # Search by institute name
#         'year__year',  # Search by year
#     ]

#     # Fields to enable filtering
#     list_filter = [
#         'institute__name',  # Filter by institute name
#         'year__year',  # Filter by year
#     ]

#     # Display fields in the list view
#     list_display = [
#         'institute',
#         'exam_name',
#         'exam_name_in_english',
#         'year__year', 
#         'heighest_marks',
#         'get_classes',  # Custom method to display classes
#     ]

#     def get_classes(self, obj):
#         return ", ".join([str(class_instance.class_name) for class_instance in obj.class_instance.all()])
#     get_classes.short_description = "Classes"

#     # Fields to be displayed in the detail view
#     fieldsets = [
#         (None, {'fields': ['institute', 'year', 'exam_name','exam_name_in_english', 'heighest_marks', 'start_date', 'end_date']}),
#         ('Classes', {'fields': ['class_instance']}),
#     ]

#     # Enable autocomplete for ForeignKey fields
#     # autocomplete_fields = ['institute', 'year']

#     # Enable a filter horizontal widget for ManyToManyField (class_instance)
#     filter_horizontal = ['class_instance']

# # Register the ExamForIMS model with the custom ModelAdmin
# admin.site.register(ExamForIMS, ExamForIMSAdmin)

from django.contrib import admin
from .models import ExamForIMS

class ExamForIMSAdmin(admin.ModelAdmin):
    search_fields = [
        'exam_name',
        'institute__name',  # ✅ allowed in search_fields
        'year__year',       # ✅ allowed in search_fields
    ]

    list_filter = [
        'institute',  # ✅ use FK directly
        'year',
    ]

    list_display = [
        'institute',
        'exam_name',
        'exam_name_in_english',
        'get_year',
        'heighest_marks',
        'get_classes',
    ]

    def get_year(self, obj):
        return obj.year.year
    get_year.short_description = "Year"

    def get_classes(self, obj):
        return ", ".join([str(class_instance.class_name) for class_instance in obj.class_instance.all()])
    get_classes.short_description = "Classes"

    fieldsets = [
        (None, {
            'fields': [
                'institute', 'year', 'exam_name',
                'exam_name_in_english', 'heighest_marks',
                'start_date', 'end_date'
            ]
        }),
        ('Classes', {'fields': ['class_instance']}),
    ]

    filter_horizontal = ['class_instance']

admin.site.register(ExamForIMS, ExamForIMSAdmin)

