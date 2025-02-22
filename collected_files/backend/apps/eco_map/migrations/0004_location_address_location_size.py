# Generated by Django 5.1.2 on 2024-11-09 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eco_map', '0003_location_last_updated'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Адрес'),
        ),
        migrations.AddField(
            model_name='location',
            name='size',
            field=models.FloatField(blank=True, null=True, verbose_name='Размер локации'),
        ),
    ]
