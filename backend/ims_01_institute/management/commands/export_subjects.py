# //////////////////////////////////////////////////////////////////////////////////////////////////////////////
# Import Subject name using Excel file
# Command: python manage.py export_subjects
# export_subject is the python file name
# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
from django.core.management.base import BaseCommand
from openpyxl import Workbook
from ims_04_result.models import SubjectName  # Adjust this import to your app

class Command(BaseCommand):
    help = 'Export all SubjectName records to an Excel (.xlsx) file'

    def handle(self, *args, **kwargs):
        file_path = "subject_names_export.xlsx"
        subjects = SubjectName.objects.all().order_by('class_name')

        wb = Workbook()
        ws = wb.active
        ws.title = "Subjects"

        # Write header
        ws.append(['ID', 'Name', 'Name (Bengali)', 'Short Name', 'Class Name', 'Code', 'Serial'])

        # Write data rows
        for subj in subjects:
            ws.append([
                subj.id,
                subj.name,
                subj.name_bengali,
                subj.short_name,
                subj.class_name,
                subj.code,
                subj.serial,
            ])

        # Save the file
        wb.save(file_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Exported {subjects.count()} records to '{file_path}'"))
