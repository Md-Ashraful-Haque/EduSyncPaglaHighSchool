from django.urls import path
from .views import get_school_info

from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('api/school-info/', get_school_info, name='get_school_info'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
