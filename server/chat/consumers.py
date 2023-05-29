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
        logger.info("Connect method called")
        logging.info("user: %s', self.scope['user']")
        await self.channel_layer.group_add("chat", self.channel_name)
        logger.info("Connect group added")
        await self.accept()
        logger.info("Connect accepted")

    async def disconnect(self, close_code):
        logging.info("Disconnect method called")
        await self.channel_layer.group_discard("chat", self.channel_name)
        logging.info("Disconnect group discarded")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        nickname = text_data_json.get('nickname', 'Anonymous')  # get nickname from client or default to 'Anonymous'
        logger.info(f"Receive method called with text_data: {text_data}")

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


