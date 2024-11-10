# backend/apps/eco_map/admin.py
from django.contrib import admin
from .models import Location

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'latitude', 'longitude', 'type', 'status')
    search_fields = ('description', 'type', 'status')
