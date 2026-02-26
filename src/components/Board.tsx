import { Row } from './Row';
import type { Tile } from '../types';
import '../styles/Board.css';

interface BoardProps {
  guesses: Tile[][];
  currentRow: number;
  isRevealing: boolean;
  isInvalidWord: boolean;
  hasWon: boolean;
}

export function Board({ 
  guesses, 
  currentRow, 
  isRevealing, 
  isInvalidWord,
  hasWon
}: BoardProps) {
  return (
    <div className="board-container">
      <div className="board">
        {guesses.map((row, index) => (
          <Row 
            key={index}
            tiles={row}
            isCurrentRow={index === currentRow}
            isRevealing={isRevealing && index === currentRow}
            isInvalid={isInvalidWord && index === currentRow}
            hasWon={hasWon && index === currentRow}
          />
        ))}
      </div>
    </div>
  );
}