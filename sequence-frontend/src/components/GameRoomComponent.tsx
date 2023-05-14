import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND from '../constants';
import SequenceBoard from './BoardComponent';
import Alert from "react-bootstrap/Alert";
import NotificationModal from './NotificationModal'
import StartComponent from './StartComponent'

interface GameRoomProps {
  gameCode: string;
  players: any
  currentPlayer: string;
  notifyMessage: string;
  resetRefresh: () => void;
}

const GameRoomComponent: React.FC<GameRoomProps> = ({gameCode, players, currentPlayer, notifyMessage, resetRefresh}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isNotify, setNotify] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>('');
    const [showBoard, setShowBoard] = useState<boolean>(true);
    const [playersData, setPlayersData] = useState<any>(players);
    const [goToStart, setGoToStart] = useState<boolean>(false);

    const socket = new WebSocket(`ws://${BACKEND['BACKEND_IP']}:${BACKEND['BACKEND_PORT']}/ws/`);
    socket.onopen = () => {
      console.log('Connected to websocket server');
    };
    socket.onclose = () => {
      console.log('Disconnected from websocket server');
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Recieving data from websocket : ", data);
      setPlayersData(data[gameCode]['players']);
      setShowBoard(false)
      setShowBoard(true)
    };

    if (notifyMessage) {
      setNotify(true)
      setNotification(notifyMessage)
    }

    const handlePlay = async (row: number, col: number) => {
        console.log(`row : ${row}, col : ${col}`)
        try {
          let gameOver = false;
          const response = await axios.post(`https://${BACKEND['BACKEND_IP']}:${BACKEND['BACKEND_PORT']}/play/`, {
                'playerName' : currentPlayer,
                'sessionId' : gameCode,
                'positionX' : row,
                'positionY' : col
            });
            console.log('Response of game play:', response.data);
            if (response.data['winner']) {
              setNotify(true)
              setNotification(`${response.data['winner']}! won the game 👏`)
              gameOver = true;
            } else if (response.data['out_of_deck'] === true) {
              setNotify(true)
              setNotification(`Oops! ${currentPlayer}! You're out of cards. You lost 🙁`)
              gameOver = true;
            } else if (response.data['game_play'] === false) {
              setErrorMessage('Oops! You made an invalid move. Please try again')
              setTimeout(() => {
                setErrorMessage('')
              }, 5000)
            }
            setPlayersData(response.data['players'])
            socket.send(JSON.stringify({
              session_id: gameCode,
              players: response.data['players'],
              winner: response.data['winner']
            }));
        } catch (error) {
          console.error('API call error:', error);
        }
      }

    return(
        <div>
             {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} className="alert-custom" dismissible={false}>
                {errorMessage}
                </Alert>
            )}
            {isNotify &&
                <NotificationModal message={notification} onClose={() => {
                    setShowBoard(false)
                    setNotify(false)
                    setGoToStart(true)
                    resetRefresh()
                }}></NotificationModal>
            }
            { goToStart &&
              <StartComponent loginId={currentPlayer}></StartComponent>
            }
            { showBoard &&
                <SequenceBoard players={playersData} currentPlayer={currentPlayer} handlePlaceCoin={handlePlay} />
            }
        </div>
    )
}

export default GameRoomComponent;