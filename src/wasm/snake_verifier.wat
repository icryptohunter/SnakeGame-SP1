(module
  ;; Import memory from JavaScript
  (import "env" "memory" (memory 1))
  
  ;; Function to verify score based on snake length
  (func $verify_score (param $score i32) (param $snake_length i32) (result i32)
    (local $expected_length i32)
    
    ;; Calculate expected length (initial length of 3 + food eaten)
    ;; Each food gives 10 points, so divide score by 10
    (local.set $expected_length 
      (i32.add 
        (i32.const 3)
        (i32.div_s (local.get $score) (i32.const 10))
      )
    )
    
    ;; Check if score is valid (multiple of 10 or 0)
    (if (i32.eq (i32.rem_s (local.get $score) (i32.const 10)) (i32.const 0))
      (then
        ;; Check if snake length matches expected length (with ±1 tolerance)
        (if (i32.le_s 
              (i32.abs 
                (i32.sub 
                  (local.get $expected_length) 
                  (local.get $snake_length)
                )
              )
              (i32.const 1)
            )
          (then (return (i32.const 1)))  ;; Valid score
          (else (return (i32.const 0)))  ;; Invalid length
        )
      )
      (else 
        (return (i32.const 0))  ;; Invalid score (not multiple of 10)
      )
    )
    
    (i32.const 0)  ;; Default return false
  )
  
  ;; Export the verification function
  (export "verify_score" (func $verify_score))
)