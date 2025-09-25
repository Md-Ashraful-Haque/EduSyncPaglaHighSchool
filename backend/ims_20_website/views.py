# ------------------------------------
# 2. Views - views.py
# ------------------------------------


# from rest_framework.permissions import AllowAny
# from rest_framework import generics, permissions
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import MenuItem, Slider, Notice, ManagingCommittee, StudentStatistics
# from .serializers import (
#     MenuItemSerializer,
#     SlideItemSerializer,
#     NoticeSerializer,
#     StudentStatisticsSerializer,
# )
# from .models import ManagingCommittee
# from .serializers import ManagingCommitteeSerializer
# from rest_framework.decorators import api_view
# from rest_framework import generics
# from django.utils import timezone
# from django.db.models import Q

# from rest_framework.generics import ListAPIView
# from rest_framework.filters import SearchFilter
# from django_filters.rest_framework import DjangoFilterBackend
# from .pagination import NoticePagination
# from rest_framework import generics, permissions

# from rest_framework import viewsets, permissions, status
# from rest_framework.response import Response
# from .models import ContactPage, ContactCard
# from .serializers import ContactPageSerializer, ContactCardSerializer
# from ims_01_institute.serializers import InstituteSerializer


# from rest_framework import generics
# from .models import ManagingCommitteeMember
# from .serializers import CommitteeMemberSerializer, ManagingCommitteeSerializer


# from rest_framework import generics, permissions
# from .models import CardItem
# from .serializers import CardItemSerializer
# from django_filters.rest_framework import DjangoFilterBackend
# from rest_framework import viewsets, mixins, permissions, filters
# from rest_framework.decorators import action
# from rest_framework.response import Response

# from core.utils import getUserProfile

# from ims_01_institute.models import Institute
# from .models import InstituteDetail, Introduction, History, Facility, Achievement
# from .serializers import (
#     InstituteDetailPublicSerializer,
#     HistorySerializer,
# )


# ==============================
# Standard library imports
# ==============================
from django.db.models import Q
from django.utils import timezone

# ==============================
# Third-party imports
# ==============================
from rest_framework import (
    generics,
    permissions,
    viewsets,
    status,
    mixins,
    filters,
)
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

# ==============================
# Local imports (same app)
# ==============================
from .pagination import NoticePagination
from .models import (
    MenuItem,
    Slider,
    Notice,
    ManagingCommittee,
    ManagingCommitteeMember,
    StudentStatistics,
    CardItem,
    ContactPage,
    ContactCard,
    InstituteDetail,
    Introduction,
    History,
    Facility,
    Achievement,
    InstituteApprovalInfo,
)
from .serializers import (
    MenuItemSerializer,
    SlideItemSerializer,
    NoticeSerializer,
    StudentStatisticsSerializer,
    ManagingCommitteeSerializer,
    CommitteeMemberSerializer,
    CardItemSerializer,
    ContactPageSerializer,
    ContactCardSerializer,
    InstituteDetailPublicSerializer,
    InstituteApprovalInfoSerializer,
    HistorySerializer,
)

# ==============================
# Local imports (other apps)
# ==============================
from ims_01_institute.models import Institute
from ims_01_institute.serializers import InstituteSerializer
from core.utils import getUserProfile

# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { About us page } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////





class MenuListView(APIView):
    permission_classes = [AllowAny]  # 👈 This makes it public

    def get(self, request):
        top_level_items = MenuItem.objects.filter(parent=None, is_active=True).order_by(
            "order"
        )
        serializer = MenuItemSerializer(top_level_items, many=True)
        return Response(serializer.data)


class SliderListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        sliders = Slider.objects.all()
        serializer = SlideItemSerializer(
            sliders, many=True, context={"request": request}
        )
        return Response(serializer.data)


class ActiveNoticeListAPIView(generics.ListAPIView):
    serializer_class = NoticeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # ✅ disable pagination

    # print(" ================================================ ")
    def get_queryset(self):
        display_position = self.request.query_params.get(
            "position"
        )  # e.g., 'homepage', 'dashboard'
        target = self.request.query_params.get(
            "target"
        )  # e.g., 'students', 'teachers', 'all'

        queryset = Notice.objects.filter(
            is_published=True,
        ).filter(Q(expire_at__isnull=True) | Q(expire_at__gt=timezone.now()))

        if display_position:
            queryset = queryset.filter(display_position=display_position)

        if target:
            queryset = queryset.filter(
                Q(target_audience="all") | Q(target_audience=target)
            )

        return queryset.order_by("-pin_on_top", "-is_important", "-published_at")


class NoticeDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    lookup_field = "slug"


class NoticeListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = NoticeSerializer
    pagination_class = NoticePagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "content"]

    def get_queryset(self):
        now = timezone.now()
        # print(" ================================================ ")
        # print("now: ", now)

        # Active & published notices
        queryset = Notice.objects.filter(
            is_published=True, published_at__lte=now  # <= published already
        ).filter(
            Q(expire_at__isnull=True) | Q(expire_at__gt=now)  # not expired
        )

        # Custom filters
        target = self.request.query_params.get("target")
        position = self.request.query_params.get("position")

        if target and target != "all":
            queryset = queryset.filter(target_audience=target)

        if position and position != "all":
            queryset = queryset.filter(display_position=position)

        return queryset


class NoticeMarqueueListAPIView(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = NoticeSerializer
    # pagination_class = NoticePagination
    # filter_backends = [DjangoFilterBackend, SearchFilter]
    # search_fields = ['title', 'content']

    def get_queryset(self):
        now = timezone.now()

        # base queryset (active and published)
        queryset = (
            Notice.objects.filter(
                is_published=True, published_at__lte=now  # <= published already
            )
            .filter(Q(expire_at__isnull=True) | Q(expire_at__gt=now))  # not expired
            .filter(is_marquee=True)
        )

        return queryset


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { ManagingCommittee    ///////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////


class ActiveCommitteeMembersList(generics.ListAPIView):
    """
    Return all active committee members whose show_image_on_sidebar=True
    """

    permission_classes = [AllowAny]
    serializer_class = CommitteeMemberSerializer

    def get_queryset(self):
        return ManagingCommitteeMember.objects.filter(
            committee__active=True, show_image_on_sidebar=True
        ).order_by("committee__formation_date", "order")


class ManagingCommitteeListView(generics.ListAPIView):
    """
    List all managing committees with their members
    """

    permission_classes = [AllowAny]
    serializer_class = ManagingCommitteeSerializer

    def get_queryset(self):
        queryset = ManagingCommittee.objects.prefetch_related("members").order_by(
            "-formation_date"
        )

        # Filter by institute if provided
        institute_code = self.request.query_params.get("institute_code")
        if institute_code:
            queryset = queryset.filter(institute__institute_code=institute_code)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Split active vs inactive committees
        active_committees = queryset.filter(active=True,show_in_website=True)
        inactive_committees = queryset.filter(active=False,show_in_website=True)

        # Serialize them separately
        active_serializer = self.get_serializer(active_committees, many=True)
        inactive_serializer = self.get_serializer(inactive_committees, many=True)

        return Response(
            {
                "active_committees": active_serializer.data,
                "inactive_committees": inactive_serializer.data,
            }
        )


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { StudentStatisticsListView  ///////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////


class StudentStatisticsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = (
            StudentStatistics.objects.select_related(
                "class_instance__class_name",  # assuming class_name is FK
                "class_instance",
                "section",
                "group",
            )
            .all()
            .order_by(
                "class_instance__class_name__code",  # or just 'class_instance__class_name__name'
                "class_instance__shift",
                "section__section_name",
            )
        )
        serializer = StudentStatisticsSerializer(queryset, many=True)
        return Response(serializer.data)



class CardItemListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = CardItem.objects.filter(is_active=True).order_by("order")
    serializer_class = CardItemSerializer


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// { About Us Page } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////
# ims_01_institute_detail/api/views.py


# Read for all, write for staff/admin by default
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class InstituteDetailViewSet(viewsets.ModelViewSet):
    """
    Lookup by institute.code instead of pk
    Example: GET /api/institute-details/JIDC/public/
    """

    queryset = InstituteDetail.objects.select_related("institute").all()
    permission_classes = [IsAdminOrReadOnly]

    lookup_field = "institute__institute_code"  # use institute.code as lookup
    lookup_url_kwarg = "institute_code"  # name used in URL

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["institute"]
    search_fields = ["institute__name", "institute__institute_code"]
    ordering_fields = ["created_at", "updated_at"]

    def get_serializer_class(self):
        if self.action == "public":
            return InstituteDetailPublicSerializer
        if self.action == "list":  # ============= not used //////////////
            return InstituteDetailPublicSerializer
        return InstituteDetailPublicSerializer

    @action(detail=True, methods=["get"], url_path="public")
    def public(self, request, institute_code=None):
        instance = self.get_object()
        serializer = InstituteDetailPublicSerializer(
            instance, context={"request": request}
        )
        return Response(serializer.data)


# ////////////////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////// {Contant Page } ///////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////



class ContactPageViewSet(viewsets.ModelViewSet):
    """
    A ViewSet to manage Contact Pages.
    Supports retrieving by institute_code instead of numeric pk.
    """

    queryset = (
        ContactPage.objects.select_related("institute").prefetch_related("cards").all()
    )
    serializer_class = ContactPageSerializer
    permission_classes = [permissions.AllowAny]  # public read

    # Use custom lookup
    lookup_field = "institute_code"

    def retrieve(self, request, *args, **kwargs):
        institute_code = kwargs.get("institute_code")  # comes from URL
        contact_page = ContactPage.objects.filter(
            institute__institute_code=institute_code
        ).first()

        if not contact_page:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(contact_page)
        institute_info = Institute.objects.filter(institute_code=institute_code).first()
        institute_serializer_data = (
            InstituteSerializer(institute_info, context={"request": request}).data
            if institute_info
            else None
        )

        response_data = serializer.data
        response_data["institute_info"] = institute_serializer_data

        return Response(response_data)
        # return Response(serializer.data)


class ContactCardViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for Contact Cards.
    """

    queryset = ContactCard.objects.select_related("page").all()
    serializer_class = ContactCardSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        page_id = self.request.query_params.get("page")
        if page_id:
            qs = qs.filter(page__id=page_id)
        return qs



#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Intititute Approval Info ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
class InstituteApprovalInfoByCodeAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = InstituteApprovalInfo.objects.all()
    serializer_class = InstituteApprovalInfoSerializer

    def get_object(self):
        institute_code = self.kwargs['institute_code']
        return self.queryset.get(institute__institute_code=institute_code)