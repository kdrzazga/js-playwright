const CaveTexture = 'cave';
const CaveColumns = 4;
const CaveRows = 4;
const CaveFormations = CaveColumns * CaveRows;

class Cave extends Phaser.GameObjects.Sprite {

    constructor(scene, worldX, worldY, formation = Phaser.Math.Between(0, CaveFormations - 1)) {
        super(scene, worldX, worldY, CaveTexture, formation);
        this.worldX = worldX;
        this.worldY = worldY;
        this.inFront = false;
        this.setOrigin(0.5, 0.5);
        this.setDepth(-5);
        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image(CaveTexture, 'files/cave.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(CaveTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < CaveRows; row++) {
            for (let column = 0; column < CaveColumns; column++) {
                const left = Math.round(column * image.width / CaveColumns);
                const top = Math.round(row * image.height / CaveRows);
                const right = Math.round((column + 1) * image.width / CaveColumns);
                const bottom = Math.round((row + 1) * image.height / CaveRows);
                texture.add(row * CaveColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    sync(cameraX, cameraY) {
        const screenX = this.worldX + this.scene.scale.width / 2 - cameraX;
        const screenY = this.worldY + this.scene.scale.height / 2 - cameraY;
        const onScreen = screenX > -this.displayWidth && screenX < this.scene.scale.width + this.displayWidth
            && screenY > -this.displayHeight && screenY < this.scene.scale.height + this.displayHeight;
        this.setVisible(onScreen);
        if (onScreen) {
            this.setPosition(screenX, screenY);
            const front = this.scene.scale.height / 2.4 < screenY;
            if (front !== this.inFront) {
                this.inFront = front;
                this.setDepth(front ? 5 : -5);
            }
        }
    }
}
