/**
 * useGameLogic.ts
 * Custom hook that handles the core game logic for the Snake game.
 * Changes:
 * - Removed WebAssembly game state management
 * - Added initialization of WebAssembly verifier
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState } from '../types';
import { initVerification } from '../utils/verification';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface GameMove {
  direction: Direction;
  timestamp: number;
  foodEaten: boolean;
}

export const useGameLogic = (
  setGameOver: (value: boolean) => void, 
  customGridWidth?: number,
  customGridHeight?: number
) => {
  const gridWidth = customGridWidth || 30;
  const gridHeight = customGridHeight || gridWidth;
  const cellSize = 20;
  
  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStateHistory, setGameStateHistory] = useState<GameMove[]>([]);
  const [foodEatenCount, setFoodEatenCount] = useState(0);
  
  const gameStateRef = useRef<GameState>({
    snake: [],
    food: { x: 0, y: 0 },
    score: 0,
    direction: 'RIGHT',
    gameOver: false
  });
  
  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [
      { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) },
      { x: Math.floor(gridWidth / 2) - 1, y: Math.floor(gridHeight / 2) },
      { x: Math.floor(gridWidth / 2) - 2, y: Math.floor(gridHeight / 2) },
    ];
    
    setSnake(initialSnake);
    setGameStateHistory([]);
    setFoodEatenCount(0);
    generateFood(initialSnake);
    setScore(0);
    
    gameStateRef.current = {
      snake: initialSnake,
      food: { x: 0, y: 0 },
      score: 0,
      direction: 'RIGHT',
      gameOver: false
    };
    
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [gridWidth, gridHeight]);
  
  // Generate food
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let foodOnSnake = true;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (foodOnSnake && attempts < maxAttempts) {
      attempts++;
      newFood = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };
      
      foodOnSnake = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
      
      if (!foodOnSnake) {
        setFood(newFood);
        gameStateRef.current.food = newFood;
        return;
      }
    }
    
    if (attempts >= maxAttempts) {
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const isOccupied = currentSnake.some(segment => segment.x === x && segment.y === y);
          if (!isOccupied) {
            const forcedFood = { x, y };
            setFood(forcedFood);
            gameStateRef.current.food = forcedFood;
            return;
          }
        }
      }
    }
  }, [gridWidth, gridHeight]);
  
  // Check collision
  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (
      head.x < 0 || 
      head.x >= gridWidth || 
      head.y < 0 || 
      head.y >= gridHeight
    ) {
      return true;
    }
    
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    
    return false;
  }, [gridWidth, gridHeight]);
  
  // Update game state
  const updateGame = useCallback((direction: Direction) => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }
      
      if (checkCollision(head, newSnake)) {
        setGameOver(true);
        gameStateRef.current.gameOver = true;
        
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        
        return prevSnake;
      }
      
      newSnake.unshift(head);
      
      const foodEaten = head.x === food.x && head.y === food.y;
      
      setGameStateHistory(prev => [
        ...prev, 
        { 
          direction, 
          timestamp: Date.now(),
          foodEaten
        }
      ]);
      
      if (foodEaten) {
        setFoodEatenCount(prev => prev + 1);
        
        setScore(prevScore => {
          const newScore = prevScore + 10;
          gameStateRef.current.score = newScore;
          
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          
          return newScore;
        });
        
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }
      
      gameStateRef.current.snake = newSnake;
      gameStateRef.current.direction = direction;
      
      return newSnake;
    });
  }, [food, generateFood, highScore, score, setGameOver, checkCollision]);
  
  const resetGame = useCallback(() => {
    initGame();
    setGameOver(false);
    setGameStateHistory([]);
    setFoodEatenCount(0);
    gameStateRef.current.gameOver = false;
  }, [initGame]);
  
  return {
    snake,
    food,
    score,
    highScore,
    gridWidth,
    gridHeight,
    cellSize,
    updateGame,
    resetGame,
    initGame,
    gameState: gameStateRef.current,
    gameStateHistory,
    foodEatenCount
  };
};