const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#1a1015',
    width: 900,
    height: 600,
    scene: [MainScene]
};

function startGame() {
    document.getElementById('intro').remove();
    new Phaser.Game(config);
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('intro').addEventListener('click', startGame, { once: true });
});
