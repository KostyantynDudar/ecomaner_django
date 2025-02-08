from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from apps.barter.models import UserBalance

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_balance(sender, instance, created, **kwargs):
    """Автоматически создаем баланс при регистрации нового пользователя"""
    if created:
        UserBalance.objects.create(user=instance)
