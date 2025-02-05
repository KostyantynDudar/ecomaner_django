from django.conf import settings
from django.db import models

class BarterRequest(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="barter_requests", null=True, blank=True)  # Добавляем null=True
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.email if self.owner else 'Без владельца'} - {self.title}"
