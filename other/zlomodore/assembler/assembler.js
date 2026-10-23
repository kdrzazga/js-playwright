class AssembledStatement {
    constructor(address, bytes, sourceText) {
        this.address = address;
        this.bytes = bytes;
        this.sourceText = sourceText;
    }

    get nextAddress() {
        return (this.address + this.bytes.length) & 0xFFFF;
    }
}

class AssemblyResult {
    constructor(statements, nextAddress) {
        this.statements = statements;
        this.nextAddress = nextAddress;
    }
}

class Assembler {
    constructor(
        opcodeTable,
        operandParser = new OperandParser(),
        numberParser = new NumberParser(),
        statementSeparator = ':',
        candidateModesBySyntax = {
            implied: ['implied', 'accumulator'],
            accumulator: ['accumulator'],
            immediate: ['immediate'],
            direct: ['relative', 'zeroPage', 'absolute'],
            indexedX: ['zeroPageX', 'absoluteX'],
            indexedY: ['zeroPageY', 'absoluteY'],
            indirect: ['indirect'],
            indexedIndirect: ['indexedIndirect'],
            indirectIndexed: ['indirectIndexed'],
        }
    ) {
        this.opcodeTable = opcodeTable;
        this.operandParser = operandParser;
        this.numberParser = numberParser;
        this.statementSeparator = statementSeparator;
        this.candidateModesBySyntax = candidateModesBySyntax;
    }

    assembleLines(sourceLines, startAddress) {
        const statements = [];
        let currentAddress = startAddress;
        sourceLines.forEach(sourceLine => {
            const lineResult = this.assembleLine(sourceLine, currentAddress);
            statements.push(...lineResult.statements);
            currentAddress = lineResult.nextAddress;
        });
        return new AssemblyResult(statements, currentAddress);
    }

    assembleLine(sourceLine, startAddress) {
        const statements = [];
        let currentAddress = startAddress;
        sourceLine.split(this.statementSeparator)
            .map(statementText => statementText.trim())
            .filter(statementText => statementText !== '')
            .forEach(statementText => {
                const statement = this.assembleStatement(statementText, currentAddress);
                statements.push(statement);
                currentAddress = statement.nextAddress;
            });
        return new AssemblyResult(statements, currentAddress);
    }

    assembleStatement(statementText, address) {
        const upperCaseText = statementText.toUpperCase();
        const originMatch = upperCaseText.match(/^\*\s*=\s*(.+)$/);
        if (originMatch) {
            return new AssembledStatement(this.numberParser.parse(originMatch[1]), [], statementText);
        }
        const byteDirectiveMatch = upperCaseText.match(/^\.BYTE\s+(.+)$/);
        if (byteDirectiveMatch) {
            return new AssembledStatement(address, this.parseByteList(byteDirectiveMatch[1]), statementText);
        }
        return new AssembledStatement(address, this.assembleInstruction(upperCaseText, address), statementText);
    }

    parseByteList(byteListText) {
        return byteListText.split(',').map(valueText => {
            const value = this.numberParser.parse(valueText);
            if (value > 0xFF) {
                throw new AssemblyError(`?ILLEGAL QUANTITY ERROR: ${valueText.trim()} does not fit in a byte`);
            }
            return value;
        });
    }

    assembleInstruction(instructionText, address) {
        const instructionMatch = instructionText.match(/^([A-Z]{3})(?:\s+(.*))?$/);
        if (!instructionMatch) {
            throw new AssemblyError(`?SYNTAX ERROR: "${instructionText}"`);
        }
        const mnemonic = instructionMatch[1];
        if (!this.opcodeTable.isKnownMnemonic(mnemonic)) {
            throw new AssemblyError(`?SYNTAX ERROR: unknown mnemonic "${mnemonic}"`);
        }
        const parsedOperand = this.operandParser.parse(instructionMatch[2] ?? '');
        return this.encodeInstruction(mnemonic, parsedOperand, address);
    }

    encodeInstruction(mnemonic, parsedOperand, address) {
        const candidateModeNames = this.candidateModesBySyntax[parsedOperand.syntax];
        let lastRangeError = null;
        for (const modeName of candidateModeNames) {
            const entry = this.opcodeTable.entryForMnemonicAndMode(mnemonic, modeName);
            if (!entry) {
                continue;
            }
            try {
                return [entry.opcode, ...this.encodeOperandBytes(entry, parsedOperand.value, address)];
            } catch (error) {
                if (!(error instanceof AssemblyError)) {
                    throw error;
                }
                lastRangeError = error;
            }
        }
        throw lastRangeError ?? new AssemblyError(`?SYNTAX ERROR: ${mnemonic} does not support this addressing mode`);
    }

    encodeOperandBytes(entry, value, address) {
        const addressingMode = entry.addressingMode;
        if (addressingMode.isRelative) {
            return [this.relativeBranchOffset(value, address)];
        }
        if (addressingMode.operandByteCount === 1) {
            if (value > 0xFF) {
                throw new AssemblyError(`?ILLEGAL QUANTITY ERROR: ${NumberFormat.hexWord(value)} does not fit in a byte`);
            }
            return [value];
        }
        if (addressingMode.operandByteCount === 2) {
            return [value & 0xFF, value >> 8];
        }
        return [];
    }

    relativeBranchOffset(targetAddress, instructionAddress) {
        const offset = targetAddress - ((instructionAddress + 2) & 0xFFFF);
        if (offset < -128 || offset > 127) {
            throw new AssemblyError(`?BRANCH OUT OF RANGE: ${NumberFormat.hexWord(targetAddress)} is ${offset} bytes away (allowed -128..127)`);
        }
        return offset & 0xFF;
    }
}
