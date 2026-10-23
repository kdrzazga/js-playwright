const ACCUMULATOR_OPERAND = -1;

class AddressingMode {
    constructor(name, operandByteCount, resolveOperandAddress, formatOperand) {
        this.name = name;
        this.operandByteCount = operandByteCount;
        this.resolveOperandAddress = resolveOperandAddress;
        this.formatOperand = formatOperand;
    }

    get isRelative() {
        return this.name === 'relative';
    }
}

class AddressingModes {
    constructor() {
        const hexByte = NumberFormat.hexByte;
        const hexWord = NumberFormat.hexWord;

        this.implied = new AddressingMode('implied', 0,
            () => null,
            () => '');

        this.accumulator = new AddressingMode('accumulator', 0,
            () => ACCUMULATOR_OPERAND,
            () => 'A');

        this.immediate = new AddressingMode('immediate', 1,
            cpu => {
                const operandAddress = cpu.programCounter;
                cpu.programCounter = (cpu.programCounter + 1) & 0xFFFF;
                return operandAddress;
            },
            value => '#' + hexByte(value));

        this.zeroPage = new AddressingMode('zeroPage', 1,
            cpu => cpu.fetchByte(),
            value => hexByte(value));

        this.zeroPageX = new AddressingMode('zeroPageX', 1,
            cpu => (cpu.fetchByte() + cpu.x) & 0xFF,
            value => hexByte(value) + ',X');

        this.zeroPageY = new AddressingMode('zeroPageY', 1,
            cpu => (cpu.fetchByte() + cpu.y) & 0xFF,
            value => hexByte(value) + ',Y');

        this.absolute = new AddressingMode('absolute', 2,
            cpu => cpu.fetchWord(),
            value => hexWord(value));

        this.absoluteX = new AddressingMode('absoluteX', 2,
            cpu => cpu.indexAddress(cpu.fetchWord(), cpu.x),
            value => hexWord(value) + ',X');

        this.absoluteY = new AddressingMode('absoluteY', 2,
            cpu => cpu.indexAddress(cpu.fetchWord(), cpu.y),
            value => hexWord(value) + ',Y');

        this.indirect = new AddressingMode('indirect', 2,
            cpu => {
                const pointer = cpu.fetchWord();
                const pointerOfHighByte = (pointer & 0xFF00) | ((pointer + 1) & 0x00FF);
                return cpu.bus.read(pointer) | (cpu.bus.read(pointerOfHighByte) << 8);
            },
            value => '(' + hexWord(value) + ')');

        this.indexedIndirect = new AddressingMode('indexedIndirect', 1,
            cpu => cpu.readZeroPageWord((cpu.fetchByte() + cpu.x) & 0xFF),
            value => '(' + hexByte(value) + ',X)');

        this.indirectIndexed = new AddressingMode('indirectIndexed', 1,
            cpu => cpu.indexAddress(cpu.readZeroPageWord(cpu.fetchByte()), cpu.y),
            value => '(' + hexByte(value) + '),Y');

        this.relative = new AddressingMode('relative', 1,
            cpu => {
                const offset = cpu.fetchByte();
                return (cpu.programCounter + AddressingModes.toSignedByte(offset)) & 0xFFFF;
            },
            (value, instructionAddress) => hexWord((instructionAddress + 2 + AddressingModes.toSignedByte(value)) & 0xFFFF));
    }

    static toSignedByte(value) {
        return value < 0x80 ? value : value - 0x100;
    }

    byName(name) {
        const addressingMode = this[name];
        if (!(addressingMode instanceof AddressingMode)) {
            throw new Error(`Unknown addressing mode "${name}"`);
        }
        return addressingMode;
    }
}
