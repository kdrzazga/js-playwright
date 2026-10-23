class Instruction {
    constructor(command, sourceIndex) {
        this.command = command;
        this.sourceIndex = sourceIndex;
    }

    get isLoopStart() {
        return this.command === '[';
    }

    get isLoopEnd() {
        return this.command === ']';
    }
}

class Program {
    constructor(source, commandAlphabet = '+-<>.,[]') {
        this.source = source;
        this.instructions = this.parseInstructions(commandAlphabet);
        this.jumpTargets = this.matchLoopBrackets();
    }

    get length() {
        return this.instructions.length;
    }

    instructionAt(position) {
        return this.instructions[position];
    }

    jumpTargetOf(position) {
        return this.jumpTargets.get(position);
    }

    parseInstructions(commandAlphabet) {
        const instructions = [];
        for (let sourceIndex = 0; sourceIndex < this.source.length; sourceIndex++) {
            const character = this.source.charAt(sourceIndex);
            if (commandAlphabet.includes(character)) {
                instructions.push(new Instruction(character, sourceIndex));
            }
        }
        return instructions;
    }

    matchLoopBrackets() {
        const jumpTargets = new Map();
        const openLoopPositions = [];

        this.instructions.forEach((instruction, position) => {
            if (instruction.isLoopStart) {
                openLoopPositions.push(position);
            } else if (instruction.isLoopEnd) {
                if (openLoopPositions.length === 0) {
                    throw new BrainfuckSyntaxError('Unmatched "]"', instruction.sourceIndex);
                }
                const loopStartPosition = openLoopPositions.pop();
                jumpTargets.set(loopStartPosition, position);
                jumpTargets.set(position, loopStartPosition);
            }
        });

        if (openLoopPositions.length > 0) {
            const unclosedLoopStart = this.instructions[openLoopPositions.pop()];
            throw new BrainfuckSyntaxError('Unmatched "["', unclosedLoopStart.sourceIndex);
        }

        return jumpTargets;
    }
}
