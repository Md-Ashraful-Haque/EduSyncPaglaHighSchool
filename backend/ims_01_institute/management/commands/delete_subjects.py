from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import SubjectName, SubjectForIMS  # Adjust to your app

class Command(BaseCommand):
    help = "Delete all SubjectName and SubjectForIMS records and reset ID sequences"

    def handle(self, *args, **kwargs):
        # Delete in correct dependency order
        SubjectForIMS.objects.all().delete()
        SubjectName.objects.all().delete()

        with connection.cursor() as cursor:
            # Reset auto-increment ID (PostgreSQL or SQLite)
            db_vendor = connection.vendor
            if db_vendor == 'sqlite':
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_subjectname'")
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_subjectforims'")
            elif db_vendor == 'postgresql':
                cursor.execute("ALTER SEQUENCE ims_04_result_subjectname_id_seq RESTART WITH 1")
                cursor.execute("ALTER SEQUENCE ims_04_result_subjectforims_id_seq RESTART WITH 1")
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Auto-increment reset not supported for {db_vendor}"))

        self.stdout.write(self.style.SUCCESS("✅ Deleted all records and reset auto-increment counters."))
