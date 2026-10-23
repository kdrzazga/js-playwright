class OpcodeEntry {
    constructor(opcode, mnemonic, addressingMode, cycles, addsCycleOnPageCross) {
        this.opcode = opcode;
        this.mnemonic = mnemonic;
        this.addressingMode = addressingMode;
        this.cycles = cycles;
        this.addsCycleOnPageCross = addsCycleOnPageCross;
    }

    get byteCount() {
        return 1 + this.addressingMode.operandByteCount;
    }
}

class OpcodeTable {
    constructor(
        addressingModes,
        definitions = OpcodeTable.officialInstructionDefinitions(),
        pageCrossPenaltyMnemonics = ['ADC', 'AND', 'CMP', 'EOR', 'LDA', 'LDX', 'LDY', 'ORA', 'SBC'],
        pageCrossPenaltyModes = ['absoluteX', 'absoluteY', 'indirectIndexed']
    ) {
        this.entriesByOpcode = new Array(256).fill(null);
        this.entriesByMnemonic = new Map();

        definitions.forEach(([mnemonic, opcodesByMode]) => {
            const entriesByMode = new Map();
            Object.entries(opcodesByMode).forEach(([modeName, [opcode, cycles]]) => {
                const addsCycleOnPageCross = pageCrossPenaltyMnemonics.includes(mnemonic) && pageCrossPenaltyModes.includes(modeName);
                const entry = new OpcodeEntry(opcode, mnemonic, addressingModes.byName(modeName), cycles, addsCycleOnPageCross);
                this.entriesByOpcode[opcode] = entry;
                entriesByMode.set(modeName, entry);
            });
            this.entriesByMnemonic.set(mnemonic, entriesByMode);
        });
    }

    entryForOpcode(opcode) {
        return this.entriesByOpcode[opcode];
    }

    entryForMnemonicAndMode(mnemonic, modeName) {
        return this.entriesByMnemonic.get(mnemonic)?.get(modeName) ?? null;
    }

    isKnownMnemonic(mnemonic) {
        return this.entriesByMnemonic.has(mnemonic);
    }

    get opcodeCount() {
        return this.entriesByOpcode.filter(entry => entry !== null).length;
    }

    static officialInstructionDefinitions() {
        return [
            ['ADC', { immediate: [0x69, 2], zeroPage: [0x65, 3], zeroPageX: [0x75, 4], absolute: [0x6D, 4], absoluteX: [0x7D, 4], absoluteY: [0x79, 4], indexedIndirect: [0x61, 6], indirectIndexed: [0x71, 5] }],
            ['AND', { immediate: [0x29, 2], zeroPage: [0x25, 3], zeroPageX: [0x35, 4], absolute: [0x2D, 4], absoluteX: [0x3D, 4], absoluteY: [0x39, 4], indexedIndirect: [0x21, 6], indirectIndexed: [0x31, 5] }],
            ['ASL', { accumulator: [0x0A, 2], zeroPage: [0x06, 5], zeroPageX: [0x16, 6], absolute: [0x0E, 6], absoluteX: [0x1E, 7] }],
            ['BCC', { relative: [0x90, 2] }],
            ['BCS', { relative: [0xB0, 2] }],
            ['BEQ', { relative: [0xF0, 2] }],
            ['BIT', { zeroPage: [0x24, 3], absolute: [0x2C, 4] }],
            ['BMI', { relative: [0x30, 2] }],
            ['BNE', { relative: [0xD0, 2] }],
            ['BPL', { relative: [0x10, 2] }],
            ['BRK', { implied: [0x00, 7] }],
            ['BVC', { relative: [0x50, 2] }],
            ['BVS', { relative: [0x70, 2] }],
            ['CLC', { implied: [0x18, 2] }],
            ['CLD', { implied: [0xD8, 2] }],
            ['CLI', { implied: [0x58, 2] }],
            ['CLV', { implied: [0xB8, 2] }],
            ['CMP', { immediate: [0xC9, 2], zeroPage: [0xC5, 3], zeroPageX: [0xD5, 4], absolute: [0xCD, 4], absoluteX: [0xDD, 4], absoluteY: [0xD9, 4], indexedIndirect: [0xC1, 6], indirectIndexed: [0xD1, 5] }],
            ['CPX', { immediate: [0xE0, 2], zeroPage: [0xE4, 3], absolute: [0xEC, 4] }],
            ['CPY', { immediate: [0xC0, 2], zeroPage: [0xC4, 3], absolute: [0xCC, 4] }],
            ['DEC', { zeroPage: [0xC6, 5], zeroPageX: [0xD6, 6], absolute: [0xCE, 6], absoluteX: [0xDE, 7] }],
            ['DEX', { implied: [0xCA, 2] }],
            ['DEY', { implied: [0x88, 2] }],
            ['EOR', { immediate: [0x49, 2], zeroPage: [0x45, 3], zeroPageX: [0x55, 4], absolute: [0x4D, 4], absoluteX: [0x5D, 4], absoluteY: [0x59, 4], indexedIndirect: [0x41, 6], indirectIndexed: [0x51, 5] }],
            ['INC', { zeroPage: [0xE6, 5], zeroPageX: [0xF6, 6], absolute: [0xEE, 6], absoluteX: [0xFE, 7] }],
            ['INX', { implied: [0xE8, 2] }],
            ['INY', { implied: [0xC8, 2] }],
            ['JMP', { absolute: [0x4C, 3], indirect: [0x6C, 5] }],
            ['JSR', { absolute: [0x20, 6] }],
            ['LDA', { immediate: [0xA9, 2], zeroPage: [0xA5, 3], zeroPageX: [0xB5, 4], absolute: [0xAD, 4], absoluteX: [0xBD, 4], absoluteY: [0xB9, 4], indexedIndirect: [0xA1, 6], indirectIndexed: [0xB1, 5] }],
            ['LDX', { immediate: [0xA2, 2], zeroPage: [0xA6, 3], zeroPageY: [0xB6, 4], absolute: [0xAE, 4], absoluteY: [0xBE, 4] }],
            ['LDY', { immediate: [0xA0, 2], zeroPage: [0xA4, 3], zeroPageX: [0xB4, 4], absolute: [0xAC, 4], absoluteX: [0xBC, 4] }],
            ['LSR', { accumulator: [0x4A, 2], zeroPage: [0x46, 5], zeroPageX: [0x56, 6], absolute: [0x4E, 6], absoluteX: [0x5E, 7] }],
            ['NOP', { implied: [0xEA, 2] }],
            ['ORA', { immediate: [0x09, 2], zeroPage: [0x05, 3], zeroPageX: [0x15, 4], absolute: [0x0D, 4], absoluteX: [0x1D, 4], absoluteY: [0x19, 4], indexedIndirect: [0x01, 6], indirectIndexed: [0x11, 5] }],
            ['PHA', { implied: [0x48, 3] }],
            ['PHP', { implied: [0x08, 3] }],
            ['PLA', { implied: [0x68, 4] }],
            ['PLP', { implied: [0x28, 4] }],
            ['ROL', { accumulator: [0x2A, 2], zeroPage: [0x26, 5], zeroPageX: [0x36, 6], absolute: [0x2E, 6], absoluteX: [0x3E, 7] }],
            ['ROR', { accumulator: [0x6A, 2], zeroPage: [0x66, 5], zeroPageX: [0x76, 6], absolute: [0x6E, 6], absoluteX: [0x7E, 7] }],
            ['RTI', { implied: [0x40, 6] }],
            ['RTS', { implied: [0x60, 6] }],
            ['SBC', { immediate: [0xE9, 2], zeroPage: [0xE5, 3], zeroPageX: [0xF5, 4], absolute: [0xED, 4], absoluteX: [0xFD, 4], absoluteY: [0xF9, 4], indexedIndirect: [0xE1, 6], indirectIndexed: [0xF1, 5] }],
            ['SEC', { implied: [0x38, 2] }],
            ['SED', { implied: [0xF8, 2] }],
            ['SEI', { implied: [0x78, 2] }],
            ['STA', { zeroPage: [0x85, 3], zeroPageX: [0x95, 4], absolute: [0x8D, 4], absoluteX: [0x9D, 5], absoluteY: [0x99, 5], indexedIndirect: [0x81, 6], indirectIndexed: [0x91, 6] }],
            ['STX', { zeroPage: [0x86, 3], zeroPageY: [0x96, 4], absolute: [0x8E, 4] }],
            ['STY', { zeroPage: [0x84, 3], zeroPageX: [0x94, 4], absolute: [0x8C, 4] }],
            ['TAX', { implied: [0xAA, 2] }],
            ['TAY', { implied: [0xA8, 2] }],
            ['TSX', { implied: [0xBA, 2] }],
            ['TXA', { implied: [0x8A, 2] }],
            ['TXS', { implied: [0x9A, 2] }],
            ['TYA', { implied: [0x98, 2] }],
        ];
    }
}
