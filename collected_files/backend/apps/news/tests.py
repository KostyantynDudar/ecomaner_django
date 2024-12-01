from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.news.models import News

class NewsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.news1 = News.objects.create(
            title="Первая новость",
            content="Текст первой новости",
            published=True  # Устанавливаем опубликованное значение
        )
        self.news2 = News.objects.create(
            title="Вторая новость",
            content="Текст второй новости",
            published=False  # Неопубликованная новость для теста
        )

    def test_news_list(self):
        response = self.client.get(reverse('api_news_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Ожидается 2 новости без фильтра

    def test_news_list_only_published(self):
        # Добавляем параметр фильтрации published=true
        response = self.client.get(reverse('api_news_list') + '?published=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Должна вернуться только одна опубликованная новость

    def test_news_detail(self):
        response = self.client.get(reverse('api_news_detail', args=[self.news1.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.news1.title)

    def test_news_detail_not_found(self):
        response = self.client.get(reverse('api_news_detail', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
