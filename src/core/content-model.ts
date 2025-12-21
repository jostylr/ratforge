
// Core Content Model based on plans/counting.md

// Entities

export interface SkillAtom {
  id: string;
  domain: 
    | 'counting' 
    | 'grouping' 
    | 'place_value' 
    | 'meaning' 
    | 'operations' 
    | 'equivalence' 
    | 'estimation' 
    | 'proportional';
  level: number;
  prereqs: string[]; // SkillAtom.id[]
  success_criteria: string; // machine-checkable statements
}

export type ExerciseFamily = 
  | 'subitize' 
  | 'counting' 
  | 'equivalence' 
  | 'grouping' 
  | 'place_value' 
  | 'meaning' 
  | 'operations' 
  | 'arrays' 
  | 'estimation';

export type ExerciseMode = 'explore' | 'guided' | 'quiz';

export interface ExerciseInstance {
  seed: number;
  state: Record<string, unknown>; // objects, arrangement, constraints
  task: Record<string, unknown>; // machine-readable objective(s)
  solution: {
    canonical: unknown;
    alternates?: unknown[];
  };
  hints: string[];
}

export interface ThemeSkin {
  id: string;
  tone: 'cute' | 'adventure' | 'utilitarian' | 'mature';
  assets: {
    icons: Record<string, string>;
    nouns: string[];
    narrationStyle?: string;
  };
  text_overrides: Record<string, string>;
}

export interface ValidationResult {
  correct: boolean;
  feedback?: string;
  score?: number;
}

export interface ExerciseTemplate<Params = any> {
  id: string;
  family: ExerciseFamily;
  name: string;
  description: string;
  
  // prompt generation
  getPrompts: (params: Params, theme: ThemeSkin) => string[];
  
  // generation
  generate: (params: Params, rng: () => number) => ExerciseInstance;
  
  // validation
  validate: (instance: ExerciseInstance, answer: unknown) => ValidationResult;
  
  // rendering capabilities
  renderers: {
    web: boolean;
    worksheet: boolean;
  };
  
  modes_supported: ExerciseMode[];
}
