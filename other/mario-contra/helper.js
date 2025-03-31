class SpriteGroupHelper {
    constructor(scene) {
        this.scene = scene;
    }

    createSpritesLevel1_1(spriteGroup) {
        const tileWidth = MainScene.TILE_WIDTH;
        const floor2Height = 2.75;
        const floor1Height = 5.5;
        const canvasHeight = this.scene.sys.canvas.height;

        const holes = [9, 45, 75, 130];

        for (let i = 0; i < 240; i++) {
            const x = i * tileWidth;
            let texture = 'grass';
            const sprite = this.scene.add.sprite(x, canvasHeight - 50, texture);
            spriteGroup.add(sprite);
        }

        const stocksX = [8, 120, 180];

        stocksX.forEach(x => {
            const stocksDevice = this.scene.add.sprite(tileWidth * x, 385, 'stocks');
            stocksDevice.setDepth(4);
            spriteGroup.add(stocksDevice);
        });

        const hillsX = [22, 60, 97, 204];
        hillsX.forEach(x => {
            const hill = this.scene.add.sprite(tileWidth * x, 435, 'hill');
            spriteGroup.add(hill);
        });


        const floor1BricksX = [13,14,15, 17, 18, 19, 21, 22,23,24, 27, 52, 53, 55, 57, 58, 59, 60, 61, 62, 64, 65, 97
            , 98, 99, 100, 101, 102, 104, 105, 201, 202, 203, 204, 205, 207
            , 209-10, 211-10, 213-10, 215-10];
        floor1BricksX.forEach(x => {
            const brick = this.scene.add.sprite(tileWidth * x, floor1Height * tileWidth, 'brick');
            spriteGroup.add(brick);
        });

        const questionsX = [16, 20, 25,26,54, 56,63, 66,90, 91, 92, 93, 94, 103, 206, 208-10, 210-10, 212-10, 214-10];
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

        const building = this.scene.add.sprite(235 * tileWidth, 315, 'building');
        spriteGroup.add(building);
        const castle = this.scene.add.sprite(235 * tileWidth, 338, 'castle');
        spriteGroup.add(castle);
        const graveyard = this.scene.add.sprite(150 * tileWidth, 381, 'graveyard');
        spriteGroup.add(graveyard);

        this.scene.anims.create({
            key: 'scythe-walk',
            frames: [
                { key: 'gumba' },
                { key: 'gumbaL' }
            ],
            frameRate: 2,
            repeat: -1
        });

        const yPos = canvasHeight - 105;
        const gumbas = [15, 17, 41, 51, 53, 109, 120, 131, 133, 135, 155, 245,266].map(x =>
                this.scene.add.sprite(x * tileWidth, yPos, 'gumba'));
        gumbas.forEach(gumba => {
            gumba.speedX = 1;
            gumba.speedY = 0;
            gumba.play('scythe-walk');
            spriteGroup.add(gumba);
        });

        const turtles = [90, 102, 115,116, 137,138,139, 145, 240, 250,260].map(x =>
                 this.scene.add.sprite(x * tileWidth, this.scene.sys.canvas.height - 123, 'turtle'));
        turtles.forEach(turtle => {
            turtle.speedX = 1;
            turtle.speedY = 0;
            spriteGroup.add(turtle);
        });

        return spriteGroup;
    }

    createSpritesLevel2_1(spriteGroup) {
        const tileWidth = MainScene.TILE_WIDTH;
        const floor2Height = 2.75;
        const floor1Height = 5.5;
        const canvasHeight = this.scene.sys.canvas.height;

        for (let i = 0; i < 240; i++) {
            const x = i * tileWidth;
            const sprite = this.scene.add.sprite(x, canvasHeight - 50, 'ground');
            spriteGroup.add(sprite);
        }

        const floor1BricksX = [9, 19, 21, 23, 25, 49,51,53,55, 78, 79, 80, 95, 96, 97, 98, 99, 100, 101, 102, 110, 111
            , 119, 128, 129, 140, 141, 143,144, 169, 170, 201, 202, 203, 204, 205, 207, 209, 211, 213, 215];
        floor1BricksX.forEach(x => {
            const brick = this.scene.add.sprite(tileWidth * x, floor1Height * tileWidth, 'brick');
            spriteGroup.add(brick);
        });

        const floor2BricksX = [9, 19, 21, 30, 31, 32, 33, 34, 100, 101, 102, 112, 113, 114, 115, 116, 117, 118, 180,181
            ,182, 183, 184, 185, 190, 192, 194, 196, 198, 200];
        floor2BricksX.forEach(x => {
            const brick = this.scene.add.sprite(tileWidth * x, floor2Height * tileWidth, 'brick');
            spriteGroup.add(brick);
        });

        const questionsX = [22, 24, 50,52,54, 82, 90, 91, 92, 93, 94, 142, 206, 208, 210, 212, 214];
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

        const turtles = [90, 102, 115,116, 137,138,139, 145, 240, 250,260].map(x =>
                 this.scene.add.sprite(x * tileWidth, this.scene.sys.canvas.height - 123, 'turtle'));
        turtles.forEach(turtle => {
            turtle.speedX = 1;
            turtle.speedY = 0;
            spriteGroup.add(turtle);
        });

        return spriteGroup;
    }

    createSpritesLevel3_1(spriteGroup) {
        for (let i = 0; i < 120; i++) {
             const x = i * 206;
             const sprite = this.scene.add.sprite(x, config.height-96/2, 'road');
             spriteGroup.add(sprite);
        }

        for (let i = 1; i< 30; i++){
            const x1 = i * 1300;
            let sprite = this.scene.add.sprite(x1, 11+i, '4-black-clouds');
            spriteGroup.add(sprite);
        }

        for(let i = 1; i<4; i++){
            const x2 = i*3250 + 800;
            let sprite = this.scene.add.sprite(x2, 300 , 'outpost');
            spriteGroup.add(sprite);
            const x3 = x2 + 600;
            sprite = this.scene.add.sprite(x3, 300 , 'ruin');
            spriteGroup.add(sprite);
        }

        const helicopter = this.scene.add.sprite(65*(206+40), config.height - 212, 'helicopter');
        spriteGroup.add(helicopter);
        const angryComputer = this.scene.add.sprite(65*(215+40), 310+50, 'angry-computer');
        angryComputer.setDepth(4);
        spriteGroup.add(angryComputer);

        const head = this.scene.add.sprite(3000, 290, 'head');
        head.setDepth(4);
        spriteGroup.add(head);
        const headEntrance = this.scene.add.sprite(2750, 481, 'head-entrance');
        spriteGroup.add(headEntrance);
        const headExit = this.scene.add.sprite(3220, 470, 'head-exit');
        spriteGroup.add(headExit);

        const head2 = this.scene.add.sprite(10000 + 2500, 290, 'head');
        head2.setDepth(4);
        spriteGroup.add(head2);
        const headEntrance2 = this.scene.add.sprite(9750 + 2500, 481, 'head-entrance');
        spriteGroup.add(headEntrance2);
        const headExit2 = this.scene.add.sprite(10220 + 2500, 470, 'head-exit');
        spriteGroup.add(headExit2);

        const eggBossShift = (1500 - 3) / 65;

        const eggBoss = this.scene.add.sprite(65*(eggBossShift + 3), 244, 'egg-boss');
        eggBoss.setDepth(-1);
        spriteGroup.add(eggBoss);

        for (let x = 0; x < 7; x++){
            let egg = this.scene.add.sprite(65 * eggBossShift +  64*x + 32*Math.random(), 444 -  32*Math.random(), 'question');
            let egg2 = this.scene.add.sprite(65 * eggBossShift +  32*x + 64*Math.random(), 480 -  64*Math.sin(x/Math.PI), 'question');
            let egg3 = this.scene.add.sprite(65 * eggBossShift +  16*x + 128*Math.random(), 512 -  128*Math.sin(x/Math.PI), 'question');

            const eggs = [egg, egg2, egg3];

            eggs.forEach(e => {
                e.setDepth(-1);
                spriteGroup.add(e);
            });
        }

        const building1 = this.scene.add.sprite(65*(225/*81*/ + 3), 96*7.5/5, 'background1');
        spriteGroup.add(building1);

        return spriteGroup;
    }
}
