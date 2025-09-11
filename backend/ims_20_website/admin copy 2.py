
from django.contrib import admin
from .models import MenuItem,Slider, Notice, HistoryOfInstitute, ManagingCommittee, StudentStatistics
from image_cropping import ImageCroppingMixin  # important
from django.utils.html import format_html  
from mptt.admin import DraggableMPTTAdmin


from django.core.exceptions import ValidationError


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


from django.contrib import admin
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from .models import Notice

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = (
        'title',  'is_marquee', 'is_published',
        'is_important', 'pin_on_top',
        'published_at', 'expire_at', 'created_by','target_audience',
    )
    list_filter = (
        'is_important', 'pin_on_top', 'is_marquee', 
        'target_audience', 'is_published'
    )
    search_fields = ('title', 'content')

    readonly_fields = ('slug', 'updated_at', 'created_by', 'institute')

    fieldsets = (
        (None, {'fields': ('title', 'slug', 'content', 'attachment')}),
        ('Visibility', {'fields': ('is_published', 'target_audience', 'is_marquee', 'expire_at',)}),
        ('Highlighting', {'fields': ('is_important', 'pin_on_top')}),
        ('Timestamps & Author', {'fields': ('published_at', 'updated_at', 'created_by', 'institute')}),
    )
    list_editable =('is_marquee','is_published', 'is_important','pin_on_top',)

    def _get_user_institute(self, user):
        """Safely return the user's institute or None"""
        return getattr(user, 'institute', None)

    # Limit queryset for non-superusers
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        user_institute = self._get_user_institute(request.user)
        if user_institute:
            return qs.filter(institute=user_institute)
        return qs.none()

    # Pre-fill readonly fields in the form
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            if 'created_by' in form.base_fields:
                form.base_fields['created_by'].initial = request.user
                form.base_fields['created_by'].disabled = True
            if 'institute' in form.base_fields:
                form.base_fields['institute'].initial = self._get_user_institute(request.user)
                form.base_fields['institute'].disabled = True
                form.base_fields['institute'].required = False
        return form

    def save_model(self, request, obj, form, change):
        # Auto-assign created_by
        if not getattr(obj, 'created_by_id', None):
            obj.created_by = request.user

        # Auto-assign institute safely using institute_id to avoid errors
        if not getattr(obj, 'institute_id', None):
            obj.institute = self._get_user_institute(request.user)

        # Fail gracefully if no institute found
        if obj.institute is None:
            raise ValidationError("Cannot save Notice: your user has no associated institute.")

        # Auto-generate slug if not set
        if not obj.slug and obj.title:
            base_slug = slugify(obj.title, allow_unicode=True)
            slug = base_slug
            counter = 1
            while Notice.objects.filter(slug=slug).exclude(pk=obj.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            obj.slug = slug

        super().save_model(request, obj, form, change)


# @admin.register(HistoryOfInstitute)
# class HistoryOfInstituteAdmin(ImageCroppingMixin, admin.ModelAdmin):
#     list_display = ('title', 'institute', 'show_image', 'short_content', 'image_preview')
#     list_filter = ('show_image',)
#     search_fields = ('title', 'content')
#     readonly_fields = ('image_preview',)
#     fields = (
#         'institute',
#         'title',
#         'image',
#         'cropping',
#         'show_image',
#         'content',
#         'image_preview',
#     )

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.is_superuser:
#             return qs
#         print("request: ", request)
#         return qs.filter(institute=request.user.institute)

#     def get_form(self, request, obj=None, **kwargs):
#         form = super().get_form(request, obj, **kwargs)
#         if not request.user.is_superuser:
#             form.base_fields['institute'].disabled = True
#             form.base_fields['institute'].required = False
#         return form
#     def get_changeform_initial_data(self, request):
#         """Set the default institute for new entries."""
#         initial = super().get_changeform_initial_data(request)
#         if not request.user.is_superuser:
#             initial['institute'] = request.user.institute
#         return initial

#     def save_model(self, request, obj, form, change):
#         if not request.user.is_superuser:
#             obj.institute = request.user.institute
#         super().save_model(request, obj, form, change)

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html('<img src="{}" style="max-height: 120px;" />', obj.image.url)
#         return "No image"
#     image_preview.short_description = 'Image Preview'

#     def short_content(self, obj):
#         return (obj.content[:75] + '...') if len(obj.content) > 75 else obj.content
#     short_content.short_description = 'Content Snippet'


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



# from .models import ContactInformation
# @admin.register(ContactInformation)
# class ContactInformationAdmin(admin.ModelAdmin):
#     list_display = (
#         'headline_for_institute_info',
#         'name',
#         'address',
#         'mobile_numbers',
#         'email',
#         'website',
#         'institute',
#         'info_center_address',
#     )
#     list_filter = ('institute',)
#     search_fields = (
#         'headline_for_institute_info',
#         'name',
#         'address',
#         'mobile_numbers',
#         'email',
#         'website',
#         'info_center_address',
#         'info_center_email',
#         'info_center_mobile_numbers',
#     )

#     fieldsets = (
#         (None, {
#             'fields': (
#                 'institute',
#                 'headline_for_institute_info',
#                 'name',
#                 'address',
#                 'mobile_numbers',
#                 'email',
#                 'website',
#             )
#         }),
#         ('Info Center Details', {
#             'fields': (
#                 'headline_for_info_center',
#                 'info_center_address',
#                 'info_center_mobile_numbers',
#                 'info_center_email',
#             )
#         }),
#     )

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.is_superuser:
#             return qs
#         return qs.filter(institute=request.user.institute)

#     def get_form(self, request, obj=None, **kwargs):
#         form = super().get_form(request, obj, **kwargs)
#         if not request.user.is_superuser:
#             form.base_fields['institute'].disabled = True
#             form.base_fields['institute'].required = False
#         return form

#     def get_changeform_initial_data(self, request):
#         """Set the default institute for new entries."""
#         initial = super().get_changeform_initial_data(request)
#         if not request.user.is_superuser:
#             initial['institute'] = request.user.institute
#         return initial

#     def save_model(self, request, obj, form, change):
#         """Ensure correct institute assignment for non-superusers."""
#         if not request.user.is_superuser:
#             obj.institute = request.user.institute
#         super().save_model(request, obj, form, change)


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


# from django.contrib import admin
# from .models import Introduction, History, Facility, Achievement
# @admin.register(Introduction)
# class IntroductionAdmin(ImageCroppingMixin, admin.ModelAdmin):
#     list_display = ('institute', 'title', 'show_image')

# @admin.register(History)
# class HistoryAdmin(ImageCroppingMixin, admin.ModelAdmin):
#     list_display = ('institute', 'title', 'show_image')
# admin.site.register(Facility)
# admin.site.register(Achievement)

from django.contrib import admin
from .models import CardItem, Feature


class FeatureInline(admin.TabularInline):  # or StackedInline for more space
    model = Feature
    extra = 1  # show 1 empty row by default
    fields = ("text",  "icon", "order","is_active", "link")
    ordering = ("order",)
    # readonly_fields = ("link",)


@admin.register(CardItem)
class CardItemAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order","icon", "is_active", "updated_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "slug")
    # prepopulated_fields = {"slug": ("title",)}
    ordering = ("order", "title")
    inlines = [FeatureInline]   # ✅ Features editable inside Card page 
    list_editable =('order','is_active',  )
    
    fieldsets = (
        (None, {
            "fields": ("title", "slug", "order","icon", "is_active")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    readonly_fields = ("created_at", "updated_at")
    
    def _get_user_institute(self, user):
        """Safely return the user's institute or None"""
        return getattr(user, 'institute', None)

    # Limit queryset for non-superusers
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        user_institute = self._get_user_institute(request.user)
        if user_institute:
            return qs.filter(institute=user_institute)
        return qs.none()

    # Pre-fill readonly fields in the form
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser: 
            if 'institute' in form.base_fields:
                form.base_fields['institute'].initial = self._get_user_institute(request.user)
                form.base_fields['institute'].disabled = True
                form.base_fields['institute'].required = False
        return form
    
    def save_model(self, request, obj, form, change):
        # Auto-assign created_by
        # if not getattr(obj, 'created_by_id', None):
        #     obj.created_by = request.user

        # Auto-assign institute safely using institute_id to avoid errors
        if not getattr(obj, 'institute_id', None):
            obj.institute = self._get_user_institute(request.user)

        # Fail gracefully if no institute found
        if obj.institute is None:
            raise ValidationError("Cannot save Notice: your user has no associated institute.")

        # Auto-generate slug if not set
        if not obj.slug and obj.title:
            base_slug = slugify(obj.title, allow_unicode=True)
            slug = base_slug
            counter = 1
            while CardItem.objects.filter(slug=slug).exclude(pk=obj.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            obj.slug = slug

        super().save_model(request, obj, form, change)


# /////////////////////////////////////////////////////////////////////
# /////////////////////////// About page ////////////////////////////
# /////////////////////////////////////////////////////////////////////
from django.contrib import admin
from .models import InstituteDetail, Introduction, History, Facility, Achievement

# -----------------------------
# Inlines
# -----------------------------
# class IntroductionInline(admin.StackedInline):
#     """Inline editing for Introduction (1 per institute)"""
#     model = Introduction
#     max_num = 1
#     extra = 0
#     fields = ('title', 'content', 'image', 'cropping', 'show_image')


# class HistoryInline(admin.StackedInline):
#     """Inline editing for History (1 per institute)"""
#     model = History
#     max_num = 1
#     extra = 0
#     fields = ('title', 'content', 'image', 'cropping', 'show_image')
class IntroductionInline(ImageCroppingMixin, admin.StackedInline):
    """Inline form for Introduction with image cropping"""
    model = Introduction
    extra = 0
    max_num = 1  # One-to-one, so max 1
    fields = ("title", "content", "image", "cropping", "show_image")


class HistoryInline(ImageCroppingMixin, admin.StackedInline):
    """Inline form for History with image cropping"""
    model = History
    extra = 0
    max_num = 1
    fields = ("title", "content", "image", "cropping", "show_image")

class FacilityInline(ImageCroppingMixin, admin.TabularInline):
    """Inline editing for multiple Facilities"""
    model = Facility
    extra = 1
    fields = ('icon', 'title', 'description','image', 'cropping', 'show_image')


class AchievementInline(admin.TabularInline):
    """Inline editing for multiple Achievements"""
    model = Achievement
    extra = 1
    fields = ('title',)


# -----------------------------
# InstituteDetail Admin
# -----------------------------
@admin.register(InstituteDetail)
class InstituteDetailAdmin(ImageCroppingMixin, admin.ModelAdmin):
    list_display = ('institute', 'established_year', 'total_students', 'total_teachers','heading_background_image', )
    search_fields = ('institute__name',)
    list_filter = ('established_year',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Summary Info', {
            'fields': ('institute', 'established_year', 'total_students', 'total_teachers')
        }),
        ('Backgroud Image', {
            'fields': ('heading_background_image','cropping', )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    # Include all inlines
    inlines = [IntroductionInline, HistoryInline, FacilityInline, AchievementInline]




#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// {Contact Page } ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
from django.contrib import admin
from .models import ContactPage, ContactCard


class ContactCardInline(admin.StackedInline):
    model = ContactCard
    extra = 1
    ordering = ("order",)
    show_change_link = True
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ['contact_person']

    fieldsets = (
        ("Basic Info", {
            "fields": ("order", "title","contact_person", "name", "designation"), 
        }),
        ("Contact Info", {
            "fields": ("address", "phone", "is_whatsapp", "email"),
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    # include our static css + js to modify inline headers in the admin
    class Media:
        css = {
            "all": (
                # path under your app's static dir. replace `your_app` with your app name
                "admin/website/css/contactcard_inline.css",
            )
        }
        js = ('admin/js/website/contactcard_inline.js',)


@admin.register(ContactPage)
class ContactPageAdmin(admin.ModelAdmin):
    list_display = ("title", "institute", "updated_at")
    list_filter = ("institute",)
    search_fields = ("title", "institute__name")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ContactCardInline]


@admin.register(ContactCard)
class ContactCardAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "title",
        "page",
        "phone",
        "is_whatsapp",
        "order",
        "is_active",
    )
    list_filter = ("is_active", "is_whatsapp", "page")
    search_fields = ("name", "phone", "email", "designation")
    ordering = ("page", "order")

