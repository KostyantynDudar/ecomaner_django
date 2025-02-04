from rest_framework import serializers
from .models import News, NewsImage

class NewsImageSerializer(serializers.ModelSerializer):
    """Сериализатор для изображений новостей."""
    class Meta:
        model = NewsImage
        fields = ['id', 'image']


class NewsSerializer(serializers.ModelSerializer):
    """Сериализатор для новостей с поддержкой нескольких изображений."""
    images = NewsImageSerializer(many=True, read_only=True)  # Отображаем список изображений

    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'created_at', 'published', 'is_hot', 'likes_count', 'images']
