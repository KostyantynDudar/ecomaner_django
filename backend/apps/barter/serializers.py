from rest_framework import serializers
from .models import BarterRequest, BarterDeal, UserBalance 

class BarterRequestSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.email")  # ✅ Передаем email владельца
    owner_username = serializers.ReadOnlyField(source="owner.username")
    is_reserved = serializers.BooleanField(default=False, required=False)  # ✅ Теперь не обязательное

    class Meta:
        model = BarterRequest
        fields = [
            "id", "owner", "owner_username", "title", "description", "barter_type",
            "location", "estimated_value", "compensatory_amount", "status", "created_at", "image",
            "is_reserved"  # ✅ Теперь это поле будет передаваться, но не обязательно в запросе
        ]
        read_only_fields = ["owner", "status", "created_at", "is_reserved"]

class BarterDealSerializer(serializers.ModelSerializer):
    initiator_username = serializers.ReadOnlyField(source="initiator.username")
    partner_username = serializers.ReadOnlyField(source="partner.username", default=None)
    item_A = serializers.PrimaryKeyRelatedField(queryset=BarterRequest.objects.all())
    item_B = serializers.PrimaryKeyRelatedField(queryset=BarterRequest.objects.all(), allow_null=True, required=False)

    class Meta:
        model = BarterDeal
        fields = [
            "id", "initiator", "initiator_username", "partner", "partner_username",
            "item_A", "item_B", "compensation_points", "status", "created_at"
        ]
        read_only_fields = ["initiator", "status", "created_at"]

class UserBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBalance
        fields = ["balance", "reserved_balance"]