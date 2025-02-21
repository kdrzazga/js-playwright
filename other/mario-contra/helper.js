
class SpriteGroupHelper {
    constructor(scene) {
        this.scene = scene;
    }

    createSprites() {
        const spriteGroup = this.scene.add.group();
        const tileWidth = MainScene.TILE_WIDTH;
        const floor2Height = 2.75;
        const floor1Height = 5.5;
        const canvasHeight = this.scene.sys.canvas.height;

        for (let i = 0; i < 240; i++) {
            const x = i * tileWidth;
            const sprite = this.scene.add.sprite(x, canvasHeight - 50, 'ground');
            spriteGroup.add(sprite);
        }

        const floor1BricksX = [9, 19, 21, 23, 25, 78, 79, 80, 95, 101, 102, 119, 128, 129, 169, 170];
        floor1BricksX.forEach(x => {
            const brick = this.scene.add.sprite(tileWidth * x, floor1Height * tileWidth, 'brick');
            spriteGroup.add(brick);
        });

        const floor2BricksX = [9, 19, 21];
        floor2BricksX.forEach(x => {
            const brick = this.scene.add.sprite(tileWidth * x, floor2Height * tileWidth, 'brick');
            spriteGroup.add(brick);
        });

        const questionsX = [22, 24];
        questionsX.forEach(x => {
            const q = this.scene.add.sprite(tileWidth * x, floor1Height * tileWidth, 'question');
            spriteGroup.add(q);
        });

        for (let i = 0.2; i < 5.2; i++) {
            const cloud1 = this.scene.add.sprite(tileWidth * 50 * i, 70, 'cloud');
            const cloud2 = this.scene.add.sprite(tileWidth * 50 * i + 10 * tileWidth, 55, 'cloud');
            spriteGroup.add(cloud1);
            spriteGroup.add(cloud2);
        }

        for (let x = 4; x < 210; x += 40) {
            const highHill = this.scene.add.sprite(x * tileWidth, canvasHeight - 120, 'high-hill');
            spriteGroup.add(highHill);
            const lowHill = this.scene.add.sprite((x + 11) * tileWidth, canvasHeight - 100, 'low-hill');
            spriteGroup.add(lowHill);
        }

        const castle = this.scene.add.sprite(235 * tileWidth, 338, 'castle');
        spriteGroup.add(castle);

        const yPos = canvasHeight - 105;
        const gumbas = [15, 17, 41, 51, 53, 109, 120, 131, 133, 135].map(x => this.scene.add.sprite(x * tileWidth, yPos, 'gumba'));
        gumbas.forEach(gumba => {
            gumba.speedX = 1;
            gumba.speedY = 0;
            spriteGroup.add(gumba);
        });

        const turtles = [90, 102, 140].map(x => this.scene.add.sprite(x * tileWidth, this.scene.sys.canvas.height - 123, 'turtle'));
        turtles.forEach(turtle => {
            turtle.speedX = 1;
            turtle.speedY = 0;
            spriteGroup.add(turtle);
        });

        return spriteGroup;
    }
}
