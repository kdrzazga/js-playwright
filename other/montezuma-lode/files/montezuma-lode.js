class MainScene extends ExtendedScene {

    static TILE_WIDTH = 60;
    static PLAYER_SPEED = 2;

    constructor(name){
        super(name);
        this.player = null;
        this.animKey = 'stand';
        this.backgroundColor = 0x880015;

        this.nonBrickRows = [];
        this.nonBrickColumns = [];
        this.skullRows= [ {'row': 2, 'side': 'right'} ];
        this.enemyTextures = ['skull'];
        this.ladderColumns = [ {'column' : 5, 'start' : 3, 'end' : 11}];
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
        this.player = this.add.sprite(MainScene.TILE_WIDTH, 2 * MainScene.TILE_WIDTH, 'player');

        let rectangle = this.add.graphics();
        rectangle.lineStyle(4, 0xffff00);
        rectangle.strokeRect(0, 0, MainScene.TILE_WIDTH, MainScene.TILE_WIDTH);
        rectangle.generateTexture('highlight', MainScene.TILE_WIDTH, MainScene.TILE_WIDTH);
        rectangle.destroy();
        this.rectSprite = this.add.sprite(2*MainScene.TILE_WIDTH, 3*MainScene.TILE_WIDTH, 'highlight');
        this.rectSprite.setDepth(3);
    }

    update(time, delta) {
        super.update(time, delta);
        this.checkFireKeys()
        this.move(time);

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
                let toBeDissolved = this.calculateHighlightSquare();

                this.spriteGroup.children.iterate(sprite => {
                    if (sprite.texture.key === 'brick')
                        if (sprite.posX === toBeDissolved[0] && sprite.posY === toBeDissolved[1])
                            sprite.play('brick-dissolve');
                });

            }
        }
    }

    move(time){
        let newAnimKey = 'player';
        if (this.cursors.right.isDown) {
            this.player.setFlipX(false);
            if (this.player.x < this.sys.canvas.width) {
                this.player.x += MainScene.PLAYER_SPEED;
                this.moveHighlight();
                newAnimKey = 'player-walk';
            }
        } else if (this.cursors.left.isDown) {
            this.player.setFlipX(true);
            if (this.player.x > MainScene.PLAYER_SPEED)
                this.player.x -= MainScene.PLAYER_SPEED;
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
                        const x = i * MainScene.TILE_WIDTH;
                        const y = j * MainScene.TILE_WIDTH;
                        let texture = 'brick';
                        const sprite = this.add.sprite(x, y, texture);
                        sprite.posX = i;
                        sprite.posY = j;
                        this.spriteGroup.add(sprite);
                    }
                }
        }

        for (let i = 0; i < this.skullRows.length; i++) {
            let x = config.width / 2;

            const y = this.skullRows[i].row * MainScene.TILE_WIDTH;
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
            this.spriteGroup.add(s);
        }

        for (let i = 0; i < this.ladderColumns.length; i++){
            const y1 = this.ladderColumns[i].start * MainScene.TILE_WIDTH;
            const y2 = this.ladderColumns[i].end * MainScene.TILE_WIDTH;
            const x = this.ladderColumns[i].column * MainScene.TILE_WIDTH;

            for (let y = y1; y < y2; y += MainScene.TILE_WIDTH){
                const ladderCell = this.add.sprite(x, y, 'ladder');
                this.spriteGroup.add(ladderCell);
            }
        }
    }

    calculatePlayerSquare(){
        const x = Math.floor(this.player.x / MainScene.TILE_WIDTH);
        const y = Math.floor(this.player.y / MainScene.TILE_WIDTH);

        return [x, y];
    }

    calculateHighlightSquare(){
        const playerSquare = this.calculatePlayerSquare();
        const y = playerSquare[1] + 1;
        let x = playerSquare[0];
        if (!this.player.flipX)
            x += 1;

        return[x, y];
    }

    moveHighlight(){
        const highlightSquare = this.calculateHighlightSquare();
        this.rectSprite.x = highlightSquare[0] * MainScene.TILE_WIDTH;
        this.rectSprite.y = highlightSquare[1] * MainScene.TILE_WIDTH;
    }

}
