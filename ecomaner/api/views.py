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

