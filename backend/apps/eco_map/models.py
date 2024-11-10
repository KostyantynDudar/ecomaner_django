# backend/apps/eco_map/models.py
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
    last_updated = models.DateTimeField("Дата последнего обновления", auto_now=True)  # Новое поле

    # Новые поля
    players_ids = models.JSONField("ID игроков", null=True, blank=True)  # Хранит ID игроков в виде списка
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="locations", verbose_name="Создано пользователем"
    )
    image = models.ImageField("Изображение локации", upload_to="location_images/", null=True, blank=True)

    # Добавляем поля address и size
    address = models.CharField("Адрес", max_length=255, blank=True, null=True)  # Опциональное поле для адреса
    size = models.FloatField("Размер локации", null=True, blank=True)  # Опциональное поле для размера локации

    def __str__(self):
        return f"{self.type} - {self.description[:30]}"


# backend/apps/eco_map/models.py

class LocationPhotoView(models.Model):
    location_id = models.IntegerField(primary_key=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=15, null=True, blank=True)
    photo_id = models.CharField(max_length=250, null=True, blank=True)
    bot_latitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    bot_longitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    bot_comments = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        managed = False  # Указываем Django не управлять этой моделью
        db_table = 'location_photo_view'

