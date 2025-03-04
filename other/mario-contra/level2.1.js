class Scene2_1 extends MainScene {
    constructor() {
        super('Scene2.1');
        this.mainCharacterPic = 'kupa';
        this.mainCharacterRunningPic = 'kupa';
        this.backgroundColor = 0;
    }

    preload(){
        super.preload();
        this.load.image('road', 'files/croad.png');
        this.currentCommandoTexture = 'kupa';
    }

    create(){
        super.create();
        this.commando.y = this.sys.canvas.height - 120;
        this.commando.setDepth(2);
        const level = document.getElementById('world');
        level.innerText = "2-1";
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        this.spriteGroup = new SpriteGroupHelper(this).createSpritesLevel2_1();
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
            if (forcedLevel == '1.2')
                this.scene.start('Scene1.2');
        }

        this.spriteGroup.children.iterate(child => {
            if (child.texture.key === 'castle') {
                if (child.x <= MainScene.TILE_WIDTH){
                    window.alert('Great ! The princess is in this particular castle.');
                    this.scene.start('Scene1.2');
                }
            }
        });
    }
}
