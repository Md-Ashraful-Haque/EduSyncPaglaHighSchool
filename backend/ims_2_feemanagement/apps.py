from django.apps import AppConfig

class Ims2FeeManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ims_2_feemanagement'
    verbose_name = '02 Fee Management'

    def ready(self):
        import ims_2_feemanagement.signals