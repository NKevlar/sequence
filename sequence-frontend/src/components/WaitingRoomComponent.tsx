import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND from '../constants';
import GameRoomComponent from './GameRoomComponent';

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

  // const ws = new WebSocket('wss://example.com/socket');

  // ws.addEventListener('open', () => {
  //   console.log('WebSocket connection established');
    
  //   // send the API request
  //   ws.send(JSON.stringify({
  //     endpoint: `${BACKEND_URL}${BACKEND_PORT}/refresh/`,
  //     method: 'POST',
  //     data: {'sessionId' : gameCode}
  //   }));
  // });

  // ws.addEventListener('message', (event) => {
  //   const response = JSON.parse(event.data);
  //   console.log('Received API response:', response);
  //   setPlayersData(response.data)
  // });
  
  // ws.addEventListener('close', () => {
  //   console.log('WebSocket connection closed');
  // });

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchPlayers()
  //   }, 5000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.post(`${BACKEND['BACKEND_URL']}:${BACKEND['BACKEND_PORT']}/refresh/`, {
            'sessionId' : gameCode,
        });
        console.log('API call response:', response.data);
        if (response.data['winner']) {
          setNotifyMessage(`${response.data['winner']}! won the game 👏`)
          setGameStart(false)
          setGameStart(true)
        } else {
          setPlayersData(response.data)
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
    // clearInterval(intervalId);
  }

  return (
    <div>
      { needRefresh &&
        <button className="main-button " onClick={fetchPlayers}>Refresh</button>
      }
      {!gameStart && (
        <div>
          <p>Waiting for other players to join...</p>
          <p>Number of players joined: {PlayersData.length}</p>
          <button className="main-button" onClick={handleGameStart}>Start Game</button>
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
