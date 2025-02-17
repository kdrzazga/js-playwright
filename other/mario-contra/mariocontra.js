class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static COMMANDO_SPEED = 5;
    constructor() {
        super('MainScene');
        this.time = 0;
        this.lastTextureChange = 0;
    }

    preload() {
        this.load.image('ground', 'files/sprite.png');
        this.load.image('commando', 'files/commando.png');
        this.load.image('commando2', 'files/commando2.png');
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('turtle', 'files/turtle.png');
        this.load.image('cloud', 'files/cloud.png');
        this.load.image('high-hill', 'files/highhill.png');
        this.load.image('low-hill', 'files/lowhill.png');
        this.load.image('castle', 'files/castle.png');
        this.currentCommandoTexture = 'commando';
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
        this.spriteGroup = new SpriteGroupHelper(this).createSprites();
    }

    update(time, delta) {
        this.moveBackground(time);
        this.moveEnemies();
        this.checkVictory();
        this.updateHeader(time);
    }

    moveBackground(time){
        this.cameras.main.setBackgroundColor(0x507fff);
        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= MainScene.COMMANDO_SPEED;
            });
            if (time - this.lastTextureChange > 300) {
                this.commando.setTexture(this.currentCommandoTexture);
                this.currentCommandoTexture = (this.currentCommandoTexture === 'commando') ? 'commando2' : 'commando';
                this.lastTextureChange = time;
            }
        }
        else {
            this.commando.setTexture('commando');
        }
    }

    moveEnemies(){
        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'gumba' || child.texture.key === 'turtle') {
                child.x -= 1;
            }
        });
    }

    checkVictory(){

        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'castle') {
                if (child.x <= 1*  MainScene.TILE_WIDTH){
                    window.alert('You win ! The princess is in this particular castle.');
                    location.reload();
                }
            }
        });
    }

    updateHeader(time){
        var timeCell = document.getElementById('time');
        const seconds = Math.floor(time/1000) % 1000;
        timeCell.innerText = String(seconds).padStart(3, '0');
    }
}
