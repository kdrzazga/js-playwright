class Constants{
    SCREEN_WIDTH = 1200;
    SCREEN_HEIGHT = 800;
}

class LevelScene extends Phaser.Scene {
    constructor(levelName) {
        super({ key: levelName });
    }
}

const levelObject = new LevelScene('Level 1');

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [levelObject]
};

let game = new Phaser.Game(config);
