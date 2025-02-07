# backend/apps/barter/serializers.py

from rest_framework import serializers
from .models import BarterRequest

class BarterRequestSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    address = serializers.CharField(source='location', required=False, allow_blank=True)  # ✅ Теперь поле записывается
    value = serializers.DecimalField(source='estimated_value', max_digits=10, decimal_places=2, required=False)  # ✅ Теперь поле записывается

    class Meta:
        model = BarterRequest
        fields = [
            'id', 'owner', 'owner_username', 'title', 'description', 'barter_type', 
            'location', 'estimated_value', 'compensatory_amount', 'status', 'created_at',
            'address', 'value'  # ✅ Теперь данные будут приниматься и сохраняться
        ]
		