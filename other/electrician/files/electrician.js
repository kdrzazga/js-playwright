class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.spriteCanJump = true;
    }

    preload() {
        this.load.image('sprite', 'files/electrician.png');
        this.load.image('ladder', 'files/ladder.png');

        this.load.image('floor0', 'files/attic.png');
        const ladderTexture = this.textures.get('floor0');
        Floor.WIDTH = 617;//ladderTexture.getSourceImage().width;
        Floor.HEIGHT = 110;//ladderTexture.getSourceImage().height;
        console.log('Floor height = ' + Floor.HEIGHT);

        this.load.image('floor1', 'files/livingRoom.png');
        this.load.image('floor2', 'files/kitchen.png');

        this.load.image('power-line-left', 'files/powerlineL.png');
        this.load.image('power-line-right', 'files/powerlineR.png');

        this.load.image('wire-section', 'files/wire.png');
        this.load.image('wire-section-up', 'files/wireUp.png');
        this.load.image('wire-section-down', 'files/wireDown.png');
    }

    create() {
        this.physics.world.setBounds(0, 0, 800, 600);

        this.building = Creator.create3storeBuilding(this.physics);
        
        this.player = this.physics.add.sprite(100, 400, 'sprite');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.handleMovement();
        this.conditionalFallDown();
    }

    jump(direction) {
        if (!this.spriteCanJump) return;

        this.spriteCanJump = false;
        const jumpHeight = 45;
        const duration = 750;

        const jumpTween = {
            targets: this.player,
            y: this.player.y - jumpHeight, // Move up
            duration: duration / 2, // Up for half the duration
            ease: 'Linear',
            onComplete: () => {

                const comeDownTween = {
                    targets: this.player,
                    y: this.player.y + jumpHeight, // Move down
                    duration: duration / 2,
                    ease: 'Linear',
                    onComplete: () => {
                        // Re-enable jumping after 1 second
                        this.spriteCanJump = true;
                    }
                };
                this.tweens.add(comeDownTween);
            }
        }

        this.tweens.add(jumpTween);

        if (direction === 'left') {
            this.player.setVelocityX(-160);
        } else if (direction === 'right') {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0); // No horizontal movement if just jumping
        }
    }

    conditionalFallDown(){
        let flrs = ""

        if (this.building.ladder.onLadder(this.player.x)){
            return; //Ladder prevents from falling;
        }

        let velocity = 160;

        this.building.floors.forEach(f => {
            flrs += " " + f.floorLevel;

            if (f.onFloor(this.player.x, this.player.y) && !this.building.ladder.onLadder(this.player.x)){
                console.log('Floor met on y= ' + this.player.y);
                velocity = 0; //Floor under feet prevents from falling
                this.player.spriteCanJump = true;
                return;
            }
        });

        this.player.setVelocityY(velocity);
        //console.log("Fall down y = ", this.player.y, " FloorLevels = " + flrs);
    }

    handleMovement() {
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown) {
            velocityX = -160;
            if (this.cursors.up.isDown) {
                this.jump('left');
            }
        } else if (this.cursors.right.isDown) {
            velocityX = 160;
            if (this.cursors.up.isDown) {
                this.jump('right');
            }
        }

        if (velocityX === 0 && this.building.ladder.onLadder(this.player.x)) {
            if (this.cursors.up.isDown) {
                velocityY = -160;
            } else if (this.cursors.down.isDown) {
                velocityY = 160;
            }
        }

        this.player.setVelocityX(velocityX);
        this.player.setVelocityY(velocityY);

        if (this.cursors.space.isDown || this.cursors.shift.isDown){
            let action = WireSlot.WIRE_STRAIGHT;
            if (this.cursors.down.isDown) {
                action = WireSlot.WIRE_DOWN;
            }
            else if (this.cursors.up.isDown) {
                action = WireSlot.WIRE_UP;
            }

            this.building.drawWire(this.player, action);
        }

        this.writeFloorInfo();
    }

    writeFloorInfo(){
        const floorInfo = document.getElementById('floor-number');
        const realCurrentFloor = this.building.getCurrentFloor(this.player);
        let prettyCurrentFloor = this.building.floors.length - realCurrentFloor;
        if (Math.abs(this.player.y - 600) < 30){
            prettyCurrentFloor = 0;
        }

        let prettyCurrentFloorText = realCurrentFloor < 0 ? ' ' : prettyCurrentFloor;
        floorInfo.innerText = `${prettyCurrentFloorText} (${realCurrentFloor})`;
    }
}

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MainScene
};

const game = new Phaser.Game(config);
