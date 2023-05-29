from django.db import models


class Message(models.Model):
    nickname = models.CharField(max_length=100)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)