from django.db import models

# Create your models here.

# api/models.py
from django.db import models

class ExampleModel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

