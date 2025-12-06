/*
how to use Message PopUp:
import it:
  1. import MessagePopup  from "Components/popup-message/MessagePopup"
  2. use it:
          <MessagePopup 
            message={message} 
            type="success" 
            duration={3000} 
          />
  type:
    - success
    - error
    - info
    - warning 
*/

import { useState, useEffect } from 'react';
import "./message-popup.scss"


// eslint-disable-next-line react/prop-types
const MessagePopup = ({ message, type = 'success', duration = 3000 }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleClose = () => {
    setIsClosing(true); 
  };

  if (!message) return null;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <div className={`message-popup ${type} ${isClosing ? 'closing' : ''}`}>
      <div className="message-content">
        <div className="message-icon">{icons[type]}</div>
        <div className="message-text">{message}</div>
        <button className="message-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default MessagePopup;