class Scene2_1 extends MainScene {
    constructor() {
        super('Scene2.1');
        this.backgroundColor = 0x507fff;
    }

    preload() {
        super.preload();
        const toBeRemoved = ['turtle', 'castle', 'cloud', 'ground', 'question', 'fire-upgrade', 'coin'
            , 'brick', 'gumba', 'gumbaL'];
        toBeRemoved.forEach(texture => this.textures.remove(texture));

        this.load.image('brick', 'files/brick.png');
        this.load.image('ground', 'files/sprite.png');
        this.load.image('turtle', 'files/turtle.png');
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('gumbaL', 'files/gumbaL.png');
        this.load.image('cloud', 'files/cloud.png');
        this.load.image('high-hill', 'files/highhill.png');
        this.load.image('low-hill', 'files/lowhill.png');
        this.load.image('castle', 'files/castle.png');
        this.load.image('question', 'files/question.png');
        this.load.image('coin', 'files/blank.png');
        this.load.image('fire-upgrade', 'files/blankFire.png');
    }

    create(){
        super.create();
        const level = document.getElementById('world');
        level.innerText = "2-1";
    }

    createSpriteGroup() {
        super.createSpriteGroup();
        this.spriteGroup = new SpriteGroupHelper(this).createSpritesLevel2_1(this.spriteGroup);

        this.anims.create({
            key: 'gumba-walk',
            frames: [
                { key: 'gumba' },
                { key: 'gumbaL' }
            ],
            frameRate: 3,
            repeat: -1
        });

        const canvasHeight = config.height;
        const yPos = canvasHeight - 105;
        const gumbas = [15, 17, 41, 51, 53, 109, 120, 131, 133, 135, 155, 245,266].map(x =>
                this.add.sprite(x * MainScene.TILE_WIDTH, yPos, 'gumba'));
        gumbas.forEach(gumba => {
            gumba.speedX = 1;
            gumba.speedY = 0;
            gumba.play('gumba-walk');
            this.spriteGroup.add(gumba);
        });
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
                    window.alert('Great ! The princess is in this particular castle.');
                    this.scene.start('Scene2.2');
                }
            }
        });
    }
}
