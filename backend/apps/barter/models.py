from django.conf import settings
from django.db import models

class BarterRequest(models.Model):
    """Модель заявки на бартер"""
    BARTER_TYPES = [
        ('exchange', 'Обмен'),
        ('gift', 'Дарение'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Открыта'),
        ('pending', 'Ожидает подтверждения'),
        ('in_progress', 'В процессе'),
        ('completed', 'Завершена'),
        ('cancelled', 'Отменена'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="barter_requests",
        verbose_name="Владелец"
    )  
    title = models.CharField(max_length=255, verbose_name="Заголовок заявки")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    barter_type = models.CharField(max_length=10, choices=BARTER_TYPES, default='exchange', verbose_name="Тип заявки")
    location = models.CharField(max_length=255, blank=True, verbose_name="Местоположение")
    estimated_value = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Оценочная стоимость в баллах")
    compensatory_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Сумма компенсации в баллах")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', verbose_name="Статус заявки")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    image = models.ImageField(upload_to="barter_images/", null=True, blank=True)
    is_reserved = models.BooleanField(default=False, verbose_name="Зарезервирован в сделке")

    def __str__(self):
        return f"{self.owner.email} - {self.title} ({self.get_barter_type_display()})"


class BarterDeal(models.Model):
    """Модель сделки между контрагентами"""
    STATUS_CHOICES = [
        ('pending', 'Ожидание'),
        ('active', 'В работе'),
        ('completed', 'Завершена'),
        ('cancelled', 'Отменена'),
    ]

    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="initiated_deals",
        verbose_name="Инициатор"
    )
    partner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="participated_deals", 
        null=True, blank=True,
        verbose_name="Партнер"
    )
    item_A = models.ForeignKey(
        BarterRequest, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="offer", 
        verbose_name="Товар инициатора"
    )
    item_B = models.ForeignKey(
        BarterRequest, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="counter_offer", 
        blank=True, 
        verbose_name="Товар партнера (если обмен)"
    )
    compensation_points = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, verbose_name="Компенсация в баллах"
    )
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="pending", verbose_name="Статус сделки"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Сделка {self.id}: {self.initiator} ↔ {self.partner if self.partner else 'Ожидает партнера'}"


class UserBalance(models.Model):
    """Баланс пользователя для компенсации"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def add_points(self, amount):
        self.balance += amount
        self.save()

    def remove_points(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            self.save()
        else:
            raise ValueError("Недостаточно баллов!")

    def __str__(self):
        return f"{self.user.email if self.user else 'Нет email'} — Баланс: {self.balance} баллов"
