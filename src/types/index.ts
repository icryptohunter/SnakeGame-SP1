/**
 * types/index.ts
 * Contains TypeScript type definitions used throughout the application.
 * Changes:
 * - Created types directory and index file
 * - Added common type definitions
 */
export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  food: Position;
  score: number;
  direction: Direction;
  gameOver: boolean;
}

export interface VerifiedScore {
  id: string;
  playerName: string;
  score: number;
  timestamp: string;
  proof: string;
  verified: boolean;
}