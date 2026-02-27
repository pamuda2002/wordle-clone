import { useEffect, useState } from 'react';
import '../styles/Toast.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 2000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Start exit animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Call onClose after exit animation
    const closeTimer = setTimeout(() => {
      onClose();
    }, duration + 300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className={`toast ${isVisible ? 'visible' : ''}`}>
        {message}
      </div>
    </div>
  );
}