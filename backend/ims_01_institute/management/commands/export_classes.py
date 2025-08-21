from django.core.management.base import BaseCommand
from openpyxl import Workbook
from ims_04_result.models import Class

class Command(BaseCommand):
    help = 'Export all Class records to Excel'

    def add_arguments(self, parser):
        parser.add_argument('output_path', type=str, help='Output Excel file path (e.g., all_classes.xlsx)')

    def handle(self, *args, **kwargs):
        output_path = kwargs['output_path']
        wb = Workbook()
        ws = wb.active
        ws.title = "Classes"

        ws.append([
            "Institute Code",
            "Year",
            "Class Code",
            "Class Name",
            "Class Name Bengali",
            "Shift"
        ])

        classes = Class.objects.select_related(
            'institute',
            'year',
            'class_name'
        ).all().order_by('institute', 'year','class_name')

        for cls in classes:
            try:
                ws.append([
                    cls.institute.institute_code,
                    cls.year.year,
                    cls.class_name.code if cls.class_name else "",
                    cls.class_name.name if cls.class_name else "",
                    cls.class_name.name_bengali if cls.class_name else "",
                    cls.shift
                ])
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Skipped a row due to: {e}"))

        wb.save(output_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Exported {classes.count()} classes to '{output_path}'"))
