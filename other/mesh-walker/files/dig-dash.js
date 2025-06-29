class MyScene extends Phaser.Scene {

    static TILE_SIZE = 75;

    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
        this.load.image('player', 'files/dd.bmp');
        this.load.image('dirt-tile', '../common/pics/dirt.png');
    }

    create() {
        this.spriteGroup = this.add.group();
        this.player = this.physics.add.sprite(2*MyScene.TILE_SIZE, 2*MyScene.TILE_SIZE, 'player');
        this.tile = this.physics.add.sprite(4*MyScene.TILE_SIZE, 3*MyScene.TILE_SIZE, 'dirt-tile');
        this.playerSpeed = 100;

        this.currentDirection = 'right'; // 'left', 'right', 'up', 'down'
        this.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        this.isMoving = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.drawMesh();
    }

    drawMesh(){
        const container = this.add.container(0, 0);
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x00cc00);
        const width = 4*this.sys.game.config.width;
        const height = 3*this.sys.game.config.height;

        for (let x = 0; x <= width; x += MyScene.TILE_SIZE) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += MyScene.TILE_SIZE) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        graphics.strokePath();
    }

    update(time, delta) {
        const maxX = Math.floor(this.sys.game.config.width / MyScene.TILE_SIZE) * MyScene.TILE_SIZE;
        const maxY = Math.floor(this.sys.game.config.height / MyScene.TILE_SIZE) * MyScene.TILE_SIZE;

        if (this.cursors.left.isDown) {
            if (this.isAlignedY()) this.currentDirection = 'left';
        } else if (this.cursors.right.isDown) {
            if (this.isAlignedY()) this.currentDirection = 'right';
        } else if (this.cursors.up.isDown) {
            if (this.isAlignedX()) this.currentDirection = 'up';
        } else if (this.cursors.down.isDown) {
            if (this.isAlignedX()) this.currentDirection = 'down';
        }

        if (this.currentDirection) {
            switch(this.currentDirection){
                case 'left': if(this.player.x > MyScene.TILE_SIZE) this.player.x--; break;
                case 'right': if(this.player.x < maxX)  this.player.x++; break;
                case 'up': if(this.player.y > MyScene.TILE_SIZE)  this.player.y--; break;
                case 'down': if(this.player.y < maxY)  this.player.y++; break;
            }
        }

    this.currentDirection = '';
    }

    isAlignedX(){
        if (this.player.x % MyScene.TILE_SIZE < MyScene.TILE_SIZE /3){
            const newX = Math.floor(this.player.x / MyScene.TILE_SIZE) * MyScene.TILE_SIZE;
            this.player.x = newX;
            return true;
        }
        return false;
    }

    isAlignedY(){
        if (this.player.y % MyScene.TILE_SIZE < MyScene.TILE_SIZE /3){
            const newY = Math.floor(this.player.y / MyScene.TILE_SIZE) * MyScene.TILE_SIZE;
            this.player.y = newY;
            return true;
        }
        return false;
    }

}