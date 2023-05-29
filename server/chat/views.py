from rest_framework import generics
from .models import Message
from .serializers import MessageSerializer

class LastNMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        n = self.kwargs.get('n', 10)  # Default to 10 if no 'n' is provided
        return Message.objects.order_by('timestamp')[:n]
