# api/serializers.py
from rest_framework import serializers
from .models import ExampleModel  # Убедитесь, что модель ExampleModel существует в models.py

class ExampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel  # Используйте вашу модель ExampleModel
        fields = '__all__'  # Укажите конкретные поля, если необходимо
