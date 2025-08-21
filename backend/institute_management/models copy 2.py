from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# /////////////////////////////////////////////////////////////////////////
# /////////////////////////// Constants for Choices ///////////////////////
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

GROUP_CHOICES = [
    ('science', 'বিজ্ঞান'),
    ('humanities', 'মানবিক'),
    ('commerce', 'ব্যবসায় শিক্ষা'),
    ('common', 'সাধারণ'),
]

SECTION_CHOICES = [
    ('a', 'ক'),
    ('b', 'খ'),
    ('c', 'গ'),
    ('d', 'ঘ'),
    ('e', 'ঙ'),
    ('f', 'চ'),
    ('common', 'সাধারণ'),
]

# /////////////////////////////////////////////////////////////////////////
# /////////////////////////// Core Models //////////////////////////////////
# /////////////////////////////////////////////////////////////////////////

class Institute(models.Model):
    institute_code = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    mobile_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    logo = models.ImageField(upload_to='institute_logos/', null=True, blank=True)
    picture = models.ImageField(upload_to='institute_pictures/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Institutes"
        ordering = ['name']



class User(AbstractUser):
    institute = models.ForeignKey(
        'Institute',
        on_delete=models.CASCADE,
        related_name='users'
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

    def __str__(self):
        return f"{self.username} ({self.role})"


class Year(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='years')
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.year} ({self.institute.name})"

    class Meta:
        unique_together = ('year', 'institute')
        ordering = ['-year']
        verbose_name_plural = "Years"


class ClassName(models.Model):
    name = models.CharField(max_length=100)
    name_bengali = models.CharField(max_length=100)
    code = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.name_bengali})"

    class Meta:
        verbose_name_plural = "Class Names"
        ordering = ['code']


class Class(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='classes')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='classes')
    class_name = models.ForeignKey(ClassName, on_delete=models.SET_NULL, null=True, blank=True, related_name='classes')
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)

    def __str__(self):
        return f"{self.class_name.name} ({self.year.year} - {self.get_shift_display()})"

    class Meta:
        indexes = [
            models.Index(fields=['institute','year','class_name','shift'])
        ]
        constraints = [
            models.UniqueConstraint(fields=['class_name', 'year', 'shift'], name='unique_class_year_shift')
        ]
        ordering = ['year', 'class_name__code', 'shift']
        verbose_name_plural = "Classes"


class Group(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='groups')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='groups')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='groups')
    group_name = models.CharField(max_length=100, choices=GROUP_CHOICES)

    def __str__(self):
        return f"{self.get_name_display()} ({self.class_instance})"

    class Meta:
        
        indexes = [
            models.Index(fields=['institute','year','class_instance','group_name'])
        ]
        constraints = [
            models.UniqueConstraint(fields=['class_instance', 'group_name'], name="unique_class_group")
        ]
        verbose_name_plural = "Groups"


class Section(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='sections')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='sections')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='sections')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='sections')
    section_name = models.CharField(max_length=100, choices=SECTION_CHOICES)

    def __str__(self):
        return f"{self.get_name_display()} ({self.group})"

    class Meta:
        indexes = [
            models.Index(fields=['institute','year','class_instance','group','section_name',])
        ]
        constraints = [
            models.UniqueConstraint(fields=['group', 'section_name'], name='unique_group_section')
        ]
        verbose_name_plural = "Sections"


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='student_profile'
    )
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='students')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='students')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='students')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='students')
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20)
    dob = models.DateField(null=True, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    guardian_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    picture = models.ImageField(upload_to='student_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.roll_number})"

    class Meta:
        indexes =[
            models.Index(fields=['institute','year','class_instance','group','section','roll_number'])
        ]
        constraints =[
            models.UniqueConstraint(fields=['section','roll_number'], name="unique_section_roll_number")
        ]
        verbose_name_plural = "Students"

class AdminProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='admin_profile'
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to='admin_images/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} (Admin)"
    
class Teacher(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='teacher_profile'
    )
    subjects_taught = models.ManyToManyField('SubjectForIMS', related_name='teachers')
    # Other teacher-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the teacher

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

class Guardian(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='guardian_profile'
    )
    students = models.ManyToManyField('Student', related_name='guardians')
    # Other guardian-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the guardian



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

    class_instance = models.ManyToManyField(
        'Class',
        related_name='examforims',
        verbose_name="Groups"
    )

    exam_name = models.CharField(max_length=255, verbose_name="Exam Name")
    heighest_marks = models.FloatField(default=0.0, verbose_name="Highest Marks")
    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(verbose_name="End Date")
    
    def __str__(self):
        return f"{self.exam_name} ({self.year.year})"

    class Meta:
        indexes=[
            models.Index(fields=['institute','year','exam_name'])
        ]        
        constraints =[
            models.UniqueConstraint(fields=['class_instance','exam_name'], name="unique_class_instance_exam_name")
        ]
        verbose_name_plural = "07 Exams"

    


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
    class_instance= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='subjectforims',
        verbose_name="Class"
    )
    group = models.ManyToManyField(
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
        indexes =[
            models.Index(fields=['institute','year','class_instance','subject_name'])
        ]
        
        constraints =[
            models.UniqueConstraint(fields=['class_instance','subject_name'], name="unique_class_instance_subject_name")
        ]
        
        verbose_name_plural = "01 Subjects"

    def __str__(self):
        groups = ", ".join([group.group_name for group in self.groups.all()])
        return f"{self.subject_name}: (Groups: {groups}, Full Marks: {self.full_marks})"


# Add the grade calculation logic here based on the provided utility functions

class StudentSubjectResult(models.Model):
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
    class_instance= models.ForeignKey(
        'Class',
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Class"
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
        indexes =[
            models.Index(fields=['institute','year','class_instance','group','section','student','exam','subject'])
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
        'StudentSubjectResult',
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
        constraints = [
            models.UniqueConstraint(
                fields=['single_result', 'marks_type'],
                name='unique_single_result_marks_type'
            )
        ]
        indexes =[
            models.Index(fields=['single_result','marks_type'])
        ]
        verbose_name_plural = "Marks"

    def __str__(self):
        return f"{self.marks_type} - {self.marks}"

