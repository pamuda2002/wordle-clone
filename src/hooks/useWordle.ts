import { useState, useCallback, useEffect } from 'react';
import type { GameStatus, KeyboardStatus, Tile, GameStats } from '../types';
import { getRandomWord, isValidWord, evaluateGuess, createTilesFromGuess,createEmptyTiles,updateKeyboardStatus } from '../utils/gameUtils';
import { loadStats, saveStats, updateStats,loadGameState,saveGameState,clearGameState } from '../utils/storage';
import { WORD_LENGTH, MAX_GUESSES } from '../utils/constants';

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
  
  // If there's a saved game that's still in progress, restore it
  if (savedState && savedState.gameStatus === 'playing') {
    // Rebuild guesses and keyboard from saved guesses
    const restoredGuesses: Tile[][] = [];
    let restoredKeyboard: KeyboardStatus = {};
    
    savedState.guesses.forEach((guess) => {
      const evaluation = evaluateGuess(guess, savedState.solution);
      restoredGuesses.push(createTilesFromGuess(guess, evaluation));
      restoredKeyboard = updateKeyboardStatus(restoredKeyboard, guess, evaluation);
    });
    
    // Fill remaining rows with empty tiles
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
  
  // Start a new game
  const newWord = getRandomWord();
  console.log('Solution:', newWord); // For debugging
  
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
  // ✅ Use lazy initialization - function runs only once
  const [gameState, setGameState] = useState<InitialGameState>(getInitialGameState);
  
  // Destructure for easier access
  const { solution, guesses, currentGuess, currentRow, gameStatus, keyboardStatus } = gameState;
  
  // UI states
  const [isInvalidWord, setIsInvalidWord] = useState<boolean>(false);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  
  // Stats - also use lazy initialization
  const [stats, setStats] = useState<GameStats>(loadStats);

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

  // Helper to update specific game state fields
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
        setTimeout(() => setIsInvalidWord(false), 600);
        return;
      }
      
      const evaluation = evaluateGuess(currentGuess, solution);
      
      setIsRevealing(true);
      
      // Update guesses with evaluation
      const newGuesses = [...guesses];
      newGuesses[currentRow] = createTilesFromGuess(currentGuess, evaluation);
      
      // Update keyboard
      const newKeyboardStatus = updateKeyboardStatus(keyboardStatus, currentGuess, evaluation);
      
      updateGameState({
        guesses: newGuesses,
        keyboardStatus: newKeyboardStatus
      });
      
      // Handle game end after animation
      const revealTime = WORD_LENGTH * 350 + 350;
      
      setTimeout(() => {
        setIsRevealing(false);
        
        if (currentGuess === solution) {
          updateGameState({ gameStatus: 'won' });
          setStats(prevStats => {
            const newStats = updateStats(prevStats, true, currentRow + 1);
            saveStats(newStats);
            return newStats;
          });
        } else if (currentRow === MAX_GUESSES - 1) {
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
    createCurrentRowTiles
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
    handleKeyPress,
    resetGame
  };
}