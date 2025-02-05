# backend/apps/barter/serializers.py

from rest_framework import serializers
from .models import BarterRequest

class BarterRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarterRequest
        fields = ['id', 'owner', 'title', 'description', 'created_at']
