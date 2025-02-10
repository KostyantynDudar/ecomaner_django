from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from .models import BarterRequest, BarterDeal, UserBalance
from .serializers import BarterRequestSerializer, BarterDealSerializer
import logging

logger = logging.getLogger(__name__)

# 🔹 Представления для рендеринга страниц
def barter_public(request):
    return render(request, 'barter/public.html')

@login_required
def barter_dashboard(request):
    return render(request, 'barter/dashboard.html')

@login_required
def barter_requests(request):
    return render(request, 'barter/requests.html')

# 🔹 Ограничение запросов
class BarterRequestThrottle(UserRateThrottle):
    rate = '1000/day'

# 🔹 API для работы с заявками
class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BarterRequestThrottle]

    def get_queryset(self):
        return BarterRequest.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        logger.debug(f"📌 Данные перед сохранением: {self.request.data}")
        serializer.save(
            owner=self.request.user,
            location=self.request.data.get('address', ''),
            estimated_value=self.request.data.get('value', 0)
        )

class UserBarterRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterRequest.objects.filter(owner=self.request.user)

# 🔹 API для получения всех заявок
class AllBarterRequestsAPIView(generics.ListAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return BarterRequest.objects.all()

# 🔹 API для создания сделки
class CreateDealAPIView(generics.CreateAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        item_A = get_object_or_404(BarterRequest, id=self.request.data.get("item_A"))
        item_B = get_object_or_404(BarterRequest, id=self.request.data.get("item_B")) if self.request.data.get("item_B") else None
        compensation = float(self.request.data.get("compensation_points", 0))

        initiator_balance, _ = UserBalance.objects.get_or_create(user=self.request.user)
        if compensation > initiator_balance.balance:
            raise serializers.ValidationError("Недостаточно баллов для компенсации!")

        # Автоматически устанавливаем партнёра, если `item_B` есть
        partner = item_B.owner if item_B else None

        deal = serializer.save(
            initiator=self.request.user,
            partner=partner,  # ✅ Устанавливаем сразу второго контрагента!
            item_A=item_A,
            item_B=item_B,
            status="pending"
        )

        logger.info(f"✅ Сделка {deal.id} создана пользователем {self.request.user.email} с {partner.email if partner else 'Ожидает партнёра'}")


# 🔹 API для просмотра деталей сделки
class DealDetailAPIView(generics.RetrieveAPIView):
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

# 🔹 API для подтверждения сделки
class ConfirmDealAPIView(generics.UpdateAPIView):
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = serializer.instance

        if instance.status != "pending":
            raise serializers.ValidationError("Сделка уже подтверждена или завершена.")

        if instance.initiator == self.request.user:
            raise serializers.ValidationError("Вы не можете подтвердить свою же сделку.")

        instance.partner = self.request.user
        instance.status = "active"

        if instance.compensation_points > 0:
            initiator_balance = get_object_or_404(UserBalance, user=instance.initiator)
            partner_balance = get_object_or_404(UserBalance, user=self.request.user)

            if initiator_balance.balance < instance.compensation_points:
                raise serializers.ValidationError("Недостаточно баллов у инициатора сделки.")

            initiator_balance.remove_points(instance.compensation_points)
            partner_balance.add_points(instance.compensation_points)

        instance.save()
        logger.info(f"✅ Сделка {instance.id} подтверждена пользователем {self.request.user.email}")

# 🔹 API для получения списка сделок пользователя
class UserDealsAPIView(generics.ListAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterDeal.objects.filter(initiator=self.request.user) | BarterDeal.objects.filter(partner=self.request.user)

class DealDetailAPIView(generics.RetrieveAPIView):
    """API для просмотра деталей сделки"""
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

