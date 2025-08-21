from django.db import models
from core.constants import *

from django.conf import settings
from django.contrib.auth.models import AbstractUser

from ims_01_institute.models import *
# from ims_03_exam.models import SubjectForIMS
# from ims_03_exam.models import SubjectForIMS
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.utils import create_user_for_profile

from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    # institute = models.ForeignKey(
    #     Institute,
    #     on_delete=models.CASCADE,
    #     related_name='users',
    #     null=True,  # Allow NULL values
    #     blank=True  # Allow the field to be left blank in forms
    # )
    
    # Override default reverse accessors to avoid clashes
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
    
    name = models.CharField(max_length=255, verbose_name="User Name")
    
    mobile = models.CharField(
        max_length=15,
        unique=True,  # Make contact_number unique
        null=False,
        blank=False
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_picture = models.ImageField(
        upload_to='user_profiles/',
        null=True,
        blank=True
    )
    def save(self, *args, **kwargs):
        # Hash the password if it's not already hashed
        print("Outer")
        if self.password and not self.password.startswith('pbkdf2_'):
            print("Inner")
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        indexes =[
            models.Index(fields=[ 'name','mobile' ])
        ]
        verbose_name_plural = "01 Users"


class Admin(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Admins')
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='admin_profile'
    )
    admin_name = models.CharField(max_length=100)
    password = models.CharField(max_length=128, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to='admin_images/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} (Admin) // {self.institute.name} // {self.phone_number}"
    
    class Meta:
        verbose_name_plural = "02 Admins"
        
class Teacher(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Teachers')
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='teacher_profile'
    )
    teacher_name = models.CharField(max_length=100)
    password = models.CharField(max_length=128, blank=True, null=True) 
    subjects_taught = models.ManyToManyField(SubjectForIMS, related_name='teachers')
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
    student_name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20)
    password = models.CharField(max_length=128, blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    guardian_mobile_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    picture = models.ImageField(upload_to='student_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.student_name}- {self.roll_number} - {self.class_instance.class_name}- {self.institute.name} - {self.year.year}"

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
        return f"{self.student} - {self.class_instance} ({self.from_date} to {self.to_date})"
    
    class Meta:
        verbose_name_plural = "05 StudentClassHistories"
        



class Guardian(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='Guardians')
    students = models.ManyToManyField('Student', related_name='guardians')
    guardian_name = models.CharField(max_length=100)
    password = models.CharField(max_length=128, blank=True, null=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='guardian_profile'
    )
    # Other guardian-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the guardian
    
    class Meta:
        verbose_name_plural = "06 Guardians"
        

class Staff(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='staff_profile'
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
def auto_create_user(sender, instance, created, **kwargs):
    if created and not instance.user:
        print("signal called.")
        role = instance.__class__.__name__.lower()  # Role based on the model name
        password = make_password(instance.password)  # Hash the password
        create_user_for_profile(instance, role=role, password=instance.password)