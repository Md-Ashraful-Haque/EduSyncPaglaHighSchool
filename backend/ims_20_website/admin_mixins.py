from django.contrib import admin

class InstituteAdminMixin:
    """
    Reusable admin mixin to automatically handle `institute` field.
    - Non-superusers: lock institute field, auto-assign user.institute
    - Superusers: keep it editable
    """

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser and "institute" in form.base_fields:
            form.base_fields["institute"].disabled = True
            form.base_fields["institute"].required = False
        return form

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if not request.user.is_superuser:
            try:
                initial["institute"] = request.user.institute.id
            except AttributeError:
                pass
        return initial

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            try:
                obj.institute = request.user.institute
            except AttributeError:
                pass
        super().save_model(request, obj, form, change)
