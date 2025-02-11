from django.contrib import admin
from .models import BarterRequest, BarterDeal, UserBalance

@admin.register(BarterRequest)
class BarterRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "owner__email")

@admin.register(BarterDeal)
class BarterDealAdmin(admin.ModelAdmin):
    list_display = ("item_A", "item_B", "initiator", "partner", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("initiator__email", "partner__email")

@admin.register(UserBalance)
class UserBalanceAdmin(admin.ModelAdmin):
    list_display = ("user", "balance")
    search_fields = ("user__email",)
