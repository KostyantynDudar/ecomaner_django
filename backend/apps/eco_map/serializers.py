# apps/eco_map/serializers.py

from rest_framework import serializers
from .models import Location, LocationPhotoView

class LocationSerializer(serializers.ModelSerializer):
    # Поля для данных, отправляемых ботом
    lat_id = serializers.FloatField(source='latitude', required=False)
    long_id = serializers.FloatField(source='longitude', required=False)
    comments = serializers.CharField(source='description', required=False)
    photo_id = serializers.CharField(required=False)

    # Поля для представления данных бота
    bot_latitude = serializers.DecimalField(max_digits=10, decimal_places=6, required=False)
    bot_longitude = serializers.DecimalField(max_digits=10, decimal_places=6, required=False)
    bot_comments = serializers.CharField(required=False)

    class Meta:
        model = Location
        fields = [
            'id', 'lat_id', 'long_id', 'comments', 'photo_id',  # Поля для бота
            'latitude', 'longitude', 'description', 'type', 'status',  # Поля для Django
            'players_ids', 'date_added', 'last_updated', 'address', 'size', 
            'bot_latitude', 'bot_longitude', 'bot_comments'  # Дополнительные поля из бота
        ]
