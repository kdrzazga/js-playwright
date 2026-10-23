class BrainfuckDebugger{

    constructor(program){
        this.program = program;
        this.instructionPointer = 0;

        this.memory = [0];
        this.memoryPointer = 0;
        this.loopStack = [];
    }

    validateCode() {
        const program = this.program;
        const brainfuckKeywords = ['+', '-', '>', '<', '.', ',', '[', ']'];

        for (let i = 0; i < program.length; i++) {
            if (!brainfuckKeywords.includes(program[i])) {
                console.warn('?SYNTAX ERROR')
                return false;
            }
        }

        return true;
    }

    step(){
        if (this.instructionPointer >= this.program.length){
            window.alert('End of program.');
            return;
        }

        this.instructionPointer++;
        const command = this.getCurrentCommand(); ;
        if ('' === command)
            return;

        else if('+' === command){
            let value = this.memory[this.memoryPointer];
            value++;

            this.memory[this.memoryPointer] = value;
        }

        else if('-' === command){
            let value = this.memory[this.memoryPointer];
            value--;
            value = truncToByte(value);

            this.memory[this.memoryPointer] = value;
        }

        else if('<' === command){
            if(this.memoryPointer > 0){
                this.memoryPointer--;
            }
            else{
                console.warn('Cannot go lower than Memory Cell 0');
            }
        }

        else if('>' === command){
            const initialValue = 0;

            if (this.memoryPointer >= this.memory.length - 1) {
                this.memory.push(initialValue);
            }

            this.memoryPointer++;
        }

        else if('.' === command){
            const outputTextarea = document.getElementById('output');
            let oldValue = outputTextarea.value;
            outputTextarea.value = '';
            this.memory.forEach(cell =>{
                let newValue = oldValue + String.fromCharCode(cell);
                outputTextarea.value = newValue;
            });
        }

        else if(',' === command){
            let value = '';

            while (!isStringANumber(value)){
                value = prompt("Enter value for cell[" + this.pointer + "]");
            }

            value = truncToByte(value);
            this.memory[this.memoryPointer] = value;
        }

        else if('[' === command){
            //TODO
        }

        else if(']' === command){
            if (this.memory[this.memoryPointer] !== 0) {
                if (this.loopStack.length === 0) {
                    console.warn('Unmatched `]` found.');
                    return;
                }
            }
            //TODO
        }
    }

    getCurrentCommand(){
        if(this.instructionPointer < this.program.length){
            return this.program.charAt(this.instructionPointer);
        }
        else{
            console.warn("End of program.");
            return "";
        }
    }

    getMemory(){
        return this.memory;
    }
}

function readProgram(){
    const programTextArea = document.getElementById('program');
    let programTextAreaCode = programTextArea.value;
    let code = programTextAreaCode.replace(/\s+/g, '');
    const bfDebugger = new BrainfuckDebugger(code);
    bfDebugger.getCurrentCommand();
    return bfDebugger;
}

function updateLabels(){
    if (null == bfDebugger)
        return;

    const pointerLabel = document.getElementById('instruction-pointer');
    const commandLabel = document.getElementById('command');

    pointerLabel.innerText = "Instruction Pointer: " + bfDebugger.instructionPointer;
    commandLabel.innerText = "Command: " + bfDebugger.getCurrentCommand();
}

function updateMemoryTable(){
    if (null == bfDebugger)
        return;

    let memoryTableHeader = document.getElementById('cell-number');
    let memoryTableValues = document.getElementById('cell-value');

    const rows = [memoryTableHeader, memoryTableValues];

    rows.forEach(row =>{
         while (row.cells.length > 0){
            row.deleteCell(0);
         }
    });

    const mem = bfDebugger.getMemory();

    for (var i = 0; i < mem.length; i++){
        let headerCell = memoryTableHeader.insertCell();
        headerCell.textContent = i;

        let valueCell = memoryTableValues.insertCell();
        valueCell.textContent = mem[i];
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    let bfDebugger = null;
});
