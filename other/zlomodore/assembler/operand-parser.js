class AssemblyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssemblyError';
    }
}

class NumberParser {
    parse(text) {
        const trimmedText = text.trim();
        const parsedValue = this.parseByPrefix(trimmedText);
        if (Number.isNaN(parsedValue)) {
            throw new AssemblyError(`?SYNTAX ERROR: "${text}" is not a number`);
        }
        if (parsedValue < 0 || parsedValue > 0xFFFF) {
            throw new AssemblyError(`?ILLEGAL QUANTITY ERROR: ${text} is out of range 0-65535`);
        }
        return parsedValue;
    }

    parseByPrefix(text) {
        if (/^\$[0-9A-F]+$/i.test(text)) {
            return parseInt(text.slice(1), 16);
        }
        if (/^%[01]+$/.test(text)) {
            return parseInt(text.slice(1), 2);
        }
        if (/^[0-9]+$/.test(text)) {
            return parseInt(text, 10);
        }
        return NaN;
    }
}

class ParsedOperand {
    constructor(syntax, value) {
        this.syntax = syntax;
        this.value = value;
    }
}

class OperandParser {
    constructor(numberParser = new NumberParser()) {
        this.numberParser = numberParser;
        this.syntaxPatterns = [
            ['immediate', /^#(.+)$/],
            ['indexedIndirect', /^\((.+),X\)$/],
            ['indirectIndexed', /^\((.+)\),Y$/],
            ['indirect', /^\((.+)\)$/],
            ['indexedX', /^(.+),X$/],
            ['indexedY', /^(.+),Y$/],
            ['direct', /^(.+)$/],
        ];
    }

    parse(operandText) {
        const normalizedText = operandText.replace(/\s+/g, '').toUpperCase();
        if (normalizedText === '') {
            return new ParsedOperand('implied', null);
        }
        if (normalizedText === 'A') {
            return new ParsedOperand('accumulator', null);
        }
        for (const [syntax, pattern] of this.syntaxPatterns) {
            const match = normalizedText.match(pattern);
            if (match) {
                return new ParsedOperand(syntax, this.numberParser.parse(match[1]));
            }
        }
        throw new AssemblyError(`?SYNTAX ERROR: cannot parse operand "${operandText}"`);
    }
}
