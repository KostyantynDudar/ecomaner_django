from django.shortcuts import render

# Create your views here.

# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ExampleModel  # Импортируйте вашу модель
from .serializers import ExampleModelSerializer

class ExampleView(APIView):
    def get(self, request):
        # Получаем все объекты ExampleModel и сериализуем их
        examples = ExampleModel.objects.all()
        serializer = ExampleModelSerializer(examples, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Десериализуем данные из запроса
        serializer = ExampleModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhotoLocationsView(APIView):
    def get(self, request):
        data = {"message": "Here are the photo locations"}
        return Response(data, status=status.HTTP_200_OK)


# api/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from utils.auth import generate_token

from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

class RegisterEmailView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token = generate_token(user.id)
                return Response({'success': True, 'message': 'Успешная регистрация!', 'token': token}, status=status.HTTP_201_CREATED)
            except IntegrityError:
                # Возвращаем сообщение, если email уже существует
                raise ValidationError({'email': 'Пользователь с таким email уже зарегистрирован.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# api/views.py
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from utils.auth import generate_token

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            token = generate_token(user.id)
            return Response({'success': True, 'message': 'Успешный вход!', 'token': token}, status=status.HTTP_200_OK)
        return Response({'success': False, 'message': 'Неверный email или пароль'}, status=status.HTTP_400_BAD_REQUEST)

