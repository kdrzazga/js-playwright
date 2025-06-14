const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scene: [Scene5, Scene2, Scene3, Scene4, Scene1, Scene6, Scene7, Scene8, Scene9, Scene10
            , Scene11, Scene12, Scene13, Scene14, Scene15, Scene16, Scene17, Scene18, Scene19],
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
