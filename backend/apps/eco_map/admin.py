from django.contrib import admin
from .models import Location

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'latitude', 'longitude', 'type', 'status', 'address', 'size', 'date_added', 'created_by')
    search_fields = ('description', 'address')
    list_filter = ('type', 'status')
    readonly_fields = ('date_added', 'last_updated')

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
