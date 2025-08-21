from django.db import models, transaction
from django.core.validators import MinValueValidator
from django.utils import timezone
import logging
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

FEE_SCOPE_CHOICES = [
    ('YEAR', 'Year-Level (All Classes)'),
    ('CLASS', 'Class-Level'),
    ('GROUP', 'Group-Level'),
]

class FeeType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    institute = models.ForeignKey('ims_01_institute.Institute', on_delete=models.CASCADE, related_name='fee_types')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [models.Index(fields=['institute', 'name'])]
        unique_together = ('institute', 'name')
        verbose_name_plural = "01 Fee Types"

class FeeStructure(models.Model):
    institute = models.ForeignKey('ims_01_institute.Institute', on_delete=models.CASCADE, related_name='fee_structures')
    year = models.ForeignKey('ims_01_institute.Year', on_delete=models.CASCADE, related_name='fee_structures')
    class_instance = models.ForeignKey('ims_01_institute.Class', on_delete=models.CASCADE, related_name='fee_structures', null=True, blank=True)
    group = models.ForeignKey('ims_01_institute.Group', on_delete=models.CASCADE, related_name='fee_structures', null=True, blank=True)
    fee_type = models.ForeignKey(FeeType, on_delete=models.CASCADE, related_name='fee_structures')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.0)])
    scope = models.CharField(max_length=20, choices=FEE_SCOPE_CHOICES, default='YEAR')

    class Meta:
        unique_together = ('institute', 'year', 'class_instance', 'group', 'fee_type', 'scope')
        verbose_name_plural = "02 Fee Structures"
        indexes = [
            models.Index(fields=['institute', 'year']),
            models.Index(fields=['institute', 'year', 'class_instance']),
            models.Index(fields=['institute', 'year', 'class_instance', 'group']),
        ]

    def __str__(self):
        group_str = self.group.group_name if self.group else 'No Group'
        class_str = self.class_instance.class_name.name if self.class_instance else 'All Classes'
        return f"{self.fee_type.name} - {self.get_scope_display()} - {class_str} - {group_str} - {self.year.year} - {self.institute.name}"

    def clean(self):
        if self.amount < 0:
            raise ValidationError("Amount cannot be negative.")
        
        # Validate scope and required fields
        if self.scope == 'YEAR':
            if self.class_instance is not None or self.group is not None:
                raise ValidationError("Year-level fees must not specify class_instance or group.")
        elif self.scope == 'CLASS':
            if self.class_instance is None:
                raise ValidationError("Class-level fees require class_instance.")
            if self.group is not None:
                raise ValidationError("Class-level fees must not specify group.")
        elif self.scope == 'GROUP':
            if self.class_instance is None or self.group is None:
                raise ValidationError("Group-level fees require both class_instance and group.")
        
        # Ensure uniqueness for the given scope
        filters = {
            'institute': self.institute,
            'year': self.year,
            'fee_type': self.fee_type,
            'scope': self.scope
        }
        if self.scope == 'YEAR':
            filters['class_instance__isnull'] = True
            filters['group__isnull'] = True
        elif self.scope == 'CLASS':
            filters['class_instance'] = self.class_instance
            filters['group__isnull'] = True
        elif self.scope == 'GROUP':
            filters['class_instance'] = self.class_instance
            filters['group'] = self.group

        if FeeStructure.objects.filter(**filters).exclude(pk=self.pk).exists():
            raise ValidationError(f"A {self.get_scope_display().lower()} fee structure already exists for this combination.")

class StudentAccount(models.Model):
    student = models.OneToOneField('ims_02_account.Student', on_delete=models.CASCADE, related_name='account')
    total_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, validators=[MinValueValidator(0.0)])
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, validators=[MinValueValidator(0.0)])

    @property
    def balance(self):
        return self.total_due - self.total_paid

    def __str__(self):
        return f"{self.student.name} | Due: {self.total_due} | Paid: {self.total_paid} | Balance: {self.balance}"

    class Meta:
        indexes = [models.Index(fields=['student'])]
        verbose_name_plural = "03 Student Accounts"

class Transaction(models.Model):
    student = models.ForeignKey('ims_02_account.Student', on_delete=models.CASCADE, related_name='transactions')
    fee_type = models.ForeignKey(FeeType, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.0)])
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    receipt_number = models.CharField(max_length=50, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.is_paid and not self.receipt_number:
            with transaction.atomic():
                # Get the latest sequence number for this institute and year
                prefix = f"{self.student.institute.name[:4].upper()}-{self.created_at.year}"
                last_transaction = Transaction.objects.filter(
                    receipt_number__startswith=prefix
                ).order_by('-receipt_number').first()
                
                if last_transaction and last_transaction.receipt_number:
                    try:
                        last_seq = int(last_transaction.receipt_number.split('-')[-1])
                    except ValueError:
                        last_seq = 0
                else:
                    last_seq = 0
                
                # Try generating a unique receipt_number
                max_attempts = 10
                for attempt in range(max_attempts):
                    seq = last_seq + 1 + attempt
                    candidate = f"{prefix}-{seq:04d}"
                    if not Transaction.objects.filter(receipt_number=candidate).exists():
                        self.receipt_number = candidate
                        break
                else:
                    raise ValidationError(f"Could not generate unique receipt_number after {max_attempts} attempts.")
        
        super().save(*args, **kwargs)

    def __str__(self):
        status = 'Paid' if self.is_paid else 'Due'
        return f"{self.student.name} - {self.fee_type.name} - {self.amount} - {status}"

    class Meta:
        indexes = [models.Index(fields=['student', 'is_paid'])]
        verbose_name_plural = "04 Transactions"

class Invoice(models.Model):
    student = models.ForeignKey('ims_02_account.Student', on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    transactions = models.ManyToManyField(Transaction, related_name='invoices')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    institute = models.ForeignKey('ims_01_institute.Institute', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            count = Invoice.objects.count() + 1
            self.invoice_number = f"INV-{self.institute.name[:4].upper()}-{self.created_at.year or timezone.now().year}-{count:04d}"
        super().save(*args, **kwargs)
        # Calculate total_amount after saving (since transactions are M2M)
        if self.pk and self.transactions.exists():
            self.total_amount = self.transactions.aggregate(total=models.Sum('amount'))['total'] or 0.0
            super().save(update_fields=['total_amount'])

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.student.name}"

    class Meta:
        indexes = [models.Index(fields=['student', 'invoice_number'])]
        verbose_name_plural = "05 Invoices"