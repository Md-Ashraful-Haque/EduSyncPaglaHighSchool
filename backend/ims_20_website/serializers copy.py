from rest_framework import serializers
from ims_01_institute.models import Institute
from .models import (
    MenuItem,
    Slider,
    Notice, 
    ManagingCommittee,
)
from .models import StudentStatistics
from easy_thumbnails.files import get_thumbnailer
from backend.utils import MultiCroppedImageMixin

class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name_bn",
            "name_en",
            "slug",
            "url",
            "order",
            "is_active",
            "children",
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by("order")
        return MenuItemSerializer(children, many=True).data


class SlideItemSerializer(MultiCroppedImageMixin):
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        image_fields = ["image", ] # it will return picture_url and picture_cropped_url
        crop_sizes = {
            "image": (1900, 785),   # widescreen ratio for full-width slider
        }
        fields = ["id", "title", "slide_number" ]

    # def get_image_url(self, obj):
    #     request = self.context.get("request")
    #     if obj.image:
    #         # ✅ This uses the manually selected cropping from admin
    #         thumb = get_thumbnailer(obj.image)["slider_cropped"]
    #         return request.build_absolute_uri(thumb.url)
    #     return None


# from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "attachment",
            "target_audience",
            "display_position",
            "is_marquee",
            "is_important",
            "pin_on_top",
            "is_published",
            "published_at",
            "expire_at",
            "created_by",
            "is_active",
        ]

    def get_is_active(self, obj):
        return obj.is_active()  # this should be defined as a method in your model




class ManagingCommitteeSerializer(MultiCroppedImageMixin): 

    class Meta:
        model = ManagingCommittee
        image_fields = ["image", ]
        crop_sizes = {
            "image": (300, 370),   # widescreen ratio  
        }
        fields = [
            "id",
            "title",
            "name",
            "designation",
            "message", 
            "institute",
        ] 


# /////////////////////////////////////////////////
class StudentStatisticsSerializer(serializers.ModelSerializer):
    # institute_name_ban = serializers.CharField(source='institute.name', read_only=True)
    # institute_name_eng = serializers.CharField(source='institute.name_in_english', read_only=True)
    class_name = serializers.CharField(
        source="class_instance.class_name.name_bengali", read_only=True
    )
    shift_name = serializers.CharField(source="class_instance.shift", read_only=True)
    section_name = serializers.CharField(
        source="section.section_name.name_bengali", read_only=True
    )
    group_name = serializers.CharField(
        source="group.group_name.name_bengali", read_only=True
    )

    class Meta:
        model = StudentStatistics
        fields = [
            "id",
            # 'institute_name_ban',
            # 'institute_name_eng',
            "class_name",
            "shift_name",
            "section_name",
            "group_name",
            "boys",
            "girls",
            "muslim",
            "hindu",
            "bouddha",
            "christian",
            "muktijoddha",
            "shodosho_sontan",
            "autistic",
            "physical_disability",
        ]


from rest_framework import serializers
from .models import CardItem, Feature


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ["id", "text", "link", "icon", "order", "is_active"]


class CardItemSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)

    class Meta:
        model = CardItem
        fields = ["id", "title", "slug", "order", "icon", "is_active", "features"]


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { About Us Page } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////

# ims_01_institute_detail/api/serializers.py
from django.conf import settings
from rest_framework import serializers
from easy_thumbnails.files import get_thumbnailer

import urllib.parse
from .models import InstituteDetail, Introduction, History, Facility, Achievement


class CroppedImageMixin(serializers.ModelSerializer):
    """
    Adds two read-only fields:
      - image_url: absolute URL to original image (or None)
      - image_cropped_url: absolute URL to cropped thumbnail (or None)

    Fixes filename issues with commas in crop boxes by decoding %2C.
    """

    image_url = serializers.SerializerMethodField(read_only=True)
    image_cropped_url = serializers.SerializerMethodField(read_only=True)

    def _absolute_url(self, relative_url):
        """
        Return an absolute URL that matches the actual file on disk.
        Decodes %2C → ',' so Apache/cPanel can serve the file.
        """
        if not relative_url:
            return None

        # Decode %2C (and any other encoded chars) to match the file on disk
        decoded_url = urllib.parse.unquote(relative_url)

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(decoded_url)
        return decoded_url

    def get_image_url(self, obj):
        try:
            if obj.image:
                return self._absolute_url(obj.image.url)
        except Exception:
            pass
        return None

    def get_image_cropped_url(self, obj):
        try:
            if not obj.image:
                return None

            # Get the cropping box from the model
            box = getattr(obj, "cropping", None)

            opts = {"size": (660, 520), "crop": True}
            if box:
                opts["box"] = box

            # Generate the thumbnail URL
            url = get_thumbnailer(obj.image).get_thumbnail(opts).url

            # Decode URL so Apache can find the file
            return self._absolute_url(url)

        except Exception:
            return None


# ---------- Child serializers ----------


class IntroductionSerializer(CroppedImageMixin):
    class Meta:
        model = Introduction
        fields = [
            "id",
            "title",
            "content",
            "show_image",
            # image fields
            "image_url",
            "image_cropped_url",
        ]
        read_only_fields = (
            fields  # read via InstituteDetail; write via its own endpoint
        )


class HistorySerializer(CroppedImageMixin):
    class Meta:
        model = History
        fields = [
            "id",
            "title",
            "content",
            "show_image",
            "image_url",
            "image_cropped_url",
        ]
        read_only_fields = fields


class FacilitySerializer(CroppedImageMixin):
    institute_detail = serializers.PrimaryKeyRelatedField(
        source="institute",  # model field is `institute` pointing to InstituteDetail
        queryset=InstituteDetail.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Facility
        fields = [
            "id",
            "title",
            "description",
            "icon",
            "show_image",
            "image_url",
            "image_cropped_url",
            "institute_detail",  # write-only alias to avoid confusion
        ]


class AchievementSerializer(serializers.ModelSerializer):
    institute_detail = serializers.PrimaryKeyRelatedField(
        source="institute", queryset=InstituteDetail.objects.all(), write_only=True
    )

    class Meta:
        model = Achievement
        fields = ["id", "title", "institute_detail"]


# ---------- Parent / aggregated ----------


class InstituteDetailListSerializer(serializers.ModelSerializer):
    institute_id = serializers.IntegerField(source="institute.id", read_only=True)
    institute_name = serializers.CharField(source="institute.name", read_only=True)

    class Meta:
        model = InstituteDetail
        fields = [
            "id",
            "institute_id",
            "institute_name",
            "established_year",
            "total_students",
            "total_teachers",
            "created_at",
            "updated_at",
        ]


class InstituteDetailPublicSerializer(serializers.ModelSerializer):
    """
    Full public payload with nested read-only sections for React.
    """

    institute_id = serializers.IntegerField(source="institute.id", read_only=True)
    institute_name = serializers.CharField(source="institute.name", read_only=True)

    # --- New fields for heading background ---
    heading_background_image_url = serializers.SerializerMethodField()
    heading_background_image_cropped_url = serializers.SerializerMethodField()

    introduction = IntroductionSerializer(read_only=True)
    history = HistorySerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)

    def _absolute_url(self, relative_url):
        request = self.context.get("request")
        if request and relative_url:
            # Decode %2C (and any other encoded chars) to match the file on disk
            decoded_url = urllib.parse.unquote(relative_url)
            return request.build_absolute_uri(decoded_url) 
        return relative_url

    def get_heading_background_image_url(self, obj):
        try:
            # print("DEBUG heading_background_image:", obj.heading_background_image)
            if obj.heading_background_image:
                return self._absolute_url(obj.heading_background_image.url)
        except Exception:
            pass
        return None

    def get_heading_background_image_cropped_url(self, obj):
        try:
            if not obj.heading_background_image:
                return None
            box = getattr(obj, "cropping", None)
            opts = {"size": (1400, 600), "crop": True}
            if box:
                opts["box"] = box
            url = get_thumbnailer(obj.heading_background_image).get_thumbnail(opts).url
            return self._absolute_url(url)
        except Exception:
            return None

    class Meta:
        model = InstituteDetail
        fields = [
            "id",
            "institute_id",
            "institute_name",
            "established_year",
            "total_students",
            "total_teachers",
            "introduction",
            "history",
            "facilities",
            "achievements",
            "created_at",
            "updated_at",
            # heading background
            "heading_background_image_url",
            "heading_background_image_cropped_url",
            "show_image",
        ]


# ---------- Direct serializers for editing Intro/History ----------


class IntroductionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Introduction
        fields = [
            "id",
            "institute_detail",
            "title",
            "content",
            "image",
            "cropping",
            "show_image",
        ]


class HistoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = [
            "id",
            "institute_detail",
            "title",
            "content",
            "image",
            "cropping",
            "show_image",
        ]


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// {Contact Card Serializer } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////

from rest_framework import serializers
from .models import ContactPage, ContactCard, Institute

from ims_02_account.models import Teacher
from ims_02_account.serializers import TeacherCardSerializer


class ContactCardSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    contact_person = TeacherCardSerializer(read_only=True)  # nested serializer
    contact_person_id = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(),
        source="contact_person",
        write_only=True,
        required=False,
    )

    class Meta:
        model = ContactCard
        fields = (
            "id",
            "title",
            "contact_person",  # full serialized teacher
            "contact_person_id",  # writable ID
            "address",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")



class ContactPageSerializer(serializers.ModelSerializer):
    cards = ContactCardSerializer(many=True, required=False)
    # print("///////////////")
    institute = serializers.SlugRelatedField(
        slug_field="institute_code", queryset=Institute.objects.all()
    )  # 🔹 now shows institute_code instead of id

    class Meta:
        model = ContactPage
        fields = (
            "id",
            "title",
            "slug",
            "institute",
            "cards",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def create(self, validated_data):
        cards_data = validated_data.pop("cards", [])
        page = ContactPage.objects.create(**validated_data)
        for cdata in cards_data:
            ContactCard.objects.create(page=page, **cdata)
        return page

    def update(self, instance, validated_data):
        cards_data = validated_data.pop("cards", None)

        # update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update nested cards
        if cards_data is not None:
            incoming_ids = [c.get("id") for c in cards_data if c.get("id")]
            instance.cards.exclude(
                id__in=[i for i in incoming_ids if i is not None]
            ).delete()

            for card_dict in cards_data:
                card_id = card_dict.get("id")
                if card_id:
                    try:
                        card_obj = instance.cards.get(id=card_id)
                        for k, v in card_dict.items():
                            if k != "id":
                                setattr(card_obj, k, v)
                        card_obj.save()
                    except ContactCard.DoesNotExist:
                        card_dict.pop("id", None)
                        ContactCard.objects.create(page=instance, **card_dict)
                else:
                    ContactCard.objects.create(page=instance, **card_dict)

        return instance
