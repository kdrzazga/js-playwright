class StatusFlags {
    constructor() {
        this.reset();
    }

    reset() {
        this.negative = false;
        this.overflow = false;
        this.decimal = false;
        this.interruptDisable = true;
        this.zero = false;
        this.carry = false;
    }

    clear() {
        this.reset();
        this.interruptDisable = false;
    }

    toByte(isBreakFlagSet) {
        return (this.negative ? 0x80 : 0)
            | (this.overflow ? 0x40 : 0)
            | 0x20
            | (isBreakFlagSet ? 0x10 : 0)
            | (this.decimal ? 0x08 : 0)
            | (this.interruptDisable ? 0x04 : 0)
            | (this.zero ? 0x02 : 0)
            | (this.carry ? 0x01 : 0);
    }

    loadFromByte(value) {
        this.negative = (value & 0x80) !== 0;
        this.overflow = (value & 0x40) !== 0;
        this.decimal = (value & 0x08) !== 0;
        this.interruptDisable = (value & 0x04) !== 0;
        this.zero = (value & 0x02) !== 0;
        this.carry = (value & 0x01) !== 0;
    }

    updateZeroAndNegative(value) {
        this.zero = (value & 0xFF) === 0;
        this.negative = (value & 0x80) !== 0;
    }
}
