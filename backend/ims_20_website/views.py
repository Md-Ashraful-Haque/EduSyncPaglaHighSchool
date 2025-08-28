

# ------------------------------------
# 2. Views - views.py
# ------------------------------------


from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MenuItem, Slider, Notice, ManagingCommittee,StudentStatistics
from .serializers import MenuItemSerializer, SlideItemSerializer, NoticeSerializer, ManagingCommitteeSerializer,StudentStatisticsSerializer

from rest_framework import generics  
from django.utils import timezone
from django.db.models import Q

from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend 
from .pagination import NoticePagination
from rest_framework import generics, permissions
from .models import HistoryOfInstitute, History
from .serializers import HistoryOfInstituteSerializer
from .models import ContactInformation
from .serializers import ContactInformationSerializer, HistorySerializer

from core.utils import getUserProfile

class MenuListView(APIView):
    permission_classes = [AllowAny]  # 👈 This makes it public

    def get(self, request):
        top_level_items = MenuItem.objects.filter(parent=None, is_active=True).order_by('order')
        serializer = MenuItemSerializer(top_level_items, many=True)
        return Response(serializer.data)

class SliderListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        sliders = Slider.objects.all()
        serializer = SlideItemSerializer(sliders, many=True, context={'request': request})
        return Response(serializer.data)

class ActiveNoticeListAPIView(generics.ListAPIView):
    serializer_class = NoticeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # ✅ disable pagination

    def get_queryset(self):
        display_position = self.request.query_params.get('position')  # e.g., 'homepage', 'dashboard'
        target = self.request.query_params.get('target')  # e.g., 'students', 'teachers', 'all'

        queryset = Notice.objects.filter(
            is_published=True,
        ).filter(
            Q(expire_at__isnull=True) | Q(expire_at__gt=timezone.now())
        )

        if display_position:
            queryset = queryset.filter(display_position=display_position)

        if target:
            queryset = queryset.filter(
                Q(target_audience='all') | Q(target_audience=target)
            )

        return queryset.order_by('-pin_on_top', '-is_important', '-published_at')


class NoticeDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    lookup_field = 'slug'




class NoticeListAPIView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = NoticeSerializer
    pagination_class = NoticePagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title', 'content']

    def get_queryset(self):
        now = timezone.now()

        # base queryset (active and published)
        queryset = Notice.objects.filter(
            is_published=True
        ).filter(
            expire_at__isnull=True
        ) | Notice.objects.filter(
            is_published=True,
            expire_at__gt=now
        )

        print("=====================================is_marquee ====================", is_marquee)
        # custom filters
        target = self.request.query_params.get("target")
        position = self.request.query_params.get("position")
        is_marquee = self.request.query_params.get("is_marquee")

        if target and target != "all":
            queryset = queryset.filter(target_audience=target)

        if position and position != "all":
            queryset = queryset.filter(display_position=position)

        if is_marquee is not None:  # only if explicitly passed
            print("is_marquee: ",is_marquee)
            queryset = queryset.filter(is_marquee=(is_marquee.lower() == "true"))

        return queryset



# class NoticeListAPIView(ListAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = NoticeSerializer
#     pagination_class = NoticePagination
#     filter_backends = [DjangoFilterBackend, SearchFilter]
#     search_fields = ['title','content']
    

#     def get_queryset(self):
#         now = timezone.now()

#         # base queryset (active and published)
#         queryset = Notice.objects.filter(
#             is_published=True
#         ).filter(
#             expire_at__isnull=True
#         ) | Notice.objects.filter(
#             is_published=True,
#             expire_at__gt=now
#         )

#         # handle custom filtering
#         target = self.request.query_params.get("target")
#         position = self.request.query_params.get("position")

#         if target and target != "all":
#             queryset = queryset.filter(target_audience=target)

#         if position and position != "all":
#             queryset = queryset.filter(display_position=position)

#         return queryset

class HistoryOfInstituteListAPIView(generics.ListAPIView):
    queryset = History.objects.all()
    # queryset = HistoryOfInstitute.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = History.objects.all()
        institute_id = self.request.query_params.get('institute')
        if institute_id:
            queryset = queryset.filter(institute__institute_code=institute_id)
            # queryset = queryset.filter(institute_id=institute_id).first()
        return queryset

class ManagingCommitteeListAPIView(generics.ListAPIView):
    queryset = ManagingCommittee.objects.all()
    serializer_class = ManagingCommitteeSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = ManagingCommittee.objects.all()
        institute_id = self.request.query_params.get('institute')
        if institute_id:
            queryset = queryset.filter(institute__institute_code=institute_id)
            # queryset = queryset.filter(institute_id=institute_id).first()
        return queryset


class ContactInformationAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        info = ContactInformation.objects.first()  # Assuming one instance
        serializer = ContactInformationSerializer(info)
        return Response(serializer.data)

# /////////////////////////////////////////////////
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
# from .models import StudentStatistics
# from .serializers import StudentStatisticsSerializer

class StudentStatisticsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = StudentStatistics.objects.select_related(
            'class_instance__class_name',  # assuming class_name is FK
            'class_instance',
            'section',
            'group'
        ).all().order_by(
            'class_instance__class_name__code',  # or just 'class_instance__class_name__name'
            'class_instance__shift',
            'section__section_name'
        )
        serializer = StudentStatisticsSerializer(queryset, many=True) 
        return Response(serializer.data)


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Institute
from .serializers import InstituteSerializer

class InstituteDetailsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, code):
        try:
            institute = Institute.objects.prefetch_related(
                'facilities', 'achievements'
            ).select_related(
                'introduction', 'history'
            ).get(institute_code=code)
        except Institute.DoesNotExist:
            return Response({'error': 'Institute not found'}, status=404)

        serializer = InstituteSerializer(institute,  context={'request': request})
        return Response(serializer.data)
