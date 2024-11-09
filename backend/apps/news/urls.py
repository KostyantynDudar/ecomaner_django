from django.urls import path
from .views import NewsListAPIView, NewsDetailAPIView

urlpatterns = [
    path('', NewsListAPIView.as_view(), name='api_news_list'),  # основной маршрут для списка новостей
    path('<int:pk>/', NewsDetailAPIView.as_view(), name='api_news_detail'),  # маршрут для деталей новости по id
]
