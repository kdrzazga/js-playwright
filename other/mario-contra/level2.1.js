class Scene2_1 extends MainScene {
    constructor() {
        super('Scene2.1');
        this.mainCharacterPic = 'kupaR1';
        this.mainCharacterRunningPic = 'kupaR2';
        this.bulletPic = 'files/fire.png';
        this.backgroundColor = 0;
    }

    preload(){
        //super.preload();
        this.textures.remove('commando');
        this.load.image('road', 'files/croad.png');
        this.load.image('helicopter', 'files/heli.png');
        this.load.image('background1', 'files/chopper.png');
        this.load.image('kupaR1', 'files/koopaR1.png');
        this.load.image('kupaR2', 'files/koopaR2.png');
        this.load.image('4-black-clouds', 'files/4blackClouds.png');
        this.load.image('outpost', 'files/outpost.png');
        this.load.image('ruin', 'files/ruin1.png');
        this.load.image('runner1', 'files/runner1.png');
        this.load.image('runner2', 'files/runner2.png');
        this.load.image('runner3', 'files/runner3.png');
        this.load.image('runner4', 'files/runner4.png');
        this.currentCommandoTexture = 'kupaR2';
    }

    create(){
        super.create();
        this.commando.y = this.sys.canvas.height - 120;
        const forcedLevel = sessionStorage.getItem('force-level');
        if (forcedLevel)
            MainScene.COMMANDO_SPEED *=5;
        this.commando.setDepth(2);
        const level = document.getElementById('world');
        level.innerText = "2-1";
        this.createSpriteGroup();
    }

    createSpriteGroup() {
        this.spriteGroup = new SpriteGroupHelper(this).createSpritesLevel2_1();

        this.anims.create({
                    key: 'run',
                    frames: [
                        { key: 'runner1' },
                        { key: 'runner2' },
                        { key: 'runner3' },
                        { key: 'runner4' }
                    ],
                    frameRate: 10,
                    repeat: -1
                });

        for (let i = 0; i < 10; i++) {
                    const runnerSprite = this.spriteGroup.create(100 + i * 300, 300, 'runner1');
                    runnerSprite.play('run');
                }
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

    move(time){
        this.cameras.main.setBackgroundColor(this.backgroundColor);
        if (this.cursors.down.isDown) {
            this.bulletAngle = 0.05;
        }
        else if (this.cursors.up.isDown) {
            this.bulletAngle = -0.05;
        }
        else this.bulletAngle = 0;
        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= MainScene.COMMANDO_SPEED;
            });
            if (time - this.lastTextureChange > 300) {
                this.commando.setTexture(this.currentCommandoTexture);
                this.currentCommandoTexture = (this.currentCommandoTexture === this.mainCharacterPic) ? this.mainCharacterRunningPic : this.mainCharacterPic;
                this.lastTextureChange = time;
            }
        }
        else {
            this.commando.setTexture(this.currentCommandoTexture);
        }
    }

}
