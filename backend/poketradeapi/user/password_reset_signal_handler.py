from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def send_reset_email(sender, instance, reset_password_token, **kwargs):
    print("Sending password reset email for:", reset_password_token.user.email)
    print("Token:", reset_password_token.key)
    print("User ID:", reset_password_token.user.id)
