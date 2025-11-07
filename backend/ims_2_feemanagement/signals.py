from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.db import transaction, models
from .models import Transaction, StudentAccount
import logging

logger = logging.getLogger(__name__)

# Store pre-save state for Transaction
_transaction_pre_save_state = {}

@receiver(pre_save, sender=Transaction)
def store_transaction_pre_save(sender, instance, **kwargs):
    """
    Store the pre-save state of Transaction to compare in post_save.
    """
    try:
        old_instance = Transaction.objects.get(pk=instance.pk)
        _transaction_pre_save_state[instance.pk] = {
            'amount': old_instance.amount,
            'is_paid': old_instance.is_paid
        }
    except Transaction.DoesNotExist:
        _transaction_pre_save_state[instance.pk] = None

@receiver(post_save, sender=Transaction)
def update_student_account_on_save(sender, instance, created, raw=False, **kwargs):
    """
    Update StudentAccount incrementally when a Transaction is created or updated.
    - On create: Add amount to total_due; add to total_paid if is_paid=True.
    - On update: Adjust totals based on amount and is_paid changes.
    - Fallback to full recalculation if needed.
    """
    if raw:  # Skip signal during fixtures or bulk operations
        return
    try:
        with transaction.atomic():
            account, _ = StudentAccount.objects.get_or_create(student=instance.student)
            old_state = _transaction_pre_save_state.get(instance.pk)

            if created or old_state is None:
                # New transaction
                account.total_due += instance.amount
                if instance.is_paid:
                    account.total_paid += instance.amount
            else:
                # Existing transaction updated
                old_amount = old_state['amount']
                old_is_paid = old_state['is_paid']

                # Adjust total_due if amount changed
                if old_amount != instance.amount:
                    account.total_due += (instance.amount - old_amount)

                # Adjust total_paid if is_paid changed
                if old_is_paid != instance.is_paid:
                    if instance.is_paid:
                        account.total_paid += instance.amount
                    else:
                        account.total_paid -= old_amount

            # Ensure non-negative values
            account.total_due = max(account.total_due, 0.0)
            account.total_paid = max(account.total_paid, 0.0)
            account.save()

            logger.info(f"Updated StudentAccount for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")
            print(f"Updated StudentAccount for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")

    except Exception as e:
        logger.error(f"Error updating StudentAccount for {instance.student.name}: {str(e)}")
        # Fallback to full recalculation
        try:
            with transaction.atomic():
                account = StudentAccount.objects.get(student=instance.student)
                totals = instance.student.transactions.aggregate(
                    total_due=models.Sum('amount'),
                    total_paid=models.Sum('amount', filter=models.Q(is_paid=True))
                )
                account.total_due = totals['total_due'] or 0.0
                account.total_paid = totals['total_paid'] or 0.0
                account.save()
                logger.info(f"Fallback recalculation for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")
                print(f"Fallback recalculation for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")
        except Exception as e:
            logger.error(f"Fallback failed for {instance.student.name}: {str(e)}")
    
    # Clean up pre-save state
    _transaction_pre_save_state.pop(instance.pk, None)

@receiver(post_delete, sender=Transaction)
def update_student_account_on_delete(sender, instance, **kwargs):
    """
    Update StudentAccount when a Transaction is deleted.
    - Subtract amount from total_due; subtract from total_paid if was paid.
    - Fallback to full recalculation if needed.
    """
    try:
        with transaction.atomic():
            try:
                account = StudentAccount.objects.get(student=instance.student)
                account.total_due -= instance.amount
                if instance.is_paid:
                    account.total_paid -= instance.amount
                # Ensure non-negative values
                account.total_due = max(account.total_due, 0.0)
                account.total_paid = max(account.total_paid, 0.0)
                account.save()
                logger.info(f"Updated StudentAccount for {instance.student.name} after deletion: Due={account.total_due}, Paid={account.total_paid}")
                print(f"Updated StudentAccount for {instance.student.name} after deletion: Due={account.total_due}, Paid={account.total_paid}")
            except StudentAccount.DoesNotExist:
                logger.warning(f"No StudentAccount found for {instance.student.name} after transaction deletion.")
    except Exception as e:
        logger.error(f"Error updating StudentAccount on delete for {instance.student.name}: {str(e)}")
        # Fallback to full recalculation
        try:
            with transaction.atomic():
                account = StudentAccount.objects.get(student=instance.student)
                totals = instance.student.transactions.aggregate(
                    total_due=models.Sum('amount'),
                    total_paid=models.Sum('amount', filter=models.Q(is_paid=True))
                )
                account.total_due = totals['total_due'] or 0.0
                account.total_paid = totals['total_paid'] or 0.0
                account.save()
                logger.info(f"Fallback recalculation for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")
                print(f"Fallback recalculation for {instance.student.name}: Due={account.total_due}, Paid={account.total_paid}")
        except Exception:
            logger.warning(f"Fallback failed for {instance.student.name}: No StudentAccount found.")