import * as React from 'react';
import { useState } from 'react';
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

    if (notifyMessage) {
      setNotify(true)
      setNotification(notifyMessage)
    }

    const handlePlay = async (row: number, col: number) => {
        console.log(`row : ${row}, col : ${col}`)
        try {
          let gameOver = false;
          const response = await axios.post(`${BACKEND['BACKEND_URL']}:${BACKEND['BACKEND_PORT']}/play/`, {
                'playerName' : currentPlayer,
                'sessionId' : gameCode,
                'positionX' : row,
                'positionY' : col
            });
            console.log('API call response:', response.data);
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