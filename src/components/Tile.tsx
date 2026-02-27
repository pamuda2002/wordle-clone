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
  
  // Calculate animation delay for flip (stagger each tile)
  const animationDelay = position * 300;
  
  // Determine if this tile has been evaluated (has a final color)
  const isEvaluated = status === 'correct' || status === 'present' || status === 'absent';
  
  // Build class names
  const classNames = [
    'tile',
    // Always add the status class if evaluated (this controls back face color AND keeps it flipped)
    isEvaluated ? status : '',
    // Add revealing class only during animation
    isRevealing ? 'revealing' : '',
    // Add filled class for current row tiles that have letters but aren't evaluated yet
    isCurrentRow && letter && !isEvaluated ? 'filled' : '',
    // Add invalid class for shake animation
    isInvalid ? 'invalid' : '',
  ].filter(Boolean).join(' ');
  
  // CSS custom properties for animation delay
  const style = {
    '--animation-delay': `${animationDelay}ms`,
  } as React.CSSProperties;
  
  return (
    <div 
      className={classNames}
      style={style}
    >
      <div className="tile-inner">
        <div className="tile-front">
          {letter}
        </div>
        <div className="tile-back">
          {letter}
        </div>
      </div>
    </div>
  );
}