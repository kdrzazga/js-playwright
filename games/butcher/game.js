const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#1a1015',
    width: 900,
    height: 600,
    scene: [MainScene]
};

const game = new Phaser.Game(config);
