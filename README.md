# Wordle Clone

A polished, fully-functional Wordle clone built with **React**, **TypeScript**, and **Vite**. This project replicates the core mechanics and aesthetic of the popular word-guessing game, featuring smooth animations, responsive design, and game state persistence.

![Wordle Clone Preview](public/favicon.svg) <!-- Replace with an actual screenshot if available -->

## 🚀 Features

-   **Core Gameplay:** 6 attempts to guess a hidden 5-letter word.
-   **Interactive Keyboard:** Support for both on-screen and physical keyboard input.
-   **Color-coded Feedback:** Tiles change color to indicate correct, present, or absent letters.
-   **Smooth Animations:** Transitions for letter entry, row shaking (on invalid words), and tile flipping.
-   **Statistics Tracking:** Track your win percentage, current streak, and guess distribution.
-   **Responsive Design:** Optimized for both desktop and mobile devices.
-   **Modals & Toasts:** "How to Play" instructions, detailed statistics, and real-time game notifications.
-   **Persistence:** Saves your game progress and statistics locally.

## 🛠️ Tech Stack

-   **Framework:** [React 19](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** Vanilla CSS (Modular & Scalable)
-   **Linting:** [ESLint](https://eslint.org/)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/wordle-clone.git
    cd wordle-clone
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 🎮 How to Play

-   Guess the **WORDLE** in 6 tries.
-   Each guess must be a valid 5-letter word. Hit the enter button to submit.
-   After each guess, the color of the tiles will change to show how close your guess was to the word.

### Examples:

-   **Green:** The letter is in the word and in the correct spot.
-   **Yellow:** The letter is in the word but in the wrong spot.
-   **Gray:** The letter is not in the word in any spot.

## 📂 Project Structure

```text
src/
├── components/   # UI components (Board, Keyboard, Modals, etc.)
├── hooks/        # Custom React hooks (useWordle)
├── data/         # Word lists and game data
├── styles/       # Component-specific and global CSS
├── types/        # TypeScript definitions
├── utils/        # Helper functions and constants
└── App.tsx       # Main application entry point
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
Built with ❤️ by ArryZ

