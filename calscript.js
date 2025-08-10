class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetNextInput = false;
    }

    delete() {
        if (this.resetNextInput) return;
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.resetNextInput) {
            this.currentOperand = '0';
            this.resetNextInput = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.resetNextInput = true;
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetNextInput = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button event listeners
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
        
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
        
        calculator.chooseOperation(button.getAttribute('data-operation'));
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    const button = document.querySelector('[data-action="calculate"]');
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 100);
    
    calculator.calculate();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    const button = document.querySelector('[data-action="clear"]');
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 100);
    
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    const button = document.querySelector('[data-action="delete"]');
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 100);
    
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', event => {
    let button = null;
    
    if (event.key >= '0' && event.key <= '9') {
        button = document.querySelector(`[data-number="${event.key}"]`);
        calculator.appendNumber(event.key);
    } else if (event.key === '.') {
        button = document.querySelector('[data-number="."]');
        calculator.appendNumber('.');
    } else if (event.key === '+') {
        button = document.querySelector('[data-operation="+"]');
        calculator.chooseOperation('+');
    } else if (event.key === '-') {
        button = document.querySelector('[data-operation="-"]');
        calculator.chooseOperation('-');
    } else if (event.key === '*') {
        button = document.querySelector('[data-operation="*"]');
        calculator.chooseOperation('*');
    } else if (event.key === '/') {
        event.preventDefault();
        button = document.querySelector('[data-operation="÷"]');
        calculator.chooseOperation('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        button = document.querySelector('[data-action="calculate"]');
        calculator.calculate();
    } else if (event.key === 'Escape') {
        button = document.querySelector('[data-action="clear"]');
        calculator.clear();
    } else if (event.key === 'Backspace') {
        button = document.querySelector('[data-action="delete"]');
               calculator.delete();
    }
    
    if (button) {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
    }
    
    calculator.updateDisplay();
});