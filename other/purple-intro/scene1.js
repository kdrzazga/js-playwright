class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.yPos = 0;
    }

    preload() {
        this.load.image('dig-dug1', 'pics/dig-dug1.png');
        this.load.image('dig-dug2', 'pics/dig-dug2.png');
        this.load.image('dig-dug3', 'pics/dig-dug3.png');
    }

    create() {
        this.digdug = SpriteManager.createDigDug(this);
    }

    update(time, delta) {
        console.log(time + ", " + delta + ", ");
        if (time < 8000)
            this.digdug.moveLeft();
        else if (time < 20000)
            this.digdug.moveRight();
        else if (time > 20000)
            this.digdug.moveLeft();

        if (time > 31000){
            this.scene.start('Scene2');
        }
    }

}
