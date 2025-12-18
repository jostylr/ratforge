import type { Exercise } from "./types";

const exercises = new Map<string, Exercise>();

export function registerExercise(exercise: Exercise): void {
  exercises.set(exercise.id, exercise);
}

export function getExercise(id: string): Exercise | undefined {
  return exercises.get(id);
}

export function getAllExercises(): Exercise[] {
  return Array.from(exercises.values());
}

export function getExercisesByTopic(topic: string): Exercise[] {
  return Array.from(exercises.values()).filter(e => e.topic === topic);
}
