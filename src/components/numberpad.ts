export function renderNumberPad(options: {
  inputId: string;
  maxDigits?: number;
  showDecimal?: boolean;
  showNegative?: boolean;
} = { inputId: 'answer-input' }): string {
  const { inputId, maxDigits = 6, showDecimal = false, showNegative = false } = options;
  
  return `
    <div class="number-pad" x-data="numberPad('${inputId}', ${maxDigits})">
      <div class="number-display">
        <input type="text" 
               id="${inputId}" 
               x-model="value" 
               readonly 
               class="number-input"
               placeholder="0">
      </div>
      <div class="pad-grid">
        <button type="button" class="pad-btn" @click="append('7')">7</button>
        <button type="button" class="pad-btn" @click="append('8')">8</button>
        <button type="button" class="pad-btn" @click="append('9')">9</button>
        <button type="button" class="pad-btn" @click="append('4')">4</button>
        <button type="button" class="pad-btn" @click="append('5')">5</button>
        <button type="button" class="pad-btn" @click="append('6')">6</button>
        <button type="button" class="pad-btn" @click="append('1')">1</button>
        <button type="button" class="pad-btn" @click="append('2')">2</button>
        <button type="button" class="pad-btn" @click="append('3')">3</button>
        ${showNegative ? `<button type="button" class="pad-btn pad-special" @click="toggleNegative()">±</button>` : `<button type="button" class="pad-btn pad-special" @click="clear()">C</button>`}
        <button type="button" class="pad-btn" @click="append('0')">0</button>
        ${showDecimal ? `<button type="button" class="pad-btn" @click="append('.')">.</button>` : `<button type="button" class="pad-btn pad-special" @click="backspace()">⌫</button>`}
      </div>
      ${showNegative || showDecimal ? `
      <div class="pad-extra">
        ${showNegative ? `<button type="button" class="pad-btn pad-special" @click="clear()">C</button>` : ''}
        <button type="button" class="pad-btn pad-special" @click="backspace()">⌫</button>
      </div>
      ` : ''}
    </div>
  `;
}

export const numberPadStyles = `
  .number-pad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .number-display {
    width: 100%;
    max-width: 200px;
  }
  
  .number-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 2rem;
    text-align: center;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    font-family: 'Courier New', monospace;
  }
  
  .number-input:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  .pad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    max-width: 200px;
  }
  
  .pad-extra {
    display: flex;
    gap: 0.5rem;
  }
  
  .pad-btn {
    width: 60px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: 600;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .pad-btn:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .pad-btn:active {
    transform: scale(0.95);
  }
  
  .pad-special {
    background: var(--color-bg);
    font-size: 1.25rem;
  }
`;

export const numberPadScript = `
  function numberPad(inputId, maxDigits) {
    return {
      value: '',
      maxDigits: maxDigits,
      
      append(digit) {
        if (this.value.length < this.maxDigits) {
          if (digit === '.' && this.value.includes('.')) return;
          if (this.value === '0' && digit !== '.') {
            this.value = digit;
          } else {
            this.value += digit;
          }
        }
      },
      
      backspace() {
        this.value = this.value.slice(0, -1);
      },
      
      clear() {
        this.value = '';
      },
      
      toggleNegative() {
        if (this.value.startsWith('-')) {
          this.value = this.value.slice(1);
        } else if (this.value) {
          this.value = '-' + this.value;
        }
      },
      
      getValue() {
        return this.value ? parseFloat(this.value) : 0;
      }
    };
  }
`;
