# apps/news/views.py

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import News
from .serializers import NewsSerializer

class NewsListAPIView(generics.ListAPIView):
    """
    Представление для получения списка новостей.
    Открыт доступ для всех пользователей.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]  # Доступ открыт для всех


class NewsDetailAPIView(generics.RetrieveAPIView):
    """
    Представление для получения детальной информации о конкретной новости.
    Открыт доступ для всех пользователей.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]  # Доступ открыт для всех
