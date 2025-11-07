from django.db import models

from ims_03_exam.models import SubjectForIMS
from ims_02_account.models import User

class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    subject = models.ForeignKey(SubjectForIMS, on_delete=models.CASCADE, related_name="attendance_records")
    status = models.CharField(
        max_length=10,
        choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Late', 'Late')],
        default='Present'
    )

    class Meta:
        # constraints =[
        #     models.UniqueConstraint(fields=['student','date','subject',], name='unique_student_date_subject')
        # ]
        unique_together = ('student','date','subject') 

    def __str__(self):
        return f"{self.student.full_name} - {self.date} - {self.subject.name} ({self.status})"
