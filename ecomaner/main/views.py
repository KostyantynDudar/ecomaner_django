# main/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')  # Создайте файл about.html в main/templates/main/
