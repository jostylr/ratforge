
import { describe, it, expect } from "bun:test";
import { subitizeExercise } from "../src/exercises/counting/subitize";

describe("Subitize Exercise", () => {
    it("generates an instance with default params", () => {
        const instance = subitizeExercise.generate();
        expect(instance.exerciseId).toBe("counting-subitize");
        expect(typeof instance.seed).toBe("number");

        // Check params
        const count = instance.params.count as number;
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(6);
        expect(instance.correctAnswer).toBe(count);

        // Check positions
        const positions = instance.params.positions as any[];
        expect(Array.isArray(positions)).toBe(true);
        expect(positions.length).toBe(count);
    });

    it("validates correct answer", () => {
        const instance = subitizeExercise.generate();
        const result = subitizeExercise.validate(instance, instance.correctAnswer);
        expect(result.correct).toBe(true);
    });

    it("validates incorrect answer", () => {
        const instance = subitizeExercise.generate();
        const count = instance.correctAnswer as number;
        const result = subitizeExercise.validate(instance, count + 1);
        expect(result.correct).toBe(false);
    });

    it("generates deterministic instances with same seed", () => {
        const seed = 12345;
        const instance1 = subitizeExercise.generate(seed);
        const instance2 = subitizeExercise.generate(seed);

        expect(instance1.params.count).toBe(instance2.params.count);
        // Deep equality for positions
        expect(JSON.stringify(instance1.params.positions)).toBe(JSON.stringify(instance2.params.positions));
    });
});
