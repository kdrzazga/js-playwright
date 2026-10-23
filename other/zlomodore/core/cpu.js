class IllegalOpcodeError extends Error {
    constructor(opcode, address) {
        super(`Illegal opcode ${NumberFormat.hexByte(opcode)} at ${NumberFormat.hexWord(address)}`);
        this.name = 'IllegalOpcodeError';
        this.opcode = opcode;
        this.address = address;
    }
}

class Cpu6510 {
    constructor(bus, opcodeTable, stackPageAddress = 0x0100, resetVectorAddress = 0xFFFC, interruptVectorAddress = 0xFFFE) {
        this.bus = bus;
        this.opcodeTable = opcodeTable;
        this.stackPageAddress = stackPageAddress;
        this.resetVectorAddress = resetVectorAddress;
        this.interruptVectorAddress = interruptVectorAddress;
        this.flags = new StatusFlags();
        this.instructionHandlers = this.createInstructionHandlers();
        this.reset();
    }

    reset() {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.stackPointer = 0xFD;
        this.flags.reset();
        this.programCounter = this.bus.readWord(this.resetVectorAddress);
        this.clearExecutionCounters();
    }

    powerOn() {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.stackPointer = 0xFF;
        this.flags.clear();
        this.programCounter = 0;
        this.clearExecutionCounters();
    }

    clearExecutionCounters() {
        this.totalCycles = 0;
        this.operandAddress = null;
        this.isPageCrossed = false;
        this.extraCycles = 0;
    }

    step() {
        const instructionAddress = this.programCounter;
        const entry = this.opcodeTable.entryForOpcode(this.bus.read(instructionAddress));
        if (!entry) {
            throw new IllegalOpcodeError(this.bus.read(instructionAddress), instructionAddress);
        }
        this.programCounter = (instructionAddress + 1) & 0xFFFF;
        this.isPageCrossed = false;
        this.extraCycles = 0;
        this.operandAddress = entry.addressingMode.resolveOperandAddress(this);
        this.instructionHandlers.get(entry.mnemonic)();

        const pageCrossPenalty = entry.addsCycleOnPageCross && this.isPageCrossed ? 1 : 0;
        const cycles = entry.cycles + pageCrossPenalty + this.extraCycles;
        this.totalCycles += cycles;
        return cycles;
    }

    get statusRegister() {
        return this.flags.toByte(false);
    }

    fetchByte() {
        const value = this.bus.read(this.programCounter);
        this.programCounter = (this.programCounter + 1) & 0xFFFF;
        return value;
    }

    fetchWord() {
        const lowByte = this.fetchByte();
        return lowByte | (this.fetchByte() << 8);
    }

    readZeroPageWord(zeroPageAddress) {
        return this.bus.read(zeroPageAddress) | (this.bus.read((zeroPageAddress + 1) & 0xFF) << 8);
    }

    indexAddress(baseAddress, index) {
        const indexedAddress = (baseAddress + index) & 0xFFFF;
        this.isPageCrossed = (baseAddress & 0xFF00) !== (indexedAddress & 0xFF00);
        return indexedAddress;
    }

    readOperand() {
        return this.operandAddress === ACCUMULATOR_OPERAND ? this.a : this.bus.read(this.operandAddress);
    }

    writeOperand(value) {
        if (this.operandAddress === ACCUMULATOR_OPERAND) {
            this.a = value & 0xFF;
        } else {
            this.bus.write(this.operandAddress, value);
        }
    }

    withZeroAndNegative(value) {
        const byteValue = value & 0xFF;
        this.flags.updateZeroAndNegative(byteValue);
        return byteValue;
    }

    push(value) {
        this.bus.write(this.stackPageAddress + this.stackPointer, value);
        this.stackPointer = (this.stackPointer - 1) & 0xFF;
    }

    pull() {
        this.stackPointer = (this.stackPointer + 1) & 0xFF;
        return this.bus.read(this.stackPageAddress + this.stackPointer);
    }

    pushWord(value) {
        this.push((value >> 8) & 0xFF);
        this.push(value & 0xFF);
    }

    pullWord() {
        const lowByte = this.pull();
        return lowByte | (this.pull() << 8);
    }

    createInstructionHandlers() {
        return new Map([
            ['LDA', () => { this.a = this.withZeroAndNegative(this.readOperand()); }],
            ['LDX', () => { this.x = this.withZeroAndNegative(this.readOperand()); }],
            ['LDY', () => { this.y = this.withZeroAndNegative(this.readOperand()); }],
            ['STA', () => this.writeOperand(this.a)],
            ['STX', () => this.writeOperand(this.x)],
            ['STY', () => this.writeOperand(this.y)],

            ['TAX', () => { this.x = this.withZeroAndNegative(this.a); }],
            ['TAY', () => { this.y = this.withZeroAndNegative(this.a); }],
            ['TXA', () => { this.a = this.withZeroAndNegative(this.x); }],
            ['TYA', () => { this.a = this.withZeroAndNegative(this.y); }],
            ['TSX', () => { this.x = this.withZeroAndNegative(this.stackPointer); }],
            ['TXS', () => { this.stackPointer = this.x; }],

            ['PHA', () => this.push(this.a)],
            ['PHP', () => this.push(this.flags.toByte(true))],
            ['PLA', () => { this.a = this.withZeroAndNegative(this.pull()); }],
            ['PLP', () => this.flags.loadFromByte(this.pull())],

            ['AND', () => { this.a = this.withZeroAndNegative(this.a & this.readOperand()); }],
            ['ORA', () => { this.a = this.withZeroAndNegative(this.a | this.readOperand()); }],
            ['EOR', () => { this.a = this.withZeroAndNegative(this.a ^ this.readOperand()); }],
            ['BIT', () => this.testBitsAgainstAccumulator(this.readOperand())],

            ['ADC', () => this.addWithCarry(this.readOperand())],
            ['SBC', () => this.subtractWithBorrow(this.readOperand())],
            ['CMP', () => this.compare(this.a, this.readOperand())],
            ['CPX', () => this.compare(this.x, this.readOperand())],
            ['CPY', () => this.compare(this.y, this.readOperand())],

            ['INC', () => this.writeOperand(this.withZeroAndNegative(this.readOperand() + 1))],
            ['DEC', () => this.writeOperand(this.withZeroAndNegative(this.readOperand() - 1))],
            ['INX', () => { this.x = this.withZeroAndNegative(this.x + 1); }],
            ['INY', () => { this.y = this.withZeroAndNegative(this.y + 1); }],
            ['DEX', () => { this.x = this.withZeroAndNegative(this.x - 1); }],
            ['DEY', () => { this.y = this.withZeroAndNegative(this.y - 1); }],

            ['ASL', () => this.shiftLeft(false)],
            ['ROL', () => this.shiftLeft(true)],
            ['LSR', () => this.shiftRight(false)],
            ['ROR', () => this.shiftRight(true)],

            ['JMP', () => { this.programCounter = this.operandAddress; }],
            ['JSR', () => this.jumpToSubroutine()],
            ['RTS', () => this.returnFromSubroutine()],

            ['BCC', () => this.branchIf(!this.flags.carry)],
            ['BCS', () => this.branchIf(this.flags.carry)],
            ['BEQ', () => this.branchIf(this.flags.zero)],
            ['BNE', () => this.branchIf(!this.flags.zero)],
            ['BMI', () => this.branchIf(this.flags.negative)],
            ['BPL', () => this.branchIf(!this.flags.negative)],
            ['BVC', () => this.branchIf(!this.flags.overflow)],
            ['BVS', () => this.branchIf(this.flags.overflow)],

            ['CLC', () => { this.flags.carry = false; }],
            ['SEC', () => { this.flags.carry = true; }],
            ['CLD', () => { this.flags.decimal = false; }],
            ['SED', () => { this.flags.decimal = true; }],
            ['CLI', () => { this.flags.interruptDisable = false; }],
            ['SEI', () => { this.flags.interruptDisable = true; }],
            ['CLV', () => { this.flags.overflow = false; }],

            ['BRK', () => this.forceBreak()],
            ['NOP', () => {}],
            ['RTI', () => this.returnFromInterrupt()],
        ]);
    }

    testBitsAgainstAccumulator(value) {
        this.flags.zero = (this.a & value) === 0;
        this.flags.negative = (value & 0x80) !== 0;
        this.flags.overflow = (value & 0x40) !== 0;
    }

    addWithCarry(value) {
        if (this.flags.decimal) {
            this.addWithCarryDecimal(value);
        } else {
            this.addWithCarryBinary(value);
        }
    }

    addWithCarryBinary(value) {
        const carryIn = this.flags.carry ? 1 : 0;
        const sum = this.a + value + carryIn;
        this.flags.overflow = ((~(this.a ^ value)) & (this.a ^ sum) & 0x80) !== 0;
        this.flags.carry = sum > 0xFF;
        this.a = this.withZeroAndNegative(sum);
    }

    addWithCarryDecimal(value) {
        const carryIn = this.flags.carry ? 1 : 0;
        const binarySum = this.a + value + carryIn;
        let lowNibble = (this.a & 0x0F) + (value & 0x0F) + carryIn;
        if (lowNibble > 9) {
            lowNibble += 6;
        }
        let highNibble = (this.a >> 4) + (value >> 4) + (lowNibble > 0x0F ? 1 : 0);
        this.flags.zero = (binarySum & 0xFF) === 0;
        this.flags.negative = (highNibble & 0x08) !== 0;
        this.flags.overflow = ((~(this.a ^ value)) & (this.a ^ (highNibble << 4)) & 0x80) !== 0;
        if (highNibble > 9) {
            highNibble += 6;
        }
        this.flags.carry = highNibble > 0x0F;
        this.a = ((highNibble << 4) | (lowNibble & 0x0F)) & 0xFF;
    }

    subtractWithBorrow(value) {
        if (!this.flags.decimal) {
            this.addWithCarryBinary(value ^ 0xFF);
            return;
        }
        const borrowIn = this.flags.carry ? 0 : 1;
        const originalAccumulator = this.a;
        this.addWithCarryBinary(value ^ 0xFF);
        let lowNibble = (originalAccumulator & 0x0F) - (value & 0x0F) - borrowIn;
        let highNibble = (originalAccumulator >> 4) - (value >> 4);
        if (lowNibble & 0x10) {
            lowNibble -= 6;
            highNibble--;
        }
        if (highNibble & 0x10) {
            highNibble -= 6;
        }
        this.a = ((highNibble << 4) | (lowNibble & 0x0F)) & 0xFF;
    }

    compare(registerValue, value) {
        this.flags.carry = registerValue >= value;
        this.flags.updateZeroAndNegative((registerValue - value) & 0xFF);
    }

    shiftLeft(isRotatingCarryIn) {
        const value = this.readOperand();
        const carryIn = isRotatingCarryIn && this.flags.carry ? 1 : 0;
        this.flags.carry = (value & 0x80) !== 0;
        this.writeOperand(this.withZeroAndNegative((value << 1) | carryIn));
    }

    shiftRight(isRotatingCarryIn) {
        const value = this.readOperand();
        const carryIn = isRotatingCarryIn && this.flags.carry ? 0x80 : 0;
        this.flags.carry = (value & 0x01) !== 0;
        this.writeOperand(this.withZeroAndNegative((value >> 1) | carryIn));
    }

    jumpToSubroutine() {
        this.pushWord((this.programCounter - 1) & 0xFFFF);
        this.programCounter = this.operandAddress;
    }

    returnFromSubroutine() {
        this.programCounter = (this.pullWord() + 1) & 0xFFFF;
    }

    addCycles(cycles) {
        this.totalCycles += cycles;
    }

    branchIf(condition) {
        if (!condition) {
            return;
        }
        const crossesPage = (this.programCounter & 0xFF00) !== (this.operandAddress & 0xFF00);
        this.extraCycles = crossesPage ? 2 : 1;
        this.programCounter = this.operandAddress;
    }

    forceBreak() {
        this.pushWord((this.programCounter + 1) & 0xFFFF);
        this.push(this.flags.toByte(true));
        this.flags.interruptDisable = true;
        this.programCounter = this.bus.readWord(this.interruptVectorAddress);
    }

    returnFromInterrupt() {
        this.flags.loadFromByte(this.pull());
        this.programCounter = this.pullWord();
    }
}
