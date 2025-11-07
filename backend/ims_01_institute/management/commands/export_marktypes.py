# from django.core.management.base import BaseCommand
# from openpyxl import Workbook
# from ims_04_result.models import MarkTypeForSubject

# class Command(BaseCommand):
#     help = 'Export all MarkTypeForSubject records to an Excel file'

#     def handle(self, *args, **kwargs):
#         file_path = 'mark_types_export.xlsx'
#         mark_types = MarkTypeForSubject.objects.select_related('subject').order_by('subject__class_name', 'subject__name', 'serial_number')

#         wb = Workbook()
#         ws = wb.active
#         ws.title = "Mark Types"

#         # Write header
#         ws.append([
#             "Subject ID",
#             "Subject Name",
#             "Subject Bengali Name",
#             "Class Name",
#             "Mark Type",
#             "Maximum Marks",
#             "Pass Marks",
#             "Serial Number",
#         ])

#         # Write data
#         for mt in mark_types:
#             ws.append([
#                 mt.subject.id,
#                 mt.subject.name,
#                 mt.subject.name_bengali,
#                 mt.subject.class_name,
#                 mt.get_mark_type_display(),  # for human-readable label
#                 mt.max_marks,
#                 mt.pass_marks,
#                 mt.serial_number
#             ])

#         wb.save(file_path)
#         self.stdout.write(self.style.SUCCESS(f"✅ Exported {mark_types.count()} Mark Types to '{file_path}'"))
from django.core.management.base import BaseCommand
from openpyxl import Workbook
from ims_04_result.models import MarkTypeForSubject

class Command(BaseCommand):
    help = 'Export Mark Types grouped by subject code and class'

    def handle(self, *args, **kwargs):
        file_path = 'mark_types_export.xlsx'
        mark_types = MarkTypeForSubject.objects.select_related('subject').order_by('subject__class_name', 'subject__code', 'serial_number')

        wb = Workbook()
        ws = wb.active
        ws.title = "Mark Types"

        ws.append([
            "Class Name",
            "Subject Code",
            "Subject Name",
            "Subject Name (Bengali)",
            "Mark Type",
            "Maximum Marks",
            "Pass Marks",
            "Serial Number"
        ])

        for mt in mark_types:
            ws.append([
                mt.subject.class_name,
                mt.subject.code,
                mt.subject.name,
                mt.subject.name_bengali,
                mt.get_mark_type_display(),
                mt.max_marks,
                mt.pass_marks,
                mt.serial_number
            ])

        wb.save(file_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Exported {mark_types.count()} Mark Types to '{file_path}'"))
