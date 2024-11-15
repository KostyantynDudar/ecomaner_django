from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import uuid
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)	

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)  # Поле для проверки подтверждения email
    #  verification_token = models.UUIDField(default=uuid.uuid4, editable=False)  # Токен для подтверждения email
    email_confirmation_code = models.CharField(max_length=6, blank=True, null=True)  # Поле для кода подтверждения

    created_at = models.DateTimeField(default=timezone.now)  # Поле для даты создания пользователя

    # Поля для прав доступа
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Добавляем метод для генерации кода подтверждения
    def generate_confirmation_code(self):
        # Генерация случайного 6-значного кода
        self.email_confirmation_code = f"{random.randint(100000, 999999)}"
        self.save()

    def __str__(self):
        return self.email
