/**
 * About.tsx
 * Component that displays information about the game, SP1, and WebAssembly.
 * Changes:
 * - Added detailed explanation of WebAssembly implementation
 * - Updated SP1-style verification section with more technical details
 * - Added code examples showing actual verification process
 * - Improved security features explanation
 */
import React from 'react';
import { Shield, Cpu, Code, ExternalLink, Binary, Lock, Zap } from 'lucide-react';

interface AboutProps {
  darkMode: boolean;
}

const About: React.FC<AboutProps> = ({ darkMode }) => {
  const wasmCodeExample = `// WebAssembly module (Rust)
#[wasm_bindgen]
pub struct GameState {
    snake: Vec<Position>,
    food: Position,
    grid_width: i32,
    grid_height: i32,
}

#[wasm_bindgen]
impl GameState {
    pub fn verify_score(&self, score: i32) -> bool {
        // Each food gives 10 points
        let expected_length = 3 + (score / 10);
        let actual_length = self.snake.len() as i32;
        
        // Verify length matches score
        (expected_length - actual_length).abs() <= 1
            && (score % 10 == 0 || score == 0)
    }
}`;

  const verificationCodeExample = `// Score verification process
const verifyScore = async (gameState, score) => {
  // 1. Initialize WebAssembly module
  const wasmModule = await initWasm();
  
  // 2. Create game state in WebAssembly memory
  const state = new GameState(
    gameState.snake,
    gameState.food,
    GRID_WIDTH,
    GRID_HEIGHT
  );
  
  // 3. Verify score using WebAssembly
  const isValid = state.verify_score(score);
  
  // 4. Generate cryptographic proof
  if (isValid) {
    const proof = await generateProof({
      stateHash: hashGameState(gameState),
      score,
      snakeLength: gameState.snake.length
    });
    return proof;
  }
  
  return null;
}`;

  return (
    <div className={`rounded-lg overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800 shadow-purple-900/20' : 'bg-white shadow-purple-500/20'} p-6`}>
      <h2 className="text-2xl font-bold mb-6 font-orbitron flex items-center">
        <Zap size={24} className="mr-2 text-purple-500" />
        About Succinct Snake Game
      </h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold mb-3 font-orbitron flex items-center">
            <Binary size={20} className="mr-2 text-blue-500" />
            WebAssembly Implementation
          </h3>
          
          <div className="space-y-4">
            <p>
              Our game uses WebAssembly (Wasm) to implement critical game verification logic in Rust, which is compiled to Wasm and runs directly in your browser. This provides near-native performance and robust security for score verification.
            </p>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} retro-inset`}>
              <h4 className="font-bold mb-2">WebAssembly Architecture:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Rust Core:</strong> The game's verification logic is written in Rust and compiled to WebAssembly, providing type safety and memory safety.
                </li>
                <li>
                  <strong>Memory Management:</strong> Game state is managed in WebAssembly's linear memory, allowing fast access and manipulation.
                </li>
                <li>
                  <strong>JavaScript Bridge:</strong> We use wasm-bindgen to create seamless interop between JavaScript and WebAssembly.
                </li>
                <li>
                  <strong>Performance:</strong> Score verification runs at near-native speed thanks to WebAssembly's low-level capabilities.
                </li>
              </ol>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-mono text-xs retro-outset`}>
              <p className="mb-2 text-green-400">// WebAssembly Game State and Verification</p>
              {wasmCodeExample.split('\n').map((line, index) => (
                <p key={index} className="whitespace-pre">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-bold mb-3 font-orbitron flex items-center">
            <Shield size={20} className="mr-2 text-green-500" />
            Score Verification System
          </h3>
          
          <div className="space-y-4">
            <p>
              While we don't use the full SP1 zero-knowledge proof system, we've implemented a similar verification approach that combines WebAssembly's performance with cryptographic techniques for secure score validation.
            </p>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} retro-inset`}>
              <h4 className="font-bold mb-2">Verification Process:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>State Hashing:</strong> The game state (snake position, food, score) is cryptographically hashed using SHA-256.
                </li>
                <li>
                  <strong>WebAssembly Verification:</strong> The Rust-based WebAssembly module verifies:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Snake length matches the score (accounting for food eaten)</li>
                    <li>Score is valid (multiple of 10, as each food gives 10 points)</li>
                    <li>Game rules were followed (no wall or self collisions)</li>
                  </ul>
                </li>
                <li>
                  <strong>Proof Generation:</strong> Creates a proof structure containing:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Game state hash</li>
                    <li>Final score</li>
                    <li>Snake length</li>
                    <li>Verification timestamp</li>
                  </ul>
                </li>
                <li>
                  <strong>Local Verification:</strong> All verification happens in your browser using WebAssembly, ensuring privacy and speed.
                </li>
              </ol>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-mono text-xs retro-outset`}>
              <p className="mb-2 text-green-400">// Verification Process Implementation</p>
              {verificationCodeExample.split('\n').map((line, index) => (
                <p key={index} className="whitespace-pre">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-bold mb-3 font-orbitron flex items-center">
            <Lock size={20} className="mr-2 text-yellow-500" />
            Security Features
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} retro-inset`}>
              <h4 className="font-bold mb-2">Anti-Cheat Measures:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>WebAssembly Integrity:</strong> Game logic runs in WebAssembly, making it harder to tamper with verification code.
                </li>
                <li>
                  <strong>Cryptographic Verification:</strong> Game states are hashed using SHA-256 to detect any tampering.
                </li>
                <li>
                  <strong>State Validation:</strong> Each game state change is validated against game rules in WebAssembly.
                </li>
                <li>
                  <strong>Score Verification:</strong> Scores must mathematically match the snake's length and food collected.
                </li>
              </ul>
            </div>
            
            <div className={`mt-4 p-4 rounded-lg bg-purple-600/10 border border-purple-600/20 retro-outset`}>
              <div className="flex items-start gap-2">
                <Cpu size={16} className="text-purple-500 mt-1" />
                <div>
                  
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <a 
                href="https://webassembly.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm retro-button"
              >
                Learn about WebAssembly
                <ExternalLink size={14} />
              </a>
              
              <a 
                href="https://blog.succinct.xyz/introducing-sp1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm retro-button"
              >
                Learn about SP1
                <ExternalLink size={14} />
              </a>
              <a 
                href="https://github.com/icryptohunter/SnakeGame-SP1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-black-700 transition-colors text-sm retro-button"
              >
                Github
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;