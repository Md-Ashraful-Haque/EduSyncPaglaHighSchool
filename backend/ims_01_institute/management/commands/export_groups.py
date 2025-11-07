from django.core.management.base import BaseCommand
from openpyxl import Workbook
from ims_04_result.models import Group

class Command(BaseCommand):
    help = 'Export all Group records to Excel'

    def add_arguments(self, parser):
        parser.add_argument('output_path', type=str, help='Output Excel file path (e.g., all_groups.xlsx)')

    def handle(self, *args, **kwargs):
        output_path = kwargs['output_path']
        wb = Workbook()
        ws = wb.active
        ws.title = "Groups"

        ws.append([
            "Institute Code",
            "Year",
            "Class Name",
            "Shift",
            "Group Code",
            "Group Name",
            "Group Bangla",
            "Order"
        ])

        groups = Group.objects.select_related(
            'institute',
            'year',
            'class_instance__class_name',
            'group_name'
        ).all().order_by('institute', 'year', 'class_instance__class_name', )

        for group in groups:
            try:
                ws.append([
                    group.institute.institute_code,
                    group.year.year,
                    group.class_instance.class_name.name,
                    group.class_instance.shift,
                    group.group_name.code,
                    group.group_name.name,
                    group.group_name.name_bengali,
                    group.order
                ])
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Skipped a row due to: {e}"))

        wb.save(output_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Exported {groups.count()} groups to '{output_path}'"))
