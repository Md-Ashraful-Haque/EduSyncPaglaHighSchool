from django.contrib import admin
from .models import AttendanceDay, StudentAttendance


class StudentAttendanceInline(admin.TabularInline):
    """
    Allows editing student attendance inside AttendanceDay detail page.
    """
    model = StudentAttendance
    extra = 0
    fields = (
        'student',
        'status',
        'entry_time',
        'exit_time',
        'note',
    )
    autocomplete_fields = ['student']
    ordering = ('student__roll_number',)
    show_change_link = True


@admin.register(AttendanceDay)
class AttendanceDayAdmin(admin.ModelAdmin):
    """
    Admin for Attendance Day (one record per date/class/section)
    """
    list_display = (
        'date',
        'institute',
        'year',
        'class_instance',
        'group',
        'section',
        'attendance_type',
    )
    list_filter = (
        'institute',
        'year__year',
        'class_instance__class_name__name',
        'class_instance__shift',
        'group__group_name__name',
        'section__section_name__name',
        'attendance_type',
        'date',
    )

    search_fields = (
        'class_instance__class_name__name',
        'group__group_name__name',
        'section__section_name__name',
    )

    date_hierarchy = 'date'
    ordering = ('-date', 'class_instance__class_name__code')

    inlines = [StudentAttendanceInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            'institute',
            'year',
            'class_instance',
            'group',
            'section',
        )


@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    """
    Standalone admin view: usually used for search/reporting
    """
    list_display = ( 
        'student',
        'attendance_day',
        'status',
        'entry_time',
        'exit_time',
    )

    list_filter = (
        'status',
        'attendance_day__date',
        'attendance_day__class_instance__class_name__name',
        'attendance_day__group__group_name__name',
        'attendance_day__section__section_name__name',
        'attendance_day__institute',
    )

    search_fields = (
        'student__name',
        'student__roll_number',
        'attendance_day__date',
    )

    autocomplete_fields = ['student', 'attendance_day']

    ordering = ('attendance_day__date', 'student__roll_number')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related(
            'student',
            'attendance_day',
            'attendance_day__class_instance',
            'attendance_day__section',
            'attendance_day__group',
        )
