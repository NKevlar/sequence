import * as React from 'react';
import "./Modal.css";

interface NotificationModalProps {
  message: string; // Custom text message for the modal
  onClose: () => void; // Callback function to handle modal closing
}

const NotificationModal: React.FC<NotificationModalProps> = ({ message, onClose }) => {

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default NotificationModal;