from django.core.management.base import BaseCommand
from django.db import connection
from ims_02_account.models import Student


class Command(BaseCommand):
    help = "Delete all students from the database and reset the table index (auto-increment ID) to 0"

    def handle(self, *args, **options):
        # Delete all records
        count, _ = Student.objects.all().delete()

        # Reset SQLite autoincrement (works for SQLite & PostgreSQL differently)
        with connection.cursor() as cursor:
            if connection.vendor == "sqlite":
                cursor.execute("DELETE FROM sqlite_sequence WHERE name = %s", [Student._meta.db_table])
            elif connection.vendor == "postgresql":
                cursor.execute(f"ALTER SEQUENCE {Student._meta.db_table}_id_seq RESTART WITH 1")

        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {count} students and reset index to 0"))
