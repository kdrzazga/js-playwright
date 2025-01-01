class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level 1' });
        this.currentPlayerPic = 'vehicle';
    }

    preload() {
        this.loadImages();
    }

    create() {
        this.physics.world.setBounds(0, 0, 800, 600);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(100, 400, 'vehicle');
        this.player.setCollideWorldBounds(true);

        this.ground = new Ground(this);
    }

    update() {
        this.ground.update();

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }
    }

    loadImages() {
        this.load.image('ground', 'files/ground.bmp');
        this.load.image('vehicle', 'files/vehicle.bmp');
    }
}
