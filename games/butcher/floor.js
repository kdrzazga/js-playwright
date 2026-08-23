const FloorTexture = 'floor';
const TileWidth = 160;
const TileHeight = 80;
const TileStepX = 80;
const TileStepY = 40;
const TileBands = 6;
const TilesPerBand = 5;
const FloorTiles = 250;

class Floor {

    constructor(scene, columns = FloorTiles, rows = FloorTiles) {
        this.scene = scene;
        this.columns = columns;
        this.rows = rows;
        this.worldWidth = columns * TileWidth;
        this.worldHeight = rows * TileStepY;
        this.pool = [];
        this.map = this.buildMap();
    }

    static preload(scene) {
        scene.load.image(FloorTexture, 'files/floor.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(FloorTexture);
        const image = texture.getSourceImage();
        let index = 0;
        for (let band = 0; band < TileBands; band++) {
            const bandTiles = band < TileBands - 1 ? TilesPerBand : TilesPerBand - 1;
            for (let column = 0; column < bandTiles; column++) {
                const height = Math.min(TileHeight, image.height - band * TileHeight);
                texture.add(index, 0, column * TileWidth, band * TileHeight, TileWidth, height);
                index++;
            }
        }
        return index;
    }

    buildMap() {
        const frameCount = (TileBands - 1) * TilesPerBand + (TilesPerBand - 1);
        const map = [];
        for (let row = 0; row < this.rows; row++) {
            const line = new Uint8Array(this.columns);
            for (let column = 0; column < this.columns; column++) {
                line[column] = Math.floor(Math.random() * frameCount);
            }
            map.push(line);
        }
        return map;
    }

    acquire(index) {
        if (!this.pool[index]) {
            this.pool[index] = this.scene.add.image(0, 0, FloorTexture, 0).setOrigin(0, 0).setDepth(-10);
        }
        this.pool[index].setVisible(true);
        return this.pool[index];
    }

    render(cameraX, cameraY) {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const shiftX = width / 2 - cameraX;
        const shiftY = height / 2 - cameraY;
        const firstRow = Math.max(0, Math.floor((cameraY - height / 2) / TileStepY) - 2);
        const lastRow = Math.min(this.rows - 1, Math.ceil((cameraY + height / 2) / TileStepY) + 1);
        let used = 0;
        for (let row = firstRow; row <= lastRow; row++) {
            const rowOffset = (row % 2) * TileStepX;
            const screenTop = row * TileStepY + shiftY;
            const firstColumn = Math.max(0, Math.floor((cameraX - width / 2 - rowOffset) / TileWidth) - 1);
            const lastColumn = Math.min(this.columns - 1, Math.ceil((cameraX + width / 2 - rowOffset) / TileWidth) + 1);
            for (let column = firstColumn; column <= lastColumn; column++) {
                const tile = this.acquire(used++);
                tile.setFrame(this.map[row][column]);
                tile.setPosition(column * TileWidth + rowOffset + shiftX, screenTop);
            }
        }
        for (let index = used; index < this.pool.length; index++) {
            this.pool[index].setVisible(false);
        }
    }
}
