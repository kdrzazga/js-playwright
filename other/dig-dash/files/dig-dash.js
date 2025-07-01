class BaseLevel extends Phaser.Scene {

    static TILE_SIZE = 75;
    static BOARD_WIDTH = 120;
    static BOARD_HEIGHT = 80;

    constructor(levelKey) {
        super({ key: levelKey });

        this.emptyColumns = [];
        this.emptyRows = [];
        this.meshShiftX = 0;
        this.meshShiftY = 0;
    }

    preload() {
        this.load.image('player', '../common/pics/dig-dug/dig-dug1.png');
        this.load.image('player2', '../common/pics/dig-dug/dig-dug2.png');
        this.load.image('player3', '../common/pics/dig-dug/dig-dug3.png');
        this.load.image('dirt-tile', '../common/pics/dirt.png');
    }

    create() {
        this.spriteGroup = this.add.group();
        this.container = this.add.container(0, 0);
        const startX = 5*BaseLevel.TILE_SIZE;
        const startY = 1*BaseLevel.TILE_SIZE
        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.absoluteX = startX;
        this.player.absoluteY = startY;
        this.player.setScale(0.75);

        for (let x = 0; x < BaseLevel.BOARD_WIDTH; x++)
            for (let y = 0; y < BaseLevel.BOARD_HEIGHT; y++){

                let isWithinEmptyRow = this.emptyRows.some(entry => {
                  return y === entry.row && x >= entry.start && x <= entry.end;
                });

                let isWithinEmptyColumn = this.emptyColumns.some(entry => {
                  return x === entry.column && y >= entry.start && y <= entry.end;
                });

                if (isWithinEmptyRow || isWithinEmptyColumn) continue;

                const tile = this.physics.add.sprite(x*BaseLevel.TILE_SIZE, y*BaseLevel.TILE_SIZE, 'dirt-tile');
                tile.setDepth(-5);
                tile.setScale(1.49);
                this.spriteGroup.add(tile);
            }

        this.currentDirection = 'right'; // 'left', 'right', 'up', 'down'
        this.targetPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
        this.isMoving = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.drawMesh();
    }

    drawMesh(){
        this.container = this.add.container(0, 0);
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x00cc00);
        const width = 4*this.sys.game.config.width;
        const height = 3*this.sys.game.config.height;

        for (let x = 0; x <= width; x += BaseLevel.TILE_SIZE) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += BaseLevel.TILE_SIZE) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        graphics.strokePath();

        this.spriteGroup.add(this.container);
        this.container.add(graphics);
    }

    update(time, delta) {

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
                case 'left': this.moveLeft(); break;
                case 'right': this.moveRight(); break;
                case 'up': this.moveUp(); break;
                case 'down': this.moveDown(); break;
            }
        }

    this.currentDirection = '';
    }

    moveLeft(){
        const movement = -1;
        const limit = BaseLevel.TILE_SIZE;
        const maxX = Math.floor(this.sys.game.config.width / BaseLevel.TILE_SIZE) * BaseLevel.TILE_SIZE;
        if(this.player.x > limit) {
            this.player.x += movement;
            this.player.absoluteX += movement;
            this.player.flipX = true;
        }
        else {
            this.spriteGroup.children.iterate( s => s.x++);
            this.player.absoluteX += movement;
        }
        this.digConditionally();
    }

    moveRight(){
        const movement = 1;
        const maxX = Math.floor(this.sys.game.config.width / BaseLevel.TILE_SIZE) * BaseLevel.TILE_SIZE;
        const limit = 8 * BaseLevel.TILE_SIZE;
        if (this.player.x < limit)  {
            this.player.x += movement;
            this.player.absoluteX += movement;
            this.player.flipX = false;
        }
        else {
            this.spriteGroup.children.iterate( s => s.x--);
            this.player.absoluteX += movement;
        }
        this.digConditionally();
    }

    moveUp(){
        if(this.player.y > BaseLevel.TILE_SIZE) {
            this.player.y--;
            this.player.absoluteY--;
        }
        else {
            this.spriteGroup.children.iterate( s => s.y++);
            this.player.absoluteY--;
        }
        this.digConditionally();
    }

    moveDown(){
        const maxY = Math.floor(this.sys.game.config.height / BaseLevel.TILE_SIZE) * BaseLevel.TILE_SIZE;
        const limit = 6 * BaseLevel.TILE_SIZE;
        if(this.player.y < limit)  {
            this.player.y++;
            this.player.absoluteY++;
            this.digConditionally();
        }
        else {
            this.spriteGroup.children.iterate( s => s.y--);
            this.player.absoluteY++;
        }
        this.digConditionally();
    }

    digConditionally(){
        //TODO
    }

    getTileTexture(sprite){
        //TODO
    }

    isAlignedX(){
        if ((this.player.x + this.meshShiftX)  % BaseLevel.TILE_SIZE < BaseLevel.TILE_SIZE /3){
            const newX = Math.floor(this.player.x / BaseLevel.TILE_SIZE) * BaseLevel.TILE_SIZE;
            this.player.x = newX;
            return true;
        }
        return false;
    }

    isAlignedY(){
        if ((this.player.y + this.meshShiftY) % BaseLevel.TILE_SIZE < BaseLevel.TILE_SIZE /3){
            const newY = Math.floor(this.player.y / BaseLevel.TILE_SIZE) * BaseLevel.TILE_SIZE;
            this.player.y = newY;
            return true;
        }
        return false;
    }
}
