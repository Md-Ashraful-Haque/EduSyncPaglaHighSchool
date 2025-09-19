from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Run VACUUM on the database to reclaim space (SQLite only)"

    def handle(self, *args, **options):
        vendor = connection.vendor
        if vendor != "sqlite":
            self.stdout.write(self.style.WARNING(f"VACUUM is only for SQLite. Your DB vendor is {vendor}."))
            return

        self.stdout.write("Running VACUUM on the SQLite database...")

        with connection.cursor() as cursor:
            cursor.execute("VACUUM;")

        self.stdout.write(self.style.SUCCESS("✅ VACUUM completed. Database file size is now optimized."))


# jidc.edu.bd/backend