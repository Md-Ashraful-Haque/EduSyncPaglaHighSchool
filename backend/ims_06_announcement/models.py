from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from ims_01_institute.models import Institute,Year

class AudienceGroup(models.Model):
    """Define groups to target announcements (e.g., students, teachers, parents)."""
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="audiencegroup",
        verbose_name="Institute"
    )
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='audiencegroup',
        verbose_name="Year"
    )
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "01 AudienceGroups"
        


class Audience(models.Model):
    """
    Model to represent SMS recipients. Links to users and their roles.
    """
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="Audiences",
        verbose_name="Institute"
    )
    
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='audience',
        verbose_name="Year"
    )
    
    group = models.ForeignKey(
        AudienceGroup,
        on_delete=models.CASCADE,
        related_name="audiences",
        blank=True,
        null=True,
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="Audience")
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.phone_number})"
    
    class Meta:
        verbose_name_plural = "02 Audiences"
        

class Announcement(models.Model):
    """Main model for storing announcements."""
    
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="announcements",
        verbose_name="Institute"
    )
    
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='announcements',
        verbose_name="Year"
    )
    
    announcement_type = models.CharField(
        max_length=50,
        choices=[
            ('General', 'General'),
            ('Event', 'Event'),
            ('Urgent', 'Urgent'),
        ],
        default='General'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    audience = models.ManyToManyField(AudienceGroup, related_name="announcements")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_announcements")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "03 Announcements"
        

class AnnouncementDelivery(models.Model):
    """Track the delivery of announcements across different channels."""
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name="deliveries")
    channel = models.CharField(
        max_length=50,
        choices=[
            ('Web', 'Web'),
            ('Email', 'Email'),
            ('SMS', 'SMS'),
            ('App Notification', 'App Notification'),
        ]
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Delivered', 'Delivered'),
            ('Failed', 'Failed'),
        ],
        default='Pending'
    )
    delivered_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.announcement.title} via {self.channel}"

    
    class Meta:
        verbose_name_plural = "04 AnnouncementDeliverys"
        