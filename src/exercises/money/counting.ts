import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MoneyCountingParams {
  quarters: number;
  dimes: number;
  nickels: number;
  pennies: number;
  total: number;
}

export const moneyCountingExercise: Exercise = {
  id: "money-counting",
  topic: "money",
  title: "Counting Money",
  description: "Count collections of coins and bills",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const quarters = randomInt(0, 3, random);
    const dimes = randomInt(0, 4, random);
    const nickels = randomInt(0, 3, random);
    const pennies = randomInt(0, 4, random);
    
    const total = quarters * 25 + dimes * 10 + nickels * 5 + pennies;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { quarters, dimes, nickels, pennies, total } as unknown as Record<string, unknown>,
      correctAnswer: total,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MoneyCountingParams;
    let answerNum: number;
    
    const answerStr = String(answer).replace(/[$¢]/g, '');
    if (answerStr.includes('.')) {
      answerNum = Math.round(parseFloat(answerStr) * 100);
    } else {
      answerNum = parseInt(answerStr, 10);
    }
    
    if (answerNum === params.total) {
      const dollars = Math.floor(params.total / 100);
      const cents = params.total % 100;
      const display = dollars > 0 ? `$${dollars}.${cents.toString().padStart(2, '0')}` : `${cents}¢`;
      return { correct: true, feedback: `Correct! The total is ${display} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count each coin type and add them up.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MoneyCountingParams;
    
    let coins = '';
    for (let i = 0; i < params.quarters; i++) coins += '<span class="coin quarter">25¢</span>';
    for (let i = 0; i < params.dimes; i++) coins += '<span class="coin dime">10¢</span>';
    for (let i = 0; i < params.nickels; i++) coins += '<span class="coin nickel">5¢</span>';
    for (let i = 0; i < params.pennies; i++) coins += '<span class="coin penny">1¢</span>';
    
    return `
      <div class="exercise-container" x-data="moneyCountingExercise()" x-init="$nextTick(() => document.querySelector('.money-input')?.focus())">
        <div class="exercise-prompt">
          <h2>How much money is this?</h2>
          <p class="exercise-hint">Count all the coins. Enter your answer in cents (e.g., 75) or dollars (e.g., 0.75)</p>
        </div>
        
        <div class="coins-area">
          ${coins}
        </div>
        
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 placeholder="0"
                 class="money-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="cents-label">¢</span>
        </div>
        
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="/practice/money-counting" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .coins-area {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          min-height: 100px;
        }
        .coin {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.75rem;
        }
        .quarter {
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #d4d4d4, #a8a8a8);
          border: 2px solid #888;
        }
        .dime {
          width: 45px;
          height: 45px;
          background: linear-gradient(145deg, #d4d4d4, #a8a8a8);
          border: 2px solid #888;
        }
        .nickel {
          width: 55px;
          height: 55px;
          background: linear-gradient(145deg, #d4d4d4, #a8a8a8);
          border: 2px solid #888;
        }
        .penny {
          width: 50px;
          height: 50px;
          background: linear-gradient(145deg, #cd7f32, #8b4513);
          border: 2px solid #6b3510;
          color: white;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .money-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .money-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .cents-label {
          font-size: 1.5rem;
          color: var(--color-text-muted);
        }
      </style>
      
      <script>
        function moneyCountingExercise() {
          return {
            answer: '',
            submitted: false,
            correct: false,
            feedback: '',
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
              if (result.correct) {
                this.$nextTick(() => this.$refs.nextBtn?.focus());
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.answer = '';
            }
          };
        }
      </script>
    `;
  },
};
