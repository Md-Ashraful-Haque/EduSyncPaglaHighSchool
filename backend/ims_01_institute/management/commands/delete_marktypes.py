from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import MarkTypeForSubject  # Adjust if app name is different

class Command(BaseCommand):
    help = "Delete all MarkTypeForSubject records and reset auto-increment ID"

    def handle(self, *args, **kwargs):
        # Step 1: Delete all MarkTypeForSubject records
        MarkTypeForSubject.objects.all().delete()

        # Step 2: Reset auto-increment/ID sequence
        with connection.cursor() as cursor:
            vendor = connection.vendor
            table_name = 'ims_04_result_marktypeforsubject'  # Adjust if your table name is different

            if vendor == 'sqlite':
                cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table_name}'")
                self.stdout.write(self.style.SUCCESS("✅ SQLite sequence reset."))
            elif vendor == 'postgresql':
                cursor.execute(f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH 1")
                self.stdout.write(self.style.SUCCESS("✅ PostgreSQL sequence reset."))
            elif vendor == 'mysql':
                cursor.execute(f"ALTER TABLE {table_name} AUTO_INCREMENT = 1")
                self.stdout.write(self.style.SUCCESS("✅ MySQL AUTO_INCREMENT reset."))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Reset not supported for DB vendor: {vendor}"))

        self.stdout.write(self.style.SUCCESS("✅ Deleted all MarkTypeForSubject records."))
