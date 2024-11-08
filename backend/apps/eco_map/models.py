# /home/ecomaner_django/backend/apps/eco_map/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator  # Исправленный импорт

User = get_user_model()

class Location(models.Model):
    LATITUDE_MIN, LATITUDE_MAX = -90, 90
    LONGITUDE_MIN, LONGITUDE_MAX = -180, 180

    TYPE_CHOICES = [
        ('waste_dump', 'Свалка мусора'),
        ('recycling_point', 'Пункт приёма мусора')
    ]

    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('in_progress', 'Очистка в процессе'),
        ('cleaned', 'Очищено')
    ]

    # Основные поля
    latitude = models.FloatField("Широта", validators=[
        MinValueValidator(LATITUDE_MIN), MaxValueValidator(LATITUDE_MAX)
    ])
    longitude = models.FloatField("Долгота", validators=[
        MinValueValidator(LONGITUDE_MIN), MaxValueValidator(LONGITUDE_MAX)
    ])
    description = models.TextField("Описание", blank=True)
    type = models.CharField("Тип", max_length=20, choices=TYPE_CHOICES)
    status = models.CharField("Статус", max_length=15, choices=STATUS_CHOICES, default='active')

    # Дополнительные поля
    authors = models.ManyToManyField(User, related_name='locations', verbose_name="Авторы")
    players_ids = models.JSONField("ID участников", default=list, blank=True)
    date_added = models.DateTimeField("Дата добавления", auto_now_add=True)
    last_updated = models.DateTimeField("Дата обновления", auto_now=True)
    address = models.CharField("Адрес", max_length=255, blank=True)
    size = models.CharField("Размер свалки", max_length=100, blank=True)

    def __str__(self):
        return f"{self.get_type_display()} ({self.latitude}, {self.longitude})"
