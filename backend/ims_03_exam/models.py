from django.db import models
from ims_01_institute.models import *

class ExamForIMS(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="examforims",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='examforims',
        verbose_name="Year"
    )

    class_instance = models.ManyToManyField(
        Class,
        related_name='examforims',
        verbose_name="Groups"
    )

    exam_name = models.CharField(max_length=255, verbose_name="Exam Name in Bengali")
    exam_name_in_english = models.CharField(max_length=255, verbose_name="Exam Name in English")
    heighest_marks = models.FloatField(default=0.0, verbose_name="Highest Marks")
    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(verbose_name="End Date")
    
    def __str__(self):
        return f"{self.exam_name} "

    class Meta:
        indexes=[
            models.Index(fields=['institute','year','exam_name'])
        ]
        
        unique_together = ('institute', 'year', 'exam_name')
        
        verbose_name_plural = "01 Exams"



class ExamRoutine(models.Model):
    exam = models.ForeignKey(
        'ExamForIMS',
        on_delete=models.CASCADE,
        related_name='routines'
    )

    class_instance = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='exam_routines'
    )

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='exam_routines'
    )

    subject = models.ForeignKey(
        SubjectForIMS,   # adjust if your subject model name differs
        on_delete=models.CASCADE,
        related_name='exam_routines'
    )

    exam_date = models.DateField()
    exam_day = models.CharField(max_length=50, blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    is_published = models.BooleanField(default=False, verbose_name="Published")
    order = models.PositiveIntegerField(default=0, help_text="Order in timetable")

    class Meta:
        ordering = ['exam', 'class_instance', 'group', 'order', 'exam_date']
        indexes = [
            models.Index(fields=['exam','class_instance','group','exam_date'])
        ]

    def __str__(self):
        return f"{self.exam} - {self.class_instance} - {self.group} - {self.subject}"
