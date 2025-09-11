# # models.py


from django.db import models
from django.utils.text import slugify
from django.db.models import Max
from mptt.models import MPTTModel, TreeForeignKey
from image_cropping import ImageCropField, ImageRatioField
from django.contrib.auth import get_user_model
from ims_01_institute.models import *
from ims_01_institute.models import Institute, Year, Class, Group, Section
User = get_user_model()
from django.utils import timezone
from backend.utils import safe_upload_to_notice_attachments
from unidecode import unidecode

from backend.utils import safe_upload_to_institute_details_attachments

class MenuItem(MPTTModel):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="menuitem",  # Unique related_name for institute
        verbose_name="Institute"
    )
    name_bn = models.CharField(
        max_length=100,
        verbose_name="মেনুর নাম (বাংলা)",
        help_text="বাংলা নাম লিখুন"
    )
    name_en = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Menu Name (English)",
        help_text="Optional: English version of the name"
    )
    slug = models.SlugField(
        max_length=150,
        unique=True,
        blank=True,
        allow_unicode=True,
        help_text="Auto-generated from English or Bengali name"
    )
    url = models.CharField(
        max_length=255,
        blank=True,
        help_text="Custom URL (if needed), otherwise generated from slug"
    )
    
    parent = TreeForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.CASCADE,
        help_text="Set parent for dropdown or submenu"
    )
    
    order = models.PositiveIntegerField(default=0, help_text="Order of menu item")
    is_active = models.BooleanField(default=True, help_text="Active/Inactive menu")

    class MPTTMeta:
        order_insertion_by = ['order']
        
    class Meta:
        ordering = ['order']
        verbose_name = "01 Menu Item"
        verbose_name_plural = "01 Menu Items"

    def __str__(self):
        return self.name_bn or self.name_en or f"Menu #{self.pk}"

    def get_absolute_url(self):
        return self.url or f"/{self.slug}/"

    def save(self, *args, **kwargs):
        if not self.slug:
            base = self.name_en if self.name_en else self.name_bn
            self.slug = slugify(base, allow_unicode=True)
        super().save(*args, **kwargs)



# /////////////////// Slider Model ///////////////////////
class Slider(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="slider",  # Unique related_name for institute
        verbose_name="Institute"
    )
    title = models.CharField(max_length=200)
    image = ImageCropField(upload_to='website/home-sliders/')  # Notice: ImageCropField
    cropping = ImageRatioField('image', '1920x1000')
    slide_number = models.PositiveIntegerField()

    class Meta:
        # app_label = 'pages'
        verbose_name = '02 Slider'
        verbose_name_plural = '02 Sliders'
        ordering = ['slide_number']

    def __str__(self):
        return self.title



class Notice(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="notice",  # Unique related_name for institute
        verbose_name="Institute"
    )
    TARGET_CHOICES = [
        ('all', 'Everyone'),
        ('students', 'Students'),
        ('teachers', 'Teachers'),
        ('staff', 'Staff'),
        ('parents', 'Parents'),
    ]

    DISPLAY_CHOICES = [
        ('all', 'All'), 
        ('dashboard', 'User Dashboard'),
        ('noticeboard', 'Notice Board Page Only'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True,allow_unicode=True)
    content = models.TextField(help_text="Full notice details")
    # attachment = models.FileField(
    #     upload_to='website/notice-attachments/', blank=True, null=True,
    #     help_text="PDF/DOC/Image/etc. to download"
    # )
    attachment = models.FileField(
        upload_to=safe_upload_to_notice_attachments,
        blank=True,
        null=True,
        help_text="PDF/DOC/Image/etc. to download"
    )
    target_audience = models.CharField(
        max_length=20, choices=TARGET_CHOICES, default='all',
        help_text="Who is this notice for?"
    )

    display_position = models.CharField(
        max_length=20, choices=DISPLAY_CHOICES, default='all',
        help_text="Where this notice will be shown"
    )
    is_marquee = models.BooleanField(default=False)

    is_important = models.BooleanField(
        default=False, help_text="Show this notice with priority/highlight"
    )

    pin_on_top = models.BooleanField(
        default=False, help_text="Always show this notice at the top"
    )

    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)  
    updated_at = models.DateTimeField(auto_now=True)
    expire_at = models.DateTimeField(blank=True, null=True, help_text="Optional auto-expiry")

    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        help_text="Who posted this notice?"
    )

    class Meta:
        ordering = ['-pin_on_top', '-is_important', '-published_at']
        verbose_name = "03 Notice"
        verbose_name_plural = "Notices"

    def __str__(self):
        return self.title 

    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        return self.is_published and (self.expire_at is None or self.expire_at > now)
    
    



# /////////////////// HistoryOfInstitute ///////////////////////
class HistoryOfInstitute(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="historyofinstitute",  # Unique related_name for institute
        verbose_name="Institute"
    )
    title = models.CharField(max_length=200)
    image = ImageCropField(upload_to='website/home-sliders/')  # Notice: ImageCropField
    cropping = ImageRatioField('image', '400x300')
    show_image = models.BooleanField(
        default=False, help_text="Are you want to show image with history?"
    )
    content = models.TextField(help_text="Full History of Institute.")
    # slide_number = models.PositiveIntegerField()

    class Meta:
        # app_label = 'pages'
        verbose_name = '05_History_Of_Institute'
        verbose_name_plural = '05 History of Institutes'
        # ordering = ['slide_number']

    def __str__(self):
        return self.title



# /////////////////// ManagingCommittee ///////////////////////
class ManagingCommittee(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="managingcommittee",  # Unique related_name for institute
        verbose_name="Institute"
    )
    title = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=200)
    image = ImageCropField(upload_to='website/home-sliders/')  # Notice: ImageCropField
    cropping = ImageRatioField('image', '520x600') 
    message = models.TextField(help_text="Enter Message", blank=True, null=True)
    show_image_on_sidebar = models.BooleanField(default=True)
    order = models.PositiveIntegerField()

    class Meta:
        # app_label = 'pages'
        verbose_name = '06_Managing_Committee'
        verbose_name_plural = '06 Managing Committee'
        ordering = ['order']

    def __str__(self):
        return self.title


# /////////////////// ContactInformation ///////////////////////
# class ContactInformation(models.Model):
#     institute = models.ForeignKey(
#         Institute,
#         on_delete=models.CASCADE,
#         related_name="contactinformation",  # Unique related_name for institute
#         verbose_name="Institute"
#     )
#     headline_for_institute_info = models.CharField(max_length=200, verbose_name="Headline for Institute Info", blank=True, null=True)
#     name = models.CharField(max_length=200, verbose_name="Name", blank=True, null=True)
#     address = models.CharField(max_length=200, verbose_name="Address")
#     mobile_numbers = models.CharField(max_length=200, verbose_name="Mobile Numbers", blank=True, null=True)
#     email = models.CharField(max_length=200, verbose_name="Email", blank=True, null=True)
#     website = models.URLField(max_length=200, verbose_name="Website", blank=True, null=True)
    
#     headline_for_info_center = models.CharField(max_length=200, verbose_name="Headline for Info Center", blank=True, null=True)
#     info_center_address = models.CharField(max_length=200, verbose_name="Address for Info Center")
#     info_center_mobile_numbers = models.CharField(max_length=200, verbose_name="Mobile Numbers for Info Center", blank=True, null=True)
#     info_center_email = models.CharField(max_length=200, verbose_name="Email for Info Center", blank=True, null=True) 
    
#     def __str__(self):
#         return f"{self.name or self.entity_type} - {self.address}"

#     class Meta:
#         verbose_name = "Contact Information"
#         verbose_name_plural = "Contact Information"


class StudentStatistics(models.Model):
    """Model to store the result of a student for a specific exam across subjects."""
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Institute",
        help_text="The institute associated with the Student Statistics."
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='studentstatistics',
        verbose_name="Year",
        help_text="The academic year of the Student Statistics."
    )
    class_instance = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='studentstatistics',
        verbose_name="Class",
        help_text="The class (e.g., Six) of the student."
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='studentstatistics',
        verbose_name="Group",
        help_text="The group (e.g., Science, Arts) of the student."
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='studentstatistics',
        verbose_name="Section",
        help_text="The section (e.g., A, B) of the student."
    )
    
    # Gender
    boys = models.PositiveIntegerField(default=0)
    girls = models.PositiveIntegerField(default=0)
    
    # Religion
    muslim = models.PositiveIntegerField(default=0)
    hindu = models.PositiveIntegerField(default=0)
    bouddha = models.PositiveIntegerField(default=0)
    christian = models.PositiveIntegerField(default=0)
    
    # Special Categories
    muktijoddha = models.PositiveIntegerField(default=0)
    shodosho_sontan = models.PositiveIntegerField(default=0)
    autistic = models.PositiveIntegerField(default=0)
    physical_disability = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['institute', 'year', 'class_instance', 'group', 'section',])
        ]
        unique_together = ('group', 'section')
        verbose_name = "08 Student Statistics"
        verbose_name_plural = "08 Student Statistics"

    def __str__(self) -> str:
        return f"Result {self.institute} - {self.class_instance} - {self.group} - {self.section}"




class CardItem(models.Model):
    
    title = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Card Title",
        help_text="e.g., আমাদের বিষয়ে, নোটিশ, একাডেমিক"
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        allow_unicode=True,
        help_text="Auto-generated from title, used for URLs"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Sorting order of cards"
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional: React icon component name (e.g., User, BookOpen)"
    )
    is_active = models.BooleanField(default=True)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="CardItem")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title

class Feature(models.Model):
    card = models.ForeignKey(
        CardItem,
        on_delete=models.CASCADE,
        related_name="features"
    )
    text = models.CharField(max_length=150, verbose_name="Feature Text")
    link =  models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        allow_unicode=True,
        verbose_name="Feature Link",
        # editable=False,
        help_text="Auto-generated from link, used for URLs"
    )
    
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional: React icon component name (e.g., User, BookOpen)"
    )
    is_active = models.BooleanField(default=True, help_text="Active/Inactive on website")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        
    def save(self, *args, **kwargs):
        if not self.link and self.text:  # generate from text if link empty
            base_slug = slugify(self.text, allow_unicode=True)
            slug = base_slug
            counter = 1
            while Feature.objects.filter(link=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.link = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.text} ({self.card.title})"


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// about us page ////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
from django.db import models
from image_cropping import ImageCropField, ImageRatioField

# -----------------------------
# Parent Model: InstituteDetail
# -----------------------------
class InstituteDetail(models.Model):
    """
    Parent model to consolidate all institute-related info:
    - Linked to Institute (1:1)
    - Stores summary stats (established year, students, teachers)
    - Introduction and History will be inlined in admin
    """
    institute = models.OneToOneField(
        'ims_01_institute.Institute',
        on_delete=models.CASCADE,
        related_name='details',
        # verbose_name="প্রতিষ্ঠানের নাম",
        help_text="Select the institute this detail belongs to"
    )
    
    heading_background_image = ImageCropField(upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True)
    # heading_background_image_cropped_url
    cropping = ImageRatioField('heading_background_image', '1280x520')
    show_image = models.BooleanField(default=True)

    # -------------------------
    # Summary Fields
    # -------------------------
    established_year = models.CharField(
        "Establishment Year",max_length=20,
        blank=True,
        null=True,
        help_text="Year of establishment, e.g., 1976"
    )
    total_students = models.CharField(
        "Total Students",
        max_length=20,
        blank=True,
        null=True,
        help_text='Number of students, e.g., "২৭০০+"'
    )
    total_teachers = models.CharField(
        "Total Teachers",
        max_length=20,
        blank=True,
        null=True,
        help_text='Number of teachers, e.g., "20+"'
    )

    # -------------------------
    # Metadata
    # -------------------------
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Institute Detail"
        verbose_name_plural = "Institute Details"
        ordering = ['-created_at']

    def __str__(self):
        return f"Details of {self.institute.name}"


# -----------------------------
# Introduction (1 per InstituteDetail)
# -----------------------------
class Introduction(models.Model):
    institute_detail = models.OneToOneField(
        InstituteDetail,
        on_delete=models.CASCADE,
        related_name='introduction',
        null=True, 
        blank=True, 
    )
    title = models.CharField(max_length=255)
    content = models.TextField(
        null=True, 
        blank=True, )
    image = ImageCropField(upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True)
    cropping = ImageRatioField('image', '660x520')
    show_image = models.BooleanField(default=True)

    def __str__(self):
        return f"Introduction - {self.institute_detail.institute.name}"


# -----------------------------
# History (1 per InstituteDetail)
# -----------------------------
class History(models.Model):
    institute_detail = models.OneToOneField(
        InstituteDetail,
        on_delete=models.CASCADE,
        related_name='history', 
        null=True,  # <-- allow null
        blank=True,  # <-- allow blank
    )
    title = models.CharField(max_length=255)
    content = models.TextField(
        null=True, 
        blank=True, )
    image = ImageCropField(upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True)
    cropping = ImageRatioField('image', '660x520')
    show_image = models.BooleanField(default=True)

    def __str__(self):
        return f"History - {self.institute_detail.institute.name}"


# -----------------------------
# Facility (Multiple per Institute)
# -----------------------------
class Facility(models.Model):
    institute = models.ForeignKey(
        InstituteDetail,
        on_delete=models.CASCADE,
        related_name="facilities"
    )
    icon = models.CharField(max_length=50)  # React icon name
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = ImageCropField(upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True)
    cropping = ImageRatioField('image', '660x520')
    show_image = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.institute.institute.name}"


# -----------------------------
# Achievement (Multiple per Institute)
# -----------------------------
class Achievement(models.Model):
    institute = models.ForeignKey(
        InstituteDetail,
        on_delete=models.CASCADE,
        related_name="achievements"
    )
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.institute.institute.name}"


#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// { Contact Page } ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
from django.db import models

class ContactPage(models.Model):
    """
    A contact page that belongs to an institute and can have multiple contact cards.
    """
    institute = models.ForeignKey(
        "ims_01_institute.Institute",
        on_delete=models.CASCADE,
        related_name="contactinformation",
        verbose_name="Institute"
    )
    title = models.CharField(max_length=255, blank=True, null=True, help_text="Page title (e.g., যোগাযোগ)")
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.title or 'Contact Page'} — {self.institute}"


class ContactCard(models.Model):
    """
    A single contact card to show on a contact page. Multiple cards per page allowed.
    """
    page = models.ForeignKey(
        ContactPage,
        on_delete=models.CASCADE,
        related_name="cards"
    )
    title = models.CharField(max_length=255, blank=True, null=True, help_text="Card title (e.g., যোগাযোগের ঠিকানা)")
    contact_person = models.ForeignKey(
        "ims_02_account.Teacher",
        on_delete=models.CASCADE,
        related_name="Contact_Person",blank=True, null=True
    )
    # name = models.CharField(max_length=255, help_text="Person name (e.g., সেলিনা সুলতানা)")
    # designation = models.CharField(max_length=255, blank=True, null=True, help_text="Designation (e.g., প্রধান শিক্ষক)")
    address = models.TextField(blank=True, null=True, help_text="Full address (multi-line)")
    # phone = models.CharField(max_length=50, blank=True, null=True, help_text="Phone number")
    # is_whatsapp = models.BooleanField(default=False, help_text="Is this a WhatsApp number?")
    # email = models.EmailField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text="Ordering for display (lower first)")
    is_active = models.BooleanField(default=True, help_text="Show this card on frontend")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.contact_person} ({self.title or 'card'})"
