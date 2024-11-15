# backend/apps/eco_map/migrations/0006_create_location_photo_view.py

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('eco_map', '0005_locationphotoview'),  # Зависимость от предыдущей миграции
    ]

    operations = [
        migrations.RunSQL(
            """
            CREATE VIEW location_photo_view AS
            SELECT
                l.id AS location_id,
                l.latitude,
                l.longitude,
                l.description,
                l.type,
                l.status,
                p.id AS photo_id,
                p.bot_latitude,
                p.bot_longitude,
                p.bot_comments
            FROM
                eco_map_location AS l
            LEFT JOIN
                photo AS p  -- Замените на реальное имя таблицы с фото
            ON
                l.id = p.location_id;
            """,
            reverse_sql="DROP VIEW IF EXISTS location_photo_view;"
        ),
    ]
