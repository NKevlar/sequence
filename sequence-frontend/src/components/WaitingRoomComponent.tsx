import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND from '../constants';
import GameRoomComponent from './GameRoomComponent';
import './BoardComponent.css'

interface WaitingRoomProps {
  gameCode: string;
  players: any
  currentPlayer: string;
}

const WaitingRoomComponent: React.FC<WaitingRoomProps> = ({gameCode, players, currentPlayer}) => {
  const [PlayersData, setPlayersData] = useState<any>(players);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [notifyMessage, setNotifyMessage] = useState<string>('');
  const [needRefresh, setNeedRefresh] = useState<boolean>(true)

  const resetRefresh = () => {
    setNeedRefresh(!needRefresh)
  }

  const fetchPlayers = async () => {
    try {
      const response = await axios.post(`https://${BACKEND['BACKEND_IP']}:${BACKEND['BACKEND_PORT']}/refresh/`, {
            'sessionId' : gameCode,
        });
        console.log('player data:', response.data);
        if (response.data['winner']) {
          setNotifyMessage(`${response.data['winner']}! won the game 👏`)
          setGameStart(false)
          setGameStart(true)
        } else {
          setPlayersData(response.data['players'])
        }
        if (gameStart) {
          setGameStart(false)
          setGameStart(true)
        }
    } catch (error) {
      console.error('API call error:', error);
    }
  }

  const handleGameStart = async () => {
    setGameStart(true)
  }

  return (
    <div className="waiting-room">
      { needRefresh &&
        <div className="refresh-div">
        <button className="main-button refresh-button button-3" onClick={fetchPlayers}></button>
        </div>
      }
      {!gameStart && (
        <div className="waitroom-content">
          <p className="waitroom-text">Waiting for other players to join...</p>
          <p className="waitroom-text">Number of players joined: {PlayersData.length}</p>
          <p className="waitroom-text">Game code : {gameCode}</p>
          <button className="button-3 main-button start-game-button" onClick={handleGameStart}>Start Game</button>
        </div>
      )}
      {
        gameStart && (
          <GameRoomComponent gameCode={gameCode} players={PlayersData} currentPlayer={currentPlayer} notifyMessage={notifyMessage} resetRefresh={resetRefresh}></GameRoomComponent>
        )
      }
    </div>
  );
}

export default WaitingRoomComponent;
