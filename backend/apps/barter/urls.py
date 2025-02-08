from django.urls import path
from . import views

app_name = 'barter'  # Пространство имён для URL-ов, удобно для `reverse()`

urlpatterns = [
    # 🔹 Страницы бартера
    path('', views.barter_public, name='barter_public'),  # Публичная страница
    path('dashboard/', views.barter_dashboard, name='barter_dashboard'),  # Личный кабинет
    path('requests/', views.barter_requests, name='barter_requests'),  # Таблица заявок

    # 🔹 API для работы с заявками
    path('api/user-requests/', views.UserBarterRequestsAPIView.as_view(), name='user_barter_requests'),  # Получение и создание заявок
    path('api/user-requests/<int:pk>/', views.UserBarterRequestDetailAPIView.as_view(), name='user_barter_request_detail'),  # Просмотр, редактирование, удаление заявки

    # 🔹 API для работы с обменами
    path('api/user-deals/', views.UserDealsAPIView.as_view(), name='user_deals'),  # Обмены пользователя
    path('api/all-requests/', views.AllBarterRequestsAPIView.as_view(), name='all_barter_requests'),  # Все заявки

    # 🔹 API для сделок (обмена и дарения)
    path('api/deals/create/', views.CreateDealAPIView.as_view(), name='create_deal'),  # Создание сделки
    path('api/deals/<int:pk>/confirm/', views.ConfirmDealAPIView.as_view(), name='confirm_deal'),  # Подтверждение сделки
]
