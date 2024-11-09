from django.urls import path
from .views import NewsListAPIView, NewsDetailAPIView

urlpatterns = [
    path('api/news/', NewsListAPIView.as_view(), name='api_news_list'),
    path('api/news/<int:pk>/', NewsDetailAPIView.as_view(), name='api_news_detail'),
]
