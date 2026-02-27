import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Modal } from './components/Modal';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';
import { Toast } from './components/Toast';
import { useWordle } from './hooks/useWordle';
import './styles/global.css';
import './styles/App.css';

function App() {
  const {
    solution,
    guesses,
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
  } = useWordle();

  // Modal states
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Show stats modal on game end (with delay for animations)
  const handleGameEnd = useCallback(() => {
    setTimeout(() => setShowStats(true), 2500);
  }, []);

  // Track game status changes to show stats modal
  const [prevGameStatus, setPrevGameStatus] = useState(gameStatus);
  
  if (gameStatus !== prevGameStatus) {
    setPrevGameStatus(gameStatus);
    if (gameStatus === 'won' || gameStatus === 'lost') {
      handleGameEnd();
    }
  }

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showHelp || showStats || showSettings) return;
      
      const key = event.key;
      
      if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, showHelp, showStats, showSettings]);

  // Handle play again
  const handlePlayAgain = () => {
    setShowStats(false);
    resetGame();
  };

  return (
    <div className="app">
      <Header
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <main className="game-container">
        <Board
          guesses={guesses}
          currentRow={currentRow}
          isRevealing={isRevealing}
          isInvalidWord={isInvalidWord}
          hasWon={gameStatus === 'won'}
        />
        
        <Keyboard
          onKeyPress={handleKeyPress}
          keyboardStatus={keyboardStatus}
          disabled={gameStatus !== 'playing' || isRevealing}
        />
      </main>

      {/* Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="How To Play"
      >
        <HelpModal />
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Statistics"
      >
        <StatsModal
          stats={stats}
          gameStatus={gameStatus}
          solution={solution}
          onPlayAgain={handlePlayAgain}
        />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Settings coming soon!</p>
        </div>
      </Modal>

      {/* Toast notification - simplified */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={clearToast}
        />
      )}
    </div>
  );
}

export default App;