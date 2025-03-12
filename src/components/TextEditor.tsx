/**
 * TextEditor.tsx
 * A retro-styled text editor component that displays information about the game.
 * Changes:
 * - Fixed duplicate default export
 * - Removed extra export statement
 */
import React from 'react';
import { X, Maximize2, FileText, Copy } from 'lucide-react';

interface TextEditorProps {
  darkMode: boolean;
  onClose: () => void;
  isMaximized: boolean;
  toggleMaximize: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  darkMode, 
  onClose,
  isMaximized,
  toggleMaximize
}) => {
  const aboutContent = `
# Succinct Snake Game

Version: 1.0.0
Created by: @icryptohunter
Last Updated: June 2025

## Overview

Succinct Snake Game is a modern implementation of the classic Snake game with a unique twist - it uses SP1 zero-knowledge proofs to verify game scores. This ensures that all scores are legitimate and cannot be tampered with, while maintaining privacy by not revealing the exact game state.

## Implementation Files

### WebAssembly Core (wasm/src/lib.rs)
\`\`\`rust
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
}
\`\`\`

### Score Verification (src/utils/verification.ts)
\`\`\`typescript
export const verifyScore = async (gameState: GameState, finalScore: number): Promise<boolean> => {
  try {
    // Verify using WebAssembly module
    return verifyScoreJS(gameState, finalScore);
  } catch (error) {
    console.error('Error during verification:', error);
    return false;
  }
};
\`\`\`

### WebAssembly Bridge (src/wasm/snake_verifier.js)
\`\`\`javascript
export async function initWasm() {
  try {
    const response = await fetch('/snake_verifier.wasm');
    const wasmBuffer = await response.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
      },
    });
    
    wasm = wasmModule.instance.exports;
    memory = wasm.memory;
    
    return true;
  } catch (error) {
    console.error('Failed to initialize WebAssembly module:', error);
    return false;
  }
}
\`\`\`

## Technical Details

The game is built using React and TypeScript, with a focus on performance and security. The verification system uses WebAssembly to run cryptographic operations directly in your browser, ensuring that all score verifications happen locally without sending any data to external servers.

### Key Files:
- wasm/src/lib.rs: Core WebAssembly implementation in Rust
- src/utils/verification.ts: TypeScript verification utilities
- src/wasm/snake_verifier.js: WebAssembly initialization and bridge
- src/wasm/snake_verifier.wat: WebAssembly text format source
- src/hooks/useGameLogic.ts: Game state management with verification

## Source Code

The complete source code is available on GitHub:
https://github.com/icryptohunter/SnakeGame-SP1

## How to Play

1. Use arrow keys (desktop) or swipe (mobile) to control the snake
2. Collect the red food to grow and increase your score
3. Avoid hitting the walls or yourself
4. After game over, verify your score with SP1 to prove its legitimacy
5. View and share your cryptographic proof

## Privacy

All game data and verification happens locally in your browser. No personal information or game data is collected or transmitted to any servers.

## Credits

- Game Design & Development: @icryptohunter
- SP1 Integration: Succinct Labs
- Icons: Lucide React
- Fonts: Orbitron & Urbanist

## Learn More

- WebAssembly: https://webassembly.org/
- SP1: https://blog.succinct.xyz/introducing-sp1/
- GitHub Repository: https://github.com/icryptohunter/SnakeGame-SP1

Enjoy the game!
`;

  return (
    <div 
      className={`${isMaximized ? 'w-full max-w-none' : 'max-w-3xl mx-auto'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${darkMode ? 'shadow-blue-900/40' : 'shadow-blue-500/20'}`}
    >
      {/* Window Title Bar */}
      <div className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white`}>
        <div className="flex items-center">
          <FileText size={16} className="mr-2" />
          <h1 className="text-sm font-bold font-orbitron">README.txt - Text Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMaximize}
            className="p-1 rounded-sm hover:bg-blue-700/50"
            aria-label="Maximize"
          >
            <Maximize2 size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-red-500"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Editor Toolbar */}
      <div className={`flex items-center gap-2 px-4 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
        <button className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
          File
        </button>
        <button className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
          Edit
        </button>
        <button className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
          View
        </button>
        <button className={`px-2 py-0.5 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
          Format
        </button>
        <div className="ml-auto flex items-center">
          <button 
            className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
          >
            <Copy size={12} />
            Copy
          </button>
        </div>
      </div>
      
      {/* Text Content */}
      <div 
        className={`p-4 font-mono text-sm overflow-y-auto h-[60vh] whitespace-pre-wrap ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'}`}
      >
        {aboutContent.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={index} className="text-lg font-bold mt-3 mb-2">{line.substring(3)}</h2>;
          } else if (line.startsWith('- ')) {
            return <div key={index} className="ml-4 flex"><span className="mr-2">•</span>{line.substring(2)}</div>;
          } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
                     line.startsWith('4. ') || line.startsWith('5. ')) {
            const num = line.substring(0, line.indexOf('.'));
            return <div key={index} className="ml-4 flex"><span className="mr-2 w-4">{num}.</span>{line.substring(line.indexOf('.') + 2)}</div>;
          } else {
            return <div key={index} className={line.trim() === '' ? 'h-4' : ''}>{line}</div>;
          }
        })}
      </div>
      
      {/* Status Bar */}
      <div className={`flex justify-between items-center px-4 py-1 text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
        <div>
          Read-Only Mode
        </div>
        <div>
          UTF-8
        </div>
      </div>
    </div>
  );
};

export default TextEditor;