const HellBaronTexture = 'hellbaron';
const HellBaronColumns = 16;
const HellBaronRows = 1;

class HellBaron extends Enemy {

    constructor(scene, worldX, worldY) {
        super(scene, worldX, worldY, HellBaronTexture, 0);
        this.cycle('hellbaron-stand', 'hellbaron-attack');
    }

    static preload(scene) {
        scene.load.image(HellBaronTexture, 'files/hellbaron.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(HellBaronTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < HellBaronRows; row++) {
            for (let column = 0; column < HellBaronColumns; column++) {
                const left = Math.round(column * image.width / HellBaronColumns);
                const top = Math.round(row * image.height / HellBaronRows);
                const right = Math.round((column + 1) * image.width / HellBaronColumns);
                const bottom = Math.round((row + 1) * image.height / HellBaronRows);
                texture.add(row * HellBaronColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: 'hellbaron-stand',
            frames: scene.anims.generateFrameNumbers(HellBaronTexture, { start: 0, end: 0 }),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: 'hellbaron-attack',
            frames: scene.anims.generateFrameNumbers(HellBaronTexture, { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'hellbaron-die',
            frames: scene.anims.generateFrameNumbers(HellBaronTexture, { start: 6, end: 15 }),
            frameRate: 10,
            repeat: 0
        });
    }

    deathKey() {
        return 'hellbaron-die';
    }
}
