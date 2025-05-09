const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#6699cc',
    width: 1000,
    height: 600,
    scene: [MainScene],
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
    let container = document.getElementById('game-container');
    let header = document.getElementById('header');
    let footer = document.getElementById('footer');
	
    const game = new Phaser.Game(config)
    return game;
}
