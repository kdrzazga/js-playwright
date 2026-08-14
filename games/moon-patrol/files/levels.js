class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level 1' });
        this.currentPlayerPicIndex = 0;
        this.distance = 0;
        this.totalDistance = 0;
        this.collisions = 0;

        const maxY = 520;
        this.maxJump = 520;

        this.groundTextureWidth = 8150;
        this.craterRanges = [[321, 368], [1135, 1153], [2244, 2262], [3198, 3245],
                             [3910, 3928], [5368, 5415], [6719, 6746], [7376, 7405]];
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

        const bulletGfx = this.add.graphics();
        bulletGfx.fillStyle(0xffff33, 1);
        bulletGfx.fillRect(0, 0, 12, 4);
        bulletGfx.generateTexture('bullet', 12, 4);
        bulletGfx.destroy();

        this.bullets = this.physics.add.group({ allowGravity: false });

        this.fireKeys = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL),
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT)
        ];

        this.ground = new Ground(this);

        this.ufoGroup = this.physics.add.group({ allowGravity: false });
        this.ufos = [];
        for (let i = 0; i < 20; i++)
            this.ufos.push(new Ufo(this, this.ufoGroup, i));
        this.physics.add.overlap(this.bullets, this.ufoGroup, this.hitUfo, null, this);

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

        if (this.fireKeys.some(key => Phaser.Input.Keyboard.JustDown(key)))
            this.fire();

        this.bullets.getChildren().forEach(bullet => {
            if (bullet.x > Constants.SCREEN_WIDTH || bullet.y < 0)
                bullet.destroy();
        });

        this.updateUfos();
        this.checkCollision();
    }

    updateUfos() {
        const pxPerUnit = this.ground.speed * 60;
        const scroll = this.ground.sprite.tilePositionX;
        const t = this.time.now;
        this.ufos.forEach(ufo => ufo.update(pxPerUnit, scroll, t));
    }

    hitUfo(bullet, ufoSprite) {
        bullet.destroy();
        ufoSprite.destroy();
    }

    fire() {
        const forward = this.bullets.create(this.player.x, this.player.y, 'bullet');
        forward.body.allowGravity = false;
        forward.setDepth(7);
        forward.setVelocityX(700);

        const upward = this.bullets.create(this.player.x, this.player.y, 'bullet');
        upward.body.allowGravity = false;
        upward.setDepth(7);
        upward.setAngle(90);
        upward.setVelocityY(-700);
    }

    increaseDistance() {
        this.distance += 1;
        this.updateDisplay();
    }

    computeTotalDistance() {
        const pxPerUnit = this.ground.speed * 60;
        this.totalDistance = Math.floor((this.ground.sprite.tilePositionX + this.player.x - 100) / pxPerUnit);
    }

    textureUnderRover() {
        const g = this.ground.sprite;
        const leftEdge = g.x - g.originX * g.displayWidth;
        const raw = this.ground.sprite.tilePositionX + this.player.x - leftEdge;
        return ((raw % this.groundTextureWidth) + this.groundTextureWidth) % this.groundTextureWidth;
    }

    checkCollision(){
        this.computeTotalDistance();

        if (!this.player.body.blocked.down)
            return;

        const tx = this.textureUnderRover();
        if (this.craterRanges.some(r => tx >= r[0] && tx <= r[1])){
            this.crash();
            return;
        }
        this.updateDisplay();
    }

    crash(){
        this.scene.pause();
        window.alert('CRASH !');
        window.location.reload();
    }

    rotateWheel(){
        const picName = 'vehicle' + this.currentPlayerPicIndex;
        this.player.setTexture(picName);
        this.currentPlayerPicIndex = (this.currentPlayerPicIndex + 1) % 3;
    }

    loadImages() {
        this.load.image('ground', 'files/ground.png');
        this.load.image('vehicle0', 'files/vehicle0.png');
        this.load.image('vehicle1', 'files/vehicle1.png');
        this.load.image('vehicle2', 'files/vehicle2.png');
        this.load.image('ufo', 'files/ufo.png');
    }

    updateDisplay(){
        document.getElementById('distance').innerText = this.distance;
        document.getElementById('rel-distance').innerText = Math.floor(this.totalDistance);
        document.getElementById('fails').innerText = this.collisions;
    }
}
