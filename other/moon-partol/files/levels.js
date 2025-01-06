class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level 1' });
        this.currentPlayerPicIndex = 0;
        this.distance = 0;
        this.totalDistance = 0;
        this.collisions = 0;

        const maxY = 520;
        this.maxJump = 520;

        this.craterPoints = [3, 7,  10, 16, 22, 24, 29, 32, 37, 41,
                            45, 49, 55, 56, 62, 65, 70, 73, 77, 83,
                            88, 91, 95, 99, 104,107,110,116,122,129,
                           132,136,141,143,149];
    }

    preload() {
        this.loadImages();
    }

    create() {
        this.physics.world.setBounds(0, 0, 800, this.maxJump);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.sprite(100, this.maxJump, 'vehicle0');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravity(0, 2450);
        this.player.body.allowGravity = true;
        this.player.setDepth(8);

        this.ground = new Ground(this);
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

        this.checkCollision();
    }

    increaseDistance() {
        this.distance += 1;
        this.totalDistance = Math.floor(this.distance + this.player.x * 8/580 - 1);
        this.updateDisplay();
    }

    checkCollision(){
        //document.getElementById('debug').innerText = `${this.player.y}, ${this.maxJump}`;
        if (this.player.y< 450)
            return;

        if (this.craterPoints.includes(this.totalDistance)){
            this.collisions++;
            this.craterPoints = this.craterPoints.filter(point => point !== this.totalDistance);
        }
        this.updateDisplay();
    }

    rotateWheel(){
        const picName = 'vehicle' + this.currentPlayerPicIndex;
        this.player.setTexture(picName);
        this.currentPlayerPicIndex = (this.currentPlayerPicIndex + 1) % 3;
    }

    loadImages() {
        this.load.image('ground', 'files/ground.bmp');
        this.load.image('vehicle0', 'files/vehicle0.png');
        this.load.image('vehicle1', 'files/vehicle1.png');
        this.load.image('vehicle2', 'files/vehicle2.png');
    }

    updateDisplay(){
        document.getElementById('distance').innerText = this.distance;
        document.getElementById('rel-distance').innerText = this.totalDistance;
        document.getElementById('fails').innerText = this.collisions;
    }
}
