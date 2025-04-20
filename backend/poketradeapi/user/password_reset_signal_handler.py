from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

@receiver(reset_password_token_created)
def send_reset_email(sender, instance, reset_password_token, **kwargs):
    reset_url = f"http://localhost:8000/password-reset/confirm?token={reset_password_token.key}"

    send_mail(
        subject="Reset your password",
        message=f"Click the link to reset your password:\n\n{reset_url}",
        from_email="poketradegt@gmail.com",
        recipient_list=[reset_password_token.user.email],
        fail_silently=False,
    )