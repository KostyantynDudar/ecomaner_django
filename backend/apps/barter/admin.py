from django.contrib import admin
from .models import BarterRequest, BarterDeal, UserBalance

@admin.register(BarterRequest)
class BarterRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "status", "is_reserved", "created_at")  # ✅ Показываем is_reserved
    list_filter = ("status", "is_reserved",)
    search_fields = ("title", "owner__email")
    actions = ["clear_reservation"]  # ✅ Добавляем кастомное действие

    # 🔹 Действие: снять резерв с выбранных товаров
    @admin.action(description="Снять резерв с товаров")
    def clear_reservation(self, request, queryset):
        updated = queryset.update(is_reserved=False)  # ✅ Обновляем is_reserved в БД
        self.message_user(request, f"✅ Снято с резерва {updated} товаров.")

@admin.register(BarterDeal)
class BarterDealAdmin(admin.ModelAdmin):
    list_display = ("item_A", "item_B", "initiator", "partner", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("initiator__email", "partner__email")

@admin.register(UserBalance)
class UserBalanceAdmin(admin.ModelAdmin):
    list_display = ("user", "balance")  # Показываем email и баланс
    search_fields = ("user__email",)  # Поиск по email
    list_editable = ("balance",)  # ✅ Позволяем редактировать баланс прямо в списке
