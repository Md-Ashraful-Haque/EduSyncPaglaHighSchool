from django.db import models

from ims_03_exam.models import SubjectForIMS
from ims_02_account.models import *
from ims_01_institute.models import *

# class Attendance(models.Model):
#     student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance_records")
#     date = models.DateField()
#     subject = models.ForeignKey(SubjectForIMS, on_delete=models.CASCADE, related_name="attendance_records")
#     status = models.CharField(
#         max_length=10,
#         choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Late', 'Late')],
#         default='Present'
#     )

#     class Meta:
#         # constraints =[
#         #     models.UniqueConstraint(fields=['student','date','subject',], name='unique_student_date_subject')
#         # ]
#         unique_together = ('student','date','subject') 

#     def __str__(self):
#         return f"{self.student.full_name} - {self.date} - {self.subject.name} ({self.status})"

# ims_05_attendance/models.py

class AttendanceDay(models.Model):
    ATTENDANCE_TYPE = [
        ('daily', 'Daily'),
        ('subject', 'Subject Wise'),
    ]

    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="attendance_days"
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name="attendance_days"
    )
    class_instance = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="attendance_days"
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="attendance_days"
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="attendance_days"
    )
    
    attendance_by = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="taken_attendances"
    )

    date = models.DateField()
    attendance_type = models.CharField(
        max_length=20, choices=ATTENDANCE_TYPE, default='daily'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            'institute',
            'year',
            'class_instance',
            'group',
            'section',
            'date',
        )
        ordering = ['-date']

    def __str__(self):
        return f"{self.class_instance} - {self.section} - {self.date}"


class StudentAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('late', 'Late'),
        ('absent', 'Absent'),
        ('holiday', 'Holiday'),
        ('half_day', 'Half Day'),
        ('initial', 'Initial'),
    ]

    attendance_day = models.ForeignKey(
        AttendanceDay,
        on_delete=models.CASCADE,
        related_name="student_attendances"
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendances"
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='initial'
    )
    entry_time = models.TimeField(null=True, blank=True)
    exit_time = models.TimeField(null=True, blank=True)
    note = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('attendance_day', 'student')
        ordering = ['student__roll_number']

    def __str__(self):
        return f"{self.student.name} - {self.attendance_day.date}"
