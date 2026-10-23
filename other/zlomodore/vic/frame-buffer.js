class ScreenGeometry {
    constructor({
        width = 350,
        height = 220,
        firstVisibleRasterLine = 41,
        firstVisibleSpriteX = 9,
        displayWindowFirstRasterLine = 51,
        displayWindowFirstSpriteX = 24,
        columns = 40,
        rows = 25,
        characterSize = 8,
        screenMemoryAddress = 0x0400,
        spritePointerAddress = 0x07F8,
        colorRamAddress = 0xD800,
    } = {}) {
        this.width = width;
        this.height = height;
        this.firstVisibleRasterLine = firstVisibleRasterLine;
        this.firstVisibleSpriteX = firstVisibleSpriteX;
        this.displayWindowFirstRasterLine = displayWindowFirstRasterLine;
        this.displayWindowFirstSpriteX = displayWindowFirstSpriteX;
        this.columns = columns;
        this.rows = rows;
        this.characterSize = characterSize;
        this.screenMemoryAddress = screenMemoryAddress;
        this.spritePointerAddress = spritePointerAddress;
        this.colorRamAddress = colorRamAddress;
    }

    get displayWindowWidth() {
        return this.columns * this.characterSize;
    }

    get displayWindowHeight() {
        return this.rows * this.characterSize;
    }

    get displayWindowLeftOnCanvas() {
        return this.displayWindowFirstSpriteX - this.firstVisibleSpriteX;
    }

    get screenCellCount() {
        return this.columns * this.rows;
    }

    isRasterLineInDisplayWindow(rasterLine) {
        const lineInWindow = rasterLine - this.displayWindowFirstRasterLine;
        return lineInWindow >= 0 && lineInWindow < this.displayWindowHeight;
    }

    canvasRowOfRasterLine(rasterLine) {
        return rasterLine - this.firstVisibleRasterLine;
    }

    isCanvasRowVisible(canvasRow) {
        return canvasRow >= 0 && canvasRow < this.height;
    }
}

class FrameBuffer {
    constructor(width, height, palette) {
        this.width = width;
        this.height = height;
        this.palette = palette;
        this.imageData = new ImageData(width, height);
        this.pixels = new Uint32Array(this.imageData.data.buffer);
    }

    fillSpan(row, startColumn, endColumn, colorIndex) {
        const rowStart = row * this.width;
        this.pixels.fill(this.palette.packedColorAt(colorIndex), rowStart + startColumn, rowStart + endColumn);
    }

    copyColorIndexes(row, startColumn, colorIndexes) {
        const rowStart = row * this.width + startColumn;
        for (let offset = 0; offset < colorIndexes.length; offset++) {
            this.pixels[rowStart + offset] = this.palette.packedColorAt(colorIndexes[offset]);
        }
    }

    colorIndexAt(column, row) {
        const packedColor = this.pixels[row * this.width + column];
        return this.palette.packedColors.indexOf(packedColor);
    }
}
