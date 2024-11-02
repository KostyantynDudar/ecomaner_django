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
