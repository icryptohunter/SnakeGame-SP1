/**
 * utils/verification.ts
 * Utility functions for score verification.
 * Changes:
 * - Removed WebAssembly dependency
 * - Simplified verification logic
 * - Added pure JavaScript implementation
 */
import { GameState } from '../types';

export const verifyScore = async (gameState: GameState, finalScore: number): Promise<boolean> => {
  try {
    return verifyScoreJS(gameState, finalScore);
  } catch (error) {
    console.error('Error during verification:', error);
    return false;
  }
};

const verifyScoreJS = (gameState: GameState, finalScore: number): boolean => {
  // Each food gives 10 points
  const expectedLength = 3 + (finalScore / 10);
  const actualLength = gameState.snake.length;
  
  // Allow some flexibility in length verification
  const lengthValid = Math.abs(expectedLength - actualLength) <= 1;
  
  // Score must be a multiple of 10 (each food gives 10 points)
  const scoreValid = finalScore % 10 === 0 || finalScore === 0;
  
  return lengthValid && scoreValid;
};