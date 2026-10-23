class DisassembledInstruction {
    constructor(address, bytes, text) {
        this.address = address;
        this.bytes = bytes;
        this.text = text;
    }

    get nextAddress() {
        return (this.address + this.bytes.length) & 0xFFFF;
    }

    get hexBytes() {
        return this.bytes.map(byte => NumberFormat.hexDigits(byte, 2)).join(' ');
    }
}

class Disassembler {
    constructor(bus, opcodeTable) {
        this.bus = bus;
        this.opcodeTable = opcodeTable;
    }

    disassembleAt(address) {
        const opcode = this.bus.peek(address);
        const entry = this.opcodeTable.entryForOpcode(opcode);
        if (!entry) {
            return new DisassembledInstruction(address, [opcode], `.BYTE ${NumberFormat.hexByte(opcode)}`);
        }
        const bytes = Array.from({ length: entry.byteCount }, (_, offset) => this.bus.peek((address + offset) & 0xFFFF));
        const operandValue = this.operandValueOf(bytes);
        const operandText = entry.addressingMode.formatOperand(operandValue, address);
        const text = operandText === '' ? entry.mnemonic : `${entry.mnemonic} ${operandText}`;
        return new DisassembledInstruction(address, bytes, text);
    }

    disassembleRange(startAddress, instructionCount) {
        const instructions = [];
        let currentAddress = startAddress;
        for (let index = 0; index < instructionCount; index++) {
            const instruction = this.disassembleAt(currentAddress);
            instructions.push(instruction);
            currentAddress = instruction.nextAddress;
        }
        return instructions;
    }

    operandValueOf(bytes) {
        if (bytes.length === 2) {
            return bytes[1];
        }
        if (bytes.length === 3) {
            return bytes[1] | (bytes[2] << 8);
        }
        return null;
    }
}
