class VicLineRenderer {
    constructor(vic, ram, colorRam, characterRom, frameBuffer, geometry, spriteBytesPerRow = 3, spriteHeight = 21, spriteBlockSize = 64, spriteDisplayDelayLines = 1) {
        this.vic = vic;
        this.ram = ram;
        this.colorRam = colorRam;
        this.characterRom = characterRom;
        this.frameBuffer = frameBuffer;
        this.geometry = geometry;
        this.spriteBytesPerRow = spriteBytesPerRow;
        this.spriteHeight = spriteHeight;
        this.spriteBlockSize = spriteBlockSize;
        this.spriteDisplayDelayLines = spriteDisplayDelayLines;
        this.lineColors = new Uint8Array(geometry.displayWindowWidth);
        this.foregroundMask = new Uint8Array(geometry.displayWindowWidth);
        this.spriteCoverage = new Uint8Array(geometry.displayWindowWidth);
    }

    renderLine(rasterLine) {
        const canvasRow = this.geometry.canvasRowOfRasterLine(rasterLine);
        if (!this.geometry.isCanvasRowVisible(canvasRow)) {
            return;
        }
        const borderColor = this.vic.borderColor;
        if (!this.vic.isDisplayEnabled || !this.geometry.isRasterLineInDisplayWindow(rasterLine)) {
            this.frameBuffer.fillSpan(canvasRow, 0, this.geometry.width, borderColor);
            return;
        }
        const windowLeft = this.geometry.displayWindowLeftOnCanvas;
        const windowRight = windowLeft + this.geometry.displayWindowWidth;
        this.renderTextLine(rasterLine - this.geometry.displayWindowFirstRasterLine);
        this.renderSpritesLine(rasterLine);
        this.frameBuffer.fillSpan(canvasRow, 0, windowLeft, borderColor);
        this.frameBuffer.copyColorIndexes(canvasRow, windowLeft, this.lineColors);
        this.frameBuffer.fillSpan(canvasRow, windowRight, this.geometry.width, borderColor);
    }

    renderTextLine(lineInWindow) {
        const characterSize = this.geometry.characterSize;
        const textRow = Math.floor(lineInWindow / characterSize);
        const pixelRowInCharacter = lineInWindow % characterSize;
        const characterSetIndex = this.vic.characterSetIndex;
        const backgroundColor = this.vic.backgroundColor;

        for (let column = 0; column < this.geometry.columns; column++) {
            const cellOffset = textRow * this.geometry.columns + column;
            const screenCode = this.ram.read(this.geometry.screenMemoryAddress + cellOffset);
            const foregroundColor = this.colorRam.read(cellOffset);
            const pixelRowBits = this.characterRom.pixelRowOf(characterSetIndex, screenCode, pixelRowInCharacter);
            for (let pixelColumn = 0; pixelColumn < characterSize; pixelColumn++) {
                const linePosition = column * characterSize + pixelColumn;
                const isForegroundPixel = (pixelRowBits & (0x80 >> pixelColumn)) !== 0;
                this.lineColors[linePosition] = isForegroundPixel ? foregroundColor : backgroundColor;
                this.foregroundMask[linePosition] = isForegroundPixel ? 1 : 0;
            }
        }
    }

    renderSpritesLine(rasterLine) {
        this.spriteCoverage.fill(0);
        let spriteBackgroundCollisions = 0;

        for (let spriteIndex = this.vic.spriteCount - 1; spriteIndex >= 0; spriteIndex--) {
            const spriteRowBits = this.spriteRowBitsAt(spriteIndex, rasterLine);
            if (spriteRowBits === null) {
                continue;
            }
            const plotPixel = (linePosition, colorIndex) => {
                if (linePosition < 0 || linePosition >= this.lineColors.length) {
                    return;
                }
                this.spriteCoverage[linePosition] |= 1 << spriteIndex;
                const isOverForeground = this.foregroundMask[linePosition] === 1;
                if (isOverForeground) {
                    spriteBackgroundCollisions |= 1 << spriteIndex;
                }
                if (!(isOverForeground && this.vic.isSpriteBehindBackground(spriteIndex))) {
                    this.lineColors[linePosition] = colorIndex;
                }
            };
            if (this.vic.isSpriteMulticolor(spriteIndex)) {
                this.plotMulticolorSpriteRow(spriteIndex, spriteRowBits, plotPixel);
            } else {
                this.plotHiresSpriteRow(spriteIndex, spriteRowBits, plotPixel);
            }
        }

        this.vic.recordCollisions(this.collectSpriteSpriteCollisions(), spriteBackgroundCollisions);
    }

    spriteRowBitsAt(spriteIndex, rasterLine) {
        if (!this.vic.isSpriteEnabled(spriteIndex)) {
            return null;
        }
        const verticalScale = this.vic.isSpriteExpandedY(spriteIndex) ? 2 : 1;
        const lineInSprite = rasterLine - this.vic.spriteY(spriteIndex) - this.spriteDisplayDelayLines;
        if (lineInSprite < 0 || lineInSprite >= this.spriteHeight * verticalScale) {
            return null;
        }
        const spriteDataRow = Math.floor(lineInSprite / verticalScale);
        const spriteDataAddress = this.ram.read(this.geometry.spritePointerAddress + spriteIndex) * this.spriteBlockSize
            + spriteDataRow * this.spriteBytesPerRow;
        return (this.ram.read(spriteDataAddress) << 16)
            | (this.ram.read(spriteDataAddress + 1) << 8)
            | this.ram.read(spriteDataAddress + 2);
    }

    spriteLeftInWindow(spriteIndex) {
        return this.vic.spriteX(spriteIndex) - this.geometry.displayWindowFirstSpriteX;
    }

    plotHiresSpriteRow(spriteIndex, spriteRowBits, plotPixel) {
        const horizontalScale = this.vic.isSpriteExpandedX(spriteIndex) ? 2 : 1;
        const spriteLeft = this.spriteLeftInWindow(spriteIndex);
        const spriteColor = this.vic.spriteColor(spriteIndex);
        for (let bitIndex = 0; bitIndex < 24; bitIndex++) {
            if ((spriteRowBits & (1 << (23 - bitIndex))) === 0) {
                continue;
            }
            for (let repeat = 0; repeat < horizontalScale; repeat++) {
                plotPixel(spriteLeft + bitIndex * horizontalScale + repeat, spriteColor);
            }
        }
    }

    plotMulticolorSpriteRow(spriteIndex, spriteRowBits, plotPixel) {
        const pixelWidth = this.vic.isSpriteExpandedX(spriteIndex) ? 4 : 2;
        const spriteLeft = this.spriteLeftInWindow(spriteIndex);
        const colorsByBitPair = [null, this.vic.spriteMulticolor0, this.vic.spriteColor(spriteIndex), this.vic.spriteMulticolor1];
        for (let pairIndex = 0; pairIndex < 12; pairIndex++) {
            const colorIndex = colorsByBitPair[(spriteRowBits >> (22 - pairIndex * 2)) & 0x03];
            if (colorIndex === null) {
                continue;
            }
            for (let repeat = 0; repeat < pixelWidth; repeat++) {
                plotPixel(spriteLeft + pairIndex * pixelWidth + repeat, colorIndex);
            }
        }
    }

    collectSpriteSpriteCollisions() {
        let spriteSpriteCollisions = 0;
        for (const coveringSprites of this.spriteCoverage) {
            if ((coveringSprites & (coveringSprites - 1)) !== 0) {
                spriteSpriteCollisions |= coveringSprites;
            }
        }
        return spriteSpriteCollisions;
    }
}
