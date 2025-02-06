# apps/eco_map/serializers.py

from rest_framework import serializers
from .models import Location

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

    # Поле created_by только для чтения: возвращает email пользователя
    created_by = serializers.ReadOnlyField(source='created_by.email')
    
    # Поле address теперь только для чтения
    address = serializers.CharField(read_only=True)

    class Meta:
        model = Location
        fields = [
            # Поля, необходимые для работы бота
            'id', 'lat_id', 'long_id', 'comments', 'photo_id',  
            'bot_latitude', 'bot_longitude', 'bot_comments',  
            
            # Поля модели Location
            'latitude', 'longitude', 'description', 'type', 'status',
            'players_ids', 'date_added', 'last_updated', 'address', 'size', 'image',
            
            # Поле created_by для данных о создателе
            'created_by',
        ]
