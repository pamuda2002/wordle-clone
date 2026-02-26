import type { KeyboardStatus } from '../types';
import { KEYBOARD_ROWS } from '../utils/constants';
import '../styles/Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: KeyboardStatus;
  disabled?: boolean;
}

export function Keyboard({ onKeyPress, keyboardStatus, disabled = false }: KeyboardProps) {
  const handleClick = (key: string) => {
    if (!disabled) {
      onKeyPress(key);
    }
  };

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyboardStatus[key] || '';
            const isSpecial = key === 'enter' || key === 'backspace';
            
            return (
              <button
                key={key}
                className={`key ${status} ${isSpecial ? 'special' : ''}`}
                onClick={() => handleClick(key)}
                disabled={disabled}
                data-key={key}
              >
                {key === 'backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}