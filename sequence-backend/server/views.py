from django.shortcuts import render
import logging
from django.http import HttpResponse, HttpRequest, JsonResponse
from backend.main import Game_Renderer
import json
from json import JSONEncoder
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .user_manage import UserSerializer
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
# from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError

game_renderer = Game_Renderer()

# subclass JSONEncoder
class Json_Encoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

def index(request):
    return HttpResponse("Hello Players, Let's play Sequence")

@api_view(['POST'])
def create_game(request: HttpRequest):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    user = data.get('userName')
    result = game_renderer.create_board(user)
    response = json.dumps(result, indent=4, cls=Json_Encoder)
    return JsonResponse(json.loads(response), safe=False)

@api_view(['POST'])
def add_player(request: HttpRequest):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    player = data.get('playerName')
    session_id = data.get('sessionId')
    result = game_renderer.add_player(player, session_id)
    response = json.dumps(result, indent=4, cls=Json_Encoder)
    return JsonResponse(json.loads(response), safe=False)

@api_view(['POST'])
def play_game(request: HttpRequest):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    player = data.get('playerName')
    session_id = data.get('sessionId')
    pos_x = data.get("positionX")
    pos_y = data.get("positionY")
    result = game_renderer.game_play(player, session_id, int(pos_x), int(pos_y))
    response = json.dumps(result, indent=4, cls=Json_Encoder)
    return JsonResponse(json.loads(response), safe=False)

@api_view(['POST'])
def refresh_players(request: HttpRequest):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    session_id = data.get('sessionId')
    result = game_renderer.fetch_players(session_id)
    response = json.dumps(result, indent=4, cls=Json_Encoder)
    return JsonResponse(json.loads(response), safe=False)

@api_view(['POST'])
def login_user(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    username = data.get('username')
    password = data.get('password')
    logging.info("AUTHENTICATING USER " + username)
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        logging.info("SUCCESSFUL USER LOGIN FOR " + username)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid credentials'})

@api_view(['POST'])
def create_user(request: HttpRequest):
    logging.debug("SERIALIZING DATA")
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        logging.debug("VALIDATION FAILED FOR ACCOUNT ")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
