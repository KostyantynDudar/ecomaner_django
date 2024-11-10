# api/serializers.py
from rest_framework import serializers


from .models import ExampleModel  # Импортируйте модель, с которой будете работать

class ExampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel
        fields = '__all__'  # Или укажите конкретные поля, например: ('id', 'name', 'description')



from django.contrib.auth.models import User  # Импортируйте модель User из стандартных моделей Django

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Укажите нужные поля


from .models import Photo  # Импортируйте модель Photo, если она существует

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo  # Убедитесь, что модель Photo определена в models.py
        fields = '__all__'  # Или укажите конкретные поля, например: ('id', 'name', 'image', 'description')


