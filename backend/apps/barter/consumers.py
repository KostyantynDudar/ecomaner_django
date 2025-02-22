import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.barter.models import BarterDeal as Deal

class TradeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["deal_id"]
        self.room_group_name = f"deal_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        print(f"✅ WebSocket подключен: {self.room_name}")

        # Отправляем текущее состояние сделки новому пользователю
        await self.fetch_current_state()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f"❌ WebSocket отключен: {self.room_name}")

    async def receive(self, text_data):
        """Обрабатываем входящие сообщения от клиента"""
        data = json.loads(text_data)
        print(f"📨 Получены данные от клиента: {data}")

        if data["action"] == "update_price":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "deal_update",
                    "offerA": data["offerA"],
                    "offerB": data["offerB"],
                    "priceDifference": data["priceDifference"],
                }
            )
            await self.update_database(data)

        elif data["action"] == "update_status":
            new_status = data["status"]
            await self.update_deal_status(new_status)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "deal_status_update",
                    "status": new_status,
                }
            )

    async def deal_update(self, event):
        """Отправляем обновленные данные по сделке клиентам"""
        print(f"📤 Отправка обновлений всем клиентам в комнате {self.room_name}: {event}")

        await self.send(text_data=json.dumps({
            "type": "update",
            "offerA": event["offerA"],
            "offerB": event["offerB"],
            "priceDifference": event["priceDifference"],
        }))

    async def deal_status_update(self, event):
        """🔹 Отправка нового статуса сделки всем клиентам"""
        print(f"📤 Отправка нового статуса сделки {self.room_name}: {event['status']}")

        await self.send(text_data=json.dumps({
            "type": "status_update",
            "status": event["status"],
        }))

    async def fetch_current_state(self):
        """Отправка текущего состояния сделки при подключении нового пользователя"""
        deal = await self.get_deal_state()
        if deal:
            await self.send(text_data=json.dumps({
                "type": "update",
                "offerA": deal["offerA"],
                "offerB": deal["offerB"],
                "priceDifference": deal["priceDifference"],
            }))

    @sync_to_async
    def get_deal_state(self):
        """Получение состояния сделки из базы данных"""
        try:
            deal = Deal.objects.get(id=self.room_name)
            offerA = float(deal.item_A.estimated_value) if deal.item_A else 0
            offerB = float(deal.item_B.estimated_value) if deal.item_B else 0

            return {
                "offerA": offerA,
                "offerB": offerB,
                "priceDifference": abs(offerA - offerB),
            }
        except Deal.DoesNotExist:
            return None

    @sync_to_async
    def update_database(self, data):
        """Обновление состояния сделки в базе данных"""
        try:
            deal = Deal.objects.get(id=self.room_name)
            if deal.item_A:
                deal.item_A.estimated_value = data["offerA"]
                deal.item_A.save()
            if deal.item_B:
                deal.item_B.estimated_value = data["offerB"]
                deal.item_B.save()
            print(f"✅ Обновлено в БД: {data['offerA']} ↔ {data['offerB']}")
        except Deal.DoesNotExist:
            print(f"❌ Ошибка: Сделка {self.room_name} не найдена")

    @sync_to_async
    def update_deal_status(self, new_status):
        """🔹 Обновление статуса сделки в БД"""
        try:
            deal = Deal.objects.get(id=self.room_name)
            deal.status = new_status
            deal.save()
            print(f"✅ Статус сделки {self.room_name} обновлен: {new_status}")
        except Deal.DoesNotExist:
            print(f"❌ Ошибка: Сделка {self.room_name} не найдена")
