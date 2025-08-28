from rest_framework import serializers
from .models import MenuItem, Slider, Notice, HistoryOfInstitute, ManagingCommittee, ContactInformation
from .models import StudentStatistics
from easy_thumbnails.files import get_thumbnailer  

class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ['id', 'name_bn',  'name_en', 'slug', 'url', 'order', 'is_active', 'children']

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('order')
        return MenuItemSerializer(children, many=True).data


class SlideItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        fields = ['id', 'title', 'slide_number', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            # ✅ This uses the manually selected cropping from admin
            thumb = get_thumbnailer(obj.image)['slider_cropped']
            return request.build_absolute_uri(thumb.url)
        return None


# from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'attachment',
            'target_audience',
            'display_position',
            'is_marquee',
            'is_important',
            'pin_on_top',
            'is_published',
            'published_at',
            'expire_at',
            'created_by',
            'is_active'
        ]

    def get_is_active(self, obj):
        return obj.is_active()  # this should be defined as a method in your model



class HistoryOfInstituteSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HistoryOfInstitute
        fields = [
            'id',
            'title',
            'content',
            'image_url',
            'show_image',
            'institute',
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ManagingCommitteeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ManagingCommittee
        fields = [
            'id',
            'title',
            'name',
            'designation',
            'message',
            'image_url', 
            'institute',
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ContactInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInformation
        fields = '__all__'

# /////////////////////////////////////////////////
class StudentStatisticsSerializer(serializers.ModelSerializer):
    # institute_name_ban = serializers.CharField(source='institute.name', read_only=True)
    # institute_name_eng = serializers.CharField(source='institute.name_in_english', read_only=True)
    class_name = serializers.CharField(source='class_instance.class_name.name_bengali', read_only=True)
    shift_name = serializers.CharField(source='class_instance.shift', read_only=True)
    section_name = serializers.CharField(source='section.section_name.name_bengali', read_only=True)
    group_name = serializers.CharField(source='group.group_name.name_bengali', read_only=True)

    class Meta:
        model = StudentStatistics
        fields = [
            'id',
            # 'institute_name_ban',
            # 'institute_name_eng',
            'class_name',
            'shift_name',
            'section_name',
            'group_name',
            'boys',
            'girls',
            'muslim',
            'hindu',
            'bouddha',
            'christian',
            'muktijoddha',
            'shodosho_sontan',
            'autistic',
            'physical_disability'
        ]


# serializers.py
from rest_framework import serializers
from .models import Institute, Introduction, History, Facility, Achievement

class IntroductionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Introduction
        fields = ['title', 'content', 'image_url',  'show_image']
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            # ✅ This uses the manually selected cropping from admin
            thumb = get_thumbnailer(obj.image)['slider_cropped']
            return request.build_absolute_uri(thumb.url)
        return None

class HistorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = History
        fields = ['title', 'content',  'image_url',  'show_image']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            # ✅ This uses the manually selected cropping from admin
            thumb = get_thumbnailer(obj.image)['slider_cropped']
            return request.build_absolute_uri(thumb.url)
        return None

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['icon', 'title', 'description']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['title']

class InstituteSerializer(serializers.ModelSerializer):
    introduction = IntroductionSerializer()
    history = HistorySerializer()
    facilities = FacilitySerializer(many=True)
    achievements = AchievementSerializer(many=True)

    class Meta:
        model = Institute
        fields = [
            'id', 'name', 'name_in_english', 'institute_code', 'address', 'mobile_number', 'email',
            'logo', 'picture',
            'introduction', 'history', 'facilities', 'achievements'
        ]


