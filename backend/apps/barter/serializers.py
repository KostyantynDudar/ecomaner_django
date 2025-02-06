# backend/apps/barter/serializers.py

from rest_framework import serializers
from .models import BarterRequest

class BarterRequestSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')  # Добавляем поле для удобства

    class Meta:
        model = BarterRequest
        fields = [
            'id', 'owner', 'owner_username', 'title', 'description', 'barter_type', 
            'location', 'estimated_value', 'compensatory_amount', 'status', 'created_at'
        ]
