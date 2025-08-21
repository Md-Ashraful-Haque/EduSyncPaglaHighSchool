from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from ims_01_institute.models import Institute,Year


class SMSRecipientGroup(models.Model):
    """
    Grouping recipients logically for class-wise, section-wise, or institute-wide messaging.
    """
    
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="smsrecipientgroup",
        verbose_name="Institute"
    )
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='smsrecipientgroup',
        verbose_name="Year"
    )
    
    name = models.CharField(max_length=100, unique=True)  # e.g., "Class 9 Section A" or "All Teachers"
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "01 SMSRecipientGroups"
        

class SMSRecipient(models.Model):
    """
    Model to represent SMS recipients. Links to users and their roles.
    """
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="smsrecipient",
        verbose_name="Institute"
    )
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='smsrecipient',
        verbose_name="Year"
    )
    group = models.ForeignKey(
        SMSRecipientGroup,
        on_delete=models.CASCADE,
        related_name="members",
        blank=True,
        null=True,
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sms_recipient")
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.phone_number})"
    
    class Meta:
        verbose_name_plural = "02 SMSRecipients"
        

class SMSLog(models.Model):
    """
    Logs each SMS sent, including group messages.
    """
    recipient = models.ForeignKey(SMSRecipient, on_delete=models.CASCADE, related_name="sms_logs")
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Sent', 'Sent'),
            ('Failed', 'Failed'),
        ],
        default='Pending'
    )
    sent_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SMS to {self.recipient.phone_number} - {self.status}"
    
    class Meta:
        verbose_name_plural = "03 SMSLogs"
        

class BulkSMS(models.Model):
    """
    Sends messages to groups of recipients, e.g., all students in a class.
    """
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="bulksms",
        verbose_name="Institute"
    )
    
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='bulksms',
        verbose_name="Year"
    )
    
    groups = models.ManyToManyField(SMSRecipientGroup, related_name="bulk_sms", blank=True)
    recipients = models.ManyToManyField(SMSRecipient, related_name="bulk_sms", blank=True)
    
    title = models.CharField(max_length=200)  # e.g., "Exam Reminder"
    message = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_bulk_sms")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Completed', 'Completed'),
        ],
        default='Pending'
    )

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "04 BulkSMSs"
        