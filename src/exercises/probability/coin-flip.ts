import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface CoinFlipParams {
  flips: number;
  questionType: 'all-same' | 'at-least-one' | 'exact-sequence' | 'specific-count';
  targetDescription: string;
  probability: string;
  explanation: string;
}

// Question types with their probabilities
const questionTypes = [
  // Single flip questions
  { flips: 1, type: 'all-same', target: 'heads', prob: '1/2', desc: 'getting heads', expl: '1 out of 2 possible outcomes' },
  { flips: 1, type: 'all-same', target: 'tails', prob: '1/2', desc: 'getting tails', expl: '1 out of 2 possible outcomes' },
  // Two flip questions
  { flips: 2, type: 'all-same', target: 'heads', prob: '1/4', desc: 'getting heads on both flips', expl: '1 out of 4 possible outcomes (HH, HT, TH, TT)' },
  { flips: 2, type: 'all-same', target: 'tails', prob: '1/4', desc: 'getting tails on both flips', expl: '1 out of 4 possible outcomes' },
  { flips: 2, type: 'at-least-one', target: 'heads', prob: '3/4', desc: 'getting at least one heads', expl: '3 out of 4 outcomes have at least one heads (HH, HT, TH)' },
  { flips: 2, type: 'exact-sequence', target: 'HT', prob: '1/4', desc: 'getting heads then tails (in that order)', expl: '1 specific sequence out of 4 possible' },
  { flips: 2, type: 'specific-count', target: '1H', prob: '1/2', desc: 'getting exactly one heads', expl: '2 out of 4 outcomes (HT, TH)' },
  // Three flip questions
  { flips: 3, type: 'all-same', target: 'heads', prob: '1/8', desc: 'getting heads on all 3 flips', expl: '1 out of 8 possible outcomes' },
  { flips: 3, type: 'all-same', target: 'tails', prob: '1/8', desc: 'getting tails on all 3 flips', expl: '1 out of 8 possible outcomes' },
  { flips: 3, type: 'at-least-one', target: 'heads', prob: '7/8', desc: 'getting at least one heads', expl: '7 out of 8 outcomes have at least one heads' },
  { flips: 3, type: 'specific-count', target: '2H', prob: '3/8', desc: 'getting exactly 2 heads', expl: '3 out of 8 outcomes (HHT, HTH, THH)' },
  // Four flip questions
  { flips: 4, type: 'all-same', target: 'heads', prob: '1/16', desc: 'getting heads on all 4 flips', expl: '1 out of 16 possible outcomes' },
  { flips: 4, type: 'specific-count', target: '2H', prob: '3/8', desc: 'getting exactly 2 heads', expl: '6 out of 16 outcomes = 3/8' },
];

export const coinFlipExercise: Exercise = {
  id: "prob-coin",
  topic: "probability",
  title: "Coin Flip Probability",
  description: "Learn basic probability with coin flips",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const questionIndex = randomInt(0, questionTypes.length - 1, random);
    const question = questionTypes[questionIndex]!;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        flips: question.flips, 
        questionType: question.type,
        targetDescription: question.desc,
        probability: question.prob,
        explanation: question.expl
      } as unknown as Record<string, unknown>,
      correctAnswer: question.prob,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as CoinFlipParams;
    const answerStr = String(answer).trim().toLowerCase();
    
    // Accept the exact fraction
    if (answerStr === params.probability.toLowerCase()) {
      return { correct: true, feedback: `Correct! ${params.explanation} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.explanation}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as CoinFlipParams;
    
    const coins = Array(params.flips).fill(0).map((_, i) => `
      <div class="coin">
        <div class="coin-face">?</div>
      </div>
    `).join('');
    
    // Generate appropriate options based on the correct answer
    const allOptions = ['1/2', '1/4', '3/4', '1/8', '3/8', '7/8', '1/16', '1/3'];
    const options = [params.probability];
    for (const opt of allOptions) {
      if (!options.includes(opt) && options.length < 6) {
        options.push(opt);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    const fractionOptions = options.map(opt => 
      `<button type="button" class="prob-option" @click="selectAnswer('${opt}')" :class="{ selected: selectedAnswer === '${opt}' }" :disabled="submitted">${opt}</button>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="coinFlipExercise()">
        <div class="exercise-prompt">
          <h2>If you flip ${params.flips === 1 ? 'a coin' : params.flips + ' coins'}, what is the probability of ${params.targetDescription}?</h2>
        </div>
        
        <div class="coins-display">
          ${coins}
        </div>
        
        <div class="options-grid">
          ${fractionOptions}
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !selectedAnswer">
            Check Answer
          </button>
        </div>

        <div class="feedback-area" x-show="feedback" x-cloak>
          <div class="alert" :class="correct ? 'alert-success' : 'alert-error'">
            <span x-text="feedback"></span>
          </div>
          
          <div class="next-actions" x-show="submitted">
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/prob-coin" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .coins-display {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .coin {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffd700, #b8860b);
          border: 4px solid #8b6914;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .coin-face {
          font-size: 2rem;
          font-weight: bold;
          color: #5c4a1f;
        }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          max-width: 320px;
          margin: 0 auto 1.5rem;
        }
        .prob-option {
          padding: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .prob-option:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-bg);
        }
        .prob-option.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .prob-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function coinFlipExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(prob) {
              if (!this.submitted) {
                this.selectedAnswer = prob;
              }
            },
            
            async checkAnswer() {
              if (!this.selectedAnswer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.selectedAnswer
                })
              });
              
              const result = await response.json();
              this.correct = result.correct;
              this.feedback = result.feedback;
              this.submitted = true;
              if (result.correct) {
                setTimeout(() => this.$refs.nextBtn?.focus(), 50);
              } else {
                setTimeout(() => this.$refs.tryAgainBtn?.focus(), 50);
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.selectedAnswer = null;
            }
          };
        }
      </script>
    `;
  },
};
