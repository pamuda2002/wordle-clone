// Letter status after evaluation
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

// Single letter tile
export interface Tile {
    letter: string;
    status: LetterStatus;
}

// Game status
export type GameStatus = 'playing' | 'won' | 'lost';

// keyboard letter status map
export type KeyboardStatus = {
    [key: string]: LetterStatus;
};

// Game statistics
export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
}

export interface GameState {
    solution: string;
    guesses: string[];
    currentGuess: string;
    gameStatus: GameStatus;
    currentRow: number;
}
