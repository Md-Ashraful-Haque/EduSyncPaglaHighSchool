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


# class SubjectForIMS(models.Model):
#     institute = models.ForeignKey(
#         Institute,
#         on_delete=models.CASCADE,
#         related_name="subjectforims",  # Unique related_name for institute
#         verbose_name="Institute"
#     )
#     year = models.ForeignKey(
#         Year,
#         on_delete=models.CASCADE,
#         related_name='subjectforims',
#         verbose_name="Year"
#     )
#     class_instance= models.ForeignKey(
#         Class,
#         on_delete=models.CASCADE,
#         related_name='subjectforims',
#         verbose_name="Class"
#     )
#     group = models.ManyToManyField(
#         Group,
#         related_name='subjectforims',
#         verbose_name="Groups"
#     )
#     subject_name = models.CharField(max_length=255, unique=True, verbose_name="Subject Name")
#     serial_number = models.PositiveIntegerField(verbose_name="Serial Number")
#     code = models.CharField(max_length=10, verbose_name="Subject Code")
    
#     full_marks = models.PositiveIntegerField(verbose_name="Full Marks", default=100)
#     pass_marks = models.PositiveIntegerField(verbose_name="Pass Marks", default=33)
    
#     mcq_marks = models.PositiveIntegerField(verbose_name="MCQ Marks", default=0)
#     theory_marks = models.PositiveIntegerField(verbose_name="Theory Marks", default=0)
#     practical_marks = models.PositiveIntegerField(verbose_name="Practical Marks", default=0)
    
#     mcq_pass_marks = models.PositiveIntegerField(verbose_name="MCQ Pass Marks", default=0)
#     theory_pass_marks = models.PositiveIntegerField(verbose_name="Theory Pass Marks", default=0)
#     practical_pass_marks = models.PositiveIntegerField(verbose_name="Practical Pass Marks", default=0)

#     class Meta:
#         indexes =[
#             models.Index(fields=['institute','year','class_instance','subject_name'])
#         ]
        
#         unique_together = ('class_instance','subject_name')
        
#         verbose_name_plural = "02 Subjects"

#     def __str__(self):
#         groups = ", ".join([group.group_name for group in self.groups.all()])
#         return f"{self.subject_name}: (Groups: {groups}, Full Marks: {self.full_marks})"
