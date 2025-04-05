class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.yPos = 0;
    }

    preload() {
        this.load.image('dig-dug1', 'pics/dig-dug1.gif');
        this.load.image('dig-dug2', 'pics/dig-dug2.gif');
        this.load.image('dig-dug3', 'pics/dig-dug3.gif');
    }

    create() {
        this.digdug = SpriteManager.createDigDug(this);
    }

    update(time, delta) {
        //console.log(time + ", " + delta + ", " + this.counter);
        if (time = 2000){
            this.scene.start('Scene2');
        }
    }

}
