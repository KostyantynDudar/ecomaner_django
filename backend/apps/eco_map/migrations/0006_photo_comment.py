# Generated by Django 5.1.2 on 2024-11-18 22:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eco_map', '0005_location_point'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='location_photos/', verbose_name='Фотография')),
                ('date_uploaded', models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')),
                ('dislikes', models.ManyToManyField(blank=True, related_name='disliked_photos', to=settings.AUTH_USER_MODEL, verbose_name='Дизлайки')),
                ('likes', models.ManyToManyField(blank=True, related_name='liked_photos', to=settings.AUTH_USER_MODEL, verbose_name='Лайки')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='eco_map.location', verbose_name='Локация')),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='photos', to=settings.AUTH_USER_MODEL, verbose_name='Загружено пользователем')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Комментарий')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
                ('photo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='eco_map.photo', verbose_name='Фотография')),
            ],
        ),
    ]