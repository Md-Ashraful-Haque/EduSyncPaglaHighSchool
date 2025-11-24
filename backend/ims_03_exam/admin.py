

from django.contrib import admin
from .models import ExamForIMS, ExamRoutine
# //////////////////////// Routine Admin /////////////////
class ExamRoutineInline(admin.TabularInline):
    model = ExamRoutine
    extra = 1
class ExamForIMSAdmin(admin.ModelAdmin):
    inlines = [ExamRoutineInline]
    search_fields = [
        'exam_name',
        'institute__name',  # ✅ allowed in search_fields
        'year__year',       # ✅ allowed in search_fields
    ]

    list_filter = [
        'institute',  # ✅ use FK directly
        'year',
    ]

    list_display = [
        'institute',
        'exam_name',
        'exam_name_in_english',
        'get_year',
        'heighest_marks',
        'get_classes',
    ]

    def get_year(self, obj):
        return obj.year.year
    get_year.short_description = "Year"

    def get_classes(self, obj):
        return ", ".join([str(class_instance.class_name) for class_instance in obj.class_instance.all()])
    get_classes.short_description = "Classes"

    fieldsets = [
        (None, {
            'fields': [
                'institute', 'year', 'exam_name',
                'exam_name_in_english', 'heighest_marks',
                'start_date', 'end_date'
            ]
        }),
        ('Classes', {'fields': ['class_instance']}),
    ]

    filter_horizontal = ['class_instance']

admin.site.register(ExamForIMS, ExamForIMSAdmin)




# @admin.register(ExamForIMS)
# class ExamForIMSAdmin(admin.ModelAdmin):
#     inlines = [ExamRoutineInline]

@admin.register(ExamRoutine)
class ExamRoutineAdmin(admin.ModelAdmin):
    list_display = ('exam','is_published','class_instance','group','subject','exam_date','start_time')
    list_filter = ('exam','class_instance','group')
    list_editable =('is_published',)