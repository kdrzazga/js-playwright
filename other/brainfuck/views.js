class CodeView {
    constructor(element) {
        this.element = element;
    }

    render(source, highlightedSourceIndex) {
        this.element.replaceChildren();
        if (highlightedSourceIndex === null || highlightedSourceIndex === undefined) {
            this.element.append(source);
            return;
        }
        const highlightedCharacter = document.createElement('span');
        highlightedCharacter.className = 'current-instruction';
        highlightedCharacter.textContent = source.charAt(highlightedSourceIndex);
        this.element.append(
            source.slice(0, highlightedSourceIndex),
            highlightedCharacter,
            source.slice(highlightedSourceIndex + 1)
        );
    }
}

class TapeView {
    constructor(tableElement, visibleCellCount = 32) {
        this.tableElement = tableElement;
        this.visibleCellCount = visibleCellCount;
    }

    render(tape) {
        const firstVisibleCell = this.firstVisibleCellFor(tape);
        const visibleCellIndexes = Array.from({ length: this.visibleCellCount }, (_, offset) => firstVisibleCell + offset);

        const indexRow = this.createRow('Cell', visibleCellIndexes.map(cellIndex => cellIndex));
        const valueRow = this.createRow('Value', visibleCellIndexes.map(cellIndex => tape.valueAt(cellIndex)));
        const characterRow = this.createRow('Char', visibleCellIndexes.map(cellIndex => this.printableCharacterOf(tape.valueAt(cellIndex))));

        [indexRow, valueRow, characterRow].forEach(row => {
            const headColumn = row.children[tape.headPosition - firstVisibleCell + 1];
            headColumn.classList.add('tape-head');
        });

        this.tableElement.replaceChildren(indexRow, valueRow, characterRow);
    }

    firstVisibleCellFor(tape) {
        const halfWindow = Math.floor(this.visibleCellCount / 2);
        return Math.max(0, tape.headPosition - halfWindow);
    }

    createRow(label, cellContents) {
        const row = document.createElement('tr');
        const labelCell = document.createElement('th');
        labelCell.textContent = label;
        row.append(labelCell);
        cellContents.forEach(content => {
            const cell = document.createElement('td');
            cell.textContent = content;
            row.append(cell);
        });
        return row;
    }

    printableCharacterOf(value) {
        const isPrintableAscii = value >= 32 && value < 127;
        return isPrintableAscii ? String.fromCharCode(value) : '';
    }
}

class StatusView {
    constructor(statusElement, instructionPointerElement, commandElement, stepCountElement) {
        this.statusElement = statusElement;
        this.instructionPointerElement = instructionPointerElement;
        this.commandElement = commandElement;
        this.stepCountElement = stepCountElement;
    }

    showMessage(message, isError = false) {
        this.statusElement.textContent = message;
        this.statusElement.classList.toggle('error', isError);
    }

    showInterpreterState(interpreter) {
        const currentInstruction = interpreter.currentInstruction;
        this.instructionPointerElement.textContent = interpreter.instructionPointer;
        this.commandElement.textContent = currentInstruction ? currentInstruction.command : '(end)';
        this.stepCountElement.textContent = interpreter.executedStepCount;
    }

    clearInterpreterState() {
        this.instructionPointerElement.textContent = '-';
        this.commandElement.textContent = '-';
        this.stepCountElement.textContent = '0';
    }
}

class ExecutionLoop {
    constructor(runOneFrame) {
        this.runOneFrame = runOneFrame;
        this.animationFrameId = null;
    }

    get isRunning() {
        return this.animationFrameId !== null;
    }

    start() {
        if (this.isRunning) {
            return;
        }
        const runFrameAndScheduleNext = () => {
            this.animationFrameId = null;
            if (this.runOneFrame()) {
                this.animationFrameId = requestAnimationFrame(runFrameAndScheduleNext);
            }
        };
        this.animationFrameId = requestAnimationFrame(runFrameAndScheduleNext);
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
