/**
 * snake_verifier.js
 * A WebAssembly module for verifying Snake game scores.
 * This provides a simpler, more focused approach to using WebAssembly
 * just for score verification rather than full game state management.
 */

let wasm = null;
let memory = null;

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

export function verifyScore(score, snakeLength) {
  if (!wasm) {
    console.warn('WebAssembly module not initialized');
    return false;
  }
  
  try {
    // Call the WebAssembly function to verify the score
    return wasm.verify_score(score, snakeLength);
  } catch (error) {
    console.error('Error verifying score:', error);
    return false;
  }
}