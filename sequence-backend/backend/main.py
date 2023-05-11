from backend.logic import Game
from backend.player import Player
from typing import List, Dict
import uuid
import json
from json import JSONEncoder
import pymongo

# subclass JSONEncoder
class Json_Encoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

class Game_Renderer:
    def __init__(self) -> None:
        self.games: Dict = {}
        self.players: Dict = {}
        self.game_play_response: Dict = {}

    def create_board(self, user: str):
        session_id = str(uuid.uuid4())
        newGame = Game()
        print("Board created!")
        player = Player(user, newGame.playerIndex)
        newGame.distribute(player)
        print("Current user added to board")
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
        print("Player added to board")
        return self.players[session_id]
    
    def fetch_players(self, session_id: str):
        return self.game_play_response[session_id]
        
    def game_play(self, player_name: str, session_id: str, pos_x: int, pos_y: int):
        game: Game = self.games[session_id]
        self.display_board(game)
        if game.winner:
            click_reponse = {'winner' : game.winnerUserId}
            return click_reponse
        else:
            game_players: List[Player] = self.players[session_id]
            print("player_name : ", player_name)
            print("game_players : ", game_players)
            current_player = [x for x in game_players if x.playerName == player_name][0]
            opponent_players = [x for x in game_players if x.playerName != player_name]
            print(f"{current_player.playerName}'s cards : {current_player.playerCards}")
            print(f"{current_player.playerName} selected : ", game.board[pos_x][pos_y])
            return self.click(game, session_id, current_player, opponent_players, pos_x, pos_y)

    def display_board(self, game: Game):
        print("Board :")
        print(end="\t")
        for col in range(len(game.board[0])):
            print(f"{col:2}", end="\t")
        print()
        for row in range(len(game.board)):
            print(f"{row:2}", end="\t")
            for col in range(len(game.board[row])):
                # TODO
                print(f"{game.board[row][col]:2}", end="\t")
            print()
 
    def click(self, game: Game, session_id: str, currentPlayer: Player, opponentPlayers: List[Player], x, y):
        opp_players_box = [oppPlayer.playerBox for oppPlayer in opponentPlayers]
        ok = game.setBox(currentPlayer, opp_players_box, x, y)

        response = {
            'game_play' : False,
            'winner' :  '',
            'out_of_deck' : False,
            'players' : self.players[session_id]
        }
        
        print("ok : ", ok)
        if not ok:
            return response

        if ok == 1:
            currentPlayer.addCard(game.getNewCard())
            response['game_play'] = True

        if game.winner:
            print(f"{currentPlayer.playerName} wins")
            # self.updateUserData(1, game.winnerUserId)
            self.players[session_id] = []
            response['winner'] = game.winnerUserId

        if not game.deck:
            print(f"Oops {currentPlayer.playerName}! that was close. but looks like you're out of cards. Better Luck newxt time ;_;")
            # self.updateUserData(0, game.winnerUserId)
            self.players[session_id].remove(currentPlayer)
            response['outOfDeck'] = True

        return response

    def updateUserData(self, score, username):
        mongo_client = pymongo.MongoClient("PROVODE MONGO CONNECTION STRING HERE")
        sequence_db = mongo_client["sequence"]
        players_collection = sequence_db['players']
        player = players_collection.find_one({'playerName' : username})

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

        players_collection.update_one({'playerName': username}, {"$set": {
                'playerName': username,
                'gamesWon' : gamesWon,
                'sequenceMade' : sequenceMade,
                'gamesLost' : gamesLost,
                'continousWin' : continousWin,
                'gamesPlayed' : gamesPlayed
            }}, upsert=True)
        
        print('updated player stats for ', username)
