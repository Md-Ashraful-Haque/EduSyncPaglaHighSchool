from django.db import models
import math

from django.contrib.auth.models import AbstractUser 
# /////////////////////////////////////////////////////////////////////////
# /////////////////////////// Single Institute Management ////////////////
# /////////////////////////////////////////////////////////////////////////

ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('guardian', 'Guardian'),
        ('staff', 'Staff'),
    ]

SHIFT_CHOICES = [
    ('morning', 'Morning'),
    ('day', 'Day'),
    ('evening', 'Evening'),
]
GROUP_LIST = [
        ('science', 'বিজ্ঞান'),
        ('humanities', 'মানবিক'),
        ('commerce', 'ব্যবসায় শিক্ষা'),
        ('common', 'সাধারণ'),
    ]
SECTION_NAME_LIST = [
        ('a', 'ক'),
        ('b', 'খ'),
        ('c', 'গ'),
        ('d', 'ঘ'),
        ('e', 'ঙ'),
        ('f', 'চ'),
        ('common', 'সাধারণ'),
    ]


class Institute(models.Model):
    institute_code = models.CharField(max_length=255, unique=True, verbose_name="Institute Code")
    name = models.CharField(max_length=255, verbose_name="Institute Name")
    address = models.TextField(verbose_name="Address")
    mobile_number = models.CharField(max_length=15, verbose_name="Mobile Number")
    email = models.EmailField(unique=True, verbose_name="Email")
    logo = models.ImageField(upload_to='institute_logos/', null=True, blank=True, verbose_name="Logo")
    institute_picture = models.ImageField(upload_to='institute_pictures/', null=True, blank=True, verbose_name="Institute Picture")
    created_at = models.DateTimeField(auto_now_add=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "01 Institutes"
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    institute = models.ForeignKey(
        'Institute',
        on_delete=models.CASCADE,
        related_name='users'
    )
    name = models.CharField(max_length=255, verbose_name="Institute Name")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_picture = models.ImageField(
        upload_to='user_profiles/',
        null=True,
        blank=True
    )
    contact_number = models.CharField(
        max_length=15,
        null=True,
        blank=True
    )

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

    def __str__(self):
        return f"{self.username} ({self.role})"



class Year(models.Model):
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="years"
    )
    year = models.PositiveIntegerField(verbose_name="Year")

    def __str__(self):
        return f"{self.year} ({self.institute.name})"

    class Meta:
        verbose_name_plural = "02 Years"
        unique_together = ('year', 'institute')  # Ensures unique year per institute

class ClassName(models.Model):
    name = models.CharField(max_length=100, verbose_name="Class Name (in English)")
    name_bengali = models.CharField(max_length=100, verbose_name="Class Name (in Bengali)")
    class_code = models.PositiveIntegerField(verbose_name="Class Code")
    

    def __str__(self):
        return self.name  # Default display (English name)

    class Meta:
        verbose_name = "Class Name"
        verbose_name_plural = "00 Class Names"


class Class(models.Model):

    
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="classes",  # Unique related_name for institute
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='classes',
        verbose_name="Year"
    )
    class_name = models.ForeignKey(
        'ClassName',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes",
        verbose_name="Class Name"
    )
    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
        verbose_name="Shift"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['class_name', 'year', 'shift'],  # Ensure uniqueness by class, year, and shift
                name='unique_class_year_shift'
            )
        ]
        verbose_name = "Class"
        verbose_name_plural = "03 Classes"

    def __str__(self):
        return f"{self.get_class_name_display()} - {self.year.year} ({self.get_shift_display()})"



class Group(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="groups",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='groups',
        verbose_name="Year"
    )
    class_name= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='groups',
        verbose_name="Class"
    )
    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
        verbose_name="Shift"
    )

    group_name = models.CharField(max_length=100, choices=GROUP_LIST, verbose_name="Group Name")
    

    class Meta:
        verbose_name = "Group"
        verbose_name_plural = "04 Groups"
        unique_together = ('group_name', 'class_name')

    def __str__(self):
        return f"{self.get_group_name_display()} - {self.class_assigned.class_name} - {self.class_assigned.year.year}"



class Section(models.Model):
  
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="sections",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='sections',
        verbose_name="Year"
    )
    class_name= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='sections',
        verbose_name="Class"
    )
    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
        verbose_name="Shift"
    )

    group = models.ForeignKey(
        'Group',
        on_delete=models.CASCADE,
        related_name='sections',
        verbose_name="Sections"
    )
    section_name = models.CharField(max_length=100, choices=SECTION_NAME_LIST, verbose_name="Section Name")

    class Meta:
        unique_together = ('group', 'section_name')
        verbose_name_plural = "05 Sections"

    def __str__(self):
        return f"{self.section_name} - {self.group.group_name} ({self.group.class_name.year.year})"


class Student(models.Model):
    
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="students",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name="Year"
    )
    class_name= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name="Class"
    )
    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
        verbose_name="Shift"
    )

    group = models.ForeignKey(
        'Group',
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name="Group"
    )
    section = models.ForeignKey(
        'Section',
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name="Section"
    )
    
    student_name = models.CharField(max_length=100, verbose_name="Student Name")
    roll_number = models.CharField(max_length=20, verbose_name="Roll Number")
    dob = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    email = models.EmailField(blank=True, verbose_name="Email")
    phone_number = models.CharField(max_length=15, blank=True, verbose_name="Phone Number")
    guardiant_number = models.CharField(max_length=15, blank=True, verbose_name="Guardian Phone Number")
    address = models.TextField(blank=True, verbose_name="Address")

    class Meta:
        unique_together = ('roll_number', 'section', 'group', 'class_name', 'year')
        verbose_name_plural = "06 Students"

    def __str__(self):
        return f"{self.student_name} ({self.roll_number} - {self.group.group_name})"


class ExamForIMS(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="examforims",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='examforims',
        verbose_name="Year"
    )

    class_name = models.ManyToManyField(
        'Class',
        related_name='examforims',
        verbose_name="Groups"
    )

    exam_name = models.CharField(max_length=255, verbose_name="Exam Name")
    heighest_marks = models.FloatField(default=0.0, verbose_name="Highest Marks")
    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(verbose_name="End Date")

    class Meta:
        verbose_name_plural = "07 Exams"

    def __str__(self):
        return f"{self.exam_name} ({self.year.year})"


class SubjectForIMS(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="subjectforims",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='subjectforims',
        verbose_name="Year"
    )
    class_name= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='subjectforims',
        verbose_name="Class"
    )
    groups = models.ManyToManyField(
        'Group',
        related_name='subjectforims',
        verbose_name="Groups"
    )
    subject_name = models.CharField(max_length=255, unique=True, verbose_name="Subject Name")
    serial_number = models.PositiveIntegerField(verbose_name="Serial Number")
    code = models.CharField(max_length=10, verbose_name="Subject Code")
    
    full_marks = models.PositiveIntegerField(verbose_name="Full Marks", default=100)
    pass_marks = models.PositiveIntegerField(verbose_name="Pass Marks", default=33)
    
    mcq_marks = models.PositiveIntegerField(verbose_name="MCQ Marks", default=0)
    theory_marks = models.PositiveIntegerField(verbose_name="Theory Marks", default=0)
    practical_marks = models.PositiveIntegerField(verbose_name="Practical Marks", default=0)
    
    mcq_pass_marks = models.PositiveIntegerField(verbose_name="MCQ Pass Marks", default=0)
    theory_pass_marks = models.PositiveIntegerField(verbose_name="Theory Pass Marks", default=0)
    practical_pass_marks = models.PositiveIntegerField(verbose_name="Practical Pass Marks", default=0)

    class Meta:
        verbose_name_plural = "01 Subjects"

    def __str__(self):
        groups = ", ".join([group.group_name for group in self.groups.all()])
        return f"{self.subject_name}: (Groups: {groups}, Full Marks: {self.full_marks})"


# Add the grade calculation logic here based on the provided utility functions

class SingleResult(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="singleresults",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        'Year',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Year"
    )
    class_name= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Class"
    )
    shift = models.CharField(
        max_length=20,
        choices=SHIFT_CHOICES,
        verbose_name="Shift"
    )

    group = models.ForeignKey(
        'Group',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Group"
    )
    section = models.ForeignKey(
        'Section',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Section"
    )
    
    
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Student"
    )
    exam = models.ForeignKey(
        'ExamForIMS',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Exam"
    )
    subject = models.ForeignKey(
        'SubjectForIMS',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Subject"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'exam', 'subject'],
                name='unique_student_exam_subject'
            )
        ]
        verbose_name_plural = "08 Single Results"

    def get_total_marks(self):
        total_marks = 0
        for mark in self.marks.all():
            total_marks += mark.marks
        return total_marks

class MarksType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Marks Type Name", unique=True)
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Marks Type"
        verbose_name_plural = "Marks Types"


class Marks(models.Model):
    single_result = models.ForeignKey(
        'SingleResult',
        on_delete=models.CASCADE,
        related_name='marks'
    )
    marks_type = models.ForeignKey(
        'MarksType',
        on_delete=models.CASCADE,
        related_name='marks'
    )
    marks = models.PositiveIntegerField(verbose_name="Marks")

    class Meta:
        unique_together = ('single_result', 'marks_type')  # Prevent duplicate entries for same marks type
        verbose_name_plural = "Marks"

    def __str__(self):
        return f"{self.marks_type} - {self.marks}"

