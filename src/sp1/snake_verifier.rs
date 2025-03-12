//! Snake Game Verifier
//! This is an SP1 program that verifies the integrity of a Snake game score.
//! It takes the game state hash and score as input and verifies that the score
//! is legitimate based on the game rules.

use sp1_sdk::{
    prelude::*,
    utils::{BabyBearPoseidon2, BabyBearPoseidon2Sponge},
};

// Define the program's public inputs
#[derive(Clone, Debug, Default)]
pub struct SnakeGamePublicInputs {
    pub game_state_hash: [u8; 32],
    pub score: u32,
    pub snake_length: u32,
}

// Define the program's private inputs
#[derive(Clone, Debug, Default)]
pub struct SnakeGamePrivateInputs {
    pub game_moves: Vec<u8>,
    pub food_positions: Vec<(u32, u32)>,
    pub initial_snake: Vec<(u32, u32)>,
}

// The main SP1 program
pub fn snake_game_verifier(
    public_inputs: SnakeGamePublicInputs,
    private_inputs: SnakeGamePrivateInputs,
) -> bool {
    // In a real implementation, we would:
    // 1. Reconstruct the game state from the private inputs
    // 2. Verify that each move follows the game rules
    // 3. Verify that the score matches the number of food items collected
    // 4. Verify that the final snake length is correct
    // 5. Hash the reconstructed game state and compare with the public input hash

    // For this example, we'll do a simplified verification
    let expected_snake_length = 3 + (public_inputs.score / 10);
    
    // Verify that the snake length is consistent with the score
    // (Each food gives 10 points and increases length by 1)
    let length_valid = (expected_snake_length - 1..=expected_snake_length + 1)
        .contains(&public_inputs.snake_length);
    
    // Verify that the score is a multiple of 10 (each food gives 10 points)
    let score_valid = public_inputs.score % 10 == 0 || public_inputs.score == 0;
    
    // Return true if all checks pass
    length_valid && score_valid
}

// Entry point for the SP1 program
fn main() {
    sp1_sdk::sp1_main!(snake_game_verifier);
}