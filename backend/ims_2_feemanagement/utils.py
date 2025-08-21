from django.db import transaction, models
from django.utils import timezone
import logging
from ims_2_feemanagement.models import FeeStructure, Transaction, FeeType
from ims_02_account.models import Student
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

def apply_fees_to_students(institute, year, fee_type, class_instance=None, group=None):
    """
    Apply fees to students based on specified scope: YEAR, CLASS, or GROUP.
    
    Signatures:
        - apply_fees_to_students(institute, year, fee_type): Apply year-level fee to all students in the year.
        - apply_fees_to_students(institute, year, class, fee_type): Apply class-level fee to students in the class.
        - apply_fees_to_students(institute, year, class, group, fee_type): Apply group-level fee to students in the group.
    
    Args:
        institute (ims_01_institute.Institute): The institute to apply fees for.
        year (ims_01_institute.Year): The year to apply fees for.
        fee_type (ims_2_feemanagement.FeeType): The fee type to apply.
        class_instance (ims_01_institute.Class, optional): The class for CLASS or GROUP scope. Defaults to None.
        group (ims_01_institute.Group, optional): The group for GROUP scope. Defaults to None.
    
    Returns:
        tuple: (created_count, skipped_count) - Number of transactions created and skipped (duplicates).
    
    Raises:
        ValidationError: If the fee_type is not defined in FeeStructure for the specified scope or invalid arguments.
    """
    try:
        with transaction.atomic():
            created_count = 0
            skipped_count = 0
            
            # Determine scope based on arguments
            if class_instance is None and group is None:
                scope = 'YEAR'
                fee_filters = {
                    'institute': institute,
                    'year': year,
                    'fee_type': fee_type,
                    'scope': 'YEAR',
                    'class_instance__isnull': True,
                    'group__isnull': True
                }
                student_filters = {
                    'institute': institute,
                    'year': year
                }
            elif class_instance is not None and group is None:
                scope = 'CLASS'
                fee_filters = {
                    'institute': institute,
                    'year': year,
                    'fee_type': fee_type,
                    'scope': 'CLASS',
                    'class_instance': class_instance,
                    'group__isnull': True
                }
                student_filters = {
                    'institute': institute,
                    'year': year,
                    'class_instance': class_instance
                }
            elif class_instance is not None and group is not None:
                scope = 'GROUP'
                fee_filters = {
                    'institute': institute,
                    'year': year,
                    'fee_type': fee_type,
                    'scope': 'GROUP',
                    'class_instance': class_instance,
                    'group': group
                }
                student_filters = {
                    'institute': institute,
                    'year': year,
                    'class_instance': class_instance,
                    'group': group
                }
            else:
                raise ValidationError("Invalid arguments: group specified without class_instance.")
            
            # Validate FeeStructure exists for the scope
            fee_structure = FeeStructure.objects.filter(**fee_filters).select_related('fee_type', 'class_instance', 'group').first()
            if not fee_structure:
                raise ValidationError(
                    f"No FeeStructure found for fee_type='{fee_type.name}', scope={scope}, "
                    f"institute={institute.name}, year={year.year}"
                    f"{', class=' + class_instance.class_name.name if class_instance else ''}"
                    f"{', group=' + group.group_name if group else ''}"
                )
            
            # Fetch eligible students
            students = Student.objects.filter(**student_filters).select_related('class_instance', 'group')
            if not students.exists():
                logger.warning(
                    f"No students found for scope={scope}, institute={institute.name}, year={year.year}"
                    f"{', class=' + class_instance.class_name.name if class_instance else ''}"
                    f"{', group=' + group.group_name if group else ''}"
                )
                return 0, 0
            
            # Create transactions
            transactions_to_create = []
            for student in students:
                if scope == 'GROUP' and student.group is None:
                    skipped_count += 1
                    continue
                # Check for duplicate transaction (same day)
                if not Transaction.objects.filter(
                    student=student,
                    fee_type=fee_type,
                    amount=fee_structure.amount,
                    created_at__date=timezone.now().date()
                ).exists():
                    transactions_to_create.append(
                        Transaction(
                            student=student,
                            fee_type=fee_type,
                            amount=fee_structure.amount,
                            is_paid=False,
                            created_at=timezone.now()
                        )
                    )
                    created_count += 1
                else:
                    skipped_count += 1
            
            # Bulk create transactions
            if transactions_to_create:
                Transaction.objects.bulk_create(transactions_to_create)
                logger.info(
                    f"Created {created_count} transactions for fee_type={fee_type.name}, scope={scope}, "
                    f"institute={institute.name}, year={year.year}"
                    f"{', class=' + class_instance.class_name.name if class_instance else ''}"
                    f"{', group=' + group.group_name if group else ''}"
                )
            
            if skipped_count:
                logger.info(f"Skipped {skipped_count} duplicate transactions")
            
            return created_count, skipped_count
    
    except ValidationError as e:
        logger.error(f"Validation error applying fees: {str(e)}")
        raise
    except Exception as e:
        logger.error(
            f"Error applying fees for fee_type={fee_type.name}, scope={scope}, "
            f"institute={institute.name}, year={year.year}: {str(e)}"
        )
        raise

def get_applicable_fees(student):
    """
    Get all applicable FeeStructure entries for a student across YEAR, CLASS, and GROUP scopes.
    
    Args:
        student (ims_02_account.Student): The student to get fees for.
    
    Returns:
        QuerySet: FeeStructure objects applicable to the student.
    """
    fees = FeeStructure.objects.filter(
        institute=student.institute,
        year=student.year
    ).filter(
        models.Q(scope='YEAR') |
        models.Q(scope='CLASS', class_instance=student.class_instance) |
        (models.Q(scope='GROUP', class_instance=student.class_instance, group=student.group) if student.group else models.Q())
    ).select_related('fee_type', 'class_instance', 'group')
    return fees

# from ims_01_institute.models import Institute, Year, Class, Group
# from ims_2_feemanagement.models import FeeType
# from ims_2_feemanagement.utils import apply_fees_to_students
# institute = Institute.objects.get(id=1)
# year = Year.objects.get(year=2025, institute=institute)
# fee_type = FeeType.objects.get(name="Board Exam Fee", institute=institute)
# created, skipped = apply_fees_to_students(institute, year, fee_type)
# class_instance = Class.objects.get(institute=institute, year=year, class_name__name="Class 10")
# created, skipped = apply_fees_to_students(institute, year, fee_type, class_instance)
# group = Group.objects.get(class_instance=class_instance, group_name="Science")
# created, skipped = apply_fees_to_students(institute, year, fee_type, class_instance, group)

# from ims_02_account.models import Student
# from ims_2_feemanagement.utils import get_applicable_fees
# student = Student.objects.get(id=1)
# fees = get_applicable_fees(student)
# for fee in fees:
#     print(f"{fee.fee_type.name}: {fee.amount} ({fee.get_scope_display()})")