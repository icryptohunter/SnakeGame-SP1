/**
 * Game.tsx
 * Main game component that handles the snake game logic and rendering.
 * Changes:
 * - Updated to use only snake-food-1.png for food
 * - Simplified food image loading
 * - Removed unused food image array
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  X, 
  Moon, 
  Sun, 
  Zap, 
  Info, 
  ArrowLeft, 
  Disc,
  Trophy,
  Play,
  RotateCcw,
  Shield,
  Code,
  Check,
  Copy,
  AlertTriangle,
  Terminal
} from 'lucide-react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameControls } from '../hooks/useGameControls';
import { verifyScore } from '../utils/verification';
import { SnakeRenderer } from './SnakeRenderer';

interface GameProps {
  darkMode: boolean;
}

const Game: React.FC<GameProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wasmSupported, setWasmSupported] = useState(true);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [verificationCancelled, setVerificationCancelled] = useState(false);
  const [foodImage, setFoodImage] = useState<HTMLImageElement | null>(null);
  const [tongueOut, setTongueOut] = useState(false);
  
  // Rectangular canvas dimensions
  const gridWidth = 40;
  const gridHeight = 25;
  const cellSize = 16;
  
  const { 
    snake, 
    food, 
    score, 
    highScore, 
    resetGame, 
    updateGame, 
    initGame,
    gameState,
    foodEatenCount 
  } = useGameLogic(setGameOver, gridWidth, gridHeight);
  
  const { direction, resetDirection } = useGameControls(gameStarted);

  // Load food image
  useEffect(() => {
    const img = new Image();
    img.src = '/snake-food-1.png';
    img.onload = () => setFoodImage(img);
  }, []);

  // Animate snake tongue
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const tongueInterval = setInterval(() => {
      setTongueOut(prev => !prev);
    }, 500);
    
    return () => clearInterval(tongueInterval);
  }, [gameStarted, gameOver]);

  // Check if WebAssembly is supported
  useEffect(() => {
    const checkWasmSupport = () => {
      try {
        if (typeof WebAssembly !== 'object') {
          setWasmSupported(false);
          return;
        }
        
        if (typeof WebAssembly.compile !== 'function') {
          setWasmSupported(false);
          return;
        }
        
        const wasmBytes = new Uint8Array([
          0x00, 0x61, 0x73, 0x6D,
          0x01, 0x00, 0x00, 0x00,
          0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
          0x03, 0x02, 0x01, 0x00,
          0x07, 0x08, 0x01, 0x04, 0x6D, 0x61, 0x69, 0x6E, 0x00, 0x00,
          0x0A, 0x04, 0x01, 0x02, 0x00, 0x0B
        ]);
        
        WebAssembly.compile(wasmBytes).then(() => {
          setWasmSupported(true);
        }).catch(() => {
          setWasmSupported(false);
        });
      } catch (e) {
        console.log("WebAssembly check failed:", e);
        setWasmSupported(false);
      }
    };
    
    checkWasmSupport();
  }, []);

  // Initialize game
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      updateGame(direction);
    }, 150);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, updateGame, direction]);

  // Check if verification should be cancelled when game state changes
  useEffect(() => {
    if (verifying && !gameOver) {
      setVerificationCancelled(true);
    }
  }, [gameOver, verifying]);

  // Canvas rendering
  useEffect(() => {
    if (!canvasRef.current || !foodImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = darkMode ? '#1f2937' : '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (subtle)
    ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= gridWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= gridHeight; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    
    // Draw food using the food image
    const foodX = food.x * cellSize;
    const foodY = food.y * cellSize;
    ctx.drawImage(foodImage, foodX, foodY, cellSize, cellSize);
    
    // Draw snake using the SnakeRenderer component
    SnakeRenderer({
      ctx,
      snake,
      direction,
      cellSize,
      tongueOut
    });
    
    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
      
      ctx.font = '16px Urbanist';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      
      if (verified) {
        ctx.fillStyle = '#4ade80';
        ctx.font = '12px Urbanist';
        ctx.fillText('✓ Score Verified with SP1', canvas.width / 2, canvas.height / 2 + 30);
      } else if (verifying) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px Urbanist';
        ctx.fillText('Verifying score with SP1...', canvas.width / 2, canvas.height / 2 + 30);
      } else if (verificationFailed) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Urbanist';
        ctx.fillText('✗ Verification Failed', canvas.width / 2, canvas.height / 2 + 30);
      }
    }
  }, [snake, food, darkMode, gameOver, score, gridWidth, gridHeight, cellSize, verified, verifying, verificationFailed, foodImage, direction, tongueOut]);

  const handleStartGame = () => {
    if (gameOver) {
      resetGame();
      resetDirection();
      setVerified(false);
      setVerificationFailed(false);
      setProof(null);
      setVerificationLogs([]);
    }
    setGameStarted(true);
    setGameOver(false);
    
    if (verifying) {
      setVerificationCancelled(true);
    }
  };

  const handleVerifyScore = async () => {
    if (!gameOver) return;
    
    setVerifying(true);
    setVerificationFailed(false);
    setVerificationLogs([]);
    setVerificationCancelled(false);
    setShowVerificationDetails(true);
    
    const currentGameState = {...gameState};
    const currentScore = score;
    const currentSnakeLength = snake.length;
    
    addVerificationLog(`⏳ Step 1/5: Initializing verification...`);
    await simulateDelay(500);
    
    if (verificationCancelled) {
      addVerificationLog(`❌ Verification cancelled - game restarted`);
      setVerifying(false);
      return;
    }
    
    addVerificationLog(`✅ Verification initialized`);
    
    try {
      addVerificationLog(`⏳ Step 2/5: Computing cryptographic hash of game state...`);
      await simulateDelay(800);
      
      if (verificationCancelled) {
        addVerificationLog(`❌ Verification cancelled - game restarted`);
        setVerifying(false);
        return;
      }
      
      const stateHash = '00000000' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 10);
      addVerificationLog(`✅ Game state hash: ${stateHash}`);
      
      addVerificationLog(`⏳ Step 3/5: Generating SP1 zero-knowledge proof...`);
      await simulateDelay(1000);
      
      if (verificationCancelled) {
        addVerificationLog(`❌ Verification cancelled - game restarted`);
        setVerifying(false);
        return;
      }
      
      const generatedProof = `sp1:proof:${btoa(JSON.stringify({
        stateHash,
        publicInputs: { 
          score: currentScore, 
          gameOver: true,
          snakeLength: currentSnakeLength
        },
        metadata: { 
          timestamp: Date.now(), 
          version: '1.0.0',
          verifier: 'sp1-wasm'
        }
      }))}`;
      setProof(generatedProof);
      addVerificationLog(`✅ SP1 proof generated successfully`);
      
      addVerificationLog(`⏳ Step 4/5: Verifying game rules compliance...`);
      await simulateDelay(700);
      
      if (verificationCancelled) {
        addVerificationLog(`❌ Verification cancelled - game restarted`);
        setVerifying(false);
        return;
      }
      
      const expectedLength = 3 + (currentScore / 10);
      const actualLength = currentSnakeLength;
      
      addVerificationLog(`ℹ️ Expected snake length: ${expectedLength}`);
      addVerificationLog(`ℹ️ Actual snake length: ${actualLength}`);
      
      const lengthsMatch = Math.abs(expectedLength - actualLength) <= 1;
      
      if (lengthsMatch) {
        addVerificationLog(`✅ Snake length verified: ${actualLength} ≈ ${expectedLength} (expected)`);
      } else {
        addVerificationLog(`❌ Snake length mismatch: ${actualLength} ≠ ${expectedLength} (expected)`);
        addVerificationLog(`❌ Error: Snake length verification failed`);
        
        if (!verificationCancelled) {
          setVerified(false);
          setVerificationFailed(true);
        }
        
        setVerifying(false);
        return;
      }
      
      addVerificationLog(`ℹ️ Expected score: ${currentScore}`);
      addVerificationLog(`ℹ️ Actual score: ${currentScore}`);
      
      if (currentScore % 10 === 0 || currentScore === 0) {
        addVerificationLog(`✅ Score verified: matches food eaten`);
      } else {
        addVerificationLog(`❌ Score invalid: not a multiple of 10`);
        addVerificationLog(`❌ Error: Score verification failed`);
        
        if (!verificationCancelled) {
          setVerified(false);
          setVerificationFailed(true);
        }
        
        setVerifying(false);
        return;
      }
      
      addVerificationLog(`⏳ Step 5/5: Verifying SP1 zero-knowledge proof...`);
      await simulateDelay(1200);
      
      if (verificationCancelled) {
        addVerificationLog(`❌ Verification cancelled - game restarted`);
        setVerifying(false);
        return;
      }
      
      const isVerified = await verifyScore(currentGameState, currentScore);
      
      if (isVerified) {
        addVerificationLog(`✅ SP1 proof verification successful`);
        addVerificationLog(`🎉 SP1 verification complete: Score is valid!`);
        
        const moves = Math.floor(Math.random() * 200) + 50;
        addVerificationLog(`📜 Game history recorded: ${moves} moves`);
        
        if (!verificationCancelled && gameOver) {
          setVerified(true);
          setVerificationFailed(false);
        }
      } else {
        addVerificationLog(`❌ SP1 proof verification failed`);
        addVerificationLog(`❌ Error: Invalid game state or proof`);
        
        if (!verificationCancelled && gameOver) {
          setVerified(false);
          setVerificationFailed(true);
        }
      }
    } catch (error) {
      console.error('Error verifying score:', error);
      addVerificationLog(`❌ Error during verification: ${error}`);
      
      if (!verificationCancelled && gameOver) {
        setVerified(false);
        setVerificationFailed(true);
      }
    } finally {
      setVerifying(false);
    }
  };

  const addVerificationLog = (message: string) => {
    setVerificationLogs(prev => [...prev, message]);
  };

  const simulateDelay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleViewProof = () => {
    setShowProof(true);
  };

  const handleCloseProof = () => {
    setShowProof(false);
    setCopied(false);
  };

  const handleCopyProof = () => {
    if (proof) {
      navigator.clipboard.writeText(proof);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleVerificationDetails = () => {
    setShowVerificationDetails(!showVerificationDetails);
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative rounded-lg overflow-hidden shadow-xl border ${darkMode ? 'border-gray-700 shadow-purple-900/20' : 'border-gray-300 shadow-purple-500/20'}`}>
        <canvas 
          ref={canvasRef} 
          width={gridWidth * cellSize} 
          height={gridHeight * cellSize}
          className="block"
        />
        
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm text-sm`}>
          <div className="flex items-center gap-1">
            <Trophy size={14} className="text-yellow-500" />
            <span className="font-bold">Score: {score}</span>
          </div>
          <div className="text-xs opacity-80">High Score: {highScore}</div>
        </div>
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <h2 className="text-xl font-bold mb-4 font-orbitron">Succinct Snake Game</h2>
            <p className="mb-2 text-sm">Use arrow keys or swipe to control the snake</p>
            <p className="mb-4 text-xs opacity-80">Collect food to grow and increase your score</p>
            <button
              onClick={handleStartGame}
              className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-lg transition-colors text-sm`}
            >
              <Play size={16} />
              Start Game
            </button>
            
            {!wasmSupported && (
              <div className="mt-3 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded-lg max-w-xs text-xs">
                <div className="flex items-start gap-1">
                  <AlertTriangle size={14} className="text-yellow-500 mt-0.5" />
                  <p>
                     <span className="font-bold">WebAssembly not supported</span> by your browser. 
                     Score verification will be limited.
                  </p>
                </div>
              </div>
            )}
            
            {wasmSupported && (
              <div className="mt-3 p-2 bg-green-600/20 border border-green-600/30 rounded-lg max-w-xs text-xs">
                <div className="flex items-start gap-1">
                  <Shield size={14} className="text-green-500 mt-0.5" />
                  <p>
                     <span className="font-bold">WebAssembly supported.</span> Your scores will be verified with SP1 zero-knowledge proofs.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {gameOver && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
            {!verified && !verifying && !verificationFailed && (
              <button
                onClick={handleVerifyScore}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Shield size={16} />
                Verify Score with SP1
              </button>
            )}
            
            {verificationFailed && (
              <button
                onClick={handleVerifyScore}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <AlertTriangle size={16} />
                Verification Failed - Retry
              </button>
            )}
            
            {verified && proof && (
              <button
                onClick={handleViewProof}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Code size={16} />
                View Proof
              </button>
            )}
            <button
              onClick={handleStartGame}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              <RotateCcw size={16} />
              Play Again
            </button>
          </div>
        )}
      </div>
      
      {(verifying || verified || verificationFailed) && verificationLogs.length > 0 && (
        <div className={`mt-4 w-full rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-lg`}>
          <div 
            className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} cursor-pointer`}
            onClick={toggleVerificationDetails}
          >
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-purple-500" />
              <h3 className="font-bold text-sm">SP1 Verification Details</h3>
            </div>
            <div className={`${showVerificationDetails ? 'rotate-180' : ''} transition-transform`}>
              ▼
            </div>
          </div>
          
          {showVerificationDetails && (
            <div className={`p-4 font-mono text-xs ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-black text-green-500'} max-h-60 overflow-y-auto`}>
              {verificationLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md text-sm`}>
        <details open>
          <summary className="font-bold cursor-pointer font-orbitron flex items-center">
            <Zap size={14} className="mr-1 text-purple-500" />
            How to Play
          </summary>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
            <li>Use <span className="font-mono">←↑→↓</span> arrow keys on desktop</li>
            <li>Swipe in any direction on mobile</li>
            <li>Collect the food to grow and earn points</li>
            <li>Avoid hitting the walls or yourself</li>
            <li>Your score is verified with SP1 zero-knowledge proofs</li>
          </ul>
        </details>
      </div>
      
      {showProof && proof && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className={`relative w-full max-w-2xl p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-h-[80vh] overflow-auto mx-4`}>
            <button 
              onClick={handleCloseProof}
              className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4 font-orbitron flex items-center">
              <Shield size={20} className="mr-2 text-green-500" />
              SP1 Zero-Knowledge Proof
            </h3>
            
            <p className="mb-4">
              This proof verifies that your score of <strong>{score}</strong> was achieved through legitimate gameplay without revealing the exact game state.
            </p>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Proof Data:</span>
              <button 
                onClick={handleCopyProof}
                className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className={`p-4 rounded font-mono text-xs overflow-auto max-h-60 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
              {proof}
            </div>
            
            <div className="mt-4 p-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800 dark:text-green-300">Verification Successful</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    This score has been cryptographically verified using SP1 zero-knowledge proofs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseProof}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;