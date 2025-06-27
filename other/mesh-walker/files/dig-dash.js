class MyScene extends Phaser.Scene {

    static TILE_SIZE = 75;

    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
        this.load.image('player', 'files/dd.bmp');
    }

    create() {
        this.playerSize = MyScene.TILE_SIZE;
        this.player = this.physics.add.sprite(150, 150, 'player');
        this.playerSpeed = 100;

        this.currentDirection = 'right'; // 'left', 'right', 'up', 'down'
        this.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        this.isMoving = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.drawMesh();
    }

    drawMesh(){
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x00cc00);
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        for (let x = 0; x <= width; x += this.playerSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += this.playerSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        graphics.strokePath();
    }

    update(time, delta) {

        const alignedX = this.player.x % this.playerSize === 0;
        const alignedY = this.player.y % this.playerSize === 0;


        if (this.cursors.left.isDown) {
            if (alignedY) this.currentDirection = 'left';
        } else if (this.cursors.right.isDown) {
            if (alignedY) this.currentDirection = 'right';
        } else if (this.cursors.up.isDown) {
            if (alignedX) this.currentDirection = 'up';
        } else if (this.cursors.down.isDown) {
            if (alignedX) this.currentDirection = 'down';
        }

        if (this.currentDirection) {
            switch(this.currentDirection){
                case 'left': this.player.x--; break;
                case 'right': this.player.x++; break;
                case 'up': this.player.y--; break;
                case 'down': this.player.y++; break;
            }
        }

        //this.currentDirection = '';
    }

}