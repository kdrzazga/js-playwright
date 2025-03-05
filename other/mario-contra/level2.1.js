class Scene2_1 extends MainScene {
    constructor() {
        super('Scene2.1');
        this.mainCharacterPic = 'kupaR1';
        this.mainCharacterRunningPic = 'kupaR2';
        this.bulletPic = 'files/fire.png';
        this.backgroundColor = 0;
    }

    preload(){
        super.preload();
        this.load.image('road', 'files/croad.png');
        this.load.image('helicopter', 'files/heli.png');
        this.load.image('kupaR1', 'files/koopaR1.png');
        this.load.image('kupaR2', 'files/koopaR2.png');
        this.currentCommandoTexture = 'kupaR2';
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
            if (child.texture.key === 'helicopter') {
                if (child.x <= MainScene.TILE_WIDTH){
                    const container = document.getElementById('footer');
                    container.innerHTML = "<td colspan='7'><div style='text-align: center;'><img src='files/castleKupa2.png'></div></td>";
                    this.reset('You win! Bonus +100');
                }
            }
        });
    }
}
