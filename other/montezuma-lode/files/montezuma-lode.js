class MainScene extends ExtendedScene {

    static TILE_WIDTH = 60;

    constructor(name){
        super(name);
        this.backgroundColor = 0x880015;

        this.nonBrickRows = [];
        this.nonBrickColumns = [];
        this.skullRows= [ {'row': 2, 'side': 'right'} ];
    }

    create(){
        super.create();

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

            if (this.skullRows[i].side === 'right'){
                s.x += config.width /4;
                s.minX = config.width/2;
                s.maxX = config.width - 15;
            }
            else {
                 s.x -= config.width /4;
                 s.minX = 15;
                 s.maxX = config.width/2 - 15;
             }

            s.play('skull-move')
        }

    }
}

