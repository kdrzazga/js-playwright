class BrainfuckError extends Error {
    constructor(message, sourceIndex) {
        super(`${message} (at source position ${sourceIndex})`);
        this.name = this.constructor.name;
        this.sourceIndex = sourceIndex;
    }
}

class BrainfuckSyntaxError extends BrainfuckError {}

class BrainfuckRuntimeError extends BrainfuckError {}

class TapeBoundaryError extends Error {}
