# backend/apps/accounts/tests/test_registration_api.py

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestRegistrationAPI:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    def test_registration_success(self, api_client):
        """
        Проверка успешной регистрации нового пользователя.
        """
        url = reverse('accounts:register')  # Убедитесь, что имя URL совпадает
        data = {
            "email": "testuser@example.com",
            "password": "testpassword123",
        }
        response = api_client.post(url, data, format='json')
        
        # Проверка, что запрос прошел успешно и пользователь создан
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email=data["email"]).exists()

    def test_registration_missing_email(self, api_client):
        """
        Проверка регистрации без email (должен быть отклонен).
        """
        url = reverse('accounts:register')
        data = {
            "password": "testpassword123",
        }
        response = api_client.post(url, data, format='json')

        # Ожидаем ошибку из-за отсутствующего email
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_registration_missing_password(self, api_client):
        """
        Проверка регистрации без пароля (должен быть отклонен).
        """
        url = reverse('accounts:register')
        data = {
            "email": "testuser@example.com",
        }
        response = api_client.post(url, data, format='json')

        # Ожидаем ошибку из-за отсутствующего пароля
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    def test_registration_existing_user(self, api_client):
        """
        Проверка регистрации пользователя, который уже существует (должен быть отклонен).
        """
        User.objects.create_user(email="testuser@example.com", password="existingpassword")
        url = reverse('accounts:register')
        data = {
            "email": "testuser@example.com",
            "password": "newpassword123",
        }
        response = api_client.post(url, data, format='json')

        # Ожидаем ошибку, так как пользователь уже существует
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
