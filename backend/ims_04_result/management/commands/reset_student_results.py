from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import StudentSubjectResult

class Command(BaseCommand):
    help = 'Delete all StudentSubjectResult records and reset ID counter to 1'

    def handle(self, *args, **kwargs):
        # Delete all records
        StudentSubjectResult.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("🗑️  All StudentSubjectResult records deleted."))

        # Reset auto-incrementing ID
        with connection.cursor() as cursor:
            table_name = StudentSubjectResult._meta.db_table
            db_engine = connection.settings_dict['ENGINE']

            if 'sqlite' in db_engine:
                cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table_name}';")
            elif 'postgresql' in db_engine:
                cursor.execute(f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH 1;")
            elif 'mysql' in db_engine:
                cursor.execute(f"ALTER TABLE {table_name} AUTO_INCREMENT = 1;")
            else:
                self.stdout.write(self.style.WARNING("⚠️  Could not reset ID: unsupported database engine."))

        self.stdout.write(self.style.SUCCESS("✅ Auto-increment ID reset to 1."))
