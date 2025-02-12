from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.contrib.auth import get_user_model
import logging

from .models import BarterRequest, BarterDeal, UserBalance
from .serializers import BarterRequestSerializer, BarterDealSerializer

# ✅ Добавляем IsAuthenticated в permissions
from rest_framework.permissions import IsAuthenticated


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

# 🔹 API для получения списка заявок (ТОЛЬКО свои!)
class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterRequest.objects.filter(owner=self.request.user)  # ✅ Только свои заявки

    def perform_create(self, serializer):
        logger.debug(f"📌 Данные перед сохранением: {self.request.data}")
        serializer.save(
            owner=self.request.user,
            location=self.request.data.get('address', ''),
            estimated_value=self.request.data.get('value', 0)
        )

# 🔹 API для получения конкретной заявки (ДОСТУП УЧАСТНИКАМ СДЕЛКИ)
class UserBarterRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # ✅ Исправленный запрос
        queryset = BarterRequest.objects.filter(
            Q(owner=user) |
            Q(id__in=BarterDeal.objects.filter(item_A_id__in=BarterRequest.objects.filter(owner=user).values_list("id", flat=True)).values_list("item_B_id", flat=True)) |
            Q(id__in=BarterDeal.objects.filter(item_B_id__in=BarterRequest.objects.filter(owner=user).values_list("id", flat=True)).values_list("item_A_id", flat=True))
        ).distinct()


        logger.debug(f"📌 Запрос на товар: {self.request.query_params}, Найденные ID: {[item.id for item in queryset]}")
        
        return queryset


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

        # Определяем партнера сделки
        partner = None
        if item_B:
            partner = item_B.owner
        elif self.request.data.get("partner_email"):
            partner = get_object_or_404(User, email=self.request.data.get("partner_email"))

        if not partner:
            raise serializers.ValidationError("Невозможно создать сделку без партнера!")

        logger.debug(f"📌 Partner найден: {partner}")  # ЛОГ

        # Если у сделки есть партнер, сразу переводим ее в "active"
        status = "active" if partner else "pending"

        deal = serializer.save(
            initiator=self.request.user,
            partner=partner,
            item_A=item_A,
            item_B=item_B,
            status=status
        )

        logger.info(f"✅ Сделка {deal.id} создана: {self.request.user.email} ↔ {partner.email if partner else 'Ожидает партнера'}")

        # Если сделка активирована, отправляем уведомление партнёру (добавить логику отправки)


# 🔹 API для просмотра деталей сделки
from rest_framework.exceptions import PermissionDenied

class DealDetailAPIView(generics.RetrieveAPIView):
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        deal = super().get_object()
        if deal.initiator != self.request.user and deal.partner != self.request.user:
            logger.warning(f"❌ Доступ запрещен: {self.request.user} пытался открыть сделку {deal.id}")
            raise PermissionDenied("Вы не участвуете в этой сделке.")
        return deal


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

# 🔹 API для чата
class DealChatAPIView(APIView):
    """Заглушка для чата сделки"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Возвращает пустой список сообщений (заглушка)"""
        deal = get_object_or_404(BarterDeal, pk=pk)

        # Проверяем, является ли пользователь участником сделки
        if request.user != deal.initiator and request.user != deal.partner:
            return Response({"error": "Вы не участник сделки!"}, status=403)

        # Возвращаем заглушку (пустой чат)
        return Response({"messages": []})
