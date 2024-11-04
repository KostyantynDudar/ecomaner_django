from django.db import models

# Create your models here.
from django.db import models

class Photo(models.Model):
    # Укажите нужные поля модели
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='photos/')
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class ExampleModel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name