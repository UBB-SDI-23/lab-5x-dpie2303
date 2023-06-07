from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
import logging
import asyncio

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def save_message(self, nickname, message):
        from chat.models import Message
        Message.objects.create(nickname=nickname, message=message)

    async def connect(self):
        await self.channel_layer.group_add("chat", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("chat", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        nickname = text_data_json.get('nickname', 'Anonymous')  # get nickname from client or default to 'Anonymous'

        # Start the save_message operation, but don't wait for it to finish
        asyncio.create_task(self.save_message(nickname, message)) # type: ignore

        await self.channel_layer.group_send(
            "chat",
            {
                'type': 'chat.message',
                'message': message,
                'nickname': nickname,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        nickname = event['nickname']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'nickname': nickname,
            'message': message
        }))


