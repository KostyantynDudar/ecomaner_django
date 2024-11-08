# backend/apps/news/views.py
from rest_framework import generics
from .models import News
from .serializers import NewsSerializer

class NewsListAPIView(generics.ListAPIView):
    queryset = News.objects.all().order_by('-published')  # исправлено на 'published'
    serializer_class = NewsSerializer

class NewsDetailAPIView(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    lookup_field = 'pk'
