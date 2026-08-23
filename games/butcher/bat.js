const BatTexture = 'bat';
const BatColumns = 8;
const BatRows = 8;
const BatFlapFrames = [0, 1, 4, 6];

class Bat extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, BatTexture, BatFlapFrames[0]);
        this.setOrigin(0.5, 0.5);
        this.setDepth(500);
        scene.add.existing(this);
        this.flap();
    }

    static preload(scene) {
        scene.load.image(BatTexture, 'files/bat.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(BatTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < BatRows; row++) {
            for (let column = 0; column < BatColumns; column++) {
                const left = Math.round(column * image.width / BatColumns);
                const top = Math.round(row * image.height / BatRows);
                const right = Math.round((column + 1) * image.width / BatColumns);
                const bottom = Math.round((row + 1) * image.height / BatRows);
                texture.add(row * BatColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: 'bat-flap',
            frames: BatFlapFrames.map((frame) => ({ key: BatTexture, frame })),
            frameRate: 7,
            repeat: -1
        });
    }

    flap() {
        this.play('bat-flap');
        this.anims.setProgress(Math.random());
        this.anims.timeScale = 0.7 + Math.random() * 0.8;
        return this;
    }
}

class Swarm {

    constructor(scene, worldX, worldY, size, worldWidth) {
        this.scene = scene;
        this.worldX = worldX;
        this.worldY = worldY;
        this.worldWidth = worldWidth;
        this.heading = Math.random() < 0.5 ? -1 : 1;
        this.speed = 30 + Math.random() * 60;
        this.bats = this.createBats(size);
    }

    createBats(size) {
        const bats = [];
        for (let index = 0; index < size; index++) {
            const bat = new Bat(this.scene, this.worldX, this.worldY);
            bat.setScale(0.6 + Math.random() * 0.8);
            bat.offsetX = (Math.random() - 0.5) * 130;
            bat.offsetY = (Math.random() - 0.5) * 80;
            bat.bobPhase = Math.random() * Math.PI * 2;
            bat.bobAmplitude = 5 + Math.random() * 12;
            bats.push(bat);
        }
        return bats;
    }

    update(seconds, time, cameraX, cameraY) {
        this.worldX += this.heading * this.speed * seconds;
        if (this.worldX < 0) {
            this.worldX = 0;
            this.heading = 1;
        } else if (this.worldX > this.worldWidth) {
            this.worldX = this.worldWidth;
            this.heading = -1;
        }
        const shiftX = this.scene.scale.width / 2 - cameraX;
        const shiftY = this.scene.scale.height / 2 - cameraY;
        for (const bat of this.bats) {
            const worldX = this.worldX + bat.offsetX;
            const worldY = this.worldY + bat.offsetY + Math.sin(time * 0.006 + bat.bobPhase) * bat.bobAmplitude;
            bat.setPosition(worldX + shiftX, worldY + shiftY);
            bat.setFlipX(this.heading < 0);
        }
    }
}
