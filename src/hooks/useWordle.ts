import { useState, useCallback, useEffect } from 'react';
import type { GameStatus, KeyboardStatus, Tile, GameStats } from '../types';
import { getRandomWord, isValidWord, evaluateGuess, createTilesFromGuess,createEmptyTiles,updateKeyboardStatus } from '../utils/gameUtils';
import { loadStats, saveStats, updateStats, loadGameState,saveGameState,clearGameState } from '../utils/storage';
import { WORD_LENGTH, MAX_GUESSES } from '../utils/constants';

// Win messages based on number of guesses
const WIN_MESSAGES = [
  'Genius!',      // 1 guess
  'Magnificent!', // 2 guesses
  'Impressive!',  // 3 guesses
  'Splendid!',    // 4 guesses
  'Great!',       // 5 guesses
  'Phew!'         // 6 guesses
];

interface UseWordleReturn {
  solution: string;
  guesses: Tile[][];
  currentGuess: string;
  currentRow: number;
  gameStatus: GameStatus;
  keyboardStatus: KeyboardStatus;
  stats: GameStats;
  isInvalidWord: boolean;
  isRevealing: boolean;
  toastMessage: string;        // Add this
  clearToast: () => void;      // Add this
  handleKeyPress: (key: string) => void;
  resetGame: () => void;
}

// Helper function to create empty board
function createEmptyBoard(): Tile[][] {
  return Array(MAX_GUESSES).fill(null).map(() => createEmptyTiles());
}

// Helper function to get initial game state
interface InitialGameState {
  solution: string;
  guesses: Tile[][];
  currentGuess: string;
  currentRow: number;
  gameStatus: GameStatus;
  keyboardStatus: KeyboardStatus;
}

function getInitialGameState(): InitialGameState {
  const savedState = loadGameState();
  
  if (savedState && savedState.gameStatus === 'playing') {
    const restoredGuesses: Tile[][] = [];
    let restoredKeyboard: KeyboardStatus = {};
    
    savedState.guesses.forEach((guess) => {
      const evaluation = evaluateGuess(guess, savedState.solution);
      restoredGuesses.push(createTilesFromGuess(guess, evaluation));
      restoredKeyboard = updateKeyboardStatus(restoredKeyboard, guess, evaluation);
    });
    
    while (restoredGuesses.length < MAX_GUESSES) {
      restoredGuesses.push(createEmptyTiles());
    }
    
    return {
      solution: savedState.solution,
      guesses: restoredGuesses,
      currentGuess: savedState.currentGuess,
      currentRow: savedState.currentRow,
      gameStatus: savedState.gameStatus,
      keyboardStatus: restoredKeyboard
    };
  }
  
  const newWord = getRandomWord();
  console.log('Solution:', newWord);
  
  return {
    solution: newWord,
    guesses: createEmptyBoard(),
    currentGuess: '',
    currentRow: 0,
    gameStatus: 'playing',
    keyboardStatus: {}
  };
}

// Main Hook
export function useWordle(): UseWordleReturn {
  const [gameState, setGameState] = useState<InitialGameState>(getInitialGameState);
  
  const { solution, guesses, currentGuess, currentRow, gameStatus, keyboardStatus } = gameState;
  
  // UI states
  const [isInvalidWord, setIsInvalidWord] = useState<boolean>(false);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Stats
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Clear toast message
  const clearToast = useCallback(() => {
    setToastMessage('');
  }, []);

  // Show toast helper
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (solution) {
      const guessStrings = guesses
        .slice(0, currentRow)
        .map(row => row.map(tile => tile.letter).join(''))
        .filter(guess => guess.length === WORD_LENGTH);
      
      saveGameState({
        solution,
        guesses: guessStrings,
        currentGuess,
        gameStatus,
        currentRow
      });
    }
  }, [solution, guesses, currentGuess, gameStatus, currentRow]);

  // Helper to update game state
  const updateGameState = useCallback((updates: Partial<InitialGameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  // Initialize new game
  const initializeNewGame = useCallback(() => {
    const newWord = getRandomWord();
    console.log('Solution:', newWord);
    
    setGameState({
      solution: newWord,
      guesses: createEmptyBoard(),
      currentGuess: '',
      currentRow: 0,
      gameStatus: 'playing',
      keyboardStatus: {}
    });
    
    setIsInvalidWord(false);
    setIsRevealing(false);
    setToastMessage('');
    clearGameState();
  }, []);

  // Create tiles for current row
  const createCurrentRowTiles = useCallback((guess: string): Tile[] => {
    const tiles: Tile[] = [];
    
    for (const letter of guess) {
      tiles.push({ letter, status: 'tbd' });
    }
    
    while (tiles.length < WORD_LENGTH) {
      tiles.push({ letter: '', status: 'empty' });
    }
    
    return tiles;
  }, []);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing' || isRevealing) return;
    
    const normalizedKey = key.toLowerCase();
    
    // ===== ENTER KEY =====
    if (normalizedKey === 'enter') {
      if (currentGuess.length !== WORD_LENGTH) return;
      
      if (!isValidWord(currentGuess)) {
        setIsInvalidWord(true);
        showToast('Not in word list');  // ✅ Show toast here
        setTimeout(() => setIsInvalidWord(false), 600);
        return;
      }
      
      const evaluation = evaluateGuess(currentGuess, solution);
      
      setIsRevealing(true);
      
      const newGuesses = [...guesses];
      newGuesses[currentRow] = createTilesFromGuess(currentGuess, evaluation);
      
      const newKeyboardStatus = updateKeyboardStatus(keyboardStatus, currentGuess, evaluation);
      
      updateGameState({
        guesses: newGuesses,
        keyboardStatus: newKeyboardStatus
      });
      
      const revealTime = WORD_LENGTH * 350 + 350;
      
      setTimeout(() => {
        setIsRevealing(false);
        
        if (currentGuess === solution) {
          // ✅ Show win toast here
          showToast(WIN_MESSAGES[currentRow] || 'Nice!');
          updateGameState({ gameStatus: 'won' });
          setStats(prevStats => {
            const newStats = updateStats(prevStats, true, currentRow + 1);
            saveStats(newStats);
            return newStats;
          });
        } else if (currentRow === MAX_GUESSES - 1) {
          // ✅ Show solution on loss
          showToast(solution);
          updateGameState({ gameStatus: 'lost' });
          setStats(prevStats => {
            const newStats = updateStats(prevStats, false, currentRow + 1);
            saveStats(newStats);
            return newStats;
          });
        } else {
          updateGameState({
            currentRow: currentRow + 1,
            currentGuess: ''
          });
        }
      }, revealTime);
      
    // ===== BACKSPACE KEY =====
    } else if (normalizedKey === 'backspace' || normalizedKey === 'delete') {
      if (currentGuess.length > 0) {
        const newGuess = currentGuess.slice(0, -1);
        const newGuesses = [...guesses];
        newGuesses[currentRow] = createCurrentRowTiles(newGuess);
        
        updateGameState({
          currentGuess: newGuess,
          guesses: newGuesses
        });
      }
      
    // ===== LETTER KEY =====
    } else if (/^[a-z]$/.test(normalizedKey)) {
      if (currentGuess.length < WORD_LENGTH) {
        const newGuess = currentGuess + normalizedKey.toUpperCase();
        const newGuesses = [...guesses];
        newGuesses[currentRow] = createCurrentRowTiles(newGuess);
        
        updateGameState({
          currentGuess: newGuess,
          guesses: newGuesses
        });
      }
    }
  }, [
    gameStatus, 
    isRevealing, 
    currentGuess, 
    currentRow, 
    solution, 
    guesses, 
    keyboardStatus,
    updateGameState,
    createCurrentRowTiles,
    showToast
  ]);

  // Reset game
  const resetGame = useCallback(() => {
    initializeNewGame();
  }, [initializeNewGame]);

  return {
    solution,
    guesses,
    currentGuess,
    currentRow,
    gameStatus,
    keyboardStatus,
    stats,
    isInvalidWord,
    isRevealing,
    toastMessage,
    clearToast,
    handleKeyPress,
    resetGame
  };
}