export function renderNumberPad(options: {
  targetModel?: string;
  showDecimal?: boolean;
  showNegative?: boolean;
  onEnter?: string;
  hideable?: boolean;
} = {}): string {
  const { targetModel = 'answer', showDecimal = false, showNegative = false, onEnter = '', hideable = true } = options;
  
  const enterHandler = onEnter ? `@click="${onEnter}"` : '';
  
  return `
    <div class="numpad-container" x-data="{ showNumpad: true }">
      ${hideable ? `
      <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
        <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
      </button>
      ` : ''}
      <div class="number-pad" x-show="showNumpad" x-cloak>
        <div class="pad-grid">
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '7'" :disabled="submitted">7</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '8'" :disabled="submitted">8</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '9'" :disabled="submitted">9</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '4'" :disabled="submitted">4</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '5'" :disabled="submitted">5</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '6'" :disabled="submitted">6</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '1'" :disabled="submitted">1</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '2'" :disabled="submitted">2</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '3'" :disabled="submitted">3</button>
          <button type="button" class="pad-btn pad-special" @click="${targetModel} = ''" :disabled="submitted">C</button>
          <button type="button" class="pad-btn" @click="${targetModel} = (${targetModel} || '') + '0'" :disabled="submitted">0</button>
          <button type="button" class="pad-btn pad-special" @click="${targetModel} = (${targetModel} || '').slice(0, -1)" :disabled="submitted">⌫</button>
          ${showDecimal ? `<button type="button" class="pad-btn" @click="if(!(${targetModel} || '').includes('.')) ${targetModel} = (${targetModel} || '') + '.'" :disabled="submitted">.</button>` : ''}
          ${showNegative ? `<button type="button" class="pad-btn pad-special" @click="${targetModel} = (${targetModel} || '').startsWith('-') ? (${targetModel} || '').slice(1) : '-' + (${targetModel} || '')" :disabled="submitted">±</button>` : ''}
          ${onEnter ? `<button type="button" class="pad-btn pad-enter" ${enterHandler} :disabled="submitted || !${targetModel}">↵</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

export const numberPadStyles = `
  .numpad-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .numpad-toggle {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    cursor: pointer;
    color: var(--color-text-muted);
  }
  
  .numpad-toggle:hover {
    background: var(--color-bg);
  }
  
  .number-pad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
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
  
  .pad-btn:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .pad-btn:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  .pad-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pad-special {
    background: var(--color-bg);
    font-size: 1rem;
  }
  
  .pad-enter {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .pad-enter:hover:not(:disabled) {
    background: var(--color-primary-dark, #4f46e5);
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
