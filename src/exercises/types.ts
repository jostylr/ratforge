export interface ExerciseInstance {
  id: string;
  exerciseId: string;
  seed: number;
  params: Record<string, unknown>;
  correctAnswer: unknown;
  createdAt: string;
}

export interface ValidationResult {
  correct: boolean;
  feedback?: string;
}

export interface Exercise {
  id: string;
  topic: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  generate(seed?: number): ExerciseInstance;
  validate(instance: ExerciseInstance, answer: unknown): ValidationResult;
  renderHTML(instance: ExerciseInstance): string;
}

export function createSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function randomInt(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}
