import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useGameStore } from './store/gameStore'
import { playClickSound, initAudio } from './utils/soundUtils'

// Global click handler wrapper component
function AppWithGlobalHandlers() {
  // Track if the game has started to avoid handling clicks during the intro modal
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    // Check if game has started (look for non-zero points to determine if user has interacted)
    const checkGameStatus = () => {
      const gameState = useGameStore.getState();
      // If points are greater than 0, the game has started
      if (!gameStarted && gameState.points > 0) {
        setGameStarted(true);
      }
    };
    
    // Check status initially and set up periodic checks
    checkGameStatus();
    const intervalId = setInterval(checkGameStatus, 1000);
    
    return () => clearInterval(intervalId);
  }, [gameStarted]);

  useEffect(() => {
    const handleGlobalClick = () => {
      // Only trigger if game has started or the game is in a fresh state
      const gameState = useGameStore.getState();
      // Also check if player has accepted employment
      if ((gameStarted || gameState.points >= 0) && gameState.playerAccepted) {
        playClickSound();
        gameState.click();
      }
    };

    const handleGlobalKeyPress = () => {
      // Only trigger if game has started or the game is in a fresh state
      const gameState = useGameStore.getState();
      // Also check if player has accepted employment
      if ((gameStarted || gameState.points >= 0) && gameState.playerAccepted) {
        playClickSound();
        gameState.click();
      }
    };

    // Add global event listeners
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKeyPress);

    // Clean up on unmount
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [gameStarted]);

  // Initialize audio when component mounts
  useEffect(() => {
    initAudio();
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithGlobalHandlers />
  </StrictMode>,
)
