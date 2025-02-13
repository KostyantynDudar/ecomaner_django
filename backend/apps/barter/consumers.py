import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DealConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.deal_id = self.scope['url_route']['kwargs']['deal_id']
        self.room_group_name = f"deal_{self.deal_id}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        
        if action == "update_price":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "deal_update",
                    "offerA": data["offerA"],
                    "offerB": data["offerB"],
                    "priceDifference": data["priceDifference"],
                }
            )
        elif action == "confirm_deal":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "deal_confirm",
                    "user": data["user"],
                }
            )
    
    async def deal_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "update",
            "offerA": event["offerA"],
            "offerB": event["offerB"],
            "priceDifference": event["priceDifference"],
        }))
        
    async def deal_confirm(self, event):
        await self.send(text_data=json.dumps({
            "type": "confirm",
            "user": event["user"],
        }))
