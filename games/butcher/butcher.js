const StandTexture = 'butcher-stand';
const WalkTexture = 'butcher-walk';
const AttackTexture = 'butcher-attack';
const TauntSound = 'butcher-taunt';
const DirectionCount = 8;
const FrameColumns = 12;

class Butcher extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction) {
        super(scene, x, y, StandTexture, direction);
        this.direction = direction;
        this.speed = 175;
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        this.stand();
    }

    static preload(scene) {
        scene.load.image(StandTexture, 'files/stand.png');
        scene.load.image(WalkTexture, 'files/walk.png');
        scene.load.image(AttackTexture, 'files/attack1.png');
        scene.load.audio(TauntSound, 'files/fresh-meat.mp3');
    }

    static slice(scene) {
        Butcher.sliceGrid(scene, StandTexture, 1, DirectionCount);
        Butcher.sliceGrid(scene, WalkTexture, FrameColumns, DirectionCount);
        Butcher.sliceGrid(scene, AttackTexture, FrameColumns, DirectionCount);
    }

    static sliceGrid(scene, key, columns, rows) {
        const texture = scene.textures.get(key);
        const image = texture.getSourceImage();
        const cellWidth = image.width / columns;
        const cellHeight = image.height / rows;
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                texture.add(row * columns + column, 0,
                    column * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    static createAnimations(scene) {
        for (let direction = 0; direction < DirectionCount; direction++) {
            scene.anims.create({
                key: Butcher.walkKey(direction),
                frames: scene.anims.generateFrameNumbers(WalkTexture, {
                    start: direction * FrameColumns,
                    end: direction * FrameColumns + FrameColumns - 1
                }),
                frameRate: 12,
                repeat: -1
            });
            scene.anims.create({
                key: Butcher.attackKey(direction),
                frames: scene.anims.generateFrameNumbers(AttackTexture, {
                    start: direction * FrameColumns,
                    end: direction * FrameColumns + FrameColumns - 1
                }),
                frameRate: 14,
                repeat: -1
            });
        }
    }

    static walkKey(direction) {
        return `butcher-walk-${direction}`;
    }

    static attackKey(direction) {
        return `butcher-attack-${direction}`;
    }

    face(direction) {
        this.direction = direction;
        return this;
    }

    stand() {
        this.anims.stop();
        this.setTexture(StandTexture, this.direction);
        return this;
    }

    walk() {
        this.play(Butcher.walkKey(this.direction), true);
        return this;
    }

    attack1() {
        this.play(Butcher.attackKey(this.direction), true);
        return this;
    }
}
