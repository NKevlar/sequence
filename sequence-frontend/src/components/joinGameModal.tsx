import * as React from 'react';
import { useState } from 'react'
import "./Modal.css";

interface JoinGameModalProps {
  message: string; // Custom text message for the modal
  onSubmit: (gameCode: string) => void; // Callback function to handle form submission
  onClose: () => void; // Callback function to handle modal closing
}

const JoinGameModal: React.FC<JoinGameModalProps> = ({ message, onSubmit, onClose }) => {
  const [gameCode, setGameCode] = useState<string>(""); // State to hold the game code

  const handleSubmit = () => {
    onSubmit(gameCode); // Call the onSubmit callback with the game code
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="waitroom-text">{message}</h2>
        <input
          type="text"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <button className="button-3" onClick={handleSubmit}>Submit</button>
        <button className="button-3" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JoinGameModal;