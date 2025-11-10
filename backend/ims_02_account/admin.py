from image_cropping import ImageCroppingMixin 
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django_admin_inline_paginator.admin import TabularInlinePaginated
from .models import * 
class CustomUserAdmin(UserAdmin):
    # Fields to enable searching
    search_fields = ['username', 'role']

    # Fields to enable filtering
    list_filter = ['role']

    # Display fields in the list view
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']

    # Fields to be displayed in the detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'role', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

# Register the User model with the custom ModelAdmin
admin.site.register(User, CustomUserAdmin)


class AdminAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = ['name', 'phone_number', 'institute__name']

    # Fields to enable filtering
    list_filter = ['institute__name']

    # Display fields in the list view
    list_display = ['name', 'phone_number', 'institute', 'user']

    # Fields to be displayed in the detail view
    fieldsets = [
        (None, {'fields': ['institute', 'user', 'name', 'phone_number', 'password', 'address', 'picture']}),
    ]

    # Enable autocomplete for ForeignKey fields
    autocomplete_fields = ['institute', 'user']

# Register the Admin model with the custom ModelAdmin
admin.site.register(Admin, AdminAdmin)

from django.contrib import admin
from .models import Teacher, TeacherSubjectAssignment


# ✅ Inline for Subject Assignments
class TeacherSubjectAssignmentInline(admin.TabularInline):  # or TabularInlinePaginated if you use it
    model = TeacherSubjectAssignment
    extra = 1
    ordering = ['-id']
    per_page = 8  # only if you're using a custom paginated inline base class


from .models import Teacher, TeacherEducation, Examination
# (ImageCroppingMixin, admin.StackedInline):
# class TeacherEducationInline(admin.StackedInline):  # You may use StackedInline if you want big fields
class TeacherEducationInline(ImageCroppingMixin, admin.StackedInline):  # You may use StackedInline if you want big fields
    model = TeacherEducation
    extra = 1
    fields = (
        "examination",
        "board_or_institute",
        "group_or_subject",
        "result",
        "passing_year",
        "roll",
        "ntrca_batch",
        "duration",
        "image",
        "image_cropped",
    )
    # readonly_fields = ("image_cropped",)  # show preview if needed



# ✅ Admin for Teacher
# class TeacherAdmin(admin.ModelAdmin):
@admin.register(Teacher)
class TeacherAdmin(ImageCroppingMixin, admin.ModelAdmin):
    search_fields = ['name', 'phone_number', 'institute__name']
    list_filter = ['institute']
    list_display = [
        'name', 'designation', 'major_subject','phone_number', 'institute',
        'section', 'blood_group', 'is_visible','is_whatsapp'
    ] 

    fieldsets = [
        ("Basic Information", {
            'fields': [
                'institute', 'user', 'name','bangla_name', 'designation','order', 'major_subject',
                'phone_number','is_whatsapp', 'email', 'password',
                'dob',
                'joining_date',
                'indexing_of_mpo',
                'index_number',
                'qualification',
                'blood_group',
                'religion',
                'section',
                'nid',
                'address',
                'is_visible',
            ]
        }),
        ("Permissions & Flags", {
            'fields': ['allow_all_subject','allow_students_info','only_marks_input', 'allow_result_processing']
        }),
        ("Media", {
            "fields": (
                "picture",
                "picture_cropped",
                "signature",
                "signature_cropped",
            )
        }),
        ("Timestamps", {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]

    readonly_fields = ['created_at', 'updated_at']
    inlines = [TeacherSubjectAssignmentInline,TeacherEducationInline]

    # ✅ Prevent more than one head teacher per institute
    def save_model(self, request, obj, form, change):
        if obj.designation == 'head_teacher':
            existing_head_teacher = Teacher.objects.filter(
                institute=obj.institute,
                designation='head_teacher'
            ).exclude(id=obj.id if change else None)
            if existing_head_teacher.exists():
                self.message_user(
                    request,
                    f"A head teacher already exists for {obj.institute}.",
                    level='ERROR'
                )
                return
        super().save_model(request, obj, form, change)

    class Media:
        js = ('admin/js/filter_year_to_section_for_teacher.js',)
        css = {
            'all': ('admin/css/custom_teacher_admin.css',)
        }
        # td.field-subject>.related-widget-wrapper select{
        #     max-width: 200px !important;
        # }
@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ("name", "name_bn", "order")
    list_editable = ("order",)
    ordering = ("order",)


class StudentAdmin(ImageCroppingMixin, admin.ModelAdmin):
    # Fields to enable searching
    search_fields = ['name', 'roll_number', 'phone_number', 'institute__name']

    # Fields to enable filtering
    list_filter = ['institute__name', 'year__year', 'class_instance__shift','class_instance__class_name', 'group__group_name', 'section__section_name']

    # Display fields in the list view
    list_display = ['name', 'roll_number', 'student_id', 'institute', 'year', 'class_instance',  'group', 'section', 'user']

    exclude = ('user',)
    
    # Fields to be displayed in the detail view
    # fieldsets = [
    #     (None, {'fields': ['institute', 'year', 'class_instance', 'group', 'section', 'user', 'name', 'roll_number', 'password', 'dob', 'email', 'phone_number', 'guardian_mobile_number', 'address', 'picture']}),
    # ]

    # Enable autocomplete for ForeignKey fields
    # autocomplete_fields = ['institute', 'year', 'class_instance', 'group', 'section', 'user']
    
    class Media:
        js = ('admin/js/filter_year_to_section_and_student.js',)  # Load the custom JavaScript file

# Register the Student model with the custom ModelAdmin
admin.site.register(Student, StudentAdmin)


class StudentClassHistoryAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = ['student__username', 'institute__name', 'class_instance__class_name']

    # Fields to enable filtering
    list_filter = ['institute__name', 'year__year', 'class_instance__class_name']

    # Display fields in the list view
    list_display = ['student', 'institute', 'year', 'class_instance', 'section', 'group', 'from_date', 'to_date']

    # Fields to be displayed in the detail view
    fieldsets = [
        (None, {'fields': ['student', 'institute', 'year', 'class_instance', 'section', 'group', 'from_date', 'to_date']}),
    ]

    # Enable autocomplete for ForeignKey fields
    autocomplete_fields = ['student', 'institute', 'year', 'class_instance', 'section', 'group']

# Register the StudentClassHistory model with the custom ModelAdmin
admin.site.register(StudentClassHistory, StudentClassHistoryAdmin)



class GuardianAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = ['name', 'phone_number', 'institute__name']

    # Fields to enable filtering
    list_filter = ['institute__name']

    # Display fields in the list view
    list_display = ['name', 'phone_number', 'institute', 'user']

    exclude = ('user',) 
    # Fields to be displayed in the detail view
    # fieldsets = [
    #     (None, {'fields': ['institute', 'user', 'name', 'phone_number', 'password', 'students']}),
    # ]

    # Enable autocomplete for ForeignKey fields
    autocomplete_fields = ['institute', 'user']

    # Enable a filter horizontal widget for ManyToManyField (students)
    filter_horizontal = ['students']

# Register the Guardian model with the custom ModelAdmin
admin.site.register(Guardian, GuardianAdmin)


class StaffAdmin(admin.ModelAdmin):
    # Fields to enable searching
    search_fields = ['name', 'phone_number', 'institute__name']

    # Fields to enable filtering
    list_filter = ['institute__name']

    # Display fields in the list view
    list_display = ['name', 'phone_number', 'institute', 'user']

    exclude = ('user',) 
    # Fields to be displayed in the detail view
    # fieldsets = [
    #     (None, {'fields': ['institute', 'user', 'name', 'phone_number', 'password']}),
    # ]

    # Enable autocomplete for ForeignKey fields
    autocomplete_fields = ['institute', 'user']

# Register the Staff model with the custom ModelAdmin
admin.site.register(Staff, StaffAdmin)



