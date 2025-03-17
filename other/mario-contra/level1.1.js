class Scene1_1 extends MainScene {
    constructor() {
        super('Scene1.1');
    }

    preload() {
        super.preload();
        this.load.image('brick', 'files/cross.png');
        this.load.image('grass', 'files/grass.png');
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('turtle', 'files/zombie.png');
        this.load.image('cloud', 'files/distant-mountain.png');
        this.load.image('graveyard', 'files/graveyard.png');
        this.load.image('question', 'files/grave.png');
        this.load.image('building', 'files/building.png');
        this.load.image('castle', 'files/heavy-door.png');
        this.load.image('coin', 'files/grave-coin.png');
        this.load.image('fire-upgrade', 'files/grave-fire.png');
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        this.spriteGroup = new SpriteGroupHelper(this).createSpritesLevel1_1();
    }

    moveEnemies(time){
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)) {
                child.x -= child.speedX;
                child.y += child.speedY;
            }
        });
    }

    checkVictory(){
        super.checkVictory();
        const forcedLevel = sessionStorage.getItem('force-level');
        if (forcedLevel){
            if (forcedLevel == '2.2')
                this.scene.start('Scene2.2');
            else if (forcedLevel == '3.1') {
                this.scene.start('Scene3.1');
            }
        }

        this.spriteGroup.children.iterate(child => {
            if (child.texture.key === 'castle') {
                if (child.x <= MainScene.TILE_WIDTH){
                    window.alert("Let's travel to MarioLand !!!");
                    this.scene.start('Scene2.1');
                }
            }
        });
    }
}
