# ecomaner/views.py

from django.http import JsonResponse
from django.db import connection


def photo_locations(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, lat_id AS latitude, long_id AS longitude, comments FROM photo;")
            results = cursor.fetchall()
            locations = [{'id': row[0], 'latitude': row[1], 'longitude': row[2], 'comments': row[3]} for row in results]
        return JsonResponse({'success': True, 'data': locations})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})