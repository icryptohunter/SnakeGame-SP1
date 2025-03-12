/**
 * SnakeRenderer.tsx
 * Component that handles the snake rendering logic.
 * Changes:
 * - Updated snake head to be square-shaped instead of triangular
 * - Enhanced eye positioning and size for better appearance
 * - Added subtle rounded corners to the head
 * - Improved scale patterns
 * - Added gradient shading for more depth
 */
import React from 'react';
import { Direction } from '../hooks/useGameLogic';
import { Position } from '../types';

interface SnakeRendererProps {
  ctx: CanvasRenderingContext2D;
  snake: Position[];
  direction: Direction;
  cellSize: number;
  tongueOut: boolean;
}

export const SnakeRenderer: React.FC<SnakeRendererProps> = ({
  ctx,
  snake,
  direction,
  cellSize,
  tongueOut
}) => {
  // Draw snake segments
  snake.forEach((segment, index) => {
    const isHead = index === 0;
    const segX = segment.x * cellSize;
    const segY = segment.y * cellSize;
    
    if (isHead) {
      drawSnakeHead(ctx, segX, segY, direction, cellSize, tongueOut);
    } else {
      drawSnakeBody(ctx, segX, segY, cellSize, index, snake.length);
    }
  });
};

const drawSnakeHead = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: Direction,
  cellSize: number,
  tongueOut: boolean
) => {
  ctx.save();
  
  // Rotate head based on direction
  ctx.translate(x + cellSize / 2, y + cellSize / 2);
  switch (direction) {
    case 'UP':
      ctx.rotate(-Math.PI / 2);
      break;
    case 'DOWN':
      ctx.rotate(Math.PI / 2);
      break;
    case 'LEFT':
      ctx.rotate(Math.PI);
      break;
    case 'RIGHT':
      // Default direction, no rotation needed
      break;
  }
  ctx.translate(-cellSize / 2, -cellSize / 2);
  
  // Create gradient for head
  const gradient = ctx.createLinearGradient(0, 0, cellSize, cellSize);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(0.5, '#7c3aed');
  gradient.addColorStop(1, '#6d28d9');
  ctx.fillStyle = gradient;
  
  // Draw square head with slightly rounded corners
  const radius = cellSize / 6;
  ctx.beginPath();
  ctx.moveTo(0 + radius, 0);
  ctx.lineTo(cellSize - radius, 0);
  ctx.quadraticCurveTo(cellSize, 0, cellSize, 0 + radius);
  ctx.lineTo(cellSize, cellSize - radius);
  ctx.quadraticCurveTo(cellSize, cellSize, cellSize - radius, cellSize);
  ctx.lineTo(0 + radius, cellSize);
  ctx.quadraticCurveTo(0, cellSize, 0, cellSize - radius);
  ctx.lineTo(0, 0 + radius);
  ctx.quadraticCurveTo(0, 0, 0 + radius, 0);
  ctx.closePath();
  ctx.fill();
  
  // Add shading to create depth
  const shading = ctx.createLinearGradient(0, 0, cellSize, cellSize);
  shading.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  shading.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  shading.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
  ctx.fillStyle = shading;
  ctx.fill();
  
  // Draw scales
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  const scaleSize = cellSize / 6;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.beginPath();
      ctx.arc(
        cellSize / 3 + (j * cellSize / 3),
        cellSize / 4 + (i * cellSize / 3),
        scaleSize,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
  
  // Draw eyes
  const eyeSize = cellSize / 4;
  const eyeOffset = cellSize / 4;
  
  // Left eye
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(eyeOffset, cellSize / 2, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Right eye
  ctx.beginPath();
  ctx.arc(cellSize - eyeOffset, cellSize / 2, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Left pupil
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(eyeOffset, cellSize / 2, eyeSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Right pupil
  ctx.beginPath();
  ctx.arc(cellSize - eyeOffset, cellSize / 2, eyeSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw tongue
  if (tongueOut) {
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cellSize, cellSize / 2);
    ctx.lineTo(cellSize + cellSize / 3, cellSize / 2 - cellSize / 6);
    ctx.moveTo(cellSize, cellSize / 2);
    ctx.lineTo(cellSize + cellSize / 3, cellSize / 2 + cellSize / 6);
    ctx.stroke();
  }
  
  ctx.restore();
};

const drawSnakeBody = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  index: number,
  totalLength: number
) => {
  const colorPos = index / totalLength;
  const gradient = ctx.createLinearGradient(
    x, 
    y, 
    x + cellSize, 
    y + cellSize
  );
  gradient.addColorStop(0, `rgba(139, 92, 246, ${1 - colorPos * 0.5})`);
  gradient.addColorStop(1, `rgba(124, 58, 237, ${1 - colorPos * 0.5})`);
  ctx.fillStyle = gradient;
  
  // Draw rounded rectangle for body segments
  const radius = 4;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + cellSize, y, x + cellSize, y + cellSize, radius);
  ctx.arcTo(x + cellSize, y + cellSize, x, y + cellSize, radius);
  ctx.arcTo(x, y + cellSize, x, y, radius);
  ctx.arcTo(x, y, x + cellSize, y, radius);
  ctx.closePath();
  ctx.fill();
  
  // Add scale pattern to body
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
  ctx.fill();
};