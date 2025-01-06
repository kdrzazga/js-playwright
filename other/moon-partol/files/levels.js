class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level 1' });
        this.currentPlayerPicIndex = 0;
    }

    preload() {
        this.loadImages();
    }

    create() {
        const maxY = 500;
        this.maxJump = 400;
        this.physics.world.setBounds(0, 0, 800, maxY);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(100, maxY, 'vehicle0');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravity(0, 2450);
        this.player.body.allowGravity = true;

        this.ground = new Ground(this);
        this.distance = 0;
        this.time.addEvent({
            delay: 1000,
            callback: this.increaseDistance,
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: 200,
            callback: this.rotateWheel,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.ground.update();

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else if (this.cursors.up.isDown) {
            if (this.player.y < this.maxJump) this.player.setVelocityY(-160);
        } else {
            this.player.setVelocityX(0);
            if (this.player.y > this.maxJump) this.player.setVelocityY(0);
        }
    }

    increaseDistance() {
        this.distance += 1;
        document.getElementById('distance').innerText = this.distance;
    }

    rotateWheel(){
        const picName = 'vehicle' + this.currentPlayerPicIndex;
        this.player.setTexture(picName);
        this.currentPlayerPicIndex = (this.currentPlayerPicIndex + 1) % 3;
    }

    loadImages() {
        this.load.image('ground', 'files/ground.bmp');
        this.load.image('vehicle0', 'files/vehicle0.bmp');
        this.load.image('vehicle1', 'files/vehicle1.bmp');
        this.load.image('vehicle2', 'files/vehicle2.bmp');
    }
}
