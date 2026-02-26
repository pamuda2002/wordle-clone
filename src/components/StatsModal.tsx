import type { GameStats } from '../types';
import '../styles/StatsModal.css';

interface StatsModalProps {
  stats: GameStats;
  gameStatus: 'playing' | 'won' | 'lost';
  solution: string;
  onPlayAgain: () => void;
}

export function StatsModal({ stats, gameStatus, solution, onPlayAgain }: StatsModalProps) {
  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="stats-modal">
      {gameStatus !== 'playing' && (
        <div className="game-result">
          {gameStatus === 'won' ? (
            <p className="result-text win">🎉 Congratulations!</p>
          ) : (
            <p className="result-text lose">
              The word was: <strong>{solution}</strong>
            </p>
          )}
        </div>
      )}

      <h3>Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.gamesPlayed}</span>
          <span className="stat-label">Played</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{winPercentage}</span>
          <span className="stat-label">Win %</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.currentStreak}</span>
          <span className="stat-label">Current Streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.maxStreak}</span>
          <span className="stat-label">Max Streak</span>
        </div>
      </div>

      <h3>Guess Distribution</h3>
      
      <div className="distribution">
        {stats.guessDistribution.map((count, index) => (
          <div key={index} className="distribution-row">
            <span className="guess-number">{index + 1}</span>
            <div 
              className="distribution-bar"
              style={{ 
                width: `${Math.max((count / maxDistribution) * 100, 7)}%`,
                backgroundColor: count > 0 ? 'var(--color-correct)' : 'var(--color-absent)'
              }}
            >
              <span className="distribution-count">{count}</span>
            </div>
          </div>
        ))}
      </div>

      {gameStatus !== 'playing' && (
        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      )}
    </div>
  );
}