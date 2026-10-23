const VicRegister = Object.freeze({
    SPRITE_X_MSB: 0x10,
    CONTROL_1: 0x11,
    RASTER: 0x12,
    LIGHT_PEN_X: 0x13,
    LIGHT_PEN_Y: 0x14,
    SPRITE_ENABLE: 0x15,
    CONTROL_2: 0x16,
    SPRITE_EXPAND_Y: 0x17,
    MEMORY_POINTERS: 0x18,
    INTERRUPT_LATCH: 0x19,
    INTERRUPT_ENABLE: 0x1A,
    SPRITE_BACKGROUND_PRIORITY: 0x1B,
    SPRITE_MULTICOLOR: 0x1C,
    SPRITE_EXPAND_X: 0x1D,
    SPRITE_SPRITE_COLLISION: 0x1E,
    SPRITE_BACKGROUND_COLLISION: 0x1F,
    BORDER_COLOR: 0x20,
    BACKGROUND_COLOR_0: 0x21,
    BACKGROUND_COLOR_1: 0x22,
    BACKGROUND_COLOR_2: 0x23,
    BACKGROUND_COLOR_3: 0x24,
    SPRITE_MULTICOLOR_0: 0x25,
    SPRITE_MULTICOLOR_1: 0x26,
    SPRITE_0_COLOR: 0x27,
});

class VicRegisterDescription {
    constructor(offset, name, description) {
        this.offset = offset;
        this.name = name;
        this.description = description;
    }
}

class VicRegisterCatalog {
    constructor(spriteCount = 8) {
        this.descriptions = [];
        for (let spriteIndex = 0; spriteIndex < spriteCount; spriteIndex++) {
            this.descriptions.push(new VicRegisterDescription(spriteIndex * 2, `SP${spriteIndex}X`, `Sprite ${spriteIndex} X (low 8 bits)`));
            this.descriptions.push(new VicRegisterDescription(spriteIndex * 2 + 1, `SP${spriteIndex}Y`, `Sprite ${spriteIndex} Y`));
        }
        this.descriptions.push(
            new VicRegisterDescription(VicRegister.SPRITE_X_MSB, 'MSIGX', 'Sprites X bit 8'),
            new VicRegisterDescription(VicRegister.CONTROL_1, 'SCROLY', 'Control 1: raster bit 8, display on, rows, y-scroll'),
            new VicRegisterDescription(VicRegister.RASTER, 'RASTER', 'Raster line (write: compare)'),
            new VicRegisterDescription(VicRegister.LIGHT_PEN_X, 'LPENX', 'Light pen X'),
            new VicRegisterDescription(VicRegister.LIGHT_PEN_Y, 'LPENY', 'Light pen Y'),
            new VicRegisterDescription(VicRegister.SPRITE_ENABLE, 'SPENA', 'Sprite enable'),
            new VicRegisterDescription(VicRegister.CONTROL_2, 'SCROLX', 'Control 2: multicolor, columns, x-scroll'),
            new VicRegisterDescription(VicRegister.SPRITE_EXPAND_Y, 'YXPAND', 'Sprite double height'),
            new VicRegisterDescription(VicRegister.MEMORY_POINTERS, 'VMCSB', 'Memory pointers (bit 1: lowercase set)'),
            new VicRegisterDescription(VicRegister.INTERRUPT_LATCH, 'VICIRQ', 'Interrupt latch'),
            new VicRegisterDescription(VicRegister.INTERRUPT_ENABLE, 'IRQMSK', 'Interrupt enable'),
            new VicRegisterDescription(VicRegister.SPRITE_BACKGROUND_PRIORITY, 'SPBGPR', 'Sprite behind background'),
            new VicRegisterDescription(VicRegister.SPRITE_MULTICOLOR, 'SPMC', 'Sprite multicolor mode'),
            new VicRegisterDescription(VicRegister.SPRITE_EXPAND_X, 'XXPAND', 'Sprite double width'),
            new VicRegisterDescription(VicRegister.SPRITE_SPRITE_COLLISION, 'SPSPCL', 'Sprite-sprite collision'),
            new VicRegisterDescription(VicRegister.SPRITE_BACKGROUND_COLLISION, 'SPBGCL', 'Sprite-background collision'),
            new VicRegisterDescription(VicRegister.BORDER_COLOR, 'EXTCOL', 'Border color'),
            new VicRegisterDescription(VicRegister.BACKGROUND_COLOR_0, 'BGCOL0', 'Background color 0'),
            new VicRegisterDescription(VicRegister.BACKGROUND_COLOR_1, 'BGCOL1', 'Background color 1'),
            new VicRegisterDescription(VicRegister.BACKGROUND_COLOR_2, 'BGCOL2', 'Background color 2'),
            new VicRegisterDescription(VicRegister.BACKGROUND_COLOR_3, 'BGCOL3', 'Background color 3'),
            new VicRegisterDescription(VicRegister.SPRITE_MULTICOLOR_0, 'SPMC0', 'Sprite multicolor 0'),
            new VicRegisterDescription(VicRegister.SPRITE_MULTICOLOR_1, 'SPMC1', 'Sprite multicolor 1')
        );
        for (let spriteIndex = 0; spriteIndex < spriteCount; spriteIndex++) {
            this.descriptions.push(new VicRegisterDescription(VicRegister.SPRITE_0_COLOR + spriteIndex, `SP${spriteIndex}COL`, `Sprite ${spriteIndex} color`));
        }
    }
}

class Vic {
    constructor({
        registerCount = 0x2F,
        registerMirrorSize = 0x40,
        cyclesPerLine = 63,
        linesPerFrame = 312,
        spriteCount = 8,
    } = {}) {
        this.registerCount = registerCount;
        this.registerMirrorSize = registerMirrorSize;
        this.cyclesPerLine = cyclesPerLine;
        this.linesPerFrame = linesPerFrame;
        this.spriteCount = spriteCount;
        this.registers = new Uint8Array(registerCount);
        this.lineRenderer = null;
        this.colorRegisterOffsets = new Set(Array.from({ length: registerCount - VicRegister.BORDER_COLOR }, (_, index) => VicRegister.BORDER_COLOR + index));
        this.reset();
    }

    get cyclesPerFrame() {
        return this.cyclesPerLine * this.linesPerFrame;
    }

    attachLineRenderer(lineRenderer) {
        this.lineRenderer = lineRenderer;
    }

    reset() {
        this.registers.fill(0);
        this.rasterLine = 0;
        this.cycleInLine = 0;
        this.rasterCompareLine = 0;
        this.interruptLatch = 0;
        this.spriteSpriteCollisions = 0;
        this.spriteBackgroundCollisions = 0;
        this.completedFrameCount = 0;
    }

    peekRegister(offset) {
        const register = offset % this.registerMirrorSize;
        if (register >= this.registerCount) {
            return 0xFF;
        }
        return this.storedRegisterValue(register) | this.unusedBitsReadingAsOne(register);
    }

    storedRegisterValue(register) {
        switch (register) {
            case VicRegister.CONTROL_1:
                return (this.registers[register] & 0x7F) | ((this.rasterLine & 0x100) >> 1);
            case VicRegister.RASTER:
                return this.rasterLine & 0xFF;
            case VicRegister.INTERRUPT_LATCH:
                return this.interruptLatch | (this.hasPendingInterrupt ? 0x80 : 0);
            case VicRegister.SPRITE_SPRITE_COLLISION:
                return this.spriteSpriteCollisions;
            case VicRegister.SPRITE_BACKGROUND_COLLISION:
                return this.spriteBackgroundCollisions;
            default:
                return this.registers[register];
        }
    }

    unusedBitsReadingAsOne(register) {
        switch (register) {
            case VicRegister.CONTROL_2:
                return 0xC0;
            case VicRegister.MEMORY_POINTERS:
                return 0x01;
            case VicRegister.INTERRUPT_LATCH:
                return 0x70;
            case VicRegister.INTERRUPT_ENABLE:
                return 0xF0;
            default:
                return this.colorRegisterOffsets.has(register) ? 0xF0 : 0x00;
        }
    }

    readRegister(offset) {
        const value = this.peekRegister(offset);
        const register = offset % this.registerMirrorSize;
        if (register === VicRegister.SPRITE_SPRITE_COLLISION) {
            this.spriteSpriteCollisions = 0;
        } else if (register === VicRegister.SPRITE_BACKGROUND_COLLISION) {
            this.spriteBackgroundCollisions = 0;
        }
        return value;
    }

    writeRegister(offset, value) {
        const register = offset % this.registerMirrorSize;
        if (register >= this.registerCount) {
            return;
        }
        switch (register) {
            case VicRegister.CONTROL_1:
                this.registers[register] = value;
                this.rasterCompareLine = (this.rasterCompareLine & 0xFF) | ((value & 0x80) << 1);
                break;
            case VicRegister.RASTER:
                this.rasterCompareLine = (this.rasterCompareLine & 0x100) | value;
                break;
            case VicRegister.INTERRUPT_LATCH:
                this.interruptLatch &= ~value & 0x0F;
                break;
            case VicRegister.SPRITE_SPRITE_COLLISION:
            case VicRegister.SPRITE_BACKGROUND_COLLISION:
                break;
            default:
                this.registers[register] = value;
        }
    }

    advance(cycles) {
        this.cycleInLine += cycles;
        while (this.cycleInLine >= this.cyclesPerLine) {
            this.cycleInLine -= this.cyclesPerLine;
            this.lineRenderer?.renderLine(this.rasterLine);
            this.moveToNextRasterLine();
        }
    }

    moveToNextRasterLine() {
        this.rasterLine++;
        if (this.rasterLine >= this.linesPerFrame) {
            this.rasterLine = 0;
            this.completedFrameCount++;
        }
        if (this.rasterLine === this.rasterCompareLine) {
            this.interruptLatch |= 0x01;
        }
    }

    get hasPendingInterrupt() {
        return (this.interruptLatch & this.registers[VicRegister.INTERRUPT_ENABLE] & 0x0F) !== 0;
    }

    recordCollisions(spriteSpriteMask, spriteBackgroundMask) {
        if (spriteBackgroundMask !== 0 && this.spriteBackgroundCollisions === 0) {
            this.interruptLatch |= 0x02;
        }
        if (spriteSpriteMask !== 0 && this.spriteSpriteCollisions === 0) {
            this.interruptLatch |= 0x04;
        }
        this.spriteSpriteCollisions |= spriteSpriteMask;
        this.spriteBackgroundCollisions |= spriteBackgroundMask;
    }

    isRegisterBitSet(register, bitIndex) {
        return ((this.registers[register] >> bitIndex) & 1) === 1;
    }

    get borderColor() {
        return this.registers[VicRegister.BORDER_COLOR] & 0x0F;
    }

    get backgroundColor() {
        return this.registers[VicRegister.BACKGROUND_COLOR_0] & 0x0F;
    }

    get isDisplayEnabled() {
        return this.isRegisterBitSet(VicRegister.CONTROL_1, 4);
    }

    get characterSetIndex() {
        return this.isRegisterBitSet(VicRegister.MEMORY_POINTERS, 1) ? 1 : 0;
    }

    get spriteMulticolor0() {
        return this.registers[VicRegister.SPRITE_MULTICOLOR_0] & 0x0F;
    }

    get spriteMulticolor1() {
        return this.registers[VicRegister.SPRITE_MULTICOLOR_1] & 0x0F;
    }

    spriteX(spriteIndex) {
        const highBit = this.isRegisterBitSet(VicRegister.SPRITE_X_MSB, spriteIndex) ? 0x100 : 0;
        return this.registers[spriteIndex * 2] | highBit;
    }

    spriteY(spriteIndex) {
        return this.registers[spriteIndex * 2 + 1];
    }

    spriteColor(spriteIndex) {
        return this.registers[VicRegister.SPRITE_0_COLOR + spriteIndex] & 0x0F;
    }

    isSpriteEnabled(spriteIndex) {
        return this.isRegisterBitSet(VicRegister.SPRITE_ENABLE, spriteIndex);
    }

    isSpriteExpandedX(spriteIndex) {
        return this.isRegisterBitSet(VicRegister.SPRITE_EXPAND_X, spriteIndex);
    }

    isSpriteExpandedY(spriteIndex) {
        return this.isRegisterBitSet(VicRegister.SPRITE_EXPAND_Y, spriteIndex);
    }

    isSpriteMulticolor(spriteIndex) {
        return this.isRegisterBitSet(VicRegister.SPRITE_MULTICOLOR, spriteIndex);
    }

    isSpriteBehindBackground(spriteIndex) {
        return this.isRegisterBitSet(VicRegister.SPRITE_BACKGROUND_PRIORITY, spriteIndex);
    }
}
