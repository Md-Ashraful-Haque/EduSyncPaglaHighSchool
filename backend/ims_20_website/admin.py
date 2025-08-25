
from django.contrib import admin
from .models import MenuItem,Slider, Notice, HistoryOfInstitute, ManagingCommittee,ContactInformation, StudentStatistics
from image_cropping import ImageCroppingMixin  # important
from django.utils.html import format_html  
from mptt.admin import DraggableMPTTAdmin





# admin.site.register(MenuItem, DraggableMPTTAdmin) 
from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from django.utils.text import slugify
from .models import MenuItem

@admin.register(MenuItem)
class MenuItemAdmin(DraggableMPTTAdmin):
    list_display = (
        'tree_actions', 'indented_title', 'name_en', 'is_active', 'order',
    )
    list_display_links = ('indented_title',)
    list_filter = ('institute', 'is_active')
    search_fields = ('name_bn', 'name_en', 'slug', 'url')
    
    readonly_fields = ('slug',)

    fields = (
        'institute',
        'name_bn',
        'name_en',
        'slug',
        'url',
        'parent',
        'order',
        'is_active',
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser and 'institute' in form.base_fields:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        if not obj.slug:
            base = obj.name_en if obj.name_en else obj.name_bn
            obj.slug = slugify(base, allow_unicode=True)
        super().save_model(request, obj, form, change)



@admin.register(Slider)
class SliderAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('title', 'slide_number', 'institute', 'image_preview')
    list_filter = ('institute',)
    search_fields = ('title',)
    readonly_fields = ('image_preview',)

    fields = (
        'institute',
        'title',
        'slide_number',
        'image',
        'cropping',
        'image_preview',
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser and 'institute' in form.base_fields:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        super().save_model(request, obj, form, change)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'target_audience', 'display_position','is_marquee',
        'is_important', 'pin_on_top', 'is_published',
        'published_at', 'expire_at'
    )
    list_filter = (
        'is_important', 'pin_on_top','is_marquee',
        'display_position', 'target_audience', 'is_published'
    )
    search_fields = ('title', 'content')
    readonly_fields = ('published_at', 'updated_at')
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content', 'attachment')
        }),
        ('Visibility', {
            'fields': ('is_published', 'target_audience', 'display_position', 'is_marquee','expire_at')
        }),
        ('Highlighting', {
            'fields': ('is_important', 'pin_on_top')
        }),
        ('Timestamps & Author', {
            'fields': ('published_at', 'updated_at', 'created_by', 'institute')
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser and 'institute' in form.base_fields:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        if not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(HistoryOfInstitute)
class HistoryOfInstituteAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('title', 'institute', 'show_image', 'short_content', 'image_preview')
    list_filter = ('show_image',)
    search_fields = ('title', 'content')
    readonly_fields = ('image_preview',)
    fields = (
        'institute',
        'title',
        'image',
        'cropping',
        'show_image',
        'content',
        'image_preview',
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        print("request: ", request)
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form
    def get_changeform_initial_data(self, request):
        """Set the default institute for new entries."""
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        super().save_model(request, obj, form, change)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 120px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Image Preview'

    def short_content(self, obj):
        return (obj.content[:75] + '...') if len(obj.content) > 75 else obj.content
    short_content.short_description = 'Content Snippet'


@admin.register(ManagingCommittee)
class ManagingCommitteeAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('title', 'name', 'designation', 'institute', 'short_message','order', 'image_preview')
    list_filter = ('designation',)
    search_fields = ('title', 'name', 'designation', 'message')
    readonly_fields = ('image_preview',)
    fields = (
        'institute',
        'title',
        'name',
        'show_image_on_sidebar',
        'designation',
        'image',
        'cropping',
        'message',
        'order',
        'image_preview',
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form
    
    def get_changeform_initial_data(self, request):
        """Set the default institute for new entries."""
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        super().save_model(request, obj, form, change)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 120px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Image Preview'

    def short_message(self, obj):
        return (obj.message[:75] + '...') if len(obj.message) > 75 else obj.message
    short_message.short_description = 'Message Snippet'


    from django.contrib import admin



from .models import ContactInformation
@admin.register(ContactInformation)
class ContactInformationAdmin(admin.ModelAdmin):
    list_display = (
        'headline_for_institute_info',
        'name',
        'address',
        'mobile_numbers',
        'email',
        'website',
        'institute',
        'info_center_address',
    )
    list_filter = ('institute',)
    search_fields = (
        'headline_for_institute_info',
        'name',
        'address',
        'mobile_numbers',
        'email',
        'website',
        'info_center_address',
        'info_center_email',
        'info_center_mobile_numbers',
    )

    fieldsets = (
        (None, {
            'fields': (
                'institute',
                'headline_for_institute_info',
                'name',
                'address',
                'mobile_numbers',
                'email',
                'website',
            )
        }),
        ('Info Center Details', {
            'fields': (
                'headline_for_info_center',
                'info_center_address',
                'info_center_mobile_numbers',
                'info_center_email',
            )
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(institute=request.user.institute)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form

    def get_changeform_initial_data(self, request):
        """Set the default institute for new entries."""
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            initial['institute'] = request.user.institute
        return initial

    def save_model(self, request, obj, form, change):
        """Ensure correct institute assignment for non-superusers."""
        if not request.user.is_superuser:
            obj.institute = request.user.institute
        super().save_model(request, obj, form, change)


@admin.register(StudentStatistics)
class StudentStatisticsAdmin(admin.ModelAdmin):
    list_display = (
        'institute', 'year', 'class_instance', 'group', 'section',
        'boys', 'girls', 'total_students', 'muslim', 'hindu', 'bouddha', 'christian',
        'muktijoddha', 'shodosho_sontan', 'autistic', 'physical_disability'
    )
    list_filter = ('institute', 'year', 'class_instance', 'group', 'section')
    search_fields = ('institute__name', 'section__name', 'group__name')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.base_fields['institute'].disabled = True
            form.base_fields['institute'].required = False
        return form
    
    def get_changeform_initial_data(self, request):
        """Set the default institute for new entries."""
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            try:
                initial['institute'] = request.user.institute.id
            except AttributeError:
                pass
        return initial

    def total_students(self, obj):
        return obj.boys + obj.girls
    total_students.short_description = 'Total Students'

    class Media:
        js = ('admin/js/filter_year_to_section_and_student.js',)


from django.contrib import admin
from .models import Introduction, History, Facility, Achievement
@admin.register(Introduction)
class IntroductionAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('institute', 'title', 'show_image')

@admin.register(History)
class HistoryAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('institute', 'title', 'show_image')
admin.site.register(Facility)
admin.site.register(Achievement)
