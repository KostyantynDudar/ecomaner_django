from django.urls import path
from .views import NewsListAPIView, NewsDetailAPIView, NewsLikeAPIView

urlpatterns = [
    path('', NewsListAPIView.as_view(), name='api_news_list'),  # Основной маршрут для списка новостей
    path('<int:pk>/', NewsDetailAPIView.as_view(), name='api_news_detail'),  # Маршрут для деталей новости по ID
    path('<int:pk>/like/', NewsLikeAPIView.as_view(), name='api_news_like'),  # Новый маршрут для лайков
]
