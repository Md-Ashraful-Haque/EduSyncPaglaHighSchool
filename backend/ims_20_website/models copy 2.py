# # models.py


from django.db import models
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey
from image_cropping import ImageCropField, ImageRatioField
from django.contrib.auth import get_user_model



class MenuItem(MPTTModel):
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
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"

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
    title = models.CharField(max_length=200)
    image = ImageCropField(upload_to='website/home-sliders/')  # Notice: ImageCropField
    cropping = ImageRatioField('image', '1920x1000')
    slide_number = models.PositiveIntegerField()

    class Meta:
        # app_label = 'pages'
        verbose_name = '01 Slider'
        verbose_name_plural = '01 Sliders'
        ordering = ['slide_number']

    def __str__(self):
        return self.title


# from django.db import models
# from django.utils.text import slugify


User = get_user_model()

# class Notice(models.Model): 

#     title = models.CharField(max_length=255)
#     slug = models.SlugField(max_length=255, unique=True, blank=True)
#     content = models.TextField(help_text="Full notice details")
#     attachment = models.FileField(
#         upload_to='website/notice-attachments/', blank=True, null=True,
#         help_text="PDF/DOC/Image/etc. to download"
#     )

#     is_important = models.BooleanField(
#         default=False, help_text="Show this notice with priority/highlight"
#     )

#     pin_on_top = models.BooleanField(
#         default=False, help_text="Always show this notice at the top"
#     )

#     is_published = models.BooleanField(default=True)
#     published_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     expire_at = models.DateTimeField(blank=True, null=True, help_text="Optional auto-expiry")

#     created_by = models.ForeignKey(
#         User, on_delete=models.SET_NULL, null=True, blank=True,
#         help_text="Who posted this notice?"
#     )

#     class Meta:
#         ordering = ['-pin_on_top', '-is_important', '-published_at']
#         verbose_name = "Notice"
#         verbose_name_plural = "Notices"

#     def __str__(self):
#         return self.title

#     def save(self, *args, **kwargs):
#         if not self.slug:
#             self.slug = slugify(self.title)
#         super().save(*args, **kwargs)

#     def is_active(self):
#         from django.utils import timezone
#         now = timezone.now()
#         return self.is_published and (self.expire_at is None or self.expire_at > now)


class Notice(models.Model):
    TARGET_CHOICES = [
        ('all', 'Everyone'),
        ('students', 'Students'),
        ('teachers', 'Teachers'),
        ('parents', 'Parents'),
    ]

    DISPLAY_CHOICES = [
        ('all', 'Homepage Banner/Marquee'),
        ('homepage', 'Homepage Banner/Marquee'),
        ('dashboard', 'User Dashboard'),
        ('noticeboard', 'Notice Board Page Only'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField(help_text="Full notice details")
    attachment = models.FileField(
        upload_to='website/notice-attachments/', blank=True, null=True,
        help_text="PDF/DOC/Image/etc. to download"
    )
    
    target_audience = models.CharField(
        max_length=20, choices=TARGET_CHOICES, default='all',
        help_text="Who is this notice for?"
    )

    display_position = models.CharField(
        max_length=20, choices=DISPLAY_CHOICES, default='noticeboard',
        help_text="Where this notice will be shown"
    )

    is_important = models.BooleanField(
        default=False, help_text="Show this notice with priority/highlight"
    )

    pin_on_top = models.BooleanField(
        default=False, help_text="Always show this notice at the top"
    )

    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expire_at = models.DateTimeField(blank=True, null=True, help_text="Optional auto-expiry")

    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        help_text="Who posted this notice?"
    )

    class Meta:
        ordering = ['-pin_on_top', '-is_important', '-published_at']
        verbose_name = "Notice"
        verbose_name_plural = "Notices"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        return self.is_published and (self.expire_at is None or self.expire_at > now)