from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from .models import BarterRequest, BarterDeal, UserBalance
from .serializers import BarterRequestSerializer, BarterDealSerializer
import logging
from django.db import models
from django.db.models import Q

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

from django.contrib.auth import get_user_model

User = get_user_model()  # ✅ Добавляем импорт

# 🔹 API для создания сделки
class CreateDealAPIView(generics.CreateAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):

        logger.debug(f"📌 Данные перед созданием сделки: {self.request.data}")  # ЛОГ

        item_A = get_object_or_404(BarterRequest, id=self.request.data.get("item_A"))
        item_B = get_object_or_404(BarterRequest, id=self.request.data.get("item_B")) if self.request.data.get("item_B") else None
        compensation = float(self.request.data.get("compensation_points", 0))

        initiator_balance, _ = UserBalance.objects.get_or_create(user=self.request.user)
        if compensation > initiator_balance.balance:
            raise serializers.ValidationError("Недостаточно баллов для компенсации!")

        partner = item_B.owner if item_B else get_object_or_404(User, email=self.request.data.get("partner_email"))
        
        logger.debug(f"📌 Partner найден: {partner}")  # ЛОГ

        deal = serializer.save(
            initiator=self.request.user,
            partner=partner,
            item_A=item_A,
            item_B=item_B,
            status="pending"
        )
        logger.info(f"✅ Сделка {deal.id} создана: {self.request.user.email} ↔ {partner.email if partner else 'Ожидает партнера'}")

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

        logger.info(f"🔍 Подтверждение сделки ID: {instance.id}, Пользователь: {self.request.user}")

        if not instance:
            logger.error("❌ Ошибка: Сделка не найдена!")
            raise serializers.ValidationError("Сделка не найдена.")

        if instance.status != "pending":
            logger.warning(f"❌ Ошибка: Сделка {instance.id} уже подтверждена или завершена.")
            raise serializers.ValidationError("Сделка уже подтверждена или завершена.")

        if instance.partner:
            logger.warning(f"❌ Ошибка: Сделка {instance.id} уже имеет партнера.")
            raise serializers.ValidationError("Сделка уже подтверждена другим пользователем.")

        if instance.initiator == self.request.user:
            logger.warning(f"❌ Ошибка: Пользователь {self.request.user} пытается подтвердить свою же сделку {instance.id}.")
            raise serializers.ValidationError("Вы не можете подтвердить свою же сделку.")

        instance.partner = self.request.user
        instance.status = "active"

        if instance.compensation_points > 0:
            initiator_balance = get_object_or_404(UserBalance, user=instance.initiator)
            partner_balance = get_object_or_404(UserBalance, user=self.request.user)

            if initiator_balance.balance < instance.compensation_points:
                logger.warning(f"❌ Недостаточно баллов у инициатора сделки {instance.initiator}")
                raise serializers.ValidationError("Недостаточно баллов у инициатора сделки.")

            try:
                initiator_balance.remove_points(instance.compensation_points)
                partner_balance.add_points(instance.compensation_points)
            except ValueError:
                logger.error("❌ Ошибка списания баллов!")
                raise serializers.ValidationError("Ошибка при списании баллов.")

        instance.save()
        logger.info(f"✅ Сделка {instance.id} подтверждена пользователем {self.request.user.email}")

# 🔹 API для получения списка сделок пользователя
class UserDealsAPIView(generics.ListAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterDeal.objects.filter(
            Q(initiator=self.request.user) | Q(partner=self.request.user)
        ).distinct()
