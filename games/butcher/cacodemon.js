const CacodemonTexture = 'cacodemon';
const CacodemonColumns = 12;
const CacodemonRows = 1;

class Cacodemon extends Enemy {

    constructor(scene, worldX, worldY) {
        super(scene, worldX, worldY, CacodemonTexture, 0);
        this.cycle('cacodemon-stand', 'cacodemon-attack');
    }

    static preload(scene) {
        scene.load.image(CacodemonTexture, 'files/cacodemon.png');
    }

    static slice(scene) {
        const texture = scene.textures.get(CacodemonTexture);
        const image = texture.getSourceImage();
        for (let row = 0; row < CacodemonRows; row++) {
            for (let column = 0; column < CacodemonColumns; column++) {
                const left = Math.round(column * image.width / CacodemonColumns);
                const top = Math.round(row * image.height / CacodemonRows);
                const right = Math.round((column + 1) * image.width / CacodemonColumns);
                const bottom = Math.round((row + 1) * image.height / CacodemonRows);
                texture.add(row * CacodemonColumns + column, 0, left, top, right - left, bottom - top);
            }
        }
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: 'cacodemon-stand',
            frames: scene.anims.generateFrameNumbers(CacodemonTexture, { start: 0, end: 0 }),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: 'cacodemon-attack',
            frames: scene.anims.generateFrameNumbers(CacodemonTexture, { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'cacodemon-die',
            frames: scene.anims.generateFrameNumbers(CacodemonTexture, { start: 4, end: 11 }),
            frameRate: 8,
            repeat: 0
        });
    }

    deathKey() {
        return 'cacodemon-die';
    }
}
