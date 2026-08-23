const MinotaurTexture = 'minotaur';
const MinotaurColumns = 8;
const MinotaurRows = 8;
const MinotaurStandRow = 0;
const MinotaurGlowRow = 2;
const MinotaurDeathFrames = [48, 49, 50, 51, 52, 53, 56, 57, 58];

class Minotaur extends Enemy {

    constructor(scene, worldX, worldY) {
        super(scene, worldX, worldY, MinotaurTexture, MinotaurStandRow * MinotaurColumns);
        this.cycle('minotaur-stand', 'minotaur-glow');
    }

    static preload(scene) {
        scene.load.image(MinotaurTexture, 'files/minotaur.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(MinotaurTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < MinotaurRows; row++) {
            for (let column = 0; column < MinotaurColumns; column++) {
                const left = Math.round(column * image.width / MinotaurColumns);
                const top = Math.round(row * image.height / MinotaurRows);
                const right = Math.round((column + 1) * image.width / MinotaurColumns);
                const bottom = Math.round((row + 1) * image.height / MinotaurRows);
                texture.add(row * MinotaurColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        const standStart = MinotaurStandRow * MinotaurColumns;
        const glowStart = MinotaurGlowRow * MinotaurColumns;
        scene.anims.create({
            key: 'minotaur-stand',
            frames: scene.anims.generateFrameNumbers(MinotaurTexture, { start: standStart, end: standStart + 7 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'minotaur-glow',
            frames: scene.anims.generateFrameNumbers(MinotaurTexture, { start: glowStart, end: glowStart + 5 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'minotaur-die',
            frames: scene.anims.generateFrameNumbers(MinotaurTexture, { frames: MinotaurDeathFrames }),
            frameRate: 10,
            repeat: 0
        });
    }

    deathKey() {
        return 'minotaur-die';
    }
}
