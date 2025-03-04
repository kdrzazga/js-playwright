
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scene: [Scene1_1, Scene1_2, Scene2_1],
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

function play() {
    var audio = new Audio('files/contrametal.mp3');
    audio.play();
    setInterval(function() {
      audio.play();
    }, (6*60+50)*165);
    console.log('Music started.');
}

function start(){
    let container = document.getElementById('game-container');
    let header = document.getElementById('header');
    let header2 = document.getElementById('header2');
    let footer = document.getElementById('footer');

    container.innerHTML = '';
    header.innerHTML = '<td></td><td>SCORE</td><td></td><td>COINS</td><td></td><td>WORLD</td><td></td><td>TIME</td>';
    header2.innerHTML = "<td></td><td id='score'>0</td><td></td><td id='coins'>0</td><td></td><td id='world'>1-1</td><td></td><td id='time'>0</td>";
    footer.innerHTML = '<td></td><td>MARIO</td><td></td><td>CONTRA</td><td></td><td></td><td></td><td></td>';
    play();
    const game = new Phaser.Game(config)
}
