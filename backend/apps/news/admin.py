from django.contrib import admin
from .models import News, NewsImage

class NewsImageInline(admin.TabularInline):
    """
    Встроенная модель для загрузки нескольких изображений к новости в админке.
    """
    model = NewsImage
    extra = 1  # Минимум одно поле для загрузки нового изображения
    fields = ('image',)  # Показываем только поле изображения

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'published', 'is_hot', 'likes_count')  # Добавили горячие новости и лайки
    list_filter = ('published', 'is_hot')  # Фильтр по публикации и горячим новостям
    search_fields = ('title', 'content')
    readonly_fields = ('likes_count', 'created_at')  # Лайки нельзя редактировать вручную
    inlines = [NewsImageInline]  # Включаем мультизагрузку изображений
