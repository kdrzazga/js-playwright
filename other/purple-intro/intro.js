const audio = new Audio('fst.mp3');

function playAudio() {
    const button = document.getElementById('play');
    button.style.display = "none";
    audio.play();

    setTimeout(() => {
      playAudio();
    }, 45000);
  }

function moveScroll() {
    var scroll = document.getElementById('scroll');
    scroll.style.left = (parseInt(scroll.style.left) - 5) + 'px';
}

function conditionalScrollReset() {
    var scroll = document.getElementById('scroll');
    if (parseInt(scroll.style.left) < -2000) {
        scroll.style.left = '1600px';
    }
}

setInterval(()=>{
    console.log('t');
    moveScroll();
    conditionalScrollReset();
}, 120);

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
