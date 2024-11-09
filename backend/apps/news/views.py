from rest_framework import generics
from .models import News
from .serializers import NewsSerializer

class NewsListAPIView(generics.ListAPIView):
    """
    Представление для получения списка новостей.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer

class NewsDetailAPIView(generics.RetrieveAPIView):
    """
    Представление для получения детальной информации о конкретной новости.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
