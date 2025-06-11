class Globals {
    static TILE_WIDTH = 60;
    static PLAYER_X = Globals.TILE_WIDTH;
    static INITIAL_PLAYER_X = Globals.TILE_WIDTH;
    static PLAYER_Y = 2 * Globals.TILE_WIDTH;
    static INITIAL_PLAYER_Y = 2 * Globals.TILE_WIDTH;
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
        this.kupaRows= [];
        this.enemyTextures = ['skull', 'kupa'];
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
        this.load.image('player',  'files/character/stand.png');
        this.load.image('player1', 'files/character/m1.png');
        this.load.image('player2', 'files/character/m2.png');
        this.load.image('player3', 'files/character/m3.png');

        this.load.image('skull1', 'files/enemies/skull/skull1.gif');
        this.load.image('skull2', 'files/enemies/skull/skull2.gif');
        this.load.image('skull3', 'files/enemies/skull/skull3.gif');
        this.load.image('skull4', 'files/enemies/skull/skull4.gif');
        this.load.image('skull5', 'files/enemies/skull/skull5.gif');

        this.load.image('kupa1', 'files/enemies/kupa/kupa (1).png');
        this.load.image('kupa2', 'files/enemies/kupa/kupa (2).png');
        this.load.image('kupa3', 'files/enemies/kupa/kupa (3).png');
        this.load.image('kupa4', 'files/enemies/kupa/kupa (4).png');
        this.load.image('kupa5', 'files/enemies/kupa/kupa (5).png');
        this.load.image('kupa6', 'files/enemies/kupa/kupa (6).png');
        this.load.image('kupa7', 'files/enemies/kupa/kupa (7).png');
        this.load.image('kupa8', 'files/enemies/kupa/kupa (8).png');
        this.load.image('kupa9', 'files/enemies/kupa/kupa (9).png');
        this.load.image('kupa10', 'files/enemies/kupa/kupa (10).png');
        this.load.image('kupa11', 'files/enemies/kupa/kupa (11).png');
        this.load.image('kupa12', 'files/enemies/kupa/kupa (12).png');
        this.load.image('kupa13', 'files/enemies/kupa/kupa (13).png');
        this.load.image('kupa14', 'files/enemies/kupa/kupa (14).png');

        this.load.image('brick',  'files/background/brick/brick.png');
        this.load.image('brick1', 'files/background/brick/dissolve1.png');
        this.load.image('brick2', 'files/background/brick/dissolve2.png');

        this.load.image('fire1', 'files/background/fire/fire (1).gif');
        this.load.image('fire2', 'files/background/fire/fire (2).gif');
        this.load.image('fire3', 'files/background/fire/fire (3).gif');
        this.load.image('fire4', 'files/background/fire/fire (4).gif');
        this.load.image('fire5', 'files/background/fire/fire (5).gif');
        this.load.image('fire6', 'files/background/fire/fire (6).gif');
        this.load.image('fire7', 'files/background/fire/fire (7).gif');
        this.load.image('fire8', 'files/background/fire/fire (8).gif');
        this.load.image('fire9', 'files/background/fire/fire (9).gif');
        this.load.image('fire10', 'files/background/fire/fire (10).gif');
        this.load.image('fire11', 'files/background/fire/fire (11).gif');
        this.load.image('fire12', 'files/background/fire/fire (12).gif');
        this.load.image('fire13', 'files/background/fire/fire (13).gif');
        this.load.image('fire14', 'files/background/fire/fire (14).gif');
        this.load.image('fire15', 'files/background/fire/fire (15).gif');
        this.load.image('fire16', 'files/background/fire/fire (16).gif');
        this.load.image('fire17', 'files/background/fire/fire (17).gif');
        this.load.image('fire18', 'files/background/fire/fire (18).gif');
        this.load.image('fire19', 'files/background/fire/fire (19).gif');
        this.load.image('fire20', 'files/background/fire/fire (20).gif');
        this.load.image('fire21', 'files/background/fire/fire (21).gif');
        this.load.image('fire22', 'files/background/fire/fire (22).gif');
        this.load.image('fire23', 'files/background/fire/fire (23).gif');
        this.load.image('fire24', 'files/background/fire/fire (24).gif');
        this.load.image('fire25', 'files/background/fire/fire (25).gif');
        this.load.image('fire26', 'files/background/fire/fire (26).gif');

        this.load.image('montezuma', 'files/background/montezuma.png');

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
            key: 'kupa-move',
            frames: [
                { key: 'kupa1' },
                { key: 'kupa2' },
                { key: 'kupa3' },
                { key: 'kupa4' },
                { key: 'kupa5' },
                { key: 'kupa6' },
                { key: 'kupa7' },
                { key: 'kupa8' },
                { key: 'kupa9' },
                { key: 'kupa10' },
                { key: 'kupa11' },
                { key: 'kupa12' },
                { key: 'kupa13' },
                { key: 'kupa14' }
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

        this.anims.create({
            key: 'fire',
            frames: [
                { key: 'fire1' },
                { key: 'fire2' },
                { key: 'fire3' },
                { key: 'fire4' },
                { key: 'fire5' },
                { key: 'fire6' },
                { key: 'fire7' },
                { key: 'fire8' },
                { key: 'fire9' },
                { key: 'fire10' },
                { key: 'fire11' },
                { key: 'fire12' },
                { key: 'fire13' },
                { key: 'fire14' },
                { key: 'fire15' },
                { key: 'fire16' },
                { key: 'fire17' },
                { key: 'fire18' },
                { key: 'fire19' },
                { key: 'fire20' },
                { key: 'fire21' },
                { key: 'fire22' },
                { key: 'fire23' },
                { key: 'fire24' },
                { key: 'fire25' },
                { key: 'fire26' }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.player = this.add.sprite(Globals.INITIAL_PLAYER_X, Globals.INITIAL_PLAYER_Y, 'player');
        this.player.setDepth(2);

        let rectangle = this.add.graphics();
        rectangle.lineStyle(4, 0xffff00);
        rectangle.strokeRect(0, 0, Globals.TILE_WIDTH, Globals.TILE_WIDTH);
        rectangle.generateTexture('highlight', Globals.TILE_WIDTH, Globals.TILE_WIDTH);
        rectangle.destroy();
        this.rectSprite = this.add.sprite(2*Globals.TILE_WIDTH, 3*Globals.TILE_WIDTH, 'highlight');
        this.rectSprite.setDepth(4);
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

        this.checkEnemyCollision();
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

        const playerTileX = Math.ceil(this.player.x/Globals.TILE_WIDTH);
        const playerTileY = Math.ceil(this.player.y/Globals.TILE_WIDTH);
        const playerTile =  this.getTextureAt(playerTileX, playerTileY);

        if (this.cursors.right.isDown && playerTile !== 'ladder') {
            this.player.setFlipX(false);
            if (this.player.x < this.sys.canvas.width) {
                this.player.x += MainScene.PLAYER_SPEED;
                Globals.PLAYER_X = this.player.x;
                this.moveHighlight();
                newAnimKey = 'player-walk';
            }
        } else if (this.cursors.left.isDown && playerTile !== 'ladder') {
            this.player.setFlipX(true);
            if (this.player.x > MainScene.PLAYER_SPEED)
                this.player.x -= MainScene.PLAYER_SPEED;
                Globals.PLAYER_X = this.player.x;
                this.moveHighlight();
                newAnimKey = 'player-walk';
        } else {
            const underlyingSquareCoords = this.calculateHighlightSquare(this.player);
            const underlyingTile =  this.getTextureAt(underlyingSquareCoords[0], underlyingSquareCoords[1]);

            if (this.cursors.down.isDown && underlyingTile === 'ladder' && underlyingSquareCoords[0] == playerTileX)
                this.player.y += MainScene.PLAYER_SPEED;
            else if (this.cursors.up.isDown && playerTile === 'ladder' && underlyingSquareCoords[0] == playerTileX)
                this.player.y -= MainScene.PLAYER_SPEED;

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

    createEnemy(rowConfig, texture, speed, scale){
        let x = config.width / 2;

        const y = rowConfig.row * Globals.TILE_WIDTH;
        let s = this.add.sprite(x, y , texture);
        s.speedY = 0;

        if (rowConfig.side === 'right'){
            s.x += config.width /4;
            s.minX = config.width/2;
            s.maxX = config.width - 15;
        }
        else {
             s.minX = 15;
             s.maxX = 3*config.width/4 - 15;
        }

        s.speedX = speed;
        s.setScale(scale);
        if (scale < 1)
            s.y += (scale/6) * Globals.TILE_WIDTH;

        const textureAnimationJson = {
            'skull1': 'skull-move',
            'kupa1' : 'kupa-move'
        }
        s.play(textureAnimationJson[texture]);
        s.setDepth(5);

        return s;
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
                        const brickSprite = this.add.sprite(x, y, texture);
                        brickSprite.setDepth(3);
                        brickSprite.posX = i;
                        brickSprite.posY = j;
                        this.spriteGroup.add(brickSprite);
                    }
                }
        }

        console.log(`${this.constructor.name} skulls count = ${this.skullRows.length}`);
        for (let i = 0; i < this.skullRows.length; i++) {
            let s = this.createEnemy(this.skullRows[i], 'skull1', 1, 1);
            this.spriteGroup.add(s);
        }
        for (let i = 0; i < this.kupaRows.length; i++) {
            let s = this.createEnemy(this.kupaRows[i], 'kupa1', 0, 1);
            this.spriteGroup.add(s);
        }

        for (let i = 0; i < this.ladderColumns.length; i++){
            const y1 = this.ladderColumns[i].start * Globals.TILE_WIDTH;
            const y2 = this.ladderColumns[i].end * Globals.TILE_WIDTH;
            const x = this.ladderColumns[i].column * Globals.TILE_WIDTH;

            for (let y = y1; y < y2; y += Globals.TILE_WIDTH){
                const ladderCell = this.add.sprite(x, y, 'ladder');
                ladderCell.setDepth(1);
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
                    Globals.INITIAL_PLAYER_X = Globals.PLAYER_X;
                }
                else if (d === 'right'){
                    Globals.PLAYER_X = Globals.TILE_WIDTH * 1;
                    Globals.INITIAL_PLAYER_X = Globals.PLAYER_X;
                }
            }
        });
    }

    //@Override
    checkEnemyCollision() {
        if (this.spriteGroup == undefined)
            return;

        this.spriteGroup.children.iterate((child) => {
            if (this._isEnemy(child)){
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, child.x, child.y);
                if (distance < 3*Globals.TILE_WIDTH/4) {
                    this.scene.restart();
                }
            }
        });
    }

    getTextureAt(row, column){
        let texture = '';
        this.spriteGroup.children.iterate(sprite => {
                const posX = Math.floor(sprite.x / Globals.TILE_WIDTH);
                const posY = Math.floor(sprite.y / Globals.TILE_WIDTH);
                if (posX === row && posY === column){
                    texture = sprite.texture.key;
                }
            });
        return texture;
    }

    debugWriteAllSprites(){
        //usage: g.scene.scenes[0].debugWriteAllSprites();
        this.spriteGroup.children.iterate(sprite => {
            const posX = Math.floor(sprite.x / Globals.TILE_WIDTH);
            const posY = Math.floor(sprite.y / Globals.TILE_WIDTH);
            console.log(posX + `${sprite.texture.key} at [${sprite.posX}, ${sprite.posY}]}`);
        });
    }
}
