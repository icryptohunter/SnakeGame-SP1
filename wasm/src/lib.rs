use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Position {
    x: i32,
    y: i32,
}

#[wasm_bindgen]
impl Position {
    #[wasm_bindgen(constructor)]
    pub fn new(x: i32, y: i32) -> Position {
        Position { x, y }
    }
}

#[wasm_bindgen]
pub struct GameState {
    snake: Vec<Position>,
    food: Position,
    grid_width: i32,
    grid_height: i32,
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new(grid_width: i32, grid_height: i32) -> GameState {
        let initial_x = grid_width / 2;
        let initial_y = grid_height / 2;
        
        let snake = vec![
            Position::new(initial_x, initial_y),
            Position::new(initial_x - 1, initial_y),
            Position::new(initial_x - 2, initial_y),
        ];
        
        GameState {
            snake,
            food: Position::new(0, 0),
            grid_width,
            grid_height,
        }
    }
    
    pub fn check_collision(&self, head_x: i32, head_y: i32) -> bool {
        // Check wall collision
        if head_x < 0 || head_x >= self.grid_width || head_y < 0 || head_y >= self.grid_height {
            return true;
        }
        
        // Check self collision (skip the head)
        for i in 1..self.snake.len() {
            if head_x == self.snake[i].x && head_y == self.snake[i].y {
                return true;
            }
        }
        
        false
    }
    
    pub fn verify_score(&self, score: i32) -> bool {
        // Each food gives 10 points
        let expected_length = 3 + (score / 10);
        let actual_length = self.snake.len() as i32;
        
        // Allow some flexibility in length verification
        (expected_length - actual_length).abs() <= 1 && (score % 10 == 0 || score == 0)
    }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}