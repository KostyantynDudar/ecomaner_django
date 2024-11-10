# eco_map/serializers.py
from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Location
        fields = [
            'id', 'latitude', 'longitude', 'description', 'type', 'status', 
            'authors', 'players_ids', 'date_added', 'last_updated', 'address', 'size'
        ]
