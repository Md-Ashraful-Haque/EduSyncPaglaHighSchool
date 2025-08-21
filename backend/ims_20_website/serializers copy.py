from rest_framework import serializers
from .models import MenuItem, Slider, Notice
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


class NoticeSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields = [
            'id', 'title', 'slug', 'content', 'attachment',
            'target_audience', 'is_important', 'pin_on_top',
            'is_published', 'published_at', 'expire_at',
            'created_by', 'is_active'
        ]

    def get_is_active(self, obj):
        return obj.is_active()


