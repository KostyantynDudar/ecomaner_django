
# backend/api/views.py
from django.http import JsonResponse

def main_home(request):
    data = {
        "message": "Welcome to Ecomaner!",
        "content": "This is the content for the main page."
    }
    return JsonResponse(data)
