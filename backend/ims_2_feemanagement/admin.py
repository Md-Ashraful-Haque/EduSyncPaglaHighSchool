from django.contrib import admin
from .models import FeeType, FeeStructure, StudentAccount, Transaction, Invoice
from django.utils import timezone
from django.contrib import messages

@admin.register(FeeType)
class FeeTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'institute', 'description']
    list_filter = ['institute']
    search_fields = ['name', 'description']
    list_select_related = ['institute']
    ordering = ['name']
    verbose_name_plural = "01 Fee Types"

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ['fee_type', 'scope', 'class_instance', 'group', 'year', 'institute', 'amount']
    list_filter = ['scope', 'fee_type', 'institute', 'year', 'class_instance']
    search_fields = ['fee_type__name', 'class_instance__class_name__name', 'group__group_name']
    list_select_related = ['fee_type', 'class_instance', 'class_instance__class_name', 'group', 'year', 'institute']
    ordering = ['institute', 'year', 'scope', 'class_instance', 'fee_type']
    actions = ['apply_fees']
    verbose_name_plural = "02 Fee Structures"

    def apply_fees(self, request, queryset):
        from .utils import apply_fees_to_students
        for fee_structure in queryset:
            try:
                created, skipped = apply_fees_to_students(
                    institute=fee_structure.institute,
                    year=fee_structure.year,
                    fee_type=fee_structure.fee_type,
                    class_instance=fee_structure.class_instance,
                    group=fee_structure.group
                )
                self.message_user(request, f"Applied {created} transactions, skipped {skipped} duplicates for {fee_structure}.")
            except Exception as e:
                self.message_user(request, f"Error applying {fee_structure}: {str(e)}", level=messages.ERROR)

    apply_fees.short_description = "Apply selected fee structures to students"

@admin.register(StudentAccount)
class StudentAccountAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_due', 'total_paid', 'balance']
    search_fields = ['student__name']
    list_filter = ['student__institute']
    list_select_related = ['student', 'student__institute']
    ordering = ['student__name']
    verbose_name_plural = "03 Student Accounts"

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee_type', 'amount', 'is_paid', 'paid_at', 'receipt_number']
    list_filter = ['is_paid', 'fee_type', 'student__institute']
    search_fields = ['student__name', 'receipt_number', 'fee_type__name']
    list_select_related = ['student', 'student__institute', 'fee_type']
    ordering = ['-created_at']
    actions = ['mark_as_paid']
    verbose_name_plural = "04 Transactions"

    def mark_as_paid(self, request, queryset):
        updated = 0
        for transaction in queryset.filter(is_paid=False):
            transaction.is_paid = True
            transaction.paid_at = timezone.now()
            transaction.save()
            updated += 1
        self.message_user(request, f"{updated} transactions marked as paid.")

    mark_as_paid.short_description = "Mark selected transactions as paid"

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'student', 'total_amount', 'created_at']
    list_filter = ['institute', 'created_at']
    search_fields = ['invoice_number', 'student__name']
    list_select_related = ['student', 'student__institute', 'institute']
    ordering = ['-created_at']
    verbose_name_plural = "05 Invoices"