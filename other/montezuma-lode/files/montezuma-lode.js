class MainScene extends ExtendedScene {

    static TILE_WIDTH = 60;
    static PLAYER_SPEED = 2;

    constructor(name){
        super(name);
        this.player = null;
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
            repeat: 1
        });

        this.anims.create({
            key: 'player-walk',
            frames: [
                { key: 'player1' },
                { key: 'player2' },
                { key: 'player3' }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.player = this.add.sprite(MainScene.TILE_WIDTH, 2 * MainScene.TILE_WIDTH, 'player');
    }

    update(time, delta) {
        super.update(time, delta);
        this.move(time);

        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)) {
                if (child.x < child.minX || child.x > child.maxX)
                    child.speedX = -child.speedX;
            }
        });
    }

    move(time){
        if (this.cursors.right.isDown) {
            this.player.setFlipX(false);
            if (this.player.x < 8 * this.sys.canvas.width / 8) {
                this.player.x += MainScene.PLAYER_SPEED;
            }
            //newAnimKey = 'damnd-walk';
        } else if (this.cursors.left.isDown) {
            this.player.setFlipX(true);
            if (this.player.x > MainScene.PLAYER_SPEED)
                this.player.x -= MainScene.PLAYER_SPEED;
            //newAnimKey = 'damnd-walk';
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
}

