# api/serializers.py
from rest_framework import serializers
from .models import ExampleModel  # Убедитесь, что модель ExampleModel существует в models.py

class ExampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel  # Используйте вашу модель ExampleModel
        fields = '__all__'  # Укажите конкретные поля, если необходимо


# api/serializers.py
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password')

    def create(self, validated_data):
        user = User(
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


