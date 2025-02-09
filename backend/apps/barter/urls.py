from django.urls import path
from . import views

app_name = 'barter'  # Пространство имён для URL-ов, удобно для `reverse()`

urlpatterns = [
    path('', views.barter_public, name='barter_public'),
    path('dashboard/', views.barter_dashboard, name='barter_dashboard'),
    path('requests/', views.barter_requests, name='barter_requests'),

    # 🔹 API (теперь через /api/)
    path('api/user-requests/', views.UserBarterRequestsAPIView.as_view(), name='user_barter_requests'),
    path('api/user-requests/<int:pk>/', views.UserBarterRequestDetailAPIView.as_view(), name='user_barter_request_detail'),

    path('api/deals/create/', views.CreateDealAPIView.as_view(), name='create_deal'),
    path('api/deals/<int:pk>/confirm/', views.ConfirmDealAPIView.as_view(), name='confirm_deal'),
    path('api/user-deals/', views.UserDealsAPIView.as_view(), name='user_deals'),
    path('api/all-requests/', views.AllBarterRequestsAPIView.as_view(), name='all_barter_requests'),
]
