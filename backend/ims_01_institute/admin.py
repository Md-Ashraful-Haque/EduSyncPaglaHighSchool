from django.contrib import admin
from django.apps import apps
from .models import *


# class InstituteAdmin(admin.ModelAdmin):
#     search_fields = ['mobile_number__icontains', 'name__icontains', 'email__icontains']
#     list_display = ['institute_code', 'name', 'institute_eiin','mobile_number', 'email']

# admin.site.register(Institute, InstituteAdmin)
from django.contrib import admin
from image_cropping import ImageCroppingMixin
from .models import Institute


@admin.register(Institute)
class InstituteAdmin(ImageCroppingMixin, admin.ModelAdmin):

    # 🔍 Search & Filter
    search_fields = [
        'name',
        'name_in_english',
        'institute_code',
        'institute_eiin',
        'mobile_number',
        'email',
    ]

    list_filter = ['created_at']

    # 📋 List View
    list_display = [
        'name',
        'name_in_english',
        'institute_code',
        'mobile_number',
        'email',
        'created_at',
    ]

    ordering = ['name']

    # 🧩 Form Layout
    fieldsets = [
        ("Basic Information", {
            'fields': (
                'name',
                'name_in_english',
                'institute_code',
                'institute_eiin',
                'address',
            )
        }),

        ("Contact Information", {
            'fields': (
                'mobile_number',
                'email',
                'website',
            )
        }),

        ("Media", {
            'fields': (
                'logo',
                'picture',
                'signature',
                'signature_cropped',
            )
        }),

        ("Signature Labels (English)", {
            'fields': (
                'signature_of_class_teacher',
                'signature_of_class_guardian',
                'signature_of_head',
            )
        }),

        ("Signature Labels (Bangla)", {
            'fields': (
                'signature_of_class_bangla',
                'signature_of_class_guardian_bangla',
                'signature_of_head_bangla',
            )
        }),

        ("Timestamps", {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    ]

    # 🔒 Readonly
    readonly_fields = ['created_at', 'updated_at']

    # 🎨 Admin Media (optional – add if needed)
    # class Media:
    #     css = {
    #         'all': ('admin/css/custom_institute_admin.css',)
    #     }


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ('id', 'shift_name_eng', 'shift_name_eng_lowercase','shift', 'is_active')
    search_fields = ('shift_name_eng', 'shift_name_eng_lowercase','shift')
    list_filter = ('is_active',)
    list_editable = ('is_active',)
    readonly_fields = ('shift_name_eng_lowercase',)


class YearAdmin(admin.ModelAdmin):
    search_fields = ['year']
    list_filter = ['institute']
    list_display = ['institute', 'year']


admin.site.register(Year, YearAdmin)


class ClassAdmin(admin.ModelAdmin):
    search_fields = ['institute__name', 'year__year', 'class_name__name', 'shift']
    list_filter = ['institute', 'year', 'class_name', 'shift']
    list_display = ['class_name', 'year', 'shift', 'institute']

    class Media:
        js = ('admin/js/class_admin.js',)


admin.site.register(Class, ClassAdmin)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    search_fields = ['institute__name', 'year__year', 'class_instance__class_name__name']
    list_filter = ['institute', 'year', 'class_instance__class_name', 'class_instance__shift']
    list_display = ['group_name', 'institute', 'get_year', 'get_class_name', 'get_shift_name']

    def get_year(self, obj):
        return obj.year.year
    get_year.short_description = 'Year'
    get_year.admin_order_field = 'year__year'

    def get_class_name(self, obj):
        return obj.class_instance.class_name.name
    get_class_name.short_description = 'Class Name'
    get_class_name.admin_order_field = 'class_instance__class_name__name'

    def get_shift_name(self, obj):
        return obj.class_instance.shift
    get_shift_name.short_description = 'Shift Name'
    get_shift_name.admin_order_field = 'class_instance__shift'

    class Media:
        js = ('admin/js/filter_year_and_class.js',)


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    search_fields = ['institute__name', 'year__year', 'class_instance__class_name__name', 'group__group_name__name', 'section_name']
    list_filter = ['institute', 'year', 'class_instance__shift','class_instance__class_name', 'group__group_name', 'section_name']
    list_display = ['get_institute', 'section_name', 'get_group', 'get_class_name', 'get_year']

    def get_institute(self, obj):
        return obj.institute.name
    get_institute.short_description = 'Institute'

    def get_group(self, obj):
        return obj.group.group_name.name
    get_group.short_description = 'Group'

    def get_class_name(self, obj):
        return obj.class_instance.class_name.name
    get_class_name.short_description = 'Class'

    def get_year(self, obj):
        return obj.year.year
    get_year.short_description = 'Year'

    fieldsets = [
        (None, {'fields': ['institute', 'year', 'class_instance', 'group', 'section_name']}),
    ]

    class Media:
        js = ('admin/js/filter_year_to_section.js',)

class MarkTypeInline(admin.TabularInline):
    model = MarkTypeForSubject
    extra = 0
    readonly_fields = ['mark_type', 'max_marks', 'pass_marks', 'serial_number']
    can_delete = False
    show_change_link = True

@admin.register(SubjectName)
class SubjectNameAdmin(admin.ModelAdmin):
    list_filter = ['class_name']
    # list_display = ['id', 'name_bengali', 'name','serial', 'short_name', 'class_name', 'code']

    list_display = ('name_bengali', 'name', 'class_name', 'used_in_classes')
    inlines = [MarkTypeInline]

    def used_in_classes(self, obj):
        classes = obj.subjectname.values_list('class_instance__class_name__name', flat=True).distinct()
        unique_classes = sorted(set(str(cls) for cls in classes))
        return ", ".join(unique_classes)
    used_in_classes.short_description = "Used in Classes"


@admin.register(SubjectForIMS)
class SubjectForIMSAdmin(admin.ModelAdmin):
    search_fields = ['institute__name', 'year__year', 'class_instance__class_name__name', 'subject_name__name']
    list_filter = ['institute', 'year', 'class_instance__shift', 'class_instance__class_name', 'group__group_name']
    list_display = ['id', 'institute', 'serial_number', 'subject_name', 'get_subject_id', 'is_optional', 'full_marks', 'pass_marks', 'get_year', 'get_class_name', 'get_groups']

    def get_subject_id(self, obj):
        return obj.subject_name.id if obj.subject_name else 0
    get_subject_id.short_description = 'Subject ID'

    def get_year(self, obj):
        return obj.year.year
    get_year.short_description = 'Year'

    def get_class_name(self, obj):
        return obj.class_instance.class_name.name
    get_class_name.short_description = 'Class'

    def get_groups(self, obj):
        return ", ".join([group.group_name.name for group in obj.group.all()])
    get_groups.short_description = "Groups"

    fieldsets = [
        (None, {'fields': ['institute', 'year', 'class_instance', 'group', 'subject_name', 'is_optional', 'serial_number']}),
        ('Marks Information', {'fields': ['full_marks', 'pass_marks']}),
    ]

    class Media:
        js = ('admin/js/filter_year_to_section.js',)


@admin.register(MarkTypeForSubject)
class MarkTypeForSubjectAdmin(admin.ModelAdmin):
    search_fields = ['subject__name_bengali', 'mark_type']
    list_filter = ['subject__name_bengali', 'mark_type']
    # list_filter = ['subject__name_bengali', 'mark_type']
    list_display = ['subject', 'mark_type', 'max_marks', 'pass_marks', 'serial_number']

    fieldsets = [
        (None, {'fields': ['subject', 'mark_type', 'max_marks', 'pass_marks', 'serial_number']}),
    ]


# Dynamically register all other models
app_models = apps.get_app_config('ims_01_institute').get_models()

for model in app_models:
    if model not in [
        Institute, Year, Class, Group, Section, SubjectName, SubjectForIMS, MarkTypeForSubject
    ]:
        try:
            admin.site.register(model)
        except admin.sites.AlreadyRegistered:
            pass
