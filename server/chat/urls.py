from django.urls import path
from .views import LastNMessagesView

urlpatterns = [
    # ... your other url patterns ...
    path('messages/last/<int:n>/', LastNMessagesView.as_view(), name='last-n-messages'),
]