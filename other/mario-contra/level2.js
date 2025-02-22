class Scene2 extends MainScene {
    constructor() {
        super('Scene2');
    }

    preload(){
        super.preload();
        this.load.image('princess', 'files/princess.png');
        this.load.image('kupa', 'files/koopa.png');
        this.load.image('cage', 'files/cage.png');
    }

    create(){
        super.create();
        const level = document.getElementById('world');
        level.innerText = "1-2";
        this.createSprites();
        this.physics.world.setBounds(0, 733, 200, 600);
    }

    createSprites() {
        this.kupa = this.add.sprite(733, this.commando.y + 10, 'kupa');
        this.cage = this.add.sprite(733, this.commando.y + 10, 'cage');
        this.princess = this.add.sprite(333, this.commando.y + 10, 'princess');
    }

    move(time){
        if (this.cursors.down.isDown) {
            this.bulletAngle = 0.05;
        }
        else if (this.cursors.up.isDown) {
            this.bulletAngle = -0.05;
        }
        else this.bulletAngle = 0;

        if (this.cursors.right.isDown) {
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
}
