const audio = new Audio('fst.mp3');

function playAudio() {
    const button = document.getElementById('play');
    button.style.display = "none";
    audio.play();

    setTimeout(() => {
      playAudio();
    }, 45000);
  }

class Constants{
    static SCREEN_WIDTH = 800;
    static SCREEN_HEIGHT = 600;
}

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    scene: [Scene1, Scene2],
    parent: 'intro-container',
};

const game = new Phaser.Game(config);
