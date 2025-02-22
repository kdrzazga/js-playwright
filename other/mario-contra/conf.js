
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scene: [Scene1, Scene2],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500,
                x: 0,
            },
            debug: false,
        }
    }
};

const game = new Phaser.Game(config);
