from django.core.management.base import BaseCommand
from openpyxl import Workbook
from ims_04_result.models import Section

class Command(BaseCommand):
    help = 'Export all Section records to Excel'

    def add_arguments(self, parser):
        parser.add_argument('output_path', type=str, help='Output Excel file path (e.g., all_section.xlsx)')

    def handle(self, *args, **kwargs):
        output_path = kwargs['output_path']
        wb = Workbook()
        ws = wb.active
        ws.title = "Sections"

        # Header row
        ws.append([
            "Institute Code",
            "Year",
            "Class Name",
            "Shift",
            "Group Name",
            "Group Code",
            "Section Code",
            "Section Name",
            "Section Bangla"
        ])

        sections = Section.objects.select_related(
            'institute',
            'year',
            'class_instance__class_name',
            'group',
            'section_name'
        ).all().order_by('institute',
            'year',
            'class_instance__class_name',
            'group',
            'section_name')

        for section in sections:
            try:
                ws.append([
                    section.institute.institute_code,
                    section.year.year,
                    section.class_instance.class_name.name if section.class_instance.class_name else "",
                    section.class_instance.shift if section.class_instance.shift else "",
                    str(section.group.group_name) if section.group and section.group.group_name else "",
                    str(section.group.group_name.code) if section.group and section.group.group_name.code else "",
                    section.section_name.code,
                    section.section_name.name,
                    section.section_name.name_bengali
                ])
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Skipped a row due to: {e}"))

        wb.save(output_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Exported {sections.count()} sections to '{output_path}'"))
