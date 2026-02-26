import { Tile } from './Tile';
import type { Tile as TileType } from '../types';
import '../styles/Row.css';

interface RowProps {
  tiles: TileType[];
  isCurrentRow?: boolean;
  isRevealing?: boolean;
  isInvalid?: boolean;
  hasWon?: boolean;
}

export function Row({ 
  tiles, 
  isCurrentRow = false, 
  isRevealing = false,
  isInvalid = false,
  hasWon = false
}: RowProps) {
  const classNames = [
    'row',
    isInvalid ? 'shake' : '',
    hasWon ? 'win-animation' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tile={tile}
          position={index}
          isRevealing={isRevealing}
          isCurrentRow={isCurrentRow}
          isInvalid={isInvalid}
        />
      ))}
    </div>
  );
}