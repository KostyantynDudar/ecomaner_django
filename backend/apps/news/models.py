from django.db import models

class News(models.Model):
    """Модель для новостей."""
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    content = models.TextField(verbose_name="Содержание")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    published = models.BooleanField(default=False, verbose_name="Опубликовано")
    is_hot = models.BooleanField(default=False, verbose_name="Горячая новость")  # Выделение горячих новостей
    likes_count = models.PositiveIntegerField(default=0, verbose_name="Количество лайков")  # Счетчик лайков

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        ordering = ['-is_hot', '-created_at']  # Сортируем сначала горячие, потом по дате

    def __str__(self):
        return self.title


class NewsImage(models.Model):
    """Дополнительная модель для изображений новостей (можно несколько)."""
    news = models.ForeignKey(News, related_name="images", on_delete=models.CASCADE, verbose_name="Новость")
    image = models.ImageField(upload_to="news_images/", verbose_name="Изображение")

    class Meta:
        verbose_name = "Изображение новости"
        verbose_name_plural = "Изображения новостей"

    def __str__(self):
        return f"Изображение для {self.news.title}"
