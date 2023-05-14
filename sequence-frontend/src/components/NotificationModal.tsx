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
        <h2 className="waitroom-text">{message}</h2>
        <button className="button-3" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default NotificationModal;