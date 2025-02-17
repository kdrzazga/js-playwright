class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static COMMANDO_SPEED = 5;
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('ground', 'files/sprite.png');
        this.load.image('commando', 'files/commando.png');
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('cloud', 'files/cloud.png');
        this.load.image('high-hill', 'files/highhill.png');
        this.load.image('low-hill', 'files/lowhill.png');
        this.load.image('castle', 'files/castle.png');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
        this.spriteGroup = this.add.group();
        for (let i = 0; i < 240; i++) {
            const x = i * MainScene.TILE_WIDTH;
            const sprite = this.add.sprite(x, this.sys.canvas.height - 50, 'ground');
            this.spriteGroup.add(sprite);
        }

        for (let i=0.2; i < 5.2; i++){
            const cloud1 = this.add.sprite(MainScene.TILE_WIDTH *50*i, 70, 'cloud');
            const cloud2 = this.add.sprite(MainScene.TILE_WIDTH *50*i + 10*MainScene.TILE_WIDTH, 55, 'cloud');
            this.spriteGroup.add(cloud1);
            this.spriteGroup.add(cloud2);
        }

        for (let x=4; x<210; x += 40){
            const highHill = this.add.sprite(x * MainScene.TILE_WIDTH, this.sys.canvas.height - 120, 'high-hill');
            this.spriteGroup.add(highHill);
            const lowHill = this.add.sprite((x + 11) * MainScene.TILE_WIDTH, this.sys.canvas.height - 100, 'low-hill');
            this.spriteGroup.add(lowHill);
        }

        const castle = this.add.sprite(235 * MainScene.TILE_WIDTH, 338, 'castle');
        this.spriteGroup.add(castle);

        const gumba1 = this.add.sprite(900, this.sys.canvas.height - 105, 'gumba');
        const gumba2 = this.add.sprite(1050, this.sys.canvas.height - 105, 'gumba');
        this.spriteGroup.add(gumba1);
        this.spriteGroup.add(gumba2);
    }

    update(time, delta) {
        this.moveBackground();
        this.moveEnemies();
        this.checkVictory();
    }

    moveBackground(){
        this.cameras.main.setBackgroundColor(0x507fff);
        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= MainScene.COMMANDO_SPEED;
            });
        }
    }

    moveEnemies(){
        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'gumba') {
                child.x -= 1;
            }
        });
    }

    checkVictory(){

        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'castle') {
                if (child.x <= 1*  MainScene.TILE_WIDTH){
                    window.alert('You win ! The princess is in this very castle.');
                    location.reload();
                }
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [MainScene]
};

const game = new Phaser.Game(config);
