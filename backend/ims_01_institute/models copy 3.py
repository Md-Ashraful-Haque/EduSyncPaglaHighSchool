from django.db import models
from core.constants import *


class Institute(models.Model):
    name = models.CharField(max_length=255)
    institute_code = models.CharField(max_length=255, unique=True)
    address = models.TextField()
    mobile_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    logo = models.ImageField(upload_to='institute_logos/', null=True, blank=True)
    picture = models.ImageField(upload_to='institute_pictures/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f" {self.name} "

    class Meta:
        verbose_name_plural = "01 Institutes"
        ordering = ['name']



class Year(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='years')
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.year}"
        # return f"{self.year} ({self.institute.name} - {self.institute.mobile_number})"

    class Meta:
        unique_together = ('year', 'institute')
        ordering = ['-year']
        verbose_name_plural = "02 Years"


class ClassName(models.Model):
    name = models.CharField(max_length=100)
    name_bengali = models.CharField(max_length=100)
    code = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.name_bengali})"

    class Meta:
        verbose_name_plural = "03 Class Names"
        ordering = ['code']


class Class(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='classes')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='classes')
    class_name = models.ForeignKey(ClassName, on_delete=models.SET_NULL, null=True, blank=True, related_name='classes')
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)

    def __str__(self):
        return f"{self.class_name.name} "
        # return f"{self.class_name.name} ({self.year.year} - {self.get_shift_display()} - {self.institute.name})"

    class Meta:
        indexes = [
            models.Index(fields=['institute','year','class_name','shift'])
        ]
        # constraints = [
        #     models.UniqueConstraint(fields=['class_name', 'year', 'shift'], name='unique_class_year_shift')
        # ]
        unique_together = ('institute','class_name', 'year', 'shift') 
        ordering = ['year', 'class_name__code', 'shift']
        verbose_name_plural = "04 Classes"






class Group(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='groups')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='groups')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='groups')
    group_name = models.CharField(max_length=100, choices=GROUP_CHOICES)

    def __str__(self):
        return f"{self.get_group_name_display()} "
        # return f"{self.get_group_name_display()} - {self.class_instance.class_name} - {self.institute.name} "

    class Meta:
        
        indexes = [
            models.Index(fields=['institute','year','class_instance','group_name'])
        ]
        # constraints = [
        #     models.UniqueConstraint(fields=['class_instance', 'group_name'], name="unique_class_group")
        # ]
        unique_together=('class_instance', 'group_name')
        verbose_name_plural = "05 Groups"


class Section(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name='sections')
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='sections')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='sections')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='sections')
    section_name = models.CharField(max_length=100, choices=SECTION_CHOICES)

    def __str__(self):
        return f"{self.get_section_name_display()} "

    class Meta:
        indexes = [
            models.Index(fields=['institute','year','class_instance','group','section_name',])
        ]
        # constraints = [
        #     models.UniqueConstraint(fields=['group', 'section_name'], name='unique_group_section')
        # ]
        unique_together=('group', 'section_name')
        verbose_name_plural = "06 Sections"



class SubjectName(models.Model):
    name = models.CharField(max_length=100)
    name_bengali = models.CharField(max_length=100)
    code = models.PositiveIntegerField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.name_bengali})"

    class Meta:
        verbose_name_plural = "07 Subject Names"
        ordering = ['code']




class SubjectForIMS(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="subjectforims",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='subjectforims',
        verbose_name="Year"
    )
    class_instance= models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='subjectforims',
        verbose_name="Class"
    )
    group = models.ManyToManyField(
        Group,
        related_name='subjectforims',
        verbose_name="Groups"
    )
    # subject_name = models.CharField(max_length=255, unique=True, verbose_name="Subject Name")
    subject_name = models.ForeignKey(SubjectName, on_delete=models.SET_NULL, null=True, blank=True, related_name='subjectname')
    serial_number = models.PositiveIntegerField(verbose_name="Serial Number")
    # code = models.CharField(max_length=20, verbose_name="Subject Code")
    
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
        
        unique_together = ('class_instance','subject_name')
        
        verbose_name_plural = "08 Subjects"

    def __str__(self):
        groups = ", ".join([group.group_name for group in self.group.all()])
        # return f"{self.subject_name} {self.class_instance.class_name} {self.institute.name} {self.year.year}: (Groups: {groups}, Full Marks: {self.full_marks})"
        return f"{self.subject_name}"


class MarkTypeForSubject(models.Model):
    MARK_TYPE_CHOICES = [
        ('MCQ', 'Objective (MCQ)'),
        ('Theory', 'Theory'),
        ('Practical', 'Practical'),
        ('WR', 'Written(CQ)'),
        ('CA', 'Continuous Assessment'),
        ('CT', 'Class Test'),
        ('AE', 'Annual Exam'),
    ]

    subject = models.ForeignKey(
        SubjectForIMS,
        on_delete=models.CASCADE,
        related_name="mark_types",
        verbose_name="Subject"
    )
    mark_type = models.CharField(
        max_length=50,
        choices=MARK_TYPE_CHOICES,
        verbose_name="Mark Type"
    )
    max_marks = models.PositiveIntegerField(verbose_name="Maximum Marks", default=0)
    pass_marks = models.PositiveIntegerField(verbose_name="Pass Marks", default=0)

    class Meta:
        unique_together = ('subject', 'mark_type')  # Prevent duplicate mark types for a subject
        verbose_name_plural = "09 Mark Type"

    def __str__(self):
        return f"{self.subject.subject_name} - {self.mark_type}"