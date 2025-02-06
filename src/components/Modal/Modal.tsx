import React from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  description: string;
  username: string;
  userId: string;
  className: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, description, username, className, onClose, onConfirm }) => {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>{username}</strong></p>
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
