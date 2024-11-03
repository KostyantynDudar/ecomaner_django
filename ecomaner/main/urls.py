# main/urls.py
from django.contrib import admin
from django.urls import path
from . import views  # импорт views, если они находятся в текущем приложении

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('how-it-works/', views.how_it_works, name='how_it_works'),
    path('civilizations/', views.civilizations, name='civilizations'),
    path('gameplay/', views.gameplay, name='gameplay'),
    path('eternal-items/', views.eternal_items, name='eternal_items'),
    path('research/', views.research, name='research'),
    path('participation/', views.participation, name='participation'),
    path('news/', views.news, name='news'),
    path('faq/', views.faq, name='faq'),
    path('contact/', views.contact, name='contact'),
    path('store/', views.store, name='store'),
    path('map/', views.map, name='map'),

    path('api/register-email/', views.RegisterUserView.as_view(), name='register_email'),

]

# main/urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


urlpatterns += [
    path('api/photo-locations/', PhotoLocationsView.as_view(), name='photo_locations'),
]
