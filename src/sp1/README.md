# SP1 Snake Game Verifier

This directory contains the SP1 program for verifying Snake game scores using zero-knowledge proofs.

## How It Works

The SP1 program (`snake_verifier.rs`) takes the game state hash and score as public inputs and verifies that the score is legitimate based on the game rules.

## Building and Running

To build and run the SP1 program:

1. Install the SP1 toolchain:
   ```
   curl -L https://sp1up.succinct.xyz | bash
   sp1up
   ```

2. Build the program:
   ```
   cargo prove build --release
   ```

3. Generate a proof:
   ```
   cargo prove prove --release
   ```

4. Verify the proof:
   ```
   cargo prove verify
   ```

## Integration with the Game

The game uses the WebAssembly verifier (`@succinctlabs/sp1-wasm-verifier`) to verify proofs in the browser. The verification process works as follows:

1. The game state is hashed and used as input to the SP1 program
2. The SP1 program generates a proof that the score is legitimate
3. The proof is verified in the browser using the WebAssembly verifier

This ensures that scores are cryptographically verified without revealing the exact game state.