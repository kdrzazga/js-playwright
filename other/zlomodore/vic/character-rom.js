class CharacterRom {
    constructor(bytes, bytesPerCharacter = 8, charactersPerSet = 256) {
        this.bytes = bytes;
        this.bytesPerCharacter = bytesPerCharacter;
        this.charactersPerSet = charactersPerSet;
    }

    get bytesPerSet() {
        return this.bytesPerCharacter * this.charactersPerSet;
    }

    pixelRowOf(characterSetIndex, screenCode, pixelRow) {
        return this.bytes[characterSetIndex * this.bytesPerSet + screenCode * this.bytesPerCharacter + pixelRow];
    }
}

class ScreenCodeConverter {
    toPetscii(screenCode) {
        const baseCode = screenCode & 0x7F;
        if (baseCode < 32) {
            return baseCode + 64;
        }
        if (baseCode < 64) {
            return baseCode;
        }
        if (baseCode < 96) {
            return baseCode + 32;
        }
        return baseCode + 64;
    }

    fromPetscii(petsciiCode) {
        if (petsciiCode >= 32 && petsciiCode <= 63) {
            return petsciiCode;
        }
        if (petsciiCode >= 64 && petsciiCode <= 95) {
            return petsciiCode - 64;
        }
        if (petsciiCode >= 96 && petsciiCode <= 127) {
            return petsciiCode - 32;
        }
        if (petsciiCode >= 160 && petsciiCode <= 191) {
            return petsciiCode - 64;
        }
        if (petsciiCode >= 192 && petsciiCode <= 254) {
            return petsciiCode - 128;
        }
        if (petsciiCode === 255) {
            return 94;
        }
        return 32;
    }

    fromText(character) {
        const upperCaseCode = character.toUpperCase().charCodeAt(0);
        if (upperCaseCode >= 64 && upperCaseCode <= 95) {
            return upperCaseCode - 64;
        }
        if (upperCaseCode >= 32 && upperCaseCode <= 63) {
            return upperCaseCode;
        }
        return 32;
    }
}

class CharacterRomBuilder {
    constructor(
        fontFamily,
        screenCodeConverter = new ScreenCodeConverter(),
        renderScale = 8,
        glyphBaseByCharacterSet = [0xE000, 0xE100],
        baselineFromTopInPixels = 7,
        characterSize = 8
    ) {
        this.fontFamily = fontFamily;
        this.screenCodeConverter = screenCodeConverter;
        this.renderScale = renderScale;
        this.glyphBaseByCharacterSet = glyphBaseByCharacterSet;
        this.baselineFromTopInPixels = baselineFromTopInPixels;
        this.characterSize = characterSize;
    }

    build() {
        const characterRom = new CharacterRom(new Uint8Array(this.glyphBaseByCharacterSet.length * 256 * this.characterSize));
        const renderCanvas = document.createElement('canvas');
        renderCanvas.width = this.characterSize * this.renderScale;
        renderCanvas.height = this.characterSize * this.renderScale;
        const renderContext = renderCanvas.getContext('2d', { willReadFrequently: true });

        this.glyphBaseByCharacterSet.forEach((glyphBase, characterSetIndex) => {
            for (let screenCode = 0; screenCode < 128; screenCode++) {
                const glyph = String.fromCharCode(glyphBase + this.screenCodeConverter.toPetscii(screenCode));
                const pixelRows = this.renderGlyphPixelRows(renderContext, glyph);
                pixelRows.forEach((pixelRowBits, pixelRow) => {
                    const normalOffset = characterRom.bytesPerSet * characterSetIndex + screenCode * this.characterSize + pixelRow;
                    const reversedOffset = normalOffset + 128 * this.characterSize;
                    characterRom.bytes[normalOffset] = pixelRowBits;
                    characterRom.bytes[reversedOffset] = pixelRowBits ^ 0xFF;
                });
            }
        });
        return characterRom;
    }

    renderGlyphPixelRows(renderContext, glyph) {
        const canvasSize = this.characterSize * this.renderScale;
        renderContext.clearRect(0, 0, canvasSize, canvasSize);
        renderContext.font = `${canvasSize}px "${this.fontFamily}"`;
        renderContext.textBaseline = 'alphabetic';
        renderContext.fillStyle = '#FFFFFF';
        renderContext.fillText(glyph, 0, this.baselineFromTopInPixels * this.renderScale);
        const alphaPixels = renderContext.getImageData(0, 0, canvasSize, canvasSize).data;

        return Array.from({ length: this.characterSize }, (_, pixelRow) => {
            let pixelRowBits = 0;
            for (let pixelColumn = 0; pixelColumn < this.characterSize; pixelColumn++) {
                if (this.isSampledPixelOpaque(alphaPixels, canvasSize, pixelColumn, pixelRow)) {
                    pixelRowBits |= 0x80 >> pixelColumn;
                }
            }
            return pixelRowBits;
        });
    }

    isSampledPixelOpaque(rgbaPixels, canvasSize, pixelColumn, pixelRow) {
        const sampleX = pixelColumn * this.renderScale + (this.renderScale >> 1);
        const sampleY = pixelRow * this.renderScale + (this.renderScale >> 1);
        const alphaIndex = (sampleY * canvasSize + sampleX) * 4 + 3;
        return rgbaPixels[alphaIndex] > 127;
    }
}
