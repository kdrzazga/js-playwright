class Scene2 extends MainScene {
    constructor() {
        super('Scene2');

    }

    preload(){
        super.preload();
        this.load.image('princess', 'files/princess.png');
        this.load.image('kupa', 'files/koopa.png');
        this.load.image('cage', 'files/cage.png');
        this.load.image('help', 'files/help.png');
        this.load.image('save-me', 'files/saveMe.png');
        this.load.image('nothing', 'files/nothing.png');
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
        this.speechBubble = this.add.sprite(733, this.commando.y -80, 'help');
        this.princess = this.add.sprite(333, this.commando.y - 50, 'princess');
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

    moveEnemies(time){
        const t = time % 20000;
        let texture;
        let multiplier = -1;

        if (t > 5000 && t < 10000) {
            texture = 'save-me';
            multiplier = -1;
        } else if (t > 15000 && t < 20000) {
            texture = 'help';
            multiplier = 1;
        } else {
            texture = 'nothing';
        }

        this.speechBubble.setTexture(texture);

        const deltaX = 5 * Math.sin(multiplier*time/200);
        const deltaY = 14 * Math.cos(time/200);
        this.princess.x += deltaX;
        this.princess.y += deltaY;
    }
}
