import inspect, re
import os
from unidecode import unidecode
from django.utils.crypto import get_random_string


def varname(p):
    for line in inspect.getframeinfo(inspect.currentframe().f_back)[3]:
        m = re.search(r"\bvarname\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)", line)
        if m:
            return m.group(1)


def debug(var1=None, var2=None, var3=None):
    if var1:
        print(
            f"=====================//// {varname(var1)} Start////======================\n\n"
        )
        print(f"\t\t: {var1}")
        print(f"=====================//// {var1} End////======================\n\n")
    if var2:
        print(f"=====================//// {var2} Start////======================\n\n")
        print(f"\t\t: {var2}")
        print(f"=====================//// {var2} End////======================\n\n")
    if var3:
        print(f"=====================//// {var3} Start////======================\n\n")
        print(f"\t\t: {var3}")
        print(f"=====================//// {var3} End////======================\n\n")


from rest_framework import serializers
from easy_thumbnails.files import get_thumbnailer
import urllib


class MultiCroppedImageMixin(serializers.ModelSerializer):
    """
    Mixin for multiple image fields:
    - <field>_url → original image
    - <field>_cropped_url → user-selected crop, resized proportionally

    Requirements:
    - Define `Meta.image_fields = ["picture", "signature", ...]`.
    - Each image field should have a corresponding <image>_cropped ImageRatioField.
    - Optionally define `Meta.crop_sizes = {"picture": (300, 380), "signature": (1900, 785)}`.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        image_fields = getattr(self.Meta, "image_fields", None)
        if not image_fields or not isinstance(image_fields, (list, tuple)):
            raise ValueError("You must define Meta.image_fields as a list of field names")

        self._image_fields = image_fields
        self._crop_sizes = getattr(self.Meta, "crop_sizes", {})  # NEW

        # Add SerializerMethodFields dynamically
        for field in image_fields:
            self.fields[f"{field}_url"] = serializers.SerializerMethodField()
            self.fields[f"{field}_cropped_url"] = serializers.SerializerMethodField()

    # -----------------------------
    # Helper: build absolute URL
    # -----------------------------
    def _absolute_url(self, relative_url):
        if not relative_url:
            return None
        decoded_url = urllib.parse.unquote(relative_url)
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(decoded_url)
        return decoded_url

    # -----------------------------
    # Original image
    # -----------------------------
    def _get_image_url(self, obj, field):
        try:
            image = getattr(obj, field, None)
            if image:
                return self._absolute_url(image.url)
        except Exception as e:
            print(f"[ERROR] _get_image_url({field}) failed:", e)
        return None

    # -----------------------------
    # Cropped & resized image
    # -----------------------------
    def _get_image_cropped_url(self, obj, field, target_width=None):
        try:
            image = getattr(obj, field, None)
            if not image:
                # print(f"[DEBUG] No image found for {field}")
                return None

            crop_field_name = f"{field}_cropped"
            box_str = getattr(obj, crop_field_name, None)

            # Get preferred size from Meta.crop_sizes or fallback
            size = self._crop_sizes.get(field, (300, 380))

            opts = {"crop": True, "size": size, "upscale": True}

            # Parse box manually: "x1,y1,x2,y2"
            if box_str and isinstance(box_str, str) and "," in box_str:
                try:
                    box = tuple(int(float(coord)) for coord in box_str.split(","))
                    if len(box) == 4:
                        opts["box"] = box
                        # print(f"[DEBUG] Cropping {field} with box={box} and size={size}")
                except Exception as e:
                    print(f"[DEBUG] Invalid box format for {field}: {box_str}, error: {e}")
            else:
                opts["crop"] = False
                # print(f"[DEBUG] No valid crop for {field}, resizing proportionally to {size}")

            url = get_thumbnailer(image).get_thumbnail(opts).url
            return self._absolute_url(url)

        except Exception as e:
            print(f"[ERROR] _get_image_cropped_url({field}) failed:", e)
            return None

    # -----------------------------
    # Dynamic binding for SerializerMethodField
    # -----------------------------
    def __getattr__(self, name):
        for field in getattr(self, "_image_fields", []):
            if name == f"get_{field}_url":
                return lambda obj: self._get_image_url(obj, field)
            if name == f"get_{field}_cropped_url":
                return lambda obj: self._get_image_cropped_url(obj, field)
        return super().__getattr__(name)




def _make_safe_name(filename):
    """Helper to sanitize filenames"""
    name, ext = os.path.splitext(filename)
    name_ascii = unidecode(name)
    name_ascii = "".join(c if c.isalnum() else "_" for c in name_ascii)
    random_str = get_random_string(6)
    return f"{name_ascii}_{random_str}{ext}"


def safe_upload_to_teacher_picture(instance, filename):
    return os.path.join("website/teachers", _make_safe_name(filename))



def safe_upload_to_student_pictures(instance, filename):
    return os.path.join("website/student_images", _make_safe_name(filename))


def safe_upload_to_teacher_signature(instance, filename):
    return os.path.join("website/teachers-signature", _make_safe_name(filename))

# ////////////////////////////////// Teacher Certificate image //////////////////////
def safe_upload_to_website_teacher_certificate(instance, filename):
    return os.path.join("website/teachers-certificate", _make_safe_name(filename))

def safe_upload_to_notice_attachments(instance, filename):
    return os.path.join("website/notice-attachments", _make_safe_name(filename))


def safe_upload_to_institute_details_attachments(instance, filename):
    return os.path.join("website/institute_details/attachments", _make_safe_name(filename))

def safe_upload_to_website_slides(instance, filename):
    return os.path.join("website/home-sliders", _make_safe_name(filename))

def safe_upload_to_website_committee(instance, filename):
    return os.path.join("website/committee-image", _make_safe_name(filename))

def safe_upload_to_website_institute_approval(instance, filename):
    return os.path.join("website/institute-approval-image", _make_safe_name(filename))


