class Scene1 extends MainScene{

    constructor(){
        super('Scene1');

        this.nonBrickRows = [1,2];

        this.skullRows= [ {'row': 2, 'side': 'right'} ];
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

        this.nonBrickRows = [1,2];
        this.nonBrickColumns = [5];

        this.skullRows= [ {'row': 2, 'side': 'right'} ];
        this.ladderColumns = [ {'column' : 5, 'start' : 3, 'end' : 11}];
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
    }

}
