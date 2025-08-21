from django.db import models
from ims_01_institute.models import *
from ims_02_account.models import *
from ims_03_exam.models import *

class StudentSubjectResult(models.Model):
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="singleresults",  # Unique related_name for institute
        verbose_name="Institute"
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Year"
    )
    class_instance= models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Class"
    )
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Group"
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Section"
    )
    
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Student"
    )
    exam = models.ForeignKey(
        ExamForIMS,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Exam"
    )
    subject = models.ForeignKey(
        SubjectForIMS,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Subject"
    )

    class Meta:
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=['student', 'exam', 'subject'],
        #         name='unique_student_exam_subject'
        #     )
        # ]
        indexes =[
            models.Index(fields=['institute','year','class_instance','group','section','student','exam','subject'])
        ]
        unique_together = ('student', 'exam', 'subject')
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
        StudentSubjectResult,
        on_delete=models.CASCADE,
        related_name='marks'
    )
    marks_type = models.ForeignKey(
        MarksType,
        on_delete=models.CASCADE,
        related_name='marks'
    )
    marks = models.PositiveIntegerField(verbose_name="Marks")

    class Meta:
        unique_together = ('single_result', 'marks_type')  # Prevent duplicate entries for same marks type
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=['single_result', 'marks_type'],
        #         name='unique_single_result_marks_type'
        #     )
        # ]
        indexes =[
            models.Index(fields=['single_result','marks_type'])
        ]
        verbose_name_plural = "Marks"

    def __str__(self):
        return f"{self.marks_type} - {self.marks}"

