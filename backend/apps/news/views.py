from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import News, NewsImage
from .serializers import NewsSerializer, NewsImageSerializer

class NewsListAPIView(generics.ListAPIView):
    """
    Представление для получения списка новостей.
    Сначала горячие (is_hot=True), затем остальные, сортировка по дате убывания.
    """
    queryset = News.objects.filter(published=True).order_by('-is_hot', '-created_at')
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]



class NewsDetailAPIView(generics.RetrieveAPIView):
    """
    Представление для получения детальной информации о конкретной новости.
    Открыт доступ для всех пользователей.
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]


class NewsLikeAPIView(APIView):
    """
    Эндпоинт для добавления лайка к новости.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            news = News.objects.get(pk=pk)
            news.likes_count += 1
            news.save()
            return Response({'likes': news.likes_count}, status=status.HTTP_200_OK)
        except News.DoesNotExist:
            return Response({'error': 'Новость не найдена'}, status=status.HTTP_404_NOT_FOUND)
