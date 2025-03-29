class Constants{
    static SCREEN_WIDTH = 800;
    static SCREEN_HEIGHT = 600;
}
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
    }

    create() {
        this.graphics = this.add.graphics();
        this.startX = 0;
        this.startY = 300;
        this.endX = Constants.SCREEN_WIDTH;
        this.endY = 300;
        this.frequency = 0.1;
        this.amplitude = 50;
        this.offset = 0;

        this.time.addEvent({
            delay: 1,
            callback: this.updateLine,
            callbackScope: this,
            loop: true
        });
        this.circle = this.add.circle(400, 300, 100, 0xff0000);
        const thickness = 5;
        this.line = this.add.line(Constants.SCREEN_WIDTH/2, Constants.SCREEN_HEIGHT/2, 0, 0, Constants.SCREEN_WIDTH, 0, 0xffffff, thickness);
    }

    updateLine() {
        console.log('update line');
        this.graphics.clear();
        this.offset += this.frequency;
        const yPos = this.startY + Math.sin(this.offset) * this.amplitude;
        this.line.y = yPos;
    }

    update() {

    }
}

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    scene: IntroScene,
};

const game = new Phaser.Game(config);
