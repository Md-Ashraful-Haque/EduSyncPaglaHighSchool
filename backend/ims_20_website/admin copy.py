# from django.contrib import admin
# from django.apps import apps
# # Register your models here.
# # Dynamically register all other models
# app_models = apps.get_app_config('ims_20_website').get_models()

# for model in app_models:
#       try:
#           admin.site.register(model)
#       except admin.sites.AlreadyRegistered:
#           pass

# from django.contrib import admin
# from .models import MenuItem

# @admin.register(MenuItem)
# class MenuItemAdmin(admin.ModelAdmin):
#     list_display = ('indented_name', 'slug', 'parent', 'order', 'is_active')
#     list_filter = ('parent', 'is_active')
#     search_fields = ('name_bn', 'name_en', 'slug')
#     ordering = ('order',)

#     def indented_name(self, obj):
#         prefix = "— " * self._get_depth(obj)
#         return f"{prefix}{obj.name_bn}"

#     indented_name.short_description = "মেনুর নাম (হায়ারারকি সহ)"

#     def _get_depth(self, obj):
#         depth = 0
#         while obj.parent:
#             depth += 1
#             obj = obj.parent
#         return depth
# from django.contrib import admin
# from .models import MenuItem

# @admin.register(MenuItem)
# class MenuItemAdmin(admin.ModelAdmin):
#     list_display = ('indented_name', 'slug', 'parent', 'order', 'is_active')
#     list_filter = ('parent', 'is_active')
#     search_fields = ('name_bn', 'name_en', 'slug')
#     ordering = ('order',)

#     def indented_name(self, obj):
#         prefix = "— " * self._get_depth(obj)
#         return f"{prefix}{obj.name_bn}"

#     indented_name.short_description = "মেনুর নাম (হায়ারারকি সহ)"

#     def _get_depth(self, obj):
#         depth = 0
#         while obj.parent:
#             depth += 1
#             obj = obj.parent
#         return depth

from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from .models import MenuItem

admin.site.register(MenuItem, DraggableMPTTAdmin)