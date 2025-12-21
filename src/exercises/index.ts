import { registerExercise } from "./registry";
import { kittenBasketExercise } from "./counting/basket";
import { subitizeExercise } from "./counting/subitize";

// Register all exercises
registerExercise(kittenBasketExercise);
registerExercise(subitizeExercise);

export * from "./types";
export * from "./registry";
