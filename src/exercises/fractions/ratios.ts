import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface RatiosParams {
  part1: number;
  part2: number;
  total: number;
  questionType: 'write' | 'equivalent' | 'missing';
  multiplier?: number;
  missingPart?: 'first' | 'second';
  answer: string | number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export const ratiosExercise: Exercise = {
  id: "frac-ratios",
  topic: "fractions",
  title: "Ratios",
  description: "Understand and work with ratios",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const part1 = randomInt(1, 5, random);
    const part2 = randomInt(1, 5, random);
    const total = part1 + part2;
    
    const questionTypes: ('write' | 'equivalent' | 'missing')[] = ['write', 'equivalent', 'missing'];
    const questionType = questionTypes[randomInt(0, 2, random)]!;
    
    let multiplier: number | undefined;
    let missingPart: 'first' | 'second' | undefined;
    let answer: string | number;
    
    if (questionType === 'write') {
      answer = `${part1}:${part2}`;
    } else if (questionType === 'equivalent') {
      multiplier = randomInt(2, 4, random);
      answer = `${part1 * multiplier}:${part2 * multiplier}`;
    } else {
      multiplier = randomInt(2, 4, random);
      missingPart = randomInt(0, 1, random) === 0 ? 'first' : 'second';
      answer = missingPart === 'first' ? part1 * multiplier : part2 * multiplier;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { part1, part2, total, questionType, multiplier, missingPart, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as RatiosParams;
    const answerStr = String(answer).trim();
    
    if (params.questionType === 'missing') {
      const answerNum = parseInt(answerStr, 10);
      if (answerNum === params.answer) {
        return { correct: true, feedback: `Correct! The missing value is ${params.answer} 🎉` };
      }
    } else {
      // For ratio answers, check if equivalent
      const parts = answerStr.split(':');
      if (parts.length === 2) {
        const a = parseInt(parts[0]!, 10);
        const b = parseInt(parts[1]!, 10);
        
        const expectedParts = String(params.answer).split(':');
        const expA = parseInt(expectedParts[0]!, 10);
        const expB = parseInt(expectedParts[1]!, 10);
        
        // Check if ratios are equivalent
        if (a * expB === b * expA) {
          return { correct: true, feedback: `Correct! ${a}:${b} is equivalent to ${params.part1}:${params.part2} 🎉` };
        }
      }
    }
    
    return { correct: false, feedback: `Not quite. A ratio compares two quantities.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as RatiosParams;
    
    let questionText = '';
    let contextText = '';
    
    if (params.questionType === 'write') {
      contextText = `There are ${params.part1} red balls and ${params.part2} blue balls.`;
      questionText = 'Write the ratio of red to blue balls (format: a:b)';
    } else if (params.questionType === 'equivalent') {
      contextText = `The ratio is ${params.part1}:${params.part2}`;
      questionText = `Find an equivalent ratio by multiplying by ${params.multiplier}`;
    } else {
      const given = params.missingPart === 'first' ? params.part2 * params.multiplier! : params.part1 * params.multiplier!;
      contextText = `${params.part1}:${params.part2} = ?:${given}`;
      if (params.missingPart === 'second') {
        contextText = `${params.part1}:${params.part2} = ${params.part1 * params.multiplier!}:?`;
      }
      questionText = 'Find the missing value';
    }
    
    return `
      <div class="exercise-container" x-data="ratiosExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Ratios</h2>
          <p class="context-text">${contextText}</p>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input"
                 placeholder="${params.questionType === 'missing' ? 'number' : 'a:b'}"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="hint-box">
          <p><strong>Tip:</strong> Ratios compare quantities. Equivalent ratios have the same relationship.</p>
        </div>
        
        ${params.questionType === 'missing' ? `
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '7'" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '8'" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '9'" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '4'" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '5'" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '6'" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '1'" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '2'" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '3'" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '0'" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-enter" @click="checkAnswer()" :disabled="submitted || !answer">↵</button>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !answer">
            Check Answer
          </button>
        </div>

        <div class="feedback-area" x-show="feedback" x-cloak>
          <div class="alert" :class="correct ? 'alert-success' : 'alert-error'">
            <span x-text="feedback"></span>
          </div>
          
          <div class="next-actions" x-show="submitted">
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct && !givenUp" x-ref="tryAgainBtn">
              Try Again
            </button>
            <button class="btn btn-warning" @click="giveUp()" x-show="!correct && !givenUp && attempts >= 3">
              Give Up
            </button>
            <a href="/practice/frac-ratios" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .context-text {
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 120px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus { outline: none; border-color: var(--color-primary); }
        .hint-box {
          padding: 0.75rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .hint-box p { margin: 0; }
        .numpad-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .numpad-toggle {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .number-pad {
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .pad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .pad-btn {
          width: 55px;
          height: 45px;
          font-size: 1.25rem;
          font-weight: 600;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.15s;
        }
        .pad-btn:hover:not(:disabled) { background: var(--color-primary); color: white; }
        .pad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pad-special { background: var(--color-bg); }
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function ratiosExercise() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            async checkAnswer() {
              if (!this.answer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.answer
                })
              });
              
              const result = await response.json();
              this.correct = result.correct;
              this.feedback = result.feedback;
              this.submitted = true;
              this.attempts++;
              if (result.correct) {
                setTimeout(() => this.$refs.nextBtn?.focus(), 50);
              } else {
                setTimeout(() => this.$refs.tryAgainBtn?.focus(), 50);
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.answer = '';
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The answer was: ' + this.correctAnswer;
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
