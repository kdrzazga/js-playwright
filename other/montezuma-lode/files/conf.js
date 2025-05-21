const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scene: [Scene1, Scene2, Scene3, Scene4],
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

function start(){
    const game = new Phaser.Game(config)
    return game;
}

const g = start();
