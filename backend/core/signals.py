# import os
# from django.db.models.signals import post_delete, pre_save
# from django.dispatch import receiver
# from django.db.models import ImageField
# from easy_thumbnails.files import get_thumbnailer


# def cleanup_file_and_thumbnails(image_field):
#     """Delete original file + all easy-thumbnails for a given image field."""
#     if image_field and getattr(image_field, "name", None):
#         # Delete thumbnails
#         try:
#             thumbnailer = get_thumbnailer(image_field)
#             thumbnailer.delete_thumbnails()
#         except Exception:
#             pass

#         # Delete original file from storage
#         try:
#             storage = image_field.storage
#             if storage.exists(image_field.name):
#                 storage.delete(image_field.name)
#         except Exception:
#             pass


# def get_image_fields(instance):
#     """Return all ImageField fields of a model instance."""
#     return [
#         field.name
#         for field in instance._meta.get_fields()
#         if isinstance(field, ImageField)
#     ]


# @receiver(post_delete)
# def delete_files_on_delete(sender, instance, **kwargs):
#     """Delete files + thumbnails when model instance is deleted."""
#     for field_name in get_image_fields(instance):
#         fieldfile = getattr(instance, field_name, None)
#         cleanup_file_and_thumbnails(fieldfile)


# @receiver(pre_save)
# def delete_files_on_change(sender, instance, **kwargs):
#     """Delete old files + thumbnails when image fields are replaced or cleared."""
#     if not instance.pk:
#         return  # new object, nothing to compare

#     try:
#         old_instance = sender.objects.get(pk=instance.pk)
#     except sender.DoesNotExist:
#         return

#     for field_name in get_image_fields(instance):
#         old_file = getattr(old_instance, field_name, None)
#         new_file = getattr(instance, field_name, None)

#         if old_file and old_file != new_file:
#             cleanup_file_and_thumbnails(old_file)


import os
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.db.models import FileField, ImageField
from easy_thumbnails.files import get_thumbnailer


def cleanup_file_and_thumbnails(file_field):
    """Delete original file + thumbnails (if image)."""
    if file_field and getattr(file_field, "name", None):
        # If it's an ImageField -> delete thumbnails
        if isinstance(file_field.field, ImageField):
            try:
                thumbnailer = get_thumbnailer(file_field)
                thumbnailer.delete_thumbnails()
            except Exception:
                pass

        # Delete original file
        try:
            storage = file_field.storage
            if storage.exists(file_field.name):
                storage.delete(file_field.name)
        except Exception:
            pass


def get_file_fields(instance):
    """Return all FileField or ImageField fields of a model instance."""
    return [
        field.name
        for field in instance._meta.get_fields()
        if isinstance(field, (FileField, ImageField))
    ]


@receiver(post_delete)
def delete_files_on_delete(sender, instance, **kwargs):
    """Delete files + thumbnails when model instance is deleted."""
    for field_name in get_file_fields(instance):
        fieldfile = getattr(instance, field_name, None)
        cleanup_file_and_thumbnails(fieldfile)


@receiver(pre_save)
def delete_files_on_change(sender, instance, **kwargs):
    """Delete old files + thumbnails when file fields are replaced or cleared."""
    if not instance.pk:
        return  # new object, nothing to compare

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field_name in get_file_fields(instance):
        old_file = getattr(old_instance, field_name, None)
        new_file = getattr(instance, field_name, None)

        if old_file and old_file != new_file:
            cleanup_file_and_thumbnails(old_file)
