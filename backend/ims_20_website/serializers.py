from rest_framework import serializers
from ims_01_institute.models import Institute
from ims_01_institute.serializers import InstituteSerializer
from .models import (
    MenuItem,
    Slider,
    Notice,
    ManagingCommittee,
    InstituteApprovalInfo,
)
from .models import StudentStatistics
from easy_thumbnails.files import get_thumbnailer
from backend.utils import MultiCroppedImageMixin
from rest_framework import serializers
from .models import ContactPage, ContactCard, Institute
from .models import Notice
from ims_02_account.models import Teacher
from ims_02_account.serializers import TeacherCardSerializer
from rest_framework import serializers
from .models import CardItem, Feature
from .models import ManagingCommitteeMember
# ims_01_institute_detail/api/serializers.py
from django.conf import settings
from rest_framework import serializers
from easy_thumbnails.files import get_thumbnailer

import urllib.parse
from .models import InstituteDetail, Introduction, History, Facility, Achievement



# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { MenuItem Serializer  ////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
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



# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { SlideItem Serializer  ////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
class SlideItemSerializer(MultiCroppedImageMixin):
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        image_fields = [
            "image",
        ]  # it will return picture_url and picture_cropped_url
        crop_sizes = {
            "image": (1900, 785),  # widescreen ratio for full-width slider
        }
        fields = ["id", "title", "slide_number"]

    # def get_image_url(self, obj):
    #     request = self.context.get("request")
    #     if obj.image:
    #         # ✅ This uses the manually selected cropping from admin
    #         thumb = get_thumbnailer(obj.image)["slider_cropped"]
    #         return request.build_absolute_uri(thumb.url)
    #     return None


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { Notice Serializer  ///////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
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



# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { ManagingCommittee  Serializer  ///////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////

class CommitteeMemberSerializer(MultiCroppedImageMixin):
    class Meta:
        model = ManagingCommitteeMember
        image_fields =['image',]
        crop_sizes = {
            "image": (300, 370),  # widescreen ratio
        }
        fields = [
            "id",
            "committee",
            "title",
            "name",
            "designation", 
            "message",
            "mobile",
            "email",
            "social_facebook",
            "social_linkedin",
            "social_twitter",
        ]

class ManagingCommitteeSerializer(MultiCroppedImageMixin):
    members = CommitteeMemberSerializer(many=True, read_only=True)
    institute_name = serializers.CharField(source='institute.name', read_only=True)
    pdf_document_url = serializers.SerializerMethodField()
    # image_document_url = serializers.SerializerMethodField()
    # image_document_cropped_url = serializers.SerializerMethodField()

    class Meta:
        model = ManagingCommittee
        image_fields =["image_document",]
        
        fields = [
            'id', 'institute_name', 'description', 'total_members',
            'formation_date', 'expiry_date', 'approved_by', 'active',
            'pdf_document_url', 
            'notes', 'members'
        ]

    def get_pdf_document_url(self, obj):
        if obj.pdf_document:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_document.url)
            return obj.pdf_document.url
        return None 
    
# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { Student Statistics Serializer  ///////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
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

# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { Card Link Serializer  ////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ["id", "text", "link", "icon", "order", "is_active"]


class CardItemSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)

    class Meta:
        model = CardItem
        fields = ["id", "title", "slug", "order", "icon", "is_active", "features"]

 

class IntroductionSerializer(MultiCroppedImageMixin):
    class Meta:
        model = Introduction
        image_fields =['image',]
        crop_sizes = {
            "image": (500, 400),  # widescreen ratio
        }
        fields = [
            "id",
            "title",
            "content",
            "show_image",
            # image fields
            # "image_url",
            # "image_cropped_url",
        ]
        read_only_fields = (
            fields  # read via InstituteDetail; write via its own endpoint
        )


class HistorySerializer(MultiCroppedImageMixin):
    class Meta:
        model = History
        image_fields =['image',]
        crop_sizes = {
            "image": (500, 400),  # widescreen ratio
        }
        fields = [
            "id",
            "title",
            "content",
            "show_image",
            # "image_url",
            # "image_cropped_url",
        ]
        read_only_fields = fields


class FacilitySerializer(MultiCroppedImageMixin):
    institute_detail = serializers.PrimaryKeyRelatedField(
        source="institute",  # model field is `institute` pointing to InstituteDetail
        queryset=InstituteDetail.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Facility
        image_fields =['image',]
        crop_sizes = {
            "image": (100, 100),  # widescreen ratio
        }
        fields = [
            "id",
            "title",
            "description",
            "icon",
            "show_image",
            # "image_url",
            # "image_cropped_url",
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
 
class InstituteDetailPublicSerializer(MultiCroppedImageMixin):
    """
    Full public payload with nested read-only sections for React.
    """

    institute_id = serializers.IntegerField(source="institute.id", read_only=True)
    institute_name = serializers.CharField(source="institute.name", read_only=True)

    # --- New fields for heading background ---
    # heading_background_image_url = serializers.SerializerMethodField()
    # heading_background_image_cropped_url = serializers.SerializerMethodField()

    introduction = IntroductionSerializer(read_only=True)
    history = HistorySerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    achievements = AchievementSerializer(many=True, read_only=True)

    class Meta:
        model = InstituteDetail
        image_fields =['heading_background_image',]
        crop_sizes = {
            "heading_background_image": (1280, 520),  # widescreen ratio
        }
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
            # "heading_background_image_url",
            # "heading_background_image_cropped_url",
            "show_image",
        ]

 
# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// {Contact Card Serializer } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////

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


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { InstituteApprovalInfoSerializer Serializer  ///////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////

class InstituteApprovalInfoSerializer(MultiCroppedImageMixin):
    # institute_name = serializers.CharField(source='institute.name', read_only=True)
    institute = InstituteSerializer(read_only=True)
    class Meta:
        model = InstituteApprovalInfo
        image_fields =["image",]
        crop_sizes = {
            "image": (800,1120),  # widescreen ratio
        }
        fields = [
            "id",
            "institute",
            "issue_date",
            "authority_bn",
            "authority_en",  
            "created_at",
            "updated_at",
        ]
    