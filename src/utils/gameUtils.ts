import { VALID_GUESSES, SOLUTIONS } from "../data/words";
import type { LetterStatus, Tile, KeyboardStatus} from "../types";
import { WORD_LENGTH } from "./constants";

// get a randome word from the solution array
export function getRandomWord (): string {
    const randomIndex = Math.floor(Math.random() * SOLUTIONS.length);
    return SOLUTIONS[randomIndex].toUpperCase();
}

// get Daily word based on date
export function getDailyWord(): string {
    const startDate = new Date('2025-01-01').getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const dayIndex = Math.floor((today - startDate) /(1000 * 60 * 60 * 24));

    const index = Math.abs(dayIndex) % SOLUTIONS.length;
    return SOLUTIONS[index].toUpperCase();
}

// check if a word is a valid guess
export function isValidWord(word: string): boolean {
    return VALID_GUESSES.includes(word.toLowerCase()) || SOLUTIONS.includes(word.toLowerCase());
}

// evaluate a guess against the solution and return an array of letter statuses
export function evaluateGuess(guess: string, solution: string): LetterStatus[]{
    const result: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
    const solutionArray = solution.split('');
    const guessArray = guess.split('');

    // track which solution letters have been matched
    const matchedIndices = new Set<number>();

    // first pass: find correct position (green)
    guessArray.forEach((letter, index ) => {
        if (letter === solutionArray[index]) {
            result[index] = 'correct';
            matchedIndices.add(index);
        }
    });

    // second pass: find present letters (yellow)
    guessArray.forEach((letter, guessIndex) => {
        if (result[guessIndex] === 'correct') return;

        // find unmatched occurrence in solution
        const solutionIndex = solutionArray.findIndex((solutionLetter, sIdx) => {
            return solutionLetter === letter && !matchedIndices.has(sIdx);
        });

        if (solutionIndex !== -1) {
            result[guessIndex] = 'present';
            matchedIndices.add(solutionIndex);
        }
    });

    return result;
}

// convert guess and statuses to tile array 
export function createTilesFromGuess (guess: string, statuses: LetterStatus[]): Tile[] {
    return guess.split('').map((letter, index) => ({
        letter,
        status: statuses[index]
    }));
}

// create empty tiles for a row
export function createEmptyTiles(length: number = WORD_LENGTH): Tile[]{
    return Array(length).fill(null).map(() => ({
        letter: '',
        status: "empty" as LetterStatus
    }));
}

// update keyboard status based on guessed letters

export function updateKeyboardStatus (
    currentStatus: KeyboardStatus,
    guess: string,
    evaluation: LetterStatus[]
): KeyboardStatus {
    const newStatus = {...currentStatus};

    guess.split('').forEach((letter, index) => {
        const lowerLetter = letter.toLowerCase();
        const newLetterStatus = evaluation[index];
        const existingStatus = newStatus[lowerLetter];

        // priority: correct > present > absent
        if (newLetterStatus === 'correct') {
            newStatus[lowerLetter] = 'correct';
        } else if (newLetterStatus === 'present' && existingStatus !== 'correct') {
            newStatus[lowerLetter] = 'present';
        } else if (!existingStatus) {
            newStatus[lowerLetter] = newLetterStatus;
        }
    });

    return newStatus;
}