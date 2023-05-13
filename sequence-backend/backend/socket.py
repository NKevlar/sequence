from channels.generic.websocket import AsyncWebsocketConsumer
from server.views import game_renderer
from typing import List, Dict
from backend.player import Player
import json
import logging
from json import JSONEncoder

# subclass JSONEncoder
class Json_Encoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class PlayersDataConsumer(AsyncWebsocketConsumer):

    connected_users = set()
    
    async def connect(self):
        await self.accept()
        user = self.scope["user"]
        self.connected_users.add(user)
        logging.info("SOCEKT: connected")
        logging.info("SOCEKT: connected users : " + self.connected_users)

    async def disconnect(self, close_code):
        pass
        logging.info("SOCEKT: disconnected")

    async def receive(self, text_data):
        logging.info("SOCEKT: received data : " + data)
        user = self.scope["user"]
        logging.info("SOCEKT: current user : " + user)
        data = json.loads(text_data)
        session_id = data['session_id']
        players: List[Player] = data['players']
        winner = data['winner']
        game_renderer.game_play_response[session_id] = {
            'session_id' : session_id,
            'players' : players,
            'winner' : winner
        }
        await self.send(text_data=json.dumps(game_renderer.game_play_response, indent=4, cls=Json_Encoder))
        logging.info("SOCEKT: sending received data")