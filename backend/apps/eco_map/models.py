# backend/apps/eco_map/models.py

import requests
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Location(models.Model):
    TYPE_CHOICES = [
        ('waste_dump', 'Свалка мусора'),
        ('recycling_point', 'Пункт приёма мусора')
    ]

    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('in_progress', 'Очистка в процессе'),
        ('cleaned', 'Очищено')
    ]

    latitude = models.FloatField("Широта", validators=[
        MinValueValidator(-90), MaxValueValidator(90)
    ])
    longitude = models.FloatField("Долгота", validators=[
        MinValueValidator(-180), MaxValueValidator(180)
    ])
    description = models.TextField("Описание", blank=True)
    type = models.CharField("Тип", max_length=20, choices=TYPE_CHOICES)
    status = models.CharField("Статус", max_length=15, choices=STATUS_CHOICES, default='active')
    date_added = models.DateTimeField("Дата добавления", auto_now_add=True)
    last_updated = models.DateTimeField("Дата последнего обновления", auto_now=True)

    players_ids = models.JSONField("ID игроков", null=True, blank=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="locations", verbose_name="Создано пользователем"
    )
    image = models.ImageField("Изображение локации", upload_to="location_images/", null=True, blank=True)

    address = models.CharField("Адрес", max_length=255, blank=True, null=True)
    size = models.FloatField("Размер локации", null=True, blank=True)

    def fetch_address_from_nominatim(self):
        """ Получает адрес по координатам через Nominatim API """
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={self.latitude}&lon={self.longitude}"
        try:
            response = requests.get(url, headers={'User-Agent': 'EcomanerApp'})
            data = response.json()
            return data.get("display_name", "Неизвестный адрес")
        except Exception as e:
            print(f"Ошибка получения адреса: {e}")
            return "Ошибка получения адреса"

    def save(self, *args, **kwargs):
        """ При сохранении объекта автоматически запрашивает адрес """
        if not self.address:
            self.address = self.fetch_address_from_nominatim()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.type} - {self.address or 'Адрес не указан'}"
