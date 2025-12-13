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
import uuid
from image_cropping import ImageCropField, ImageRatioField
from backend.utils import safe_upload_to_teacher_picture, safe_upload_to_teacher_signature,safe_upload_to_student_pictures
from backend.utils import ( 
    safe_upload_to_website_teacher_certificate,
)
class User(AbstractUser):
    groups = models.ManyToManyField(
        "auth.Group", related_name="custom_user_set", blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="custom_permission_user_set", blank=True
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_picture = models.ImageField(
        upload_to="user_profiles/", null=True, blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        indexes = [models.Index(fields=["username"])]
        verbose_name_plural = "01 Users"

    @property
    def institute(self):
        if hasattr(self, "admin_profile") and self.admin_profile:
            return self.admin_profile.institute
        elif hasattr(self, "teacher_profile") and self.teacher_profile:
            return self.teacher_profile.institute
        print("User has no associated institute.")
        raise AttributeError("User has no associated institute.")


class Admin(models.Model):
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="Admins"
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="admin_profile",
        null=True,  # Initially null until a user is created
        blank=True,
    )
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to="admin_images/", null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"
        # return f"{self.user.username} (Admin) // {self.institute.name} // {self.phone_number}"

    class Meta:
        verbose_name_plural = "02 Admins"

# /////////////////////// Teacher Examination Name: SSC, pHD /////////////////////////////
class Examination(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_bn = models.CharField(max_length=100, null=True, blank=True)  # Optional Bangla name
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Examination"
        verbose_name_plural = "Examinations"

    def __str__(self):
        return self.name


class Teacher(models.Model):
    DESIGNATION_CHOICES = [
        ("assistant_teacher", "Assistant Teacher"),
        ("assistant_head_teacher", "Assistant Head Teacher"),
        ("head_teacher", "Head Teacher"),
        ("lecturer", "Lecturer"),
        ("demonstrator", "Demonstrator"),
        ("senior_lecturer", "Senior Lecturer"),
        ("assistant_professor", "Assistant Professor"),
        ("professor", "Professor"),
        ("principal", "Principal"),
        ("lab_assistant", "Lab Assistant"),
        ("office_assistant", "Office Assistant"),
        ("office_assistant_cum_typist", "Office Assistant Cum Typist"),
        ("assistant_librarian", "Assistant Librarian"),
        ("mali", "Mali"),
        ("nanny", "Nanny"),
        ("4th_grade_employee", "4th Grade Employee"),
        ("Cleaner", "Cleaner"),
    ]
    BLOOD_GROUP_CHOICES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
        ("O+", "O+"),
        ("O-", "O-"),
    ]

    SECTION_CHOICES = [
        ("MPO", "MPO"),
        ("Non-MPO", "Non-MPO"),
    ]

    RELIGION_CHOICES = [
        ("Islam", "Islam"),
        ("Hinduism", "Hinduism"),
        ("Christianity", "Christianity"),
        ("Buddhism", "Buddhism"),
        ("Other", "Other"),
    ]
    DESIGNATION_BN_MAP = {
        "assistant_teacher": "সহকারী শিক্ষক",
        "assistant_head_teacher": "সহকারী প্রধান শিক্ষক",
        "head_teacher": "প্রধান শিক্ষক",
        "lecturer": "প্রভাষক",
        "demonstrator": "প্রদর্শক",
        "senior_lecturer": "জেষ্ঠ্য প্রভাষক",
        "assistant_professor": "সহকারী অধ্যাপক",
        "professor": "অধ্যাপক",
        "principal": "প্রিন্সিপাল",
        
        "lab_assistant": "ল্যাব সহকারী",
        "office_assistant": "অফিস-সহকারী",
        "office_assistant_cum_typist": "অফিস অ্যাসিস্ট্যান্ট কাম-টাইপিস্ট",
        "assistant_librarian": "সহকারী গ্রন্থাগারিক",
        "mali": "মালি",
        "nanny": "আয়া",
        "4th_grade_employee": "৪র্থ শ্রেনি কর্মচারী", 
        "Cleaner": "পরিচ্ছন্নতাকর্মী", 
    }
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="Teachers"
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        null=True,  # Initially null until a user is created
        blank=True,
    )
    name = models.CharField(max_length=100)
    bangla_name = models.CharField(max_length=100, null=True, blank=True)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, unique=True)
    is_whatsapp = models.BooleanField(
        default=False, help_text="Is this a WhatsApp number?"
    )
    # subjects_taught = models.ManyToManyField(SubjectForIMS, related_name='teachers', null=True, blank=True)
    subject_assignments = models.ManyToManyField(
        SubjectForIMS,
        through="TeacherSubjectAssignment",
        related_name="assigned_teachers",
    )

    designation = models.CharField(
        max_length=50,
        choices=DESIGNATION_CHOICES, 
        verbose_name="Designation", null=True, blank=True
    )

    # picture = models.ImageField(upload_to="teacher_picture/", null=True, blank=True)
    picture = ImageCropField(upload_to=safe_upload_to_teacher_picture, blank=True, null=True)
    picture_cropped = ImageRatioField('picture', '300x380')    
    
    # signature = models.ImageField(upload_to="teacher_signature/", null=True, blank=True)
    signature = ImageCropField(upload_to=safe_upload_to_teacher_signature, blank=True, null=True)
    signature_cropped = ImageRatioField('signature', '300x100')    

    major_subject = models.CharField(
        "Major Subject", max_length=50, null=True, blank=True
    )
    allow_all_subject = models.BooleanField(
        default=False, verbose_name="Enable All Subjects"
    )

    allow_students_info = models.BooleanField(
        default=False, verbose_name="Enable Student Info"
    )

    only_marks_input = models.BooleanField(
        default=False, verbose_name="Enable Marks Input Only"
    )

    allow_result_processing = models.BooleanField(
        default=False, verbose_name="Enable Result Processing"
    )

    dob = models.DateField("Date of Birth", null=True, blank=True)
    joining_date = models.DateField("Joining Date", null=True, blank=True)
    indexing_of_mpo = models.DateField("Indexing Date", null=True, blank=True)
    index_number = models.CharField(
        "Index Number", max_length=50, null=True, blank=True
    )
    qualification = models.TextField("Educational Qualification", blank=True)
    blood_group = models.CharField(
        "Blood Group", max_length=3, choices=BLOOD_GROUP_CHOICES, null=True, blank=True
    )

    email = models.EmailField("Email", blank=True, null=True)
    religion = models.CharField(
        "Religion", max_length=20, choices=RELIGION_CHOICES, null=True, blank=True
    )
    section = models.CharField(
        "Section",
        max_length=20,
        choices=SECTION_CHOICES,
        default="MPO",
        null=True,
        blank=True,
    )
    nid = models.CharField("NID Number", max_length=20, blank=True)
    address = models.TextField("Address", blank=True)
    order = models.PositiveIntegerField(default=0, help_text="Order of Teacher")
    is_visible = models.BooleanField("Visible on Website", default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def can_teach_all_subjects(self):
        """
        Property to check if the teacher can manage all subjects.
        Useful in permissions and query optimization.
        """
        return self.allow_all_subject

    @property
    def designation_bn(self):
        """Return designation in Bangla."""
        return self.DESIGNATION_BN_MAP.get(self.designation, "")

    def __str__(self):
        return (
            f"{self.name}, {self.get_designation_display()}" if self.user else self.name
        )

    class Meta:
        ordering = ["order"]
        verbose_name_plural = "03 Teachers"


#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Educational BG ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////
class TeacherEducation(models.Model):
    teacher = models.ForeignKey(
        Teacher, on_delete=models.CASCADE, related_name="educations"
    )
    examination = models.ForeignKey(
        Examination, on_delete=models.SET_NULL, null=True, related_name="educations"
    )
    board_or_institute = models.CharField(max_length=255)
    group_or_subject = models.CharField(max_length=255, blank=True, null=True)
    result = models.CharField(max_length=10, blank=True, null=True)
    passing_year = models.PositiveIntegerField(blank=True, null=True)
    roll = models.CharField(max_length=50, blank=True, null=True)
    ntrca_batch = models.CharField(max_length=30, blank=True, null=True)
    duration = models.CharField(max_length=10, blank=True, null=True)  # e.g. "4 Years"

    image = ImageCropField(
        "Certificate",
        upload_to=safe_upload_to_website_teacher_certificate,
        blank=True,
        null=True,
    )
    image_cropped = ImageRatioField("image", "3508x2480",verbose_name="Certificate Cropped")

    class Meta:
        verbose_name = "Educational Qualification"
        verbose_name_plural = "Educational Qualifications"
        ordering = ["passing_year"]

    def __str__(self):
        return f"{self.examination} - {self.board_or_institute}"



class TeacherSubjectAssignment(models.Model):
    # teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='subject_assignments')
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="teacher_subject_assignments",  # ⭐ This solves your error
    )
    # subject = models.ForeignKey('SubjectForIMS', on_delete=models.CASCADE)

    year = models.ForeignKey(Year, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(SubjectForIMS, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            "teacher",
            "year",
            "class_instance",
            "group",
            "section",
            "subject",
        )
        verbose_name = "Teacher Subject Assignment"
        verbose_name_plural = "Teacher Subject Assignments"

    def __str__(self):
        return f"{self.teacher.name} | {self.year.year} | {self.class_instance.class_name.name} | {self.group.group_name if self.group else ''} | {self.section.section_name if self.section else ''} | {self.subject.subject_name.name}"


class Student(models.Model):
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="students"
    )
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name="students")
    class_instance = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="students"
    )
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="students")
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="students"
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
        null=True,  # Initially null until a user is created
        blank=True,
    )
    # name = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    name_bangla = models.CharField(max_length=255, null=True, blank=True)
    fathers_name = models.CharField(max_length=255, null=True, blank=True)
    mothers_name = models.CharField(max_length=255, null=True, blank=True)
    nid = models.CharField(max_length=255, null=True, blank=True)
    roll_number = models.CharField(max_length=20)
    student_id = models.CharField(max_length=15, unique=True, editable=False)
    password = models.CharField(max_length=128)
    dob = models.DateField(null=True, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, unique=True, blank=True)
    guardian_mobile_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    # picture = models.ImageField(upload_to="student_images/", null=True, blank=True)
    
    picture = ImageCropField(upload_to=safe_upload_to_student_pictures, blank=True, null=True)
    picture_cropped = ImageRatioField('picture', '300x380')    

    def __str__(self):
        return f"{self.name}"
        # return f"{self.name}({self.id})"
        # return f"{self.name}- {self.roll_number} - {self.class_instance.class_name}- {self.institute.name} - {self.year.year}"

    def save(self, *args, **kwargs):
        if not self.student_id:
            shift_code = f"{self.class_instance.shift[0].upper()}"
            year = f"{self.year.year:03d}"
            class_code = f"{self.class_instance.class_name.code:02d}"
            roll = f"{int(self.roll_number):03d}"
            self.student_id = f"{shift_code}{year}{class_code}{self.group.group_name.code}{ord(self.section.section_name) - ord('a') + 1:02d}{roll}"

        if not self.phone_number:
            self.phone_number = self.student_id
        super().save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(
                fields=[
                    "institute",
                    "year",
                    "class_instance",
                    "group",
                    "section",
                    "roll_number",
                ]
            )
        ]
        unique_together = ("section", "roll_number")
        verbose_name_plural = "04 Students"


class StudentClassHistory(models.Model):
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="class_history"
    )
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, verbose_name="Institute"
    )
    year = models.ForeignKey(Year, on_delete=models.CASCADE, verbose_name="Year")
    class_instance = models.ForeignKey(
        Class, on_delete=models.CASCADE, verbose_name="Class"
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, verbose_name="Section"
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Group"
    )
    from_date = models.DateField()
    to_date = models.DateField(
        null=True, blank=True
    )  # Null if the student is still in this class

    def __str__(self):
        return f"{self.student}"
        # return f"{self.student} - {self.class_instance} ({self.from_date} to {self.to_date})"

    class Meta:
        verbose_name_plural = "05 StudentClassHistories"


class Guardian(models.Model):
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="Guardians"
    )
    students = models.ManyToManyField("Student", related_name="guardians")
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="guardian_profile",
        null=True,  # Initially null until a user is created
        blank=True,
    )
    # Other guardian-specific fields

    def __str__(self):
        return self.user.username  # Display the username for the guardian

    class Meta:
        verbose_name_plural = "06 Guardians"


class Staff(models.Model):
    institute = models.ForeignKey(
        Institute, on_delete=models.CASCADE, related_name="Staff"
    )
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=128)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff_profile",
        null=True,  # Initially null until a user is created
        blank=True,
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
        # print("signal called.")
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


