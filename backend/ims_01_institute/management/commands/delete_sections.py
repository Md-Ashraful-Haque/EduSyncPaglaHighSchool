from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import Section, SectionName

class Command(BaseCommand):
    help = 'Delete all Section and SectionName records and reset auto-increment IDs to 1'

    def handle(self, *args, **kwargs):
        deleted_section_count = Section.objects.count()
        deleted_sectionname_count = SectionName.objects.count()

        Section.objects.all().delete()
        SectionName.objects.all().delete()

        with connection.cursor() as cursor:
            db_vendor = connection.vendor
            if db_vendor == 'sqlite':
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_section'")
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_sectionname'")
            elif db_vendor == 'postgresql':
                cursor.execute("ALTER SEQUENCE ims_04_result_section_id_seq RESTART WITH 1")
                cursor.execute("ALTER SEQUENCE ims_04_result_sectionname_id_seq RESTART WITH 1")
            elif db_vendor == 'mysql':
                cursor.execute("ALTER TABLE ims_04_result_section AUTO_INCREMENT = 1")
                cursor.execute("ALTER TABLE ims_04_result_sectionname AUTO_INCREMENT = 1")

        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {deleted_section_count} Section records"))
        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {deleted_sectionname_count} SectionName records"))
        self.stdout.write(self.style.SUCCESS("🔁 Auto-increment counters reset to 1"))
