// Creamos una clase Calculadora que contendrá todas las funciones de esta
class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }
    
    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete(){
        /* El slice devuelve un string recortado desde el 0 hasta el -1
         SIN incluir el -1*/
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number){
        if (number === '.' && this.currentOperand.includes('.')) return
        // Vamos concatenando los numeros que vamos agregando
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        // Si seleccionamos un operador sin un numero selecccionado previamente no añade nada
        if (this.currentOperand === '' && this.previousOperand === '') return
        
        // Verificamos si solo queremos cambiar el signo de un número ya ingresado
        if (this.previousOperand !== '' && this.currentOperand === '') {
            this.operation = operation;
            this.previousOperand = this.previousOperand;
            return;
        }
        // Aca ya hacemos el calculo parcial
        if (this.previousOperand !== ''){
            this.compute();
        }
        
        this.operation = operation
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        
    }

    compute(){
        let computation
        // Transformamos los textos en numeros
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        // Si no tenemos valores que computar no funciona
        if (isNaN(prev) || isNaN(current)) return
        switch(this.operation){
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
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';

    }

    // Agregarle comas a los numeros grandes SOLO DISPLAY, NO CALCULO
    getDisplayNumber(number){
        // Transformamos el numero en string para dividirlo
        const stringNumber = number.toString();
        /* Dividimos el numero en parte entera y decimal y seleccionamos 
        la entera [0] y la guardamos en una variable*/
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        // Hacemos lo mismo con la parte decimal
        const decimalDigits = stringNumber.split('.')[1]
        
        // Creamos una variable para los enteros con comas
        let integerDisplay;
        // Si no tenemos enteros entonces no se muestra nada
        if (isNaN(integerDigits)){
            integerDisplay = '';
        } else{ /* Si tenemos entonces usamos el toLocaleString para 
            agregarles las comas automaticamente*/
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        /* Si tenemos decimales entonces devolvemos los enteros separados 
        por comas concatenado a los decimales con un punto*/
        if (decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`;
        } else { // Si no, solo los enteros
            return integerDisplay;
        }
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null){
            this.previousOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else { /* Como cuando le damos a = el compute coloca undefined
            el operation entonces ahí limpiamos la pantalla de arriba*/
            this.previousOperandTextElement.innerText = '';
        }
        
    }

}



// Obtenemos los datos de los numeros y las operaciones
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
// Recorremos todos los numeros
numberButtons.forEach(button => {
    // Para cada botón añadimos una función al hacerle click
    button.addEventListener("click", () => {
        // Ejecutamos el método de añadir número a la pantalla
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
}
)

operationButtons.forEach(button => {
    // Para cada botón añadimos una función al hacerle click
    button.addEventListener("click", () => {
        // Ejecutamos el método de escoger operación
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
}
)

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})