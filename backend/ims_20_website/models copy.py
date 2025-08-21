# # models.py

# from django.db import models

# class MenuItem(models.Model):
#     name = models.CharField(max_length=100)
#     slug = models.SlugField(unique=True)
#     url = models.CharField(max_length=255, blank=True, help_text="Custom URL or leave blank to auto-generate")
#     parent = models.ForeignKey(
#         'self',
#         null=True,
#         blank=True,
#         related_name='children',
#         on_delete=models.CASCADE
#     )
#     order = models.PositiveIntegerField(default=0)
#     is_active = models.BooleanField(default=True)

#     class Meta:
#         ordering = ['order']

#     def __str__(self):
#         return self.name

#     def get_absolute_url(self):
#         return self.url or f"/{self.slug}/"
from django.db import models
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey

class MenuItem(MPTTModell):
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
    # parent = models.ForeignKey(
    #     'self',
    #     null=True,
    #     blank=True,
    #     related_name='children',
    #     on_delete=models.CASCADE,
    #     help_text="Set parent for dropdown or submenu"
    # )
    
    parent = TreeForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.CASCADE,
        help_text="Set parent for dropdown or submenu."
    )
    
    order = models.PositiveIntegerField(default=0, help_text="Order of menu item")
    is_active = models.BooleanField(default=True, help_text="Active/Inactive menu")
    # is_activep = models.BooleanField(default=True, help_text="Active/Inactive menu")

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
