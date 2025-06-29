const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scene: [MyScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
};

function start(){
    const game = new Phaser.Game(config)
    return game;
}

const g = start();
