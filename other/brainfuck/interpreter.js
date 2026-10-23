class Interpreter {
    constructor(program, inputStream = new InputStream(), outputStream = new OutputStream(), tape = new Tape()) {
        this.program = program;
        this.inputStream = inputStream;
        this.outputStream = outputStream;
        this.tape = tape;
        this.instructionPointer = 0;
        this.executedStepCount = 0;
        this.commandHandlers = new Map([
            ['+', () => this.tape.increment()],
            ['-', () => this.tape.decrement()],
            ['>', () => this.tape.moveRight()],
            ['<', () => this.tape.moveLeft()],
            ['.', () => this.outputStream.writeByte(this.tape.currentValue)],
            [',', () => { this.tape.currentValue = this.inputStream.readByte(); }],
            ['[', () => this.skipLoopIfCurrentCellIsZero()],
            [']', () => this.repeatLoopIfCurrentCellIsNonZero()],
        ]);
    }

    get isFinished() {
        return this.instructionPointer >= this.program.length;
    }

    get currentInstruction() {
        return this.isFinished ? null : this.program.instructionAt(this.instructionPointer);
    }

    step() {
        if (this.isFinished) {
            return false;
        }
        const instruction = this.currentInstruction;
        try {
            this.commandHandlers.get(instruction.command)();
        } catch (error) {
            if (error instanceof TapeBoundaryError) {
                throw new BrainfuckRuntimeError(error.message, instruction.sourceIndex);
            }
            throw error;
        }
        this.instructionPointer++;
        this.executedStepCount++;
        return true;
    }

    run(stepLimit = Infinity) {
        let stepsExecuted = 0;
        while (stepsExecuted < stepLimit && this.step()) {
            stepsExecuted++;
        }
        return this.isFinished;
    }

    skipLoopIfCurrentCellIsZero() {
        if (this.tape.currentValue === 0) {
            this.instructionPointer = this.program.jumpTargetOf(this.instructionPointer);
        }
    }

    repeatLoopIfCurrentCellIsNonZero() {
        if (this.tape.currentValue !== 0) {
            this.instructionPointer = this.program.jumpTargetOf(this.instructionPointer);
        }
    }
}
