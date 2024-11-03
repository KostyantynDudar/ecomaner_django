# main/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def how_it_works(request):
    return render(request, 'how_it_works.html')

def civilizations(request):
    return render(request, 'civilizations.html')

def gameplay(request):
    return render(request, 'gameplay.html')

def eternal_items(request):
    return render(request, 'eternal_items.html')

def research(request):
    return render(request, 'research.html')

def participation(request):
    return render(request, 'participation.html')

def news(request):
    return render(request, 'news.html')

def faq(request):
    return render(request, 'faq.html')

def contact(request):
    return render(request, 'contact.html')

def store(request):
    return render(request, 'store.html')

def map(request):
    return render(request, 'map.html')

# main/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from main.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(password=make_password(request.data['password']))
            return Response({'message': 'Успешная регистрация'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def generate_token(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

from main.models import Photo
from main.serializers import PhotoSerializer

class PhotoLocationsView(APIView):
    def get(self, request):
        photos = Photo.objects.all()
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)

