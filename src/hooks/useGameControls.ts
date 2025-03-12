/**
 * useGameControls.ts
 * Custom hook that handles keyboard and touch controls for the Snake game.
 * Changes:
 * - Implemented keyboard arrow key controls
 * - Added touch/swipe controls for mobile devices
 * - Prevents 180-degree turns (can't go directly opposite)
 * - Prevents arrow keys from scrolling the page
 * - Added reset direction function for game restart
 */
import { useState, useEffect } from 'react';
import { Direction } from './useGameLogic';

export const useGameControls = (gameStarted: boolean) => {
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [lastDirection, setLastDirection] = useState<Direction>('RIGHT');
  
  // Touch controls
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  // Reset direction to initial state
  const resetDirection = () => {
    setDirection('RIGHT');
    setLastDirection('RIGHT');
  };
  
  useEffect(() => {
    if (!gameStarted) return;
    
    // Handle keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (lastDirection !== 'DOWN') {
            setDirection('UP');
          }
          break;
        case 'ArrowDown':
          if (lastDirection !== 'UP') {
            setDirection('DOWN');
          }
          break;
        case 'ArrowLeft':
          if (lastDirection !== 'RIGHT') {
            setDirection('LEFT');
          }
          break;
        case 'ArrowRight':
          if (lastDirection !== 'LEFT') {
            setDirection('RIGHT');
          }
          break;
      }
    };
    
    // Handle touch start
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
      });
    };
    
    // Handle touch end (swipe)
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      
      const deltaX = endX - touchStart.x;
      const deltaY = endY - touchStart.y;
      
      // Determine swipe direction based on which delta is larger
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) {
          // Right swipe
          if (lastDirection !== 'LEFT') {
            setDirection('RIGHT');
          }
        } else if (deltaX < -50) {
          // Left swipe
          if (lastDirection !== 'RIGHT') {
            setDirection('LEFT');
          }
        }
      } else {
        // Vertical swipe
        if (deltaY > 50) {
          // Down swipe
          if (lastDirection !== 'UP') {
            setDirection('DOWN');
          }
        } else if (deltaY < -50) {
          // Up swipe
          if (lastDirection !== 'DOWN') {
            setDirection('UP');
          }
        }
      }
      
      setTouchStart(null);
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    // Update last direction after direction changes
    setLastDirection(direction);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction, lastDirection, touchStart, gameStarted]);
  
  return { direction, resetDirection };
};