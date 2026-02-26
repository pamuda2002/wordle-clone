import type { Tile as TileType } from '../types';
import '../styles/Tile.css';

interface TileProps {
  tile: TileType;
  position: number;
  isRevealing?: boolean;
  isCurrentRow?: boolean;
  isInvalid?: boolean;
}

export function Tile({ 
  tile, 
  position, 
  isRevealing = false, 
  isCurrentRow = false,
  isInvalid = false 
}: TileProps) {
  const { letter, status } = tile;
  
  // Calculate animation delay for flip
  const animationDelay = isRevealing ? `${position * 350}ms` : '0ms';
  
  // Build class names
  const classNames = [
    'tile',
    status,
    isRevealing ? 'revealing' : '',
    isCurrentRow && letter ? 'filled' : '',
    isInvalid ? 'invalid' : '',
    isCurrentRow && letter && !isRevealing ? 'pop' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      style={{ animationDelay }}
      data-status={status}
      data-letter={letter}
    >
      <div className="tile-front">
        {letter}
      </div>
      <div className="tile-back">
        {letter}
      </div>
    </div>
  );
}