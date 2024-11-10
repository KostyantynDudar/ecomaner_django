# backend/apps/eco_map/admin.py
from django.contrib import admin
from .models import Location, LocationPhotoView


@admin.register(LocationPhotoView)
class LocationPhotoViewAdmin(admin.ModelAdmin):
    list_display = ('location_id', 'latitude', 'longitude', 'bot_latitude', 'bot_longitude', 'photo_id')
    search_fields = ('description', 'bot_comments')
    readonly_fields = ('location_id', 'latitude', 'longitude', 'description', 'type', 'status', 
                       'photo_id', 'bot_latitude', 'bot_longitude', 'bot_comments')
