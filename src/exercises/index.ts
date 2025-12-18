import { registerExercise } from "./registry";
import { kittenBasketExercise } from "./counting/basket";

// Register all exercises
registerExercise(kittenBasketExercise);

export * from "./types";
export * from "./registry";
