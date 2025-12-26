from core.utils import debug
# from django.utils.functional import cached_property
from django.db import models
# from django.db.models import Sum
from ims_01_institute.models import Institute, Year, Class, Group, Section, SubjectForIMS
from ims_02_account.models import *
from ims_03_exam.models import ExamForIMS
from django.db.models import Sum, Q
from django.db.models.functions import Coalesce
# from django.db import models
# from ims_01_institute.models import *
# from ims_02_account.models import *
# from ims_03_exam.models import *
# from django.db.models import Sum
# constants.py

# studnet should pass individual mark type and total mark from subject pass marks
COMBINED_SUBJECTS = {
    #xxxxxxxxxxxxxxxxxxxxxxxx Class Nine and Ten
    "BAN_NINE": {   # Bangla (combined group)
        "papers": ["g-91001", "g-91002"],   # subject codes
        "mcq_pass": 20,
        "cq_pass": 46,
    },
    "ENG_TEN": {   # English (combined group)
        "papers": ["g-91003", "g-91004"],   # subject codes
        "mcq_pass": 0,
        "cq_pass": 66,
    },
}

def calculate_letter_grade(grade_point: float) -> str:
    """
    Convert a grade point to a letter grade based on predefined ranges.

    Args:
        grade_point (float): The grade point to convert (0.0 to 5.0).

    Returns:
        str: The corresponding letter grade (e.g., "A+", "Fail").

    Raises:
        ValueError: If the grade point is invalid (outside the expected range).
    """
    if grade_point > 5.0 or grade_point < 0:
        return "Invalid Grade Point. File: ims_04_result/models.py, Function: calculate_letter_grade"
    if grade_point >= 5.0:
        return "A+"
    if grade_point >= 4.0:
        return "A"
    if grade_point >= 3.5:
        return "A-"
    if grade_point >= 3.0:
        return "B"
    if grade_point >= 2.0:
        return "C"
    if grade_point >= 1.0:
        return "D"
    return "Fail"


def calculate_grade_and_point(total_obtained_marks: int, total_marks_of_subject: int) -> tuple[str, float]:
    """
    Calculate the letter grade and grade point based on the percentage of marks obtained.

    Args:
        total_obtained_marks (int): The marks obtained by the student.
        total_marks_of_subject (int): The total possible marks for the subject.

    Returns:
        tuple[str, float]: A tuple of (letter grade, grade point).

    Raises:
        ValueError: If total_obtained_marks or total_marks_of_subject are invalid.
    """
    if total_marks_of_subject <= 0:
        raise ValueError("Total marks of subject must be greater than 0.")
    if total_obtained_marks <= 0:
        # print("total_obtained_marks: ", total_obtained_marks)
        return "Fail", 0.0
        raise ValueError("Total obtained marks cannot be negative.")

    # if total_obtained_marks 
    percentage = (total_obtained_marks * 100) / total_marks_of_subject

    if not (0 <= percentage <= 100):
        raise ValueError("Invalid total_obtained_marks value. Percentage must be between 0 and 100.")

    if 80 <= percentage <= 100:
        return "A+", 5.0
    if 70 <= percentage < 80:
        return "A", 4.0
    if 60 <= percentage < 70:
        return "A-", 3.5
    if 50 <= percentage < 60:
        return "B", 3.0
    if 40 <= percentage < 50:
        return "C", 2.0
    if 33 <= percentage < 40:
        return "D", 1.0
    return "Fail", 0.0


class StudentSubjectResult(models.Model):
    """Model to store the result of a student for a specific exam across subjects."""
    institute = models.ForeignKey(
        Institute,
        on_delete=models.CASCADE,
        related_name="singleresults",
        verbose_name="Institute",
        help_text="The institute associated with the result."
    )
    year = models.ForeignKey(
        Year,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Year",
        help_text="The academic year of the result."
    )
    class_instance = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Class",
        help_text="The class (e.g., Six) of the student."
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Group",
        help_text="The group (e.g., Science, Arts) of the student."
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Section",
        help_text="The section (e.g., A, B) of the student."
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Student",
        help_text="The student associated with this result."
    )
    exam = models.ForeignKey(
        ExamForIMS,
        on_delete=models.CASCADE,
        related_name='singleresults',
        verbose_name="Exam",
        help_text="The exam for which the result is recorded."
    )
    letter_grade = models.CharField(
        max_length=10,
        default='None',
        verbose_name="Letter Grade",
        help_text="The final letter grade for the student (e.g., A+, Fail)."
    )
    gpa = models.FloatField(
        default=0.0,
        verbose_name="GPA",
        help_text="The GPA for the student across all subjects."
    )
    gpa_without_optional = models.FloatField(
        default=0.0,
        verbose_name="GPA Without Optinal",
        help_text="The GPA for the student without Optional Subject."
    )
    total_obtained_marks = models.PositiveIntegerField(
        default=0,
        verbose_name="Total Obtained Marks",
        help_text="The total marks obtained across all subjects."
    )
    classwise_merit = models.PositiveIntegerField(
        default=0,
        verbose_name="Class Wise Merit",
        help_text="The merit position within the class."
    )
    sectionwise_merit = models.PositiveIntegerField(
        default=0,
        verbose_name="Section Wise Merit",
        help_text="The merit position within the section."
    )
    total_fail_subjects = models.PositiveIntegerField(
        default=0,
        verbose_name="Total Fail Subjects",
        help_text="The number of subjects the student failed."
    )

    class Meta:
        indexes = [
            models.Index(fields=['institute', 'year', 'class_instance', 'group', 'section', 'student', 'exam'])
        ]
        unique_together = ('student', 'exam')
        verbose_name = "Result"
        verbose_name_plural = "01 Results"

    def __str__(self) -> str:
        """String representation of the result."""
        return f"Result {self.id} - {self.student} - {self.exam}"

    @property
    def final_gpa_oldNotUsed(self) -> float:
        """
        Calculate the final GPA for the student, excluding optional subjects.
        Returns:
            float: The GPA, or 0.0 if the student fails any subject or is absent in any compulsory subject.
        """
        # Prefetch all subjects related to the result in order
        subjects = list(
            self.subjectforresult.select_related('subject').order_by('subject__serial_number')
        )
        
        # Count of compulsory (non-optional) subjects for the class
        total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count()
        
        # debug("total_subjects: ", total_subjects)
        # debug("self.class_instance", self.class_instance)

        total_grade_point = 0
        participated_subjects = 0

        for s in subjects:
            subj = s.subject
            grade, point = s.grade_and_point  # Assume returns tuple: (str, float)

            if subj.is_optional:
                total_subjects -= 1  # optional subjects are excluded from required count
                if subj.full_marks == 100 and point > 2:
                    total_grade_point += point - 2
                continue

            if grade == "Fail":
                return 0.0

            total_grade_point += point
            participated_subjects += 1

        # If not all required subjects were attended
        if participated_subjects < total_subjects:
            return 0.0
        result = min(5.0, round(total_grade_point / participated_subjects, 2))
        return result

    @property
    def final_gpa(self) -> float:
        """
        Calculate the final GPA for the student, excluding optional subjects.
        Returns:
            float: The GPA, or 0.0 if the student fails any subject or is absent in any compulsory subject.
        """
        # Prefetch all subjects related to the result in order
        subjects = list(
            self.subjectforresult.select_related('subject').order_by('subject__serial_number')
        )
        
        # print("subjects: ", subjects,len(subjects))
        
        # Count of compulsory (non-optional) subjects for the class
        # total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group)
        # print("total_subjects: ", total_subjects)
        total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count()
        
        # debug("total_subjects: ", total_subjects)
        # debug("self.class_instance", self.class_instance)
        # if int(self.student.roll_number) == 20:
        #     print("\n\n\n Student name, roll and section: ",self.student.name, self.student.roll_number, self.section.section_name.name)
        total_grade_point = 0
        participated_subjects = 0
        counted_combined_groups = set()
        
        # print("\n\n\n Student name, roll and section: ",self.student.name, self.student.roll_number, self.section.section_name.name)
        for s in subjects:
            subj = s.subject
            grade, point = s.grade_and_point  # Assume returns tuple: (str, float)
            
            # if int(self.student.roll_number) == 20:
            #     print("Subject and result and optional: ", subj, grade, point, subj.is_optional)
            # print("grade, point: ", grade, point )
            if subj.is_optional:
                # total_subjects -= 1 
                if subj.full_marks == 100 and point > 2:
                    total_grade_point += point - 2
                continue
            
            subject_code = s.subject.subject_name.code

            # --- Handle combined subjects (Bangla/English) ---
            for group, rules in COMBINED_SUBJECTS.items():
                if subject_code in rules["papers"]:
                    if group not in counted_combined_groups:  # avoid double counting
                        if grade == "Fail":
                            return 0.0

                        total_grade_point += point
                        participated_subjects += 1
                        # ////////////// total count subject ///////////////////////
                        total_subjects -= 1

                        counted_combined_groups.add(group)
                    break
            else:
                # --- Default rule: non-combined compulsory subject ---
                if grade == "Fail":
                    # if int(self.student.roll_number) == 3:
                    #     print("subject_name : ",  s.subject.subject_name.name)
                    #     print("===================== Return Fail ==============")
                    # print("subject_name : ",  s.subject.subject_name.name)
                    # print("===================== Return Fail ==============")
                    return 0.0

                total_grade_point += point
                participated_subjects += 1

            

            

        # If not all required subjects were attended
        # print("participated_subjects < total_subjects", participated_subjects , total_subjects)
        if participated_subjects < total_subjects:
            # print("==================== Not atted to all Subjects =========================")
            return 0.0
        result = min(5.0, round(total_grade_point / participated_subjects, 2))
        # if int(self.student.roll_number) == 3:
        #     print("With OP: ", result)
        return result

    @property
    def final_gpa_without_optional(self) -> float:
        """
        Calculate the final GPA for the student, excluding optional subjects.
        Returns:
            float: The GPA, or 0.0 if the student fails any subject or is absent in any compulsory subject.
        """
        # Prefetch all subjects related to the result in order
        subjects = list(
            self.subjectforresult.select_related('subject').order_by('subject__serial_number')
        )
        
        # Count of compulsory (non-optional) subjects for the class
        total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count()
        
        # debug("total_subjects: ", total_subjects)
        # debug("self.class_instance", self.class_instance)
        # if int(self.student.roll_number) == 3:
        #     print("\n\n\nWith Optional Student name and roll section: ",self.student.name, self.student.roll_number, self.section.section_name.name)
        total_grade_point = 0
        participated_subjects = 0
        counted_combined_groups = set()
        for s in subjects:
            subj = s.subject
            grade, point = s.grade_and_point  # Assume returns tuple: (str, float)
            # if int(self.student.roll_number) == 3:
            #     print("Subject Name: ", s.subject.subject_name.name, grade, point )
            # print("grade, point: ", grade, point )
            if subj.is_optional:
                # total_subjects -= 1 
                # if subj.full_marks == 100 and point > 2:
                #     total_grade_point += point - 2
                continue
            
            subject_code = s.subject.subject_name.code

            # --- Handle combined subjects (Bangla/English) ---
            for group, rules in COMBINED_SUBJECTS.items():
                if subject_code in rules["papers"]:
                    if group not in counted_combined_groups:  # avoid double counting
                        if grade == "Fail":
                            return 0.0

                        total_grade_point += point
                        participated_subjects += 1
                        # ////////////// total count subject ///////////////////////
                        total_subjects -= 1

                        counted_combined_groups.add(group)
                    break
            else:
                # --- Default rule: non-combined compulsory subject ---
                if grade == "Fail":
                    # if int(self.student.roll_number) == 3:
                    #     print("subject_name : ",  s.subject.subject_name.name)
                    #     print("===================== Return Fail ==============")
                    return 0.0

                total_grade_point += point
                participated_subjects += 1

            

            

        # If not all required subjects were attended
        # print("participated_subjects < total_subjects", participated_subjects , total_subjects)
        if participated_subjects < total_subjects:
            # print("==================== Not atted to all Subjects =========================")
            return 0.0
        result = min(5.0, round(total_grade_point / participated_subjects, 2))
        # if int(self.student.roll_number) == 3:
        #     print("Without OP: ", result)
        return result

    # @property
    # def final_gpa_without_optional(self) -> float:
    #     """
    #     Calculate the final GPA for the student, excluding optional subjects.
    #     Returns:
    #         float: The GPA, or 0.0 if the student fails any subject or is absent in any compulsory subject.
    #     """
    #     # Prefetch all subjects related to the result in order
    #     subjects = list(
    #         self.subjectforresult.select_related('subject').order_by('subject__serial_number')
    #     )
        
    #     # Count of compulsory (non-optional) subjects for the class
    #     total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count()
        
    #     # debug("total_subjects: ", total_subjects)
    #     # debug("self.class_instance", self.class_instance)

    #     total_grade_point = 0
    #     participated_subjects = 0
    #     counted_combined_groups = set()
    #     for s in subjects:
    #         subj = s.subject
    #         grade, point = s.grade_and_point  # Assume returns tuple: (str, float)
    #         if subj.is_optional:
    #             total_subjects -= 1
    #             continue
            
    #         subject_code = s.subject.subject_name.code

    #         # --- Handle combined subjects (Bangla/English) ---
    #         for group, rules in COMBINED_SUBJECTS.items():
    #             if subject_code in rules["papers"]:
    #                 if group not in counted_combined_groups:  # avoid double counting
    #                     if grade == "Fail":
    #                         return 0.0

    #                     total_grade_point += point
    #                     participated_subjects += 1

    #                     counted_combined_groups.add(group)
    #                 break
    #         else:
    #             # --- Default rule: non-combined compulsory subject ---
    #             if grade == "Fail":
    #                 return 0.0

    #             total_grade_point += point
    #             participated_subjects += 1

            

            

    #     # If not all required subjects were attended
    #     if participated_subjects < total_subjects:
    #         return 0.0
    #     result = min(5.0, round(total_grade_point / participated_subjects, 2))
    #     return result

    @property
    def final_gpa_without_optionalOldNotUsed(self) -> float:
        """
        Calculate the final GPA for the student, excluding optional subjects.
        Returns:
            float: The GPA, or 0.0 if the student fails any subject or is absent in any compulsory subject.
        """
        # Prefetch all subjects related to the result in order
        subjects = list(
            self.subjectforresult.select_related('subject').order_by('subject__serial_number')
        )
        
        # Count of compulsory (non-optional) subjects for the class
        total_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count() 
        total_grade_point = 0
        participated_subjects = 0

        for s in subjects:
            subj = s.subject
            grade, point = s.grade_and_point  # Assume returns tuple: (str, float)

            if subj.is_optional:
                total_subjects -= 1
                continue

            if grade == "Fail":
                return 0.0

            total_grade_point += point
            participated_subjects += 1

        # If not all required subjects were attended
        if participated_subjects < total_subjects:
            return 0.0

        return round(total_grade_point / participated_subjects, 2)
    

    @property
    def final_grade(self) -> str:
        """
        Determine the final letter grade based on the student's GPA.

        Returns:
            str: The final letter grade (e.g., A+, Fail).
        """
        return calculate_letter_grade(self.final_gpa)

    @property
    def total_marks_of_student(self) -> float:
        """
        Calculate the total marks of the student, excluding optional subject penalties.
        
        Rules:
            - Optional subjects are not directly added.
            - If optional subject has 100 full marks(For avoiding CA) and point > 1 (Greater than 40),
            extra marks (beyond 40) are counted if not failed.
            - Compulsory subjects always add their marks.
        
        Returns:
            float: The total marks for the student.
        """
        subjects = self.subjectforresult.select_related('subject').order_by('subject__serial_number')

        total_marks = 0

        for s in subjects:
            subj = s.subject
            grade, point = s.grade_and_point  # (str, float)

            if subj.is_optional:
                # Handle optional subjects (bonus marks rule)
                if subj.full_marks == 100 and point > 1 and grade != "Fail":
                    total_marks += max(s.total_marks - 40, 0)
                # elif subj.full_marks == 50 and point > 1 and grade != "Fail":
                #     total_marks += max(s.total_marks - 20, 0)
            else:
                # Compulsory subjects: add raw marks
                total_marks += max(s.total_marks, 0)

        return total_marks

    
    @property
    def failed_subject_count_for_tabulation(self) -> int:
        """
        Count the number of subjects the student failed, excluding optional subjects.

        Returns:
            int: The number of failed subjects.
        """
        try:
            # Fetch all participated subjects (prefetch subject to avoid N+1 queries)
            subjects = list(self.subjectforresult.select_related('subject').order_by('subject__serial_number'))
            # print("Total Subject: ", len(subjects))

            total_compulsory_subjects = self.class_instance.subjectforims.filter(is_optional=False, group=self.group).count()
            # print("student roll: ", self.student.name, self.student.roll_number)
            # print("total_compulsory_subjects: ", total_compulsory_subjects)

            # Count failed compulsory subjects
            # failed_count = sum(
            #     1 for s in subjects if not s.has_passed_all_mark_types_for_tabulation
            # )
            failed_count = 0
            
            # failed_count = sum(
            #     1 for s in subjects if not s.subject.is_optional and not s.has_passed_all_mark_types_for_tabulation
            # )
            # failed_count_six_to_ten = sum(
            #     1 for s in subjects if not s.subject.is_optional and s.total_marks < s.subject.pass_marks
            # )
            
            if  6 <= self.student.class_instance.class_name.code <= 8:
                failed_count = sum(
                1 for s in subjects if not s.subject.is_optional and s.total_marks < s.subject.pass_marks
            )
            else:
                failed_count = sum(
                1 for s in subjects if not s.subject.is_optional and not s.has_passed_all_mark_types_for_tabulation
            )
            
            # print("failed_count_six_to_ten: ", failed_count_six_to_ten)
            # print("failed_count: ", failed_count)

            # If student missed some compulsory subjects, count them as failed
            not_participated = max(0, total_compulsory_subjects - len(subjects))
            # print("not_participated: ",not_participated )

            return failed_count + not_participated

        except Exception as e:
            print("Error in failed_subject_count:", e)
            return 0

    @property
    def failed_subject_count(self) -> int:
        """
        Count the number of failed subjects (excluding optional).
        - For combined subjects (Bangla, English), count them as one fail if combined rule fails.
        - For others, count individually.
        Iterates through all subjects for the student.

        -If subject belongs to a combined group (e.g., "BAN"), check once for the whole group and add 1 fail max.

        -Keeps track of already-processed groups in counted_combined_groups to prevent double-counting.

        -For all other subjects → normal per-subject fail check.

        -If student did not participate in some compulsory subjects → count as fail.
        """
        try:
            # Fetch all subjects the student has results for
            subjects = list(
                self.subjectforresult.select_related('subject__subject_name')
                .order_by('subject__serial_number')
            )

            total_compulsory_subjects = self.class_instance.subjectforims.filter(
                is_optional=False, group=self.group
            ).count()

            failed_count = 0
            counted_combined_groups = set()

            for s in subjects:
                subject_code = s.subject.subject_name.code

                # --- Handle combined subjects (Bangla/English) ---
                for group, rules in COMBINED_SUBJECTS.items():
                    if subject_code in rules["papers"]:
                        if group not in counted_combined_groups:  # avoid double counting
                            combined_subjects = SubjectForResult.objects.filter(
                                student_from_result_table=self,
                                subject__subject_name__code__in=rules["papers"]
                            )

                            # Count fail if the combined rule fails
                            if not any(combined_subjects) or not s.has_passed_all_mark_types:
                                failed_count += 1

                            counted_combined_groups.add(group)
                        break
                else:
                    # --- Default rule: non-combined compulsory subject ---
                    if not s.subject.is_optional and not s.has_passed_all_mark_types:
                        failed_count += 1

            # --- If student missed some compulsory subjects → count as fail ---
            not_participated = max(0, total_compulsory_subjects - len(subjects))

            return failed_count + not_participated

        except Exception as e:
            print("Error in failed_subject_count:", e)
            return 0



class SubjectForResult(models.Model):
    """Model to store subject-specific results for a student in an exam."""
    student_from_result_table = models.ForeignKey(
        StudentSubjectResult,
        on_delete=models.CASCADE,
        related_name='subjectforresult',
        verbose_name="Student Result",
        help_text="The overall result record this subject belongs to."
    )
    subject = models.ForeignKey(
        SubjectForIMS,
        on_delete=models.CASCADE,
        related_name='subjectforresult',
        verbose_name="Subject",
        help_text="The subject (e.g., Math, Science) for this result."
    )

    class Meta:
        unique_together = ('student_from_result_table', 'subject')
        verbose_name = "Subject Result"
        verbose_name_plural = "02 Subject for Result"

    def __str__(self) -> str:
        """String representation of the subject result."""
        return f"SubjectResult {self.id} - {self.subject} for {self.student_from_result_table}"
    
    # @property
    # def total_marks(self) -> int:
    #     """
    #     Calculate the total positive marks for this subject 
    #     by summing only positive marks from all related 
    #     TypewiseMarksForSubject entries.

    #     Returns:
    #         int: The total positive marks, or 0 if no marks are recorded.
    #     """
    #     total = self.typewisemarksforsubject.aggregate(
    #         total_marks=Sum('marks', filter=Q(marks__gt=0))
    #     )['total_marks']
    #     # print("Total: ", total)
    #     if total is None:
    #         # print('xxxxxxxxxxxxxxxxxxxxxxxx: ', total)
    #         total = self.typewisemarksforsubject.aggregate(total_marks=Sum('marks'))['total_marks']
        
    #     return total if total is not None else 0
    
    @property
    def total_marks(self) -> int:
        """return summation by skkipng negative value
        - aggregate return None if filter condition get 0 rows
        - that that time we need to negative sum like -2 or -3 for showing student absence in marksheet and tabu

        Returns:
            int: _description_
        """
        total = self.typewisemarksforsubject.aggregate(
            total_marks=Coalesce(Sum('marks', filter=Q(marks__gt=0)), Sum('marks'))
        )['total_marks']
        return total if total is not None else 0
    
    @property
    def combined_total_marks(self) -> int:
        """Calculate total marks for the subject, considering combined subjects.
        If the subject is part of a combined group (is_combined=True), sum the marks
        of all subjects in the same combined_group for the same student result.
        Otherwise, return the individual subject's total marks.

        Optimized with select_related and prefetch_related for performance.

        Returns:
            int: Total marks for the subject or combined group.
        """
        # Assume subject_name is pre-fetched with select_related('subject__subject_name')
        subject_name = getattr(self.subject, 'subject_name', None)
        if subject_name and subject_name.is_combined and subject_name.is_displayed_on_marksheet:
            # Query related subjects in the same combined group
            related_subjects = SubjectForResult.objects.filter(
                student_from_result_table=self.student_from_result_table,
                subject__subject_name__is_combined=True,
                subject__subject_name__combined_group=subject_name.combined_group
            ).select_related('subject__subject_name').prefetch_related('typewisemarksforsubject')

            # Aggregate marks for all subjects in the combined group
            total = related_subjects.aggregate(
                total_marks=Coalesce(
                    Sum('typewisemarksforsubject__marks', filter=Q(typewisemarksforsubject__marks__gt=0)),
                    0
                )
            )['total_marks']
            total_marks = total if total is not None else 0
            # ////////////////////////////////////////////////////////////////////////////
            #//////////////////// +1 if total marks of combile subject 159 /////////////
            # ////////////////////////////////////////////////////////////////////////////
            # total_marks = 160 if total_marks == 159 else total_marks
            
            # Fetch adjustment from DB
            from django.core.cache import cache
            adjustment_rules = cache.get_or_set(
                "marks_adjustment_rules",
                lambda: dict(MarksAdjustment.objects.values_list("target_marks", "adjustment")),
                300  # cache for 5 minutes
            )

            if total_marks in adjustment_rules:
                total_marks += adjustment_rules[total_marks]
            # //////////////////////////////////////////////////////////////////////////////////
            # //////////////////////////////////////////////////////////////////////////////////
            return total_marks
            # return total if total is not None else 0
        # If not combined, return the individual subject's total marks
        return self.total_marks
    
    @property
    def grade_and_point(self) -> tuple[str, float]:
        """
        Calculate grade and point.
        - For combined subjects (Bangla, English), calculate after summing both papers.
        - Otherwise, calculate normally.
        """
        subject_code = self.subject.subject_name.code

        # --- Check if subject belongs to a combined group ---
        for group, rules in COMBINED_SUBJECTS.items():
            if subject_code in rules["papers"]:
                student = self.student_from_result_table
                combined_subjects = SubjectForResult.objects.filter(
                    student_from_result_table=student,
                    subject__subject_name__code__in=rules["papers"]
                )
                #total obtained marks
                total_marks = sum(subj.total_marks for subj in combined_subjects)
                # ////////////////////////////////////////////////////////////////////////////
                #//////////////////// +1 if total marks of combile subject 159 /////////////
                # ////////////////////////////////////////////////////////////////////////////
                # total_marks =  160 if total_marks == 159 else total_marks
                # Fetch adjustment from DB
                from django.core.cache import cache
                adjustment_rules = cache.get_or_set(
                    "marks_adjustment_rules",
                    lambda: dict(MarksAdjustment.objects.values_list("target_marks", "adjustment")),
                    300  # cache for 5 minutes
                )

                if total_marks in adjustment_rules:
                    total_marks += adjustment_rules[total_marks]
                # ////////////////////////////////////////////////////////////////////////////
                # ////////////////////////////////////////////////////////////////////////////
                # Full marks of subjects
                total_full_marks = sum(subj.subject.full_marks for subj in combined_subjects)

                if self.has_passed_all_mark_types:
                    return calculate_grade_and_point(total_marks, total_full_marks)

                return "Fail", 0.0

        # --- Default case: non-combined subjects ---
        if self.has_passed_all_mark_types:
            return calculate_grade_and_point(self.total_marks, self.subject.full_marks)

        return "Fail", 0.0


    @property
    def grade_and_point_tabu(self) -> tuple[str, float]:
        """
        Calculate grade and point.
        - For combined subjects (Bangla, English), calculate after summing both papers.
        - Otherwise, calculate normally.
        """
        # --- Default case: non-combined subjects ---
        if self.has_passed_all_mark_types_for_tabulation:
            return calculate_grade_and_point(self.total_marks, self.subject.full_marks)

        return "Fail", 0.0


    @property
    def has_passed_all_mark_types(self) -> bool:
        """
        Check pass/fail:
        - For combined subjects (Bangla, English), apply combined paper rules.
        - For others, use per-mark-type pass rules.
        """
        subject_code = self.subject.subject_name.code

        # --- Check if subject belongs to a combined group ---
        for group, rules in COMBINED_SUBJECTS.items():
            if subject_code in rules["papers"]:
                student = self.student_from_result_table
                combined_subjects = SubjectForResult.objects.filter(
                    student_from_result_table=student,
                    subject__subject_name__code__in=rules["papers"]
                ).prefetch_related("typewisemarksforsubject__mark_type")

                # Collect totals
                mcq_total = 0
                cq_total = 0
                for subj in combined_subjects:
                    for mark in subj.typewisemarksforsubject.all():
                        if mark.mark_type.mark_type in ["MCQ", "Objective"]:
                            mcq_total += mark.marks or 0
                        elif mark.mark_type.mark_type in ["WR", "Theory", "CQ"]:
                            cq_total += mark.marks or 0

                return mcq_total >= rules["mcq_pass"] and cq_total >= rules["cq_pass"]

        # --- Default case: non-combined subjects ---
        mark_types = list(self.typewisemarksforsubject.select_related('mark_type'))
        if not mark_types:
            return self.subject.pass_marks == 0
        return all(mark_type.is_pass for mark_type in mark_types)
    
    @property
    def has_passed_all_mark_types_for_tabulation(self) -> bool:
        # --- Default case: non-combined subjects ---
        mark_types = list(self.typewisemarksforsubject.select_related('mark_type'))
        if not mark_types:
            print("Tabu:self.subject.pass_marks ", self.subject.pass_marks)
            return self.subject.pass_marks == 0
        
        
        return all(mark_type.is_pass for mark_type in mark_types)



class TypewiseMarksForSubject(models.Model):
    """Model to store type-wise marks (e.g., MCQ, Theory) for a subject result."""
    subject = models.ForeignKey(
        SubjectForResult,
        on_delete=models.CASCADE,
        related_name='typewisemarksforsubject',
        verbose_name="Subject",
        help_text="The subject result this mark belongs to."
    )
    mark_type = models.ForeignKey(
        MarkTypeForSubject,
        on_delete=models.CASCADE,
        related_name='typewisemarks',
        verbose_name="Mark Type",
        help_text="The type of mark (e.g., MCQ, Theory)."
    )
    marks = models.IntegerField(
        verbose_name="Marks",
        help_text="The marks obtained for this mark type.",
        default=-1
    )

    class Meta:
        unique_together = ('subject', 'mark_type')
        verbose_name = "Typewise Mark"
        verbose_name_plural = "03 Typewise Marks"

    def __str__(self) -> str:
        """String representation of the typewise mark."""
        return f"TypewiseMark {self.id} - {self.subject} - {self.mark_type.mark_type} - {self.marks}"

    @property
    def is_pass(self) -> bool:
        """
        Check if the marks meet or exceed the pass marks for this mark type.

        Returns:
            bool: True if the marks meet or exceed the pass marks, False otherwise.
        """
        return self.marks >= self.mark_type.pass_marks


class SubjectHighestMarks(models.Model):
    """
    Model to store the highest marks achieved for each subject across all students.

    This model tracks the maximum marks, the section where it was achieved, and the associated subject.
    """
    subject = models.ForeignKey(
        SubjectForIMS,
        on_delete=models.CASCADE,
        related_name='highest_marks_records',
        verbose_name="Subject",
        help_text="The subject for which the highest marks are recorded."
    )
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        verbose_name="Group",
        help_text="The group for highest marks."
    )
    
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        verbose_name="Section",
        help_text="The section where the highest marks were achieved."
    )
    
    roll = models.PositiveIntegerField(
        default=0,
        verbose_name="Student Roll",
        help_text="The Roll Number of student who achieved highest marks for this subject."
    )
    
    highest_marks = models.PositiveIntegerField(
        verbose_name="Highest Marks",
        help_text="The highest total marks achieved for this subject."
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Last Updated",
        help_text="The timestamp of the last update to this record."
    )

    class Meta:
        verbose_name = "Subject Highest Marks"
        verbose_name_plural = "04 Subject Highest Marks"
        indexes = [
            models.Index(fields=['subject', 'highest_marks']),
        ]
        unique_together = ('subject','group')

    def __str__(self) -> str:
        """String representation of the highest marks record."""
        return f"{self.subject} - {self.highest_marks} (Section: {self.section})"

class MarksAdjustment(models.Model):
    target_marks = models.IntegerField(unique=True, help_text="When total marks equals this value...")
    adjustment = models.IntegerField(default=0, help_text="...add this many marks")

    class Meta:
        verbose_name = "Marks Adjustment"
        verbose_name_plural = "05 Marks Adjustments"

    def __str__(self):
        return f"{self.target_marks} → +{self.adjustment}"
