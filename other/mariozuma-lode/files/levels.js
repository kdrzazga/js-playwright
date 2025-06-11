class Scene1 extends MainScene{

    constructor(){
        super('Scene1');

        this.nonBrickRows = [1,2];
        this.skullRows= [ {'row': 2, 'side': 'right'} ];
        this.nextScene['right'] = 'Scene2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
    }

}

class Scene2 extends MainScene{

    constructor(){
        super('Scene2');

        this.nonBrickRows = [1,2, 4,6, 8];

        this.skullRows= [ {'row': 2, 'side': 'right'}, {'row': 4, 'side': 'right'}
            , {'row': 2, 'side': 'right'}, {'row': 6, 'side': 'left'}
            , {'row': 6, 'side': 'left'}, {'row': 8, 'side': 'right'}
            , {'row': 8, 'side': 'right'}, {'row': 8, 'side': 'left'}
            ];

        this.nextScene['left'] = 'Scene1';
        this.nextScene['right'] = 'Scene3';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let increase = 2;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                child.speedX += increase % 4;
                increase = increase + 1;
                //child.x += Globals.TILE_WIDTH*increase/3;
            }
        });
    }
}

class Scene3 extends MainScene{

    constructor(){
        super('Scene3');
        this.backgroundColor = 'black';

        this.nonBrickRows = [0,1,2,3,4,5,6,7,8,9,10];

        this.skullRows= [ {'row': 4, 'side': 'right'}, {'row': 6, 'side': 'left'} , {'row': 8, 'side': 'right'} ];

        this.nextScene['left'] = 'Scene2';
        this.nextScene['right'] = 'Scene4';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();

        let factor = Globals.TILE_WIDTH;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                child.x += factor;
                factor *= -1.6;
            }
        });
    }
}

class Scene4 extends MainScene{
    constructor(){
        super('Scene4');
        this.backgroundColor = 'black';

        this.nonBrickRows = [0,1,2,3,4,5,6,7,8,9,10];

        this.skullRows= [ {'row': 4, 'side': 'left'}, {'row': 5, 'side': 'right'} , {'row': 7, 'side': 'left'} ];

        this.nextScene['left'] = 'Scene3';
        this.nextScene['right'] = 'Scene5';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let increase = 1;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                increase = increase + 0.5;
                child.speedX = 1.5 +( increase/6);
                child.x += increase;
            }
        });
    }
}

class Scene5 extends MainScene{

    constructor(){
        super('Scene5');

        this.nonBrickRows = [1,2];
        this.nonBrickColumns = [5];

        this.skullRows= [ {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}
            , {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}
            , {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}, {'row': 2, 'side': 'right'}];
        this.ladderColumns = [ {'column' : 5, 'start' : 3, 'end' : 11}];


        this.nextScene['left'] = 'Scene4';
        this.nextScene['right'] = 'Scene6';
        this.nextScene['bottom'] = 'Scene9';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
        this.exits['bottom']['x'] = '4';
        this.exits['bottom']['y'] = '10';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let increase = 1;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                increase = increase + 0.25;
                child.speedX = 1.5 +( increase/6);
                child.x = 12*Globals.TILE_WIDTH - Globals.TILE_WIDTH*increase;
                child.maxX = 11*Globals.TILE_WIDTH - 6;
            }
        });
    }
}

class Scene6 extends MainScene{

    constructor(){
        super('Scene6');

        this.nonBrickRows = [1,2, 4,6, 8];

        this.skullRows= [ {'row': 2, 'side': 'right'}, {'row': 4, 'side': 'left'}
            , {'row': 2, 'side': 'right'}, {'row': 6, 'side': 'left'}
            , {'row': 6, 'side': 'left'}, {'row': 8, 'side': 'left'}
            , {'row': 8, 'side': 'left'}, {'row': 8, 'side': 'left'}
            ];

        this.nextScene['left'] = 'Scene5';
        this.nextScene['right'] = 'Scene7';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let increase = 2;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                child.speedX += increase % 4;
                increase = increase + 1;
                //child.x += Globals.TILE_WIDTH*increase/3;
            }
        });
    }
}

class Scene7 extends MainScene{

    constructor(){
        super('Scene7');

        this.nonBrickRows = [1,2];
        this.skullRows= [ {'row': 2, 'side': 'right'} ];
        this.nextScene['left'] = 'Scene6';
        this.nextScene['right'] = 'Scene8';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let emptyCells = [[1,4], [1,5], [1,6], [1,7], [1,8], [2,8]
            ,[4,8],[5,8],[6,8],[6,7],[6,6],[6,5],[6,4],[5,4],[4,4],[4,5],[4,6],[4,7]
            ,[8,8],[9,8],[10,7],[10,6],[10,5],[9,4],[8,4],[8,5],[8,6],[8,7]
            ,[12,4], [12,5], [12,6], [12,7], [12,8], [13,8], [13,6], [13,4]];

        emptyCells.forEach(cell => {
            cell[0] *= Globals.TILE_WIDTH;
            cell[1] *= Globals.TILE_WIDTH;
        });

        this.spriteGroup.children.iterate(sprite => {
            if (sprite.texture.key === 'brick'){
                const isEmpty = emptyCells.some(cell => cell[0] === sprite.x && cell[1] === sprite.y);
                if (isEmpty) {
                    sprite.setTexture('ladder');
                }
            }
        });
    }
}

class Scene8 extends MainScene{

    constructor(){
        super('Scene8');

        this.nonBrickRows = [1,2,5,6,7,8,9,10];
        this.skullRows= [ {'row': 2, 'side': 'right'} ];
        this.nextScene['left'] = 'Scene7';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();

        const fireAnimation = this.add.sprite(6*Globals.TILE_WIDTH + 13, 7*Globals.TILE_WIDTH, 'fire1');
        fireAnimation.play('fire');
        const xs = [0,1, 12, 13];
        for(let y = 5; y < 11; y++){
            xs.forEach(x => this.add.sprite(x*Globals.TILE_WIDTH, y*Globals.TILE_WIDTH, 'brick'));
        }

    }
}

class Scene10 extends MainScene{

    constructor(){
        super('Scene10');

        this.nonBrickRows = [1,2, 4,6, 8,9,10];

        this.skullRows= [ {'row': 4, 'side': 'right'}
            , {'row': 6, 'side': 'right'}
            , {'row': 6, 'side': 'left'}, {'row': 6, 'side': 'right'}
            , {'row': 4, 'side': 'left'}, {'row': 6, 'side': 'right'}
            ];

        this.nextScene['left'] = 'Scene9';
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
        this.nextScene['right'] = 'Scene11';
        this.exits['right']['x'] = '13';
        this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        let increase = 6;
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)){
                child.speedX += increase;
                increase = increase + 1;
                //child.x += Globals.TILE_WIDTH*increase/3;
            }
        });

        const fireAnimation = this.add.sprite(6*Globals.TILE_WIDTH + 13, 10.5*Globals.TILE_WIDTH, 'fire1');
        fireAnimation.play('fire');
        const xs = [0,1, 12, 13];
        for(let y = 7; y < 11; y++){
            xs.forEach(x => this.add.sprite(x*Globals.TILE_WIDTH, y*Globals.TILE_WIDTH, 'brick'));
        }
    }
}

class Scene9 extends MainScene{

    constructor(){
        super('Scene9');

        this.nonBrickRows = [1,2, 4,5,6,7, 8,9,10];

        this.skullRows= [ {'row': 2, 'side': 'right'}
            ];

            this.nextScene['right'] = 'Scene10';
            this.exits['right']['x'] = '13';
            this.exits['right']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();

        const fireAnimation = this.add.sprite(6*Globals.TILE_WIDTH + 13, 6.5*Globals.TILE_WIDTH, 'fire1');
        fireAnimation.play('fire');
        const xs = [0,1, 12, 13];
        for(let y = 4; y < 11; y++){
            xs.forEach(x => this.add.sprite(x*Globals.TILE_WIDTH, y*Globals.TILE_WIDTH, 'brick'));
        }
    }
}

class Scene11 extends MainScene{

    constructor(){
        super('Scene11');

        this.nonBrickRows = [1,2, 4,5,6,7, 8,9,10];

            this.nextScene['left'] = 'Scene10';
            this.exits['left']['x'] = '0';
            this.exits['left']['y'] = '2';
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();

        const fireAnimation = this.add.sprite(6*Globals.TILE_WIDTH + 13, 6.5*Globals.TILE_WIDTH, 'fire1');
        fireAnimation.play('fire');
        const xs = [0,1, 12, 13];
        for(let y = 4; y < 11; y++){
            xs.forEach(x => this.add.sprite(x*Globals.TILE_WIDTH, y*Globals.TILE_WIDTH, 'brick'));
        }
    }
}
