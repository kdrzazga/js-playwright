class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.yPos = 0;
        this.digDugLeaving = false;
        this.musicPlaying = false;
    }

    preload() {
        this.load.image('dig-dug1', 'pics/dig-dug1.png');
        this.load.image('dig-dug2', 'pics/dig-dug2.png');
        this.load.image('dig-dug3', 'pics/dig-dug3.png');
        this.load.image('loading', 'pics/loading.png');
        this.load.audio('backgroundMusic', 'muza.mp3');
    }

    create() {
        this.digdug = SpriteManager.createDigDug(this, 852);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.sprite(400, 185, 'loading');
        this.music = this.sound.add('backgroundMusic');
        this.music.setLoop(true);
    }

    update(time, delta) {
        if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown){
            this.digDugLeaving = true;
            this.digdug.speed = 4;
            this.music.play();
            this.playing = true;
        }

        if (this.digDugLeaving){
                this.digdugLeave();
                return;
            }

        this.digdug.move();
    }

    digdugLeave(event){
        this.digdug.moveRight();

        if(this.digdug.sprite.x >= this.digdug.limitX)
            this.scene.start('Scene2');
    }

}
