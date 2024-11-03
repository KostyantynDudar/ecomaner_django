from django.urls import path
from . import views
from .views import PhotoLocationsView  # Убедитесь, что этот импорт присутствует
from .views import RegisterEmailView  # Убедитесь, что RegisterEmailView импортирован
from .views import RegisterEmailView, LoginView  # Добавьте LoginView

urlpatterns = [
    path('example/', views.ExampleView.as_view(), name='example'),
    path('photo-locations/', PhotoLocationsView.as_view(), name='photo_locations'),
    path('register-email/', RegisterEmailView.as_view(), name='register-email'),
    path('login/', LoginView.as_view(), name='login'),
]
