class Scene1 extends MainScene{

    constructor(){
        super('Scene1');

        this.nonBrickRows = [1,2];
        this.nonBrickColumns = [5];
    }

    create(){
        super.create();
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        super.createSpriteGroup();
    }

}
