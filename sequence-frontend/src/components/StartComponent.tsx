import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import JoinGameModal from './joinGameModal'
import "./StartComponent.css";
import BACKEND from '../constants';
import WaitingRoomComponent from './WaitingRoomComponent';

interface StartProps {
  loginId: string;
}

const Start: React.FC<StartProps> = ({loginId}) => {

  const [gameCode, setGameCode] = useState<string>();
  const [JoinModal, setJoinModal] = useState<boolean>(false);
  const [showBoard, setShowBoard] = useState<boolean>(false);
  const [players, setPlayers] = useState<any>([]);
  
  const handleCreateGame = async () => {
    console.log('Create Game button clicked');
    try {
      const response = await axios.post(`${BACKEND['BACKEND_URL']}:${BACKEND['BACKEND_PORT']}/create/`, {
          'userName' : loginId
      });
      console.log(response)
      console.log('API call response:', response.data);
      setGameCode(response.data['game_session'])
      setPlayers(response.data['players'])
      setShowBoard(true)
    } catch (error) {
      console.error('API call error:', error);
    }
  }

  const handleJoinGame = async () => {
    console.log('Join Game button clicked');
    setJoinModal(true)
  }

  const joinGameSession = async (gameSessionId: string) => {
    try {
      setGameCode(gameSessionId);
      console.log("gamecode : ", gameCode)
      const response = await axios.post(`${BACKEND['BACKEND_URL']}:${BACKEND['BACKEND_PORT']}/add/`, {
            'playerName' : loginId,
            'sessionId' : gameSessionId,
        });
        console.log('API call response:', response.data);
        setJoinModal(false)
        setPlayers(response.data)
        setShowBoard(true)
    } catch (error) {
      console.error('API call error:', error);
    }
  }

  return (
    <div>
      { !showBoard && (
        <div className='center-component'>
          <div>
            <h1 className="title">Let's play Sequence!</h1>
            <button className="main-button" onClick={handleCreateGame}>Create Game</button>
            <br></br>
            <button className="main-button" onClick={handleJoinGame}>Join Game</button>
          </div>
        </div>
      )}
      {JoinModal && (
        <JoinGameModal
          message="Enter Game Code"
          onSubmit={joinGameSession}
          onClose={() => setJoinModal(false)}
        />
      )}
      {showBoard && 
        <WaitingRoomComponent gameCode={gameCode} players={players} currentPlayer={loginId}></WaitingRoomComponent>
      }
    </div>
  );
}

export default Start;