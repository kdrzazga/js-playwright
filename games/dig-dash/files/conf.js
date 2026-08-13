const config = {
    type: Phaser.AUTO,
    parent: 'board',
    width: 800,
    height: 600,
    scene: [Level1],
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
