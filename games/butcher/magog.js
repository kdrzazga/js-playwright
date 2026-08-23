const MagogTexture = 'magog';
const MagogColumns = 9;
const MagogRows = 8;
const MagogStandRow = 0;
const MagogGlowRow = 2;
const MagogDeathFrames = [54, 55, 56, 57, 58, 59, 63, 64, 65, 66];

class Magog extends Enemy {

    constructor(scene, worldX, worldY) {
        super(scene, worldX, worldY, MagogTexture, MagogStandRow * MagogColumns);
        this.cycle('magog-stand', 'magog-glow');
    }

    static preload(scene) {
        scene.load.image(MagogTexture, 'files/magog.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(MagogTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < MagogRows; row++) {
            for (let column = 0; column < MagogColumns; column++) {
                const left = Math.round(column * image.width / MagogColumns);
                const top = Math.round(row * image.height / MagogRows);
                const right = Math.round((column + 1) * image.width / MagogColumns);
                const bottom = Math.round((row + 1) * image.height / MagogRows);
                texture.add(row * MagogColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        const standStart = MagogStandRow * MagogColumns;
        const glowStart = MagogGlowRow * MagogColumns;
        scene.anims.create({
            key: 'magog-stand',
            frames: scene.anims.generateFrameNumbers(MagogTexture, { start: standStart, end: standStart + 8 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'magog-glow',
            frames: scene.anims.generateFrameNumbers(MagogTexture, { start: glowStart, end: glowStart + 7 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'magog-die',
            frames: scene.anims.generateFrameNumbers(MagogTexture, { frames: MagogDeathFrames }),
            frameRate: 10,
            repeat: 0
        });
    }

    deathKey() {
        return 'magog-die';
    }
}
