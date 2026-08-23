const ObeliskTexture = 'obelisk';
const ObeliskColumns = 5;
const ObeliskRows = 4;
const ObeliskFrames = ObeliskColumns * ObeliskRows;

class Obelisk extends Phaser.GameObjects.Sprite {

    constructor(scene, worldX, worldY) {
        super(scene, worldX, worldY, ObeliskTexture, 0);
        this.worldX = worldX;
        this.worldY = worldY;
        this.inFront = false;
        this.setOrigin(0.5, 0.5);
        this.setDepth(-5);
        scene.add.existing(this);
        this.play('obelisk-glow');
        this.anims.setProgress(Math.random());
    }

    static preload(scene) {
        scene.load.image(ObeliskTexture, 'files/obelisk.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(ObeliskTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < ObeliskRows; row++) {
            for (let column = 0; column < ObeliskColumns; column++) {
                const left = Math.round(column * image.width / ObeliskColumns);
                const top = Math.round(row * image.height / ObeliskRows);
                const right = Math.round((column + 1) * image.width / ObeliskColumns);
                const bottom = Math.round((row + 1) * image.height / ObeliskRows);
                texture.add(row * ObeliskColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: 'obelisk-glow',
            frames: scene.anims.generateFrameNumbers(ObeliskTexture, { start: 0, end: ObeliskFrames - 1 }),
            frameRate: 10,
            repeat: -1
        });
    }

    sync(cameraX, cameraY) {
        const screenX = this.worldX + this.scene.scale.width / 2 - cameraX;
        const screenY = this.worldY + this.scene.scale.height / 2 - cameraY;
        const onScreen = screenX > -this.displayWidth && screenX < this.scene.scale.width + this.displayWidth
            && screenY > -this.displayHeight && screenY < this.scene.scale.height + this.displayHeight;
        this.setVisible(onScreen);
        if (!onScreen) {
            if (this.anims.isPlaying) {
                this.anims.pause();
            }
            return;
        }
        if (this.anims.isPaused) {
            this.anims.resume();
        }
        this.setPosition(screenX, screenY);
        const front = this.scene.scale.height / 2.4 < screenY;
        if (front !== this.inFront) {
            this.inFront = front;
            this.setDepth(front ? 5 : -5);
        }
    }
}
