class Globals {
    static TILE_WIDTH = 60;
    static PLAYER_X = Globals.TILE_WIDTH;
    static PLAYER_Y = 2 * Globals.TILE_WIDTH;
}

class MainScene extends ExtendedScene {

    static PLAYER_SPEED = 2;

    constructor(name){
        super(name);
        this.player = null;
        this.animKey = 'stand';
        this.backgroundColor = 0x880015;

        this.nonBrickRows = [];
        this.nonBrickColumns = [];
        this.skullRows= [];
        this.enemyTextures = ['skull'];
        this.ladderColumns = [];

        this.exits = {
            'top': {
                'x': '',
                'y': ''
            },
            'bottom': {
                'bottomX': '',
                'bottomY': ''
            },
            'left': {
                'leftX': '',
                'leftY': ''
            },
            'right': {
                'rightX': '',
                'rightY': ''
            }
        };

        this.nextScene = {
            'top': '',
            'topX': '',
            'topY': '',
            'bottom': '',
            'bottomX': '',
            'bottomY': '',
            'left': '',
            'leftX': '',
            'leftY': '',
            'right': '',
            'rightX': '',
            'rightY': ''
        };

    }

    preload(){
        this.load.image('skull1', 'files/enemies/skull/skull1.gif');
        this.load.image('skull2', 'files/enemies/skull/skull2.gif');
        this.load.image('skull3', 'files/enemies/skull/skull3.gif');
        this.load.image('skull4', 'files/enemies/skull/skull4.gif');
        this.load.image('skull5', 'files/enemies/skull/skull5.gif');

        this.load.image('brick',  'files/background/brick/brick.png');
        this.load.image('brick1', 'files/background/brick/dissolve1.png');
        this.load.image('brick2', 'files/background/brick/dissolve2.png');

        this.load.image('player',  'files/character/stand.png');
        this.load.image('player1', 'files/character/m1.png');
        this.load.image('player2', 'files/character/m2.png');
        this.load.image('player3', 'files/character/m3.png');

        this.load.image('ladder', 'files/background/ladder.png');
    }

    create(){
        super.create();

        let levelDiv = document.getElementById('room-number');
        let name = this.scene.key;
        levelDiv.innerText = 'ROOM ' + name.match(/\d+/g);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'skull-move',
            frames: [
                { key: 'skull1' },
                { key: 'skull2' },
                { key: 'skull3' },
                { key: 'skull4' },
                { key: 'skull5' }
            ],
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'brick-dissolve',
            frames: [
                { key: 'brick' },
                { key: 'brick1' },
                { key: 'brick2' }
            ],
            frameRate: 3,
            repeat: 0
        });

        this.anims.create({
            key: 'player-walk',
            frames: [
                { key: 'player1' },
                { key: 'player2' },
                { key: 'player3' }
            ],
            frameRate: 5,
            repeat: -1
        });
        this.player = this.add.sprite(Globals.PLAYER_X, Globals.PLAYER_Y, 'player');

        let rectangle = this.add.graphics();
        rectangle.lineStyle(4, 0xffff00);
        rectangle.strokeRect(0, 0, Globals.TILE_WIDTH, Globals.TILE_WIDTH);
        rectangle.generateTexture('highlight', Globals.TILE_WIDTH, Globals.TILE_WIDTH);
        rectangle.destroy();
        this.rectSprite = this.add.sprite(2*Globals.TILE_WIDTH, 3*Globals.TILE_WIDTH, 'highlight');
        this.rectSprite.setDepth(3);
    }

    update(time, delta) {
        super.update(time, delta);
        this.checkFireKeys()
        this.movePlayer(time);
        this.checkJumpKeys(1400);
        this.checkExit();

        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)) {
                if (child.x < child.minX || child.x > child.maxX)
                    child.speedX = -child.speedX;
            }
        });
    }

    checkFireKeys(){
        const keys = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        ];

        for (let key of keys) {
            if (Phaser.Input.Keyboard.JustDown(key)) {
                console.log(`Key ${key.keyCode} was pressed!`);
                let toBeDissolved = this.calculateHighlightSquare(this.player);

                this.spriteGroup.children.iterate(sprite => {
                    if (sprite.texture.key === 'brick')
                        if (sprite.posX === toBeDissolved[0] && sprite.posY === toBeDissolved[1])
                            sprite.play('brick-dissolve');
                });

            }
        }
    }

    movePlayer(time){
        let newAnimKey = 'player';
        if (this.cursors.right.isDown) {
            this.player.setFlipX(false);
            if (this.player.x < this.sys.canvas.width) {
                this.player.x += MainScene.PLAYER_SPEED;
                Globals.PLAYER_X = this.player.x;
                this.moveHighlight();
                newAnimKey = 'player-walk';
            }
        } else if (this.cursors.left.isDown) {
            this.player.setFlipX(true);
            if (this.player.x > MainScene.PLAYER_SPEED)
                this.player.x -= MainScene.PLAYER_SPEED;
                Globals.PLAYER_X = this.player.x;
                this.moveHighlight();
                newAnimKey = 'player-walk';
        }
        else {
            newAnimKey = 'player';
        }
        if (newAnimKey !== this.animKey) {
            this.animKey = newAnimKey;

            if (newAnimKey === 'player'){
                this.player.anims.stop();
                this.player.setTexture('player')
            }
            else
                this.player.play(this.animKey);
        }
    }

    createSpriteGroup() {

        for (let j = 0; j < 14; j++){
            if (!this.nonBrickRows.includes(j))
                for (let i = 0; i < 14; i++) {
                    if (!this.nonBrickColumns.includes(i))
                    {
                        const x = i * Globals.TILE_WIDTH;
                        const y = j * Globals.TILE_WIDTH;
                        let texture = 'brick';
                        const sprite = this.add.sprite(x, y, texture);
                        sprite.posX = i;
                        sprite.posY = j;
                        this.spriteGroup.add(sprite);
                    }
                }
        }

        console.log(`${this.constructor.name} skulls count = ${this.skullRows.length}`);
        for (let i = 0; i < this.skullRows.length; i++) {
            let x = config.width / 2;

            const y = this.skullRows[i].row * Globals.TILE_WIDTH;
            let s = this.add.sprite(x, y , 'skull1');
            s.speedY = 0;

            if (this.skullRows[i].side === 'right'){
                s.x += config.width /4;
                s.minX = config.width/2;
                s.maxX = config.width - 15;
                s.speedX = 1;
            }
            else {
                 s.x -= config.width /4;
                 s.minX = 15;
                 s.maxX = config.width/2 - 15;
            }

            s.play('skull-move');
            s.setDepth(5);
            this.spriteGroup.add(s);
        }

        for (let i = 0; i < this.ladderColumns.length; i++){
            const y1 = this.ladderColumns[i].start * Globals.TILE_WIDTH;
            const y2 = this.ladderColumns[i].end * Globals.TILE_WIDTH;
            const x = this.ladderColumns[i].column * Globals.TILE_WIDTH;

            for (let y = y1; y < y2; y += Globals.TILE_WIDTH){
                const ladderCell = this.add.sprite(x, y, 'ladder');
                this.spriteGroup.add(ladderCell);
            }
        }
    }

    conditionallyStopEnemy(enemySprite){
        const underlyingSquareCoords = this.calculateHighlightSquare(enemySprite);

        this.spriteGroup.children.iterate((child)=> {
            if (child.texture.key === 'brick2') {
                const enemyTileX = Math.ceil(child.x/Globals.TILE_WIDTH);
                const enemyTileY = Math.ceil(child.y/Globals.TILE_WIDTH);
                /*console.log(`${child.texture.key}[${child.x}][${child.y}] is non-enemy. [${enemyTileX}][${enemyTileY}]`);
                console.log(`[${underlyingSquareCoords[0]}][${underlyingSquareCoords[1]}]`);
                */
                if (enemyTileX === (underlyingSquareCoords[0]) && enemyTileY === underlyingSquareCoords[1]){
                    //console.log(child.texture.key);
                    enemySprite.speedX = 0;
                    enemySprite.x = child.x;
                    enemySprite.y = child.y;
                    child.setTexture('brick1');

                    this.time.delayedCall(3000, () => {
                        child.setTexture('brick');
                    });
                }
            }
        });
    }

    //@Override
    moveEnemies(time){
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)) {
                child.x -= child.speedX;
                child.y += child.speedY;
                this.conditionallyStopEnemy(child);
            }
        });
    }

    calculateSpriteSquare(sprite){
        const x = Math.floor(sprite.x / Globals.TILE_WIDTH);
        const y = Math.floor(sprite.y / Globals.TILE_WIDTH);

        return [x, y];
    }

    calculateHighlightSquare(sprite){
        const spriteSquare = this.calculateSpriteSquare(sprite);
        const y = spriteSquare[1] + 1;
        let x = spriteSquare[0];
        if (!this.player.flipX)
            x += 1;

        return[x, y];
    }

    moveHighlight(){
        const highlightSquare = this.calculateHighlightSquare(this.player);
        this.rectSprite.x = highlightSquare[0] * Globals.TILE_WIDTH;
        this.rectSprite.y = highlightSquare[1] * Globals.TILE_WIDTH;
    }

    checkExit(){
        const coords = this.calculateSpriteSquare(this.player);

        const directions = ['top', 'bottom', 'left', 'right'];

        directions.forEach( d => {
            const exitX = this.exits[d]['x'];
            const exitY = this.exits[d]['y'];

            if (coords[0] == exitX && coords[1] == exitY){
                this.scene.start(this.nextScene[d]);

                if (d === 'left'){
                    Globals.PLAYER_X = Globals.TILE_WIDTH * 12;
                }
                else if (d === 'right'){
                    Globals.PLAYER_X = Globals.TILE_WIDTH * 1;
                }
            }
        });
    }
}
