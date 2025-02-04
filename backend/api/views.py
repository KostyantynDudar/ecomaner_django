
# backend/api/views.py
from django.http import JsonResponse

def main_home(request):
    data = {
        "message": "Привет на Экоманере! \nСделаем мир чище вместе.",
        "content": "This is the content for the main page."
    }
    return JsonResponse(data)
