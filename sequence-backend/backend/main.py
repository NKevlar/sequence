from backend.logic import Game
from backend.player import Player
from typing import List, Dict
import uuid
import json
from json import JSONEncoder
import secrets
import pymongo
import logging

# subclass JSONEncoder
class Json_Encoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class Game_Renderer:
    def __init__(self) -> None:
        self.games: Dict = {}
        self.players: Dict = {}
        self.game_play_response: Dict = {}

    def generate_game_code(self):
        game_code = ''
        while len(game_code) < 5:
            game_code += str(secrets.randbelow(10))
        return game_code

    def create_board(self, user: str):
        session_id = self.generate_game_code()
        newGame = Game()
        logging.debug("BOARD CREATED!")
        player = Player(user, newGame.playerIndex)
        newGame.distribute(player)
        logging.debug("CURRENT USER ADDED TO BOARD")
        self.games[session_id] = newGame
        self.players[session_id] = [player]
        self.game_play_response[session_id] = {
            'players' : self.players[session_id],
            'winner' : ''
        }
        result = {'game' : newGame, 'game_session' : session_id, 'players' : self.players[session_id]}
        return result

    def add_player(self, player_name: str, session_id: str):
        game: Game = self.games[session_id]
        game.incrementPlayerIndex()
        player = Player(player_name, game.playerIndex)
        game.distribute(player)
        if session_id in self.players:
            self.players[session_id].append(player)
        logging.debug("PLAYER ADDED TO BOARD")
        return self.players[session_id]
    
    def fetch_players(self, session_id: str):
        return self.game_play_response[session_id]
        
    def game_play(self, player_name: str, session_id: str, pos_x: int, pos_y: int):
        game: Game = self.games[session_id]
        if game.winner:
            click_reponse = {'winner' : game.winnerUserId}
            return click_reponse
        else:
            game_players: List[Player] = self.players[session_id]
            logging.debug("PLAYER NAME " + player_name)
            logging.debug("GAME PLAYERS " + str(game_players))
            current_player = [x for x in game_players if x.playerName == player_name][0]
            opponent_players = [x for x in game_players if x.playerName != player_name]
            logging.debug(f"{current_player.playerName}'s CARDS : {current_player.playerCards}")
            logging.debug(f"{current_player.playerName} SELECTED : {game.board[pos_x][pos_y]}")
            return self.click(game, session_id, current_player, opponent_players, pos_x, pos_y)
 
    def click(self, game: Game, session_id: str, currentPlayer: Player, opponentPlayers: List[Player], x, y):
        opp_players_box = [oppPlayer.playerBox for oppPlayer in opponentPlayers]
        ok = game.setBox(currentPlayer, opp_players_box, x, y)

        response = {
            'game_play' : False,
            'winner' :  '',
            'out_of_deck' : False,
            'players' : self.players[session_id]
        }
        
        if not ok:
            return response

        if ok == 1:
            currentPlayer.addCard(game.getNewCard())
            response['game_play'] = True

        if game.winner:
            logging.debug(f"{currentPlayer.playerName} WINS")
            # self.updateUserData(1, game.winnerUserId)
            self.players[session_id] = []
            response['winner'] = game.winnerUserId

        if not game.deck:
            logging.debug(f"{currentPlayer.playerName} IS OUT OF CARDS")
            # self.updateUserData(0, game.winnerUserId)
            self.players[session_id].remove(currentPlayer)
            response['outOfDeck'] = True

        return response

    def updateUserData(self, score, username):
        logging.info("ATTEMPTING MONGO DB CONNECTION")
        mongo_client = pymongo.MongoClient("PROVODE MONGO CONNECTION STRING HERE")
        sequence_db = mongo_client["sequence"]
        players_collection = sequence_db['players']
        find_query = {'playerName' : username}
        player = players_collection.find_one(find_query)

        if player:
            gamesWon = player["gamesWon"]
            sequenceMade = player["sequenceMade"]
            gamesLost = player["gamesLost"]
            continousWin = player["continousWin"]
            gamesPlayed = player["gamesPlayed"]
        else:
            gamesWon = 0
            sequenceMade = 0
            gamesLost = 0
            continousWin = 0
            gamesPlayed = 0

        if score:
            gamesWon += 1
            sequenceMade += 1
            continousWin += 1
        else:
            gamesLost += 1
            continousWin = 0

        gamesPlayed += 1

        update_query = {'playerName': username}, {"$set": {
                'playerName': username,
                'gamesWon' : gamesWon,
                'sequenceMade' : sequenceMade,
                'gamesLost' : gamesLost,
                'continousWin' : continousWin,
                'gamesPlayed' : gamesPlayed
            }}
        players_collection.update_one(update_query, upsert=True)
        
        logging.debug('UPDATED PLAYER STATS FOR '+ username)
