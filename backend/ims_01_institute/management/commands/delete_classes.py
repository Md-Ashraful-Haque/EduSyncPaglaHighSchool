from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import Class, ClassName

class Command(BaseCommand):
    help = 'Delete all Class and ClassName records and reset auto-increment IDs'

    def handle(self, *args, **kwargs):
        class_count = Class.objects.count()
        classname_count = ClassName.objects.count()

        Class.objects.all().delete()
        ClassName.objects.all().delete()

        with connection.cursor() as cursor:
            db_vendor = connection.vendor
            if db_vendor == 'sqlite':
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_class'")
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_classname'")
            elif db_vendor == 'postgresql':
                cursor.execute("ALTER SEQUENCE ims_04_result_class_id_seq RESTART WITH 1")
                cursor.execute("ALTER SEQUENCE ims_04_result_classname_id_seq RESTART WITH 1")
            elif db_vendor == 'mysql':
                cursor.execute("ALTER TABLE ims_04_result_class AUTO_INCREMENT = 1")
                cursor.execute("ALTER TABLE ims_04_result_classname AUTO_INCREMENT = 1")

        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {class_count} Class records"))
        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {classname_count} ClassName records"))
        self.stdout.write(self.style.SUCCESS("🔁 Auto-increment counters reset"))
