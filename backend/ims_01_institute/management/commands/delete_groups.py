from django.core.management.base import BaseCommand
from django.db import connection
from ims_04_result.models import Group, GroupName

class Command(BaseCommand):
    help = 'Delete all Group and GroupName records and reset auto-increment IDs'

    def handle(self, *args, **kwargs):
        group_count = Group.objects.count()
        groupname_count = GroupName.objects.count()

        Group.objects.all().delete()
        GroupName.objects.all().delete()

        with connection.cursor() as cursor:
            db_vendor = connection.vendor
            if db_vendor == 'sqlite':
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_group'")
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='ims_04_result_groupname'")
            elif db_vendor == 'postgresql':
                cursor.execute("ALTER SEQUENCE ims_04_result_group_id_seq RESTART WITH 1")
                cursor.execute("ALTER SEQUENCE ims_04_result_groupname_id_seq RESTART WITH 1")
            elif db_vendor == 'mysql':
                cursor.execute("ALTER TABLE ims_04_result_group AUTO_INCREMENT = 1")
                cursor.execute("ALTER TABLE ims_04_result_groupname AUTO_INCREMENT = 1")

        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {group_count} Group records"))
        self.stdout.write(self.style.SUCCESS(f"✅ Deleted {groupname_count} GroupName records"))
        self.stdout.write(self.style.SUCCESS("🔁 Auto-increment counters reset"))
