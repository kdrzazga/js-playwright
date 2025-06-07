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
            , {'row': 2, 'side': 'right'}, {'row': 6, 'side': 'right'}
            , {'row': 6, 'side': 'right'}, {'row': 8, 'side': 'right'}
            , {'row': 8, 'side': 'right'}, {'row': 8, 'side': 'right'}
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

        this.skullRows= [ {'row': 4, 'side': 'right'}, {'row': 6, 'side': 'right'} , {'row': 8, 'side': 'right'} ];

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
        this.exits['left']['x'] = '0';
        this.exits['left']['y'] = '2';
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
                child.x = 13*Globals.TILE_WIDTH - Globals.TILE_WIDTH*increase;
            }
        });
    }
}
