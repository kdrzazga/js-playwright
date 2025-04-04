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
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Intro' });
        this.lines = [];
        this.yPos = 0;
    }

    preload() {
        this.load.image('c64', 'c64.png');

        this.load.image('saboteur1', 'pics/sab1.png');
        this.load.image('saboteur2', 'pics/sab2.png');
        this.load.image('saboteur3', 'pics/sab3.png');

        this.load.image('giana-calm1', 'c64.png');
        this.load.image('giana-calm2', 'c64.png');
        this.load.image('giana-calm3', 'c64.png');

        this.load.image('giana-crazy1', 'c64.png');
        this.load.image('giana-crazy2', 'c64.png');
        this.load.image('giana-crazy3', 'c64.png');
    }

    create() {
        this.graphics = this.add.graphics();
        this.startX = 0;
        this.startY = 240;
        this.endX = Constants.SCREEN_WIDTH;
        this.endY = 300;
        this.frequency = 0.02;
        this.amplitude = 170;
        this.offset = 0;

        this.counter = 0;
        this.time.addEvent({
            delay: 10,
            callback: this.updateLine,
            callbackScope: this,
            loop: true
        });
        this.circle = this.add.circle(400, 300, 100, 0xaa00aa);
        this.c64 = this.add.sprite(400, 300, 'c64');
        const colors = [0xff00f8, 0xdd00dd, 0xbb00bb, 0x990092, 0x770077
                       ,0xff00f9, 0xdd00dd, 0xbb00bb, 0x990093, 0x770076
                       ,0xff00fa, 0xdd00dd, 0xbb00bb, 0x990094, 0x770075
                       ,0xff00fb, 0xdd00dd, 0xbb00bb, 0x990095, 0x770074
                       ,0xff00fc, 0xdd00dd, 0xbb00bb, 0x990096, 0x770073
                       ,0xff00fd, 0xdd00dd, 0xbb00bb, 0x990097, 0x770072
                       ,0xff00fe, 0xdd00dd, 0xbb00bb, 0x990098, 0x770071
                       ,0xff00ff, 0xdd00dd, 0xbb00bb, 0x990099, 0x770070
        ];

        colors.forEach(c =>{
            const line = this.add.line(Constants.SCREEN_WIDTH/2, Constants.SCREEN_HEIGHT/2, 0, 0, Constants.SCREEN_WIDTH, 0, c);
            this.lines.push(line);
            this.lines.push(line);
            this.lines.push(line);
        });

        this.saboteur = SpriteManager.createSaboteur(this);
    }

    updateLine() {
        console.log('update line');
        this.graphics.clear();
        this.offset += this.frequency;

        this.yPos = this.startY + Math.sin(this.offset) * this.amplitude;
        for(let index = 0; index < this.lines.length; index++){
            this.lines[index].y = this.yPos + index;
        }

        if (this.yPos > 5.2*Constants.SCREEN_HEIGHT/8) {
            this.logoToBack();
        }
        else if (this.yPos < 1*Constants.SCREEN_HEIGHT/8) {
            this.logoToFront();
        }
    }

    update(time, delta) {
        //console.log(time + ", " + delta + ", " + this.counter);
        this.counter++;

        this.saboteur.move(this.yPos);
    }

    logoToFront(){
        this.circle.setDepth(-3);
        this.c64.setDepth(-3);
    }

    logoToBack(){
        this.circle.setDepth(3);
        this.c64.setDepth(3);
        console.log('Logo moved to back');
    }
}

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    scene: IntroScene,
    parent: 'intro-container',
};

const game = new Phaser.Game(config);
