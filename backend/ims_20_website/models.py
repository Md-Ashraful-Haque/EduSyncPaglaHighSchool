# models.py
from django.db import models
from django.utils.text import slugify
from django.db.models import Max
from mptt.models import MPTTModel, TreeForeignKey
from image_cropping import ImageCropField, ImageRatioField
from django.contrib.auth import get_user_model
from ims_01_institute.models import *

from django.utils import timezone
from backend.utils import (
    safe_upload_to_notice_attachments,
    safe_upload_to_website_committee,
    safe_upload_to_website_institute_approval,
)
from unidecode import unidecode

User = get_user_model()


from backend.utils import (
    safe_upload_to_institute_details_attachments,
    safe_upload_to_website_slides,
)


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// Menu Model ///////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////

class MenuItem(MPTTModel):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="menuitem",  # Unique related_name for institute
        verbose_name="Institute",
    )
    name_bn = models.CharField(
        max_length=100, verbose_name="মেনুর নাম (বাংলা)", help_text="বাংলা নাম লিখুন"
    )
    name_en = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Menu Name (English)",
        help_text="Optional: English version of the name",
    )
    slug = models.SlugField(
        max_length=150,
        unique=True,
        blank=True,
        allow_unicode=True,
        help_text="Auto-generated from English or Bengali name",
    )
    url = models.CharField(
        max_length=255,
        blank=True,
        help_text="Custom URL (if needed), otherwise generated from slug",
    )

    parent = TreeForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
        help_text="Set parent for dropdown or submenu",
    )

    order = models.PositiveIntegerField(default=0, help_text="Order of menu item")
    is_active = models.BooleanField(default=True, help_text="Active/Inactive menu")

    class MPTTMeta:
        order_insertion_by = ["order"]

    class Meta:
        ordering = ["order"]
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


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// Slider Model /////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////

class Slider(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="slider",  # Unique related_name for institute
        verbose_name="Institute",
    )
    title = models.CharField(max_length=200)
    image = ImageCropField(
        upload_to=safe_upload_to_website_slides, blank=True, null=True
    )  # Notice: ImageCropField
    image_cropped = ImageRatioField("image", "1900x785")
    slide_number = models.PositiveIntegerField()

    class Meta:
        # app_label = 'pages'
        verbose_name = "02 Slider"
        verbose_name_plural = "02 Sliders"
        ordering = ["slide_number"]

    def __str__(self):
        return self.title


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// Notice Section ///////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////

class Notice(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="notice",  # Unique related_name for institute
        verbose_name="Institute",
    )
    TARGET_CHOICES = [
        ("all", "Everyone"),
        ("students", "Students"),
        ("teachers", "Teachers"),
        ("staff", "Staff"),
        ("parents", "Parents"),
    ]

    DISPLAY_CHOICES = [
        ("all", "All"),
        ("dashboard", "User Dashboard"),
        ("noticeboard", "Notice Board Page Only"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, allow_unicode=True)
    content = models.TextField(help_text="Full notice details",blank=True, null=True) 
    attachment = models.FileField(
        upload_to=safe_upload_to_notice_attachments,
        blank=True,
        null=True,
        help_text="PDF/DOC/Image/etc. to download",
    )
    target_audience = models.CharField(
        max_length=20,
        choices=TARGET_CHOICES,
        default="all",
        help_text="Who is this notice for?",
    )

    display_position = models.CharField(
        max_length=20,
        choices=DISPLAY_CHOICES,
        default="all",
        help_text="Where this notice will be shown",
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
    expire_at = models.DateTimeField(
        blank=True, null=True, help_text="Optional auto-expiry"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Who posted this notice?",
    )

    class Meta:
        ordering = ["-pin_on_top", "-is_important", "-published_at"]
        verbose_name = "Notice"
        verbose_name_plural = "03 Notices"

    def __str__(self):
        return self.title

    def is_active(self):
        from django.utils import timezone

        now = timezone.now()
        return self.is_published and (self.expire_at is None or self.expire_at > now)


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# ////////////////// About Us Page|InstituteDetail //////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////


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
        "ims_01_institute.Institute",
        on_delete=models.CASCADE,
        related_name="details",
        # verbose_name="প্রতিষ্ঠানের নাম",
        help_text="Select the institute this detail belongs to",
    )

    heading_background_image = ImageCropField(
        upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True
    )
    # heading_background_image_cropped_url
    heading_background_image_cropped = ImageRatioField("heading_background_image", "1280x520")
    show_image = models.BooleanField(default=True)

    # -------------------------
    # Summary Fields
    # -------------------------
    established_year = models.CharField(
        "Establishment Year",
        max_length=20,
        blank=True,
        null=True,
        help_text="Year of establishment, e.g., 1976",
    )
    total_students = models.CharField(
        "Total Students",
        max_length=20,
        blank=True,
        null=True,
        help_text='Number of students, e.g., "২৭০০+"',
    )
    total_teachers = models.CharField(
        "Total Teachers",
        max_length=20,
        blank=True,
        null=True,
        help_text='Number of teachers, e.g., "20+"',
    )

    # -------------------------
    # Metadata
    # -------------------------
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Institute Detail"
        verbose_name_plural = "04 Institute Details"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Details of {self.institute.name}"


# -----------------------------
# Introduction (1 per InstituteDetail)
# -----------------------------
class Introduction(models.Model):
    institute_detail = models.OneToOneField(
        InstituteDetail,
        on_delete=models.CASCADE,
        related_name="introduction",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    content = models.TextField(
        null=True,
        blank=True,
    )
    image = ImageCropField(
        upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True
    )
    image_cropped = ImageRatioField("image", "500x400")
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
        related_name="history",
        null=True,  # <-- allow null
        blank=True,  # <-- allow blank
    )
    title = models.CharField(max_length=255)
    content = models.TextField(
        null=True,
        blank=True,
    )
    image = ImageCropField(
        upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True
    )
    image_cropped = ImageRatioField("image", "500x400")
    show_image = models.BooleanField(default=True)

    def __str__(self):
        return f"History - {self.institute_detail.institute.name}"


# -----------------------------
# Facility (Multiple per Institute)
# -----------------------------
class Facility(models.Model):
    institute = models.ForeignKey(
        InstituteDetail, on_delete=models.CASCADE, related_name="facilities"
    )
    icon = models.CharField(max_length=50, blank=True, null=True)  # React icon name
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = ImageCropField(
        upload_to=safe_upload_to_institute_details_attachments, blank=True, null=True
    )
    image_cropped = ImageRatioField("image", "100x100")
    show_image = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.institute.institute.name}"


# -----------------------------
# Achievement (Multiple per Institute)
# -----------------------------
class Achievement(models.Model):
    institute = models.ForeignKey(
        InstituteDetail, on_delete=models.CASCADE, related_name="achievements"
    )
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.institute.institute.name}"


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// Page Link Card ///////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////


class CardItem(models.Model):

    title = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Card Title",
        help_text="e.g., আমাদের বিষয়ে, নোটিশ, একাডেমিক",
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        allow_unicode=True,
        help_text="Auto-generated from title, used for URLs",
    )
    order = models.PositiveIntegerField(default=0, help_text="Sorting order of cards")
    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional: React icon component name (e.g., User, BookOpen)",
    )
    is_active = models.BooleanField(default=True)
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="CardItem"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page Card Link"
        verbose_name_plural = "05 Page Card Link"
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class Feature(models.Model):
    card = models.ForeignKey(
        CardItem, on_delete=models.CASCADE, related_name="features"
    )
    text = models.CharField(max_length=150, verbose_name="Feature Text")
    link = models.SlugField(
        max_length=120, 
        blank=True,
        allow_unicode=True,
        verbose_name="Feature Link",
        # editable=False,
        help_text="Auto-generated from link, used for URLs",
    )

    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional: React icon component name (e.g., User, BookOpen)",
    )
    is_active = models.BooleanField(
        default=True, help_text="Active/Inactive on website"
    )
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
# //////////////////////////////// ManagingCommittee ////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////

class ManagingCommittee(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="managing_committees",
        verbose_name="Institute",
    ) 
    description = models.TextField(
        blank=True,
        null=True,
        help_text="কমিটির সংক্ষিপ্ত বিবরণ / উদ্দেশ্য",
    )
    total_members = models.PositiveIntegerField(
        verbose_name="কমিটিতে সদস্য সংখ্যা",blank=True, null=True
    )
    formation_date = models.DateField(verbose_name="কমিটি গঠনের তারিখ",blank=True, null=True)
    expiry_date = models.DateField(verbose_name="কমিটির মেয়াদ শেষ হওয়ার তারিখ",blank=True, null=True)
    approved_by = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="অনুমোদনকারী কর্তৃপক্ষ",
        help_text="যেমন: শিক্ষা বোর্ড, শিক্ষা মন্ত্রণালয়",
    )
    active = models.BooleanField(
        default=True,
        verbose_name="বর্তমান কমিটি?",
    )
    show_in_website = models.BooleanField(
        default=True,
        verbose_name="ওয়েবসাইটে দেখতে চান?",
    )
    pdf_document = models.FileField(
        upload_to=safe_upload_to_website_committee, blank=True, null=True, 
        verbose_name="কমিটি অনুমোদন নথি",
    )
    image_document = ImageCropField(
        upload_to=safe_upload_to_website_committee, blank=True, null=True,
    )
    image_document_cropped = ImageRatioField("image_document", "800x1120") 
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="অতিরিক্ত মন্তব্য",
    )

    class Meta:
        verbose_name = "06_Managing_Committee"
        verbose_name_plural = "06 Managing Committees"
        ordering = ["-formation_date"]

    def __str__(self):
        formation_year = self.formation_date.year if self.formation_date else ""
        expiry_year = self.expiry_date.year if self.expiry_date else ""
        return f"{self.institute.name} ({formation_year} – {expiry_year})"


class ManagingCommitteeMember(models.Model):
    committee = models.ForeignKey(
        ManagingCommittee,
        on_delete=models.CASCADE,
        related_name="members",
        verbose_name="Managing Committee",
    )
    title = models.CharField(max_length=200, verbose_name="শিরোনাম/পদবি (যেমন: সভাপতি)")
    name = models.CharField(max_length=200, verbose_name="নাম")
    designation = models.CharField(max_length=200, verbose_name="দায়িত্ব (যেমন: সদস্য)") 
    image = ImageCropField(
        upload_to=safe_upload_to_website_committee, blank=True, null=True, 
        verbose_name="ছবি",
    )
    image_cropped = ImageRatioField("image", "300x370")
    message = models.TextField(
        help_text="সংক্ষিপ্ত বার্তা বা বক্তব্য",
        blank=True,
        null=True,
    )
    mobile = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="মোবাইল নম্বর",
    )
    email = models.EmailField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="ইমেইল",
    )
    address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="ঠিকানা",
    )
    social_facebook = models.URLField(blank=True, null=True, verbose_name="Facebook")
    social_linkedin = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    social_twitter = models.URLField(blank=True, null=True, verbose_name="Twitter")
    show_image_on_sidebar = models.BooleanField(default=True)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        verbose_name = "Committee Member"
        verbose_name_plural = "Committee Members"

    def __str__(self):
        return f"{self.name} ({self.designation})"

# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// StudentStatistics ////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
class StudentStatistics(models.Model):
    """Model to store the result of a student for a specific exam across subjects."""

    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Institute",
        help_text="The institute associated with the Student Statistics.",
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Year",
        help_text="The academic year of the Student Statistics.",
    )
    class_instance = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Class",
        help_text="The class (e.g., Six) of the student.",
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Group",
        help_text="The group (e.g., Science, Arts) of the student.",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="studentstatistics",
        verbose_name="Section",
        help_text="The section (e.g., A, B) of the student.",
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
            models.Index(
                fields=[
                    "institute",
                    "year",
                    "class_instance",
                    "group",
                    "section",
                ]
            )
        ]
        unique_together = ("group", "section")
        
        verbose_name = "08 Student Statistics"
        verbose_name_plural = "08 Student Statistics"

    def __str__(self) -> str:
        return f"Result {self.institute} - {self.class_instance} - {self.group} - {self.section}"


# ///////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// Contact Page /////////////////////////////////
# ///////////////////////////////////////////////////////////////////////////////
from django.db import models


class ContactPage(models.Model):
    """
    A contact page that belongs to an institute and can have multiple contact cards.
    """

    institute = models.ForeignKey(
        "ims_01_institute.Institute",
        on_delete=models.CASCADE,
        related_name="contactinformation",
        verbose_name="Institute",
    )
    title = models.CharField(
        max_length=255, blank=True, null=True, help_text="Page title (e.g., যোগাযোগ)"
    )
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
        ContactPage, on_delete=models.CASCADE, related_name="cards"
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Card title (e.g., যোগাযোগের ঠিকানা)",
    )
    contact_person = models.ForeignKey(
        "ims_02_account.Teacher",
        on_delete=models.CASCADE,
        related_name="Contact_Person",
        blank=True,
        null=True,
    )

    address = models.TextField(
        blank=True, null=True, help_text="Full address (multi-line)"
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Ordering for display (lower first)"
    )
    is_active = models.BooleanField(
        default=True, help_text="Show this card on frontend"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.contact_person} ({self.title or 'card'})"

# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// Institute Approval Docs ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////


class InstituteApprovalInfo(models.Model):
    institute = models.ForeignKey(
        "ims_01_institute.Institute", on_delete=models.CASCADE, related_name="documents"
    )

    # Issue date
    issue_date = models.DateField(
        blank=True, null=True, verbose_name="Issue Date (English)"
    )
    # Issuing authority
    authority_bn = models.CharField(
        max_length=255, verbose_name="প্রদানকারী কর্তৃপক্ষ (বাংলা)"
    )
    authority_en = models.CharField(max_length=255, verbose_name="Authority (English)")
    image = ImageCropField(
        upload_to=safe_upload_to_website_institute_approval,
        blank=True,
        null=True,
    )
    image_cropped = ImageRatioField("image", "800x1120")

    # Auto timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Institute Document"
        verbose_name_plural = "Institute Approval Info"
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.institute.name} - {self.issue_date}"
