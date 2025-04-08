from django.apps import AppConfig

class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'  # Make sure this matches your app folder name

    def ready(self):
        import user.password_reset_signal_handler