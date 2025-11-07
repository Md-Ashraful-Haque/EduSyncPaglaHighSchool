from django.contrib import admin
from django.apps import apps
from .models import *

class InstituteAdmin(admin.ModelAdmin):
    
    search_fields = ['mobile_number__icontains', 'name__icontains', 'email__icontains']
    
    # Display fields in the list view
    list_display = [
        'institute_code',
        'name',
        'mobile_number',
        'email',
    ]

# Register the Institute model with the custom ModelAdmin
admin.site.register(Institute, InstituteAdmin)



class YearAdmin(admin.ModelAdmin):
    search_fields = ['year']
    list_filter = ['institute__name']
    
    # Display fields in the list view
    list_display = [
        'institute',
        'year', 
    ]

# Register the Year model with the custom ModelAdmin
admin.site.register(Year, YearAdmin)


class ClassAdmin(admin.ModelAdmin):
    # raw_id_fields = ['institute', 'year']  # Use raw ID fields for institute and year
    # Fields to enable searching
    search_fields = [
        'institute__name',  # Search by institute name
        'year__year',       # Search by year
        'class_name__name', # Search by class name
        'shift',           # Search by shift
    ]

    # Fields to enable filtering
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',       # Filter by year
        'class_name__name', # Filter by class name
        'shift',            # Filter by shift
    ]

    # Display fields in the list view
    list_display = [
        'class_name',
        'year',
        'shift',
        'institute',
    ]
    # autocomplete_fields = ['institute', 'year',]
    class Media:
        js = ('admin/js/class_admin.js',)  # Load the custom JavaScript file

# Register the Class model with the custom ModelAdmin
admin.site.register(Class, ClassAdmin)


class GroupAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = [
        'institute__name',  # Search by institute name
        'year__year',       # Search by year
        'class_instance__class_namee', # Search by class name 
    ]

    # Fields to enable filtering
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',       # Filter by year
        'class_instance__class_name', # Filter by class name 
    ]

    # Display fields in the list view
    list_display = [ 
        'group_name',
        'institute',
        'year__year',
        'class_instance__class_name__name',
    ]
    
    class Media:
        js = ('admin/js/filter_year_and_class.js',)  # Load the custom JavaScript file

# Register the Group model with the custom ModelAdmin
admin.site.register(Group, GroupAdmin)


class SectionAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = [
        'institute__name',  # Search by institute name
        'year__year',       # Search by year
        'class_instance__class_name',  # Search by class name
        'group__group_name',  # Search by group name
        'section_name',  # Search by section name
    ]

    # Fields to enable filtering
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',       # Filter by year
        'class_instance__class_name',  # Filter by class name
        'group__group_name',  # Filter by group name
        'section_name',  # Filter by section name
    ]

    # Display fields in the list view
    list_display = [
        'institute__name',
        'section_name',
        'group__group_name',
        'class_instance__class_name',
        'year__year',
    ]

    # Optionally, you can add fields to be displayed in the detail view
    fieldsets = [
        (None, {'fields': ['institute', 'year', 'class_instance', 'group', 'section_name']}),
    ]

    # Optionally, you can add autocomplete fields for ForeignKey fields
    # autocomplete_fields = ['institute', 'year', 'class_instance', 'group']
    
    class Media:
        js = ('admin/js/filter_year_to_section.js',)  # Load the custom JavaScript file
        # js = ('admin/js/filter_year_and_class_group.js',)  # Load the custom JavaScript file

# Register the Section model with the custom ModelAdmin
admin.site.register(Section, SectionAdmin)


class SubjectNameAdmin(admin.ModelAdmin): 
    # Fields to enable filtering
    list_filter = [
        'class_name',  # Filter by institute name 
    ]

    # Display fields in the list view
    list_display = [
        'id',
        'name_bengali',
        'name',
        'short_name',
        'class_name', 
        'code', 
    ]

admin.site.register(SubjectName, SubjectNameAdmin)

class SubjectForIMSAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = [
        'institute__name',  # Search by institute name
        'year__year',  # Search by year
        'class_instance__class_name',  # Search by class name
        'subject_name',  # Search by subject name 
    ]

    # Fields to enable filtering
    list_filter = [
        'institute__name',  # Filter by institute name
        'year__year',  # Filter by year
        'class_instance__class_name',  # Filter by class name
        'subject_name',  # Filter by subject name
    ]

    # Display fields in the list view
    list_display = [
        'id',
        'institute',
        'serial_number',
        'subject_name', 
        'subject_name__id', 
        'is_optional',
        'full_marks',
        'pass_marks',
        'year__year',
        'class_instance__class_name',
        'get_groups',  # Custom method to display groups
    ]

    # Custom method to display groups in the list view
    def get_groups(self, obj):
        return ", ".join([group.group_name.name for group in obj.group.all()])
    get_groups.short_description = "Groups"  # Column header for the custom method

    # Fields to be displayed in the detail view
    fieldsets = [
        (None, {'fields': ['institute', 'year', 'class_instance', 'group', 'subject_name', 'is_optional','serial_number']}),
        ('Marks Information', {'fields': ['full_marks', 'pass_marks']}),
        # ('Marks Information', {'fields': ['full_marks', 'pass_marks', 'theory_marks', 'theory_pass_marks',  'mcq_marks', 'mcq_pass_marks','practical_marks',  'practical_pass_marks']}),
    ]

    # Enable autocomplete for ForeignKey fields
    # autocomplete_fields = ['institute', 'year', 'class_instance']

    # Enable a filter horizontal widget for ManyToManyField (groups)
    # filter_horizontal = ['group']
    
    class Media:
        js = ('admin/js/filter_year_to_section.js',)  # Load the custom JavaScript file
        # js = ('admin/js/filter_year_class_group_section.js',)  # Load the custom JavaScript file

# Register the SubjectForIMS model with the custom ModelAdmin
admin.site.register(SubjectForIMS, SubjectForIMSAdmin)



class MarkTypeForSubjectAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = [
        'subject__name_bengali',  # Search by subject name
        'mark_type',  # Search by mark type
    ]

    # Fields to enable filtering
    list_filter = [
        'subject__name_bengali',  # Filter by subject name
        'mark_type',  # Filter by mark type
    ]

    # Display fields in the list view
    list_display = [ 
        'subject',
        'mark_type',
        'max_marks',
        'pass_marks',
        'serial_number',
    ]

    # Fields to be displayed in the detail view
    fieldsets = [
        (None, {'fields': ['subject', 'mark_type', 'max_marks', 'pass_marks','serial_number']}),
    ]

    # Enable autocomplete for ForeignKey fields
    # autocomplete_fields = ['subject']

# Register the MarkTypeForSubject model with the custom ModelAdmin
admin.site.register(MarkTypeForSubject, MarkTypeForSubjectAdmin)



# Dynamically register all other models
app_models = apps.get_app_config('ims_01_institute').get_models()

for model in app_models:
    if model != Institute:  # Skip the Institute model since it's already registered
        try:
            admin.site.register(model)
        except admin.sites.AlreadyRegistered:
            pass