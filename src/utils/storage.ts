import type { GameStats, GameState } from '../types';

const STATS_KEY = 'wordle-stats';
const GAME_STATE_KEY = 'wordle-game-state';

/**
 * Get default stats object
 */
export function getDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0]
  };
}

/**
 * Load stats from localStorage
 */
export function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  return getDefaultStats();
}

/**
 * Save stats to localStorage
 */
export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

/**
 * Update stats after a game
 */
export function updateStats(
  currentStats: GameStats, 
  won: boolean, 
  numberOfGuesses: number
): GameStats {
  const newStats = { ...currentStats };
  
  newStats.gamesPlayed += 1;
  
  if (won) {
    newStats.gamesWon += 1;
    newStats.currentStreak += 1;
    newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
    newStats.guessDistribution[numberOfGuesses - 1] += 1;
  } else {
    newStats.currentStreak = 0;
  }
  
  return newStats;
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  return null;
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

/**
 * Clear game state from localStorage
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}