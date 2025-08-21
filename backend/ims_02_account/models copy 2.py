from django.db import models
from core.constants import *

from django.conf import settings
from django.contrib.auth.models import AbstractUser

from ims_01_institute.models import *
# from ims_03_exam.models import SubjectForIMS
# from ims_03_exam.models import SubjectForIMS
from django.db.models.signals import post_save, post_delete

from django.dispatch import receiver

from core.utils import create_user_for_profile



class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_permission_user_set',
        blank=True
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_picture = models.ImageField(
        upload_to='user_profiles/',
        null=True,
        blank=True
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        indexes =[
            models.Index(fields=[ 'username' ])
        ]
        verbose_name_plural = "01 Users"


class Admin(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Admins')
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='admin_profile',
        null=True,  # Initially null until a user is created
        blank=True
    )
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128 )
    phone_number = models.CharField(max_length=15,unique=True)
    address = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to='admin_images/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"
        # return f"{self.user.username} (Admin) // {self.institute.name} // {self.phone_number}"
    
    class Meta:
        verbose_name_plural = "02 Admins"
        
class Teacher(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Teachers')
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='teacher_profile',
        null=True,  # Initially null until a user is created
        blank=True
        
    )
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128 ) 
    phone_number = models.CharField(max_length=15,unique=True)
    subjects_taught = models.ManyToManyField(SubjectForIMS, related_name='teachers', null=True, blank=True)
    # Other teacher-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the teacher
    
    class Meta:
        verbose_name_plural = "03 Teachers"
        
class Student(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='students')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='students')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='students')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='students')
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='student_profile',
        null=True,  # Initially null until a user is created
        blank=True
    )
    # name = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128 )
    dob = models.DateField(null=True, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, unique=True)
    guardian_mobile_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    picture = models.ImageField(upload_to='student_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} "
        # return f"{self.name}- {self.roll_number} - {self.class_instance.class_name}- {self.institute.name} - {self.year.year}"

    class Meta:
        indexes =[
            models.Index(fields=['institute','year','class_instance','group','section','roll_number'])
        ]
        unique_together = ('section','roll_number') 
        verbose_name_plural = "04 Students"

class StudentClassHistory(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="class_history")
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, verbose_name="Institute")
    year = models.ForeignKey(Year, on_delete=models.CASCADE, verbose_name="Year")
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="Class")
    section = models.ForeignKey(Section, on_delete=models.CASCADE, verbose_name="Section")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Group")
    from_date = models.DateField()
    to_date = models.DateField(null=True, blank=True)  # Null if the student is still in this class

    def __str__(self):
        return f"{self.student}"
        # return f"{self.student} - {self.class_instance} ({self.from_date} to {self.to_date})"
    
    class Meta:
        verbose_name_plural = "05 StudentClassHistories"
        
class Guardian(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Guardians')
    students = models.ManyToManyField('Student', related_name='guardians')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15,unique=True)
    password = models.CharField(max_length=128 )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='guardian_profile',
        null=True,  # Initially null until a user is created
        blank=True
    )
    # Other guardian-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the guardian
    
    class Meta:
        verbose_name_plural = "06 Guardians"
        

class Staff(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Staff')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15,unique=True)
    password = models.CharField(max_length=128 )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='staff_profile',
        null=True,  # Initially null until a user is created
        blank=True
    )
    # subjects_taught = models.ManyToManyField('SubjectForIMS', related_name='teachers')
    # Other teacher-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the teacher
    
    class Meta:
        verbose_name_plural = "07 Staffs"
        
        
@receiver(post_save, sender=Admin)
@receiver(post_save, sender=Teacher)
@receiver(post_save, sender=Student)
@receiver(post_save, sender=Guardian)
@receiver(post_save, sender=Staff)
def auto_create_user(sender, instance, created, **kwargs):
    if created and not instance.user:
        print("signal called.") 
        # password = make_password(instance.password)  # Hash the password
        create_user_for_profile(instance)
        
        
        
@receiver(post_delete, sender=Admin)
@receiver(post_delete, sender=Teacher)
@receiver(post_delete, sender=Student)
@receiver(post_delete, sender=Guardian)
@receiver(post_delete, sender=Staff)
def delete_user_on_admin_delete(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()