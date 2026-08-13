class BaseLevel extends Phaser.Scene {

    static TILE_SIZE = 75;
    static BOARD_WIDTH = 120;
    static BOARD_HEIGHT = 80;
    // How close (in px) the player must be to a cell centre before a turn is allowed.
    // Keep it small so turns snap cleanly onto the grid; raise it for looser controls.
    static ALIGN_TOLERANCE = 8;
    static SPEED = 3;         // player movement, px per frame
    static FALL_SPEED = 5;    // BD-object fall, px per frame (a touch faster than the player)

    constructor(levelKey) {
        super({ key: levelKey });

        this.emptyColumns = [];
        this.emptyRows = [];
        this.meshShiftX = 0;
        this.meshShiftY = 0;
        this.boulders = [];
        this.diamonds = [];
        this.monsters = [];
    }

    preload() {
        this.load.image('player', '../common/pics/dig-dug/dig-dug1.png');
        this.load.image('player2', '../common/pics/dig-dug/dig-dug2.png');
        this.load.image('player3', '../common/pics/dig-dug/dig-dug3.png');
        this.load.image('dirt-tile', '../common/pics/dirt.png');
        this.load.image(Boulder.KEY, Boulder.PICTURE);
        this.load.image(Diamond.KEY, Diamond.PICTURE);
        this.load.image(Monster.KEY, Monster.PICTURE);
        this.load.image(Hose.KEY, Hose.PICTURE);
    }

    create() {
        // Reset per-run state (create() runs again on scene.restart()).
        this.meshShiftX = 0;
        this.meshShiftY = 0;
        this.gameOver = false;
        this.dirtCells = new Set();      // "cx,cy" of every dirt tile still present
        this.fallers = [];               // BDObjects (boulders + diamonds); they self-register on creation
        this.monsterSprites = [];        // live Monster ghosts; they self-register on creation

        this.spriteGroup = this.add.group();
        this.container = this.add.container(0, 0);
        const startX = 5*BaseLevel.TILE_SIZE;
        const startY = 1*BaseLevel.TILE_SIZE
        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.diamonds = 0
        this.player.absoluteX = startX;
        this.player.absoluteY = startY;
        this.player.setScale(0.75);
        this.player.setDepth(10);        // keep the player above dirt and boulders

        for (let x = 0; x < BaseLevel.BOARD_WIDTH; x++)
            for (let y = 0; y < BaseLevel.BOARD_HEIGHT; y++){

                let isWithinEmptyRow = this.emptyRows.some(entry => {
                  return y === entry.row && x >= entry.start && x <= entry.end;
                });

                let isWithinEmptyColumn = this.emptyColumns.some(entry => {
                  return x === entry.column && y >= entry.start && y <= entry.end;
                });

                if (isWithinEmptyRow || isWithinEmptyColumn) continue;

                if (this.boulders.some(b => {return b.x == x && b.y ==y})) continue;   // rock cell: no dirt behind it

                const tile = this.physics.add.sprite(x*BaseLevel.TILE_SIZE, y*BaseLevel.TILE_SIZE, 'dirt-tile');
                tile.setDepth(-5);
                tile.setScale(1.49);
                tile.cellX = x;
                tile.cellY = y;
                this.spriteGroup.add(tile);
                this.dirtCells.add(x + ',' + y);
            }

        for (const b of this.boulders)
            new Boulder(this, b.x, b.y);   // adds itself to spriteGroup + fallers

        for (const d of this.diamonds)
            new Diamond(this, d.x, d.y);   // adds itself to spriteGroup + fallers

        for (const m of this.monsters)
            new Monster(this, m.x, m.y);   // adds itself to monsterSprites

        this.hose = new Hose(this);        // one reusable hose, shown only while pumping

        this.diamondText = this.add.text(this.sys.game.config.width - 12, 12, '', {
            fontFamily: 'monospace', fontSize: '20px', color: '#2ee6ff'
        }).setOrigin(1, 0).setDepth(1000);
        this.updateDiamondInfo();

        this.currentDirection = '';   // '' = standing still; else 'left' | 'right' | 'up' | 'down'
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
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) this.scene.restart();
            return;
        }

        for (const o of this.fallers) o.wasPushed = false;
        this.handleInput();
        this.updateFallers();    // rocks & diamonds settle / fall even while the player stands still
        if (this.gameOver) return;
        this.updateMonsters();
        if (this.gameOver) return;
        this.handlePumping();
        this.collectDiamonds();
    }

    updateMonsters(){
        for (const m of [...this.monsterSprites]){
            if (m.dead) continue;
            m.wander();
            if (this.gameOver) return;
        }
    }

    // Pump a monster that is within 2 cells in the direction Dig Dug is facing, while fire is held.
    handlePumping(){
        const target = this.findPumpTarget();
        if (target && this.cursors.space.isDown){
            this.hose.aim(this.player.x, this.player.y, target.x, target.y);
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) target.pump();
        } else {
            this.hose.hide();
        }
    }

    findPumpTarget(){
        const T = BaseLevel.TILE_SIZE;
        const pcx = Math.round(this.player.absoluteX / T);
        const pcy = Math.round(this.player.absoluteY / T);
        for (const m of this.monsterSprites){
            if (m.dead) continue;
            if (this.facingToward(m.cellX - pcx, m.cellY - pcy)) return m;
        }
        return null;
    }

    // Is (dx,dy) cells away within 2 cells, straight ahead of the way the player faces?
    facingToward(dx, dy){
        switch (this.currentDirection){
            case 'right': return dy === 0 && dx >=  1 && dx <=  2;
            case 'left':  return dy === 0 && dx <= -1 && dx >= -2;
            case 'down':  return dx === 0 && dy >=  1 && dy <=  2;
            case 'up':    return dx === 0 && dy <= -1 && dy >= -2;
            default:      return false;
        }
    }

    handleInput() {
        const c = this.cursors;
        const dirs = [];
        if (c.left.isDown)  dirs.push('left');
        if (c.right.isDown) dirs.push('right');
        if (c.up.isDown)    dirs.push('up');
        if (c.down.isDown)  dirs.push('down');

        if (dirs.length === 0) return;   // nothing held: stand still, keep last direction

        if (this.currentDirection === '') {
            this.currentDirection = dirs[0];                 // first move from rest
        } else {
            // A perpendicular key is a turn request; a same-axis key just continues or reverses.
            const turn     = dirs.find(d => !this.sameAxis(d, this.currentDirection));
            const straight = dirs.find(d =>  this.sameAxis(d, this.currentDirection));

            if (turn && this.canTurn(turn)) {
                this.alignForTurn(turn);                     // snap onto the corridor, then turn
                this.currentDirection = turn;
            } else if (straight) {
                this.currentDirection = straight;            // continue or reverse - no centring needed
            }
            // else: turn requested but not centred yet -> keep gliding toward the next centre
        }

        this.move(this.currentDirection);
        this.updatePositionInfo();
        this.digConditionally();
    }

    move(dir){
        switch (dir){
            case 'left':  this.moveLeft();  break;
            case 'right': this.moveRight(); break;
            case 'up':    this.moveUp();    break;
            case 'down':  this.moveDown();  break;
        }
    }

    isVertical(dir){ return dir === 'up' || dir === 'down'; }

    sameAxis(a, b){ return this.isVertical(a) === this.isVertical(b); }

    canTurn(dir){
        // To start moving vertically the player must sit on a column line (aligned in X); vice-versa.
        return this.isVertical(dir) ? this.isAlignedX() : this.isAlignedY();
    }

    alignForTurn(dir){
        if (this.isVertical(dir)) this.snapX(); else this.snapY();
    }

    // How far the player may advance this frame before touching a boulder (px, capped at `desired`).
    // A boulder stops the player exactly one tile short of it (adjacent cell, no overlap).
    maxStep(dir, desired){
        const T = BaseLevel.TILE_SIZE;
        let step = desired;
        for (const b of this.fallers){
            if (b.dead || !b.blocksPlayer) continue;                         // only solid rocks block
            if (dir === 'left' || dir === 'right'){
                if (Math.abs(b.y - this.player.y) >= T * 0.5) continue;      // not on this row
                if (dir === 'right' && b.x > this.player.x)
                    step = Math.min(step, Math.max(0, b.x - this.player.x - T));
                else if (dir === 'left' && b.x < this.player.x)
                    step = Math.min(step, Math.max(0, this.player.x - b.x - T));
            } else {
                if (Math.abs(b.x - this.player.x) >= T * 0.5) continue;      // not on this column
                if (dir === 'down' && b.y > this.player.y)
                    step = Math.min(step, Math.max(0, b.y - this.player.y - T));
                else if (dir === 'up' && b.y < this.player.y)
                    step = Math.min(step, Math.max(0, this.player.y - b.y - T));
            }
        }
        return step;
    }

    // Shove a resting boulder one tile sideways if the cell beyond it is clear.
    // Returns true while the shove is happening so the player advances with the rock.
    pushBoulder(dir){
        const T = BaseLevel.TILE_SIZE;
        const sign = (dir === 'right') ? 1 : -1;
        for (const b of this.fallers){
            if (b.dead || !b.pushable || b.falling) continue;                    // only resting, pushable rocks
            if (Math.abs(b.y - this.player.y) >= T * 0.5) continue;              // must share the player's row
            if (Math.abs((b.x - this.player.x) - sign * T) >= T * 0.4) continue;  // the rock directly ahead
            const farX = b.cellX + sign;
            if (farX < 0 || farX >= BaseLevel.BOARD_WIDTH) return false;          // no room off-board
            if (this.isSolidCell(farX, b.cellY, b)) return false;                // dirt / another rock in the way
            b.x += sign * BaseLevel.SPEED;                                       // slide it along with the player
            b.wasPushed = true;
            if (Math.abs(b.x - this.cellScreenX(farX)) < BaseLevel.SPEED){        // reached the next cell
                b.x = this.cellScreenX(farX);
                b.cellX = farX;
            }
            return true;
        }
        return false;
    }

    moveLeft(){
        this.player.flipX = true;
        let step = this.maxStep('left', BaseLevel.SPEED);
        const limit = BaseLevel.TILE_SIZE;
        if (step <= 0){                                             // a boulder is blocking
            if (this.player.x > limit && this.pushBoulder('left')) step = BaseLevel.SPEED;
            else return;
        }
        if(this.player.x > limit) {
            this.player.x -= step;
            this.player.absoluteX -= step;
        }
        else {
            this.spriteGroup.children.iterate( s => s.x += step);   // scroll the world right
            this.meshShiftX -= step;
            this.player.absoluteX -= step;
        }
    }

    moveRight(){
        this.player.flipX = false;
        let step = this.maxStep('right', BaseLevel.SPEED);
        const limit = 8 * BaseLevel.TILE_SIZE;
        if (step <= 0){                                            // a boulder is blocking
            if (this.player.x < limit && this.pushBoulder('right')) step = BaseLevel.SPEED;
            else return;
        }
        if (this.player.x < limit)  {
            this.player.x += step;
            this.player.absoluteX += step;
        }
        else {
            this.spriteGroup.children.iterate( s => s.x -= step);   // scroll the world left
            this.meshShiftX += step;
            this.player.absoluteX += step;
        }
    }

    moveUp(){
        const step = this.maxStep('up', BaseLevel.SPEED);
        if (step <= 0) return;
        if(this.player.y > BaseLevel.TILE_SIZE) {
            this.player.y -= step;
            this.player.absoluteY -= step;
        }
        else {
            this.spriteGroup.children.iterate( s => s.y += step);   // scroll the world down
            this.meshShiftY -= step;
            this.player.absoluteY -= step;
        }
    }

    moveDown(){
        const step = this.maxStep('down', BaseLevel.SPEED);
        if (step <= 0) return;
        const limit = 6 * BaseLevel.TILE_SIZE;
        if(this.player.y < limit)  {
            this.player.y += step;
            this.player.absoluteY += step;
        }
        else {
            this.spriteGroup.children.iterate( s => s.y -= step);   // scroll the world up
            this.meshShiftY += step;
            this.player.absoluteY += step;
        }
    }

    // --- Boulders -----------------------------------------------------------

    // Screen coords of a world cell's centre, valid after any amount of scrolling.
    cellScreenX(i){ return i * BaseLevel.TILE_SIZE - this.meshShiftX; }
    cellScreenY(j){ return j * BaseLevel.TILE_SIZE - this.meshShiftY; }

    // Is world cell (i, j) filled by dirt or by a boulder at rest? (Used as fall support.)
    isSolidCell(i, j, except){
        if (this.dirtCells.has(i + ',' + j)) return true;
        for (const o of this.fallers){   // a resting rock or diamond is solid support
            if (o !== except && !o.dead && !o.falling && o.cellX === i && o.cellY === j) return true;
        }
        return false;
    }

    playerAtCell(i, j){
        const T = BaseLevel.TILE_SIZE;
        return Math.round(this.player.absoluteX / T) === i
            && Math.round(this.player.absoluteY / T) === j;
    }

    updateFallers(){
        for (const o of [...this.fallers]){   // copy: a collected diamond removes itself mid-loop
            if (o.dead) continue;
            o.settle();                        // slide a half-pushed rock back onto the grid
            o.fall();                          // drop down an empty tunnel, reacting to the player
            if (this.gameOver) return;
        }
    }

    killPlayer(){
        if (this.gameOver) return;
        this.gameOver = true;
        this.player.setTint(0xff0000);
        const cx = this.sys.game.config.width / 2;
        const cy = this.sys.game.config.height / 2;
        this.add.text(cx, cy, 'GAME OVER\npress SPACE', {
            fontFamily: 'monospace', fontSize: '42px', color: '#ff3030', align: 'center'
        }).setOrigin(0.5).setDepth(1000);
    }

    // --- Digging & HUD ------------------------------------------------------

    digConditionally(){
        const texture = this.getTileTexture(this.player);
        const infoDiv = document.getElementById('extraInfoFrame');
        infoDiv.innerText = texture;

        this.conditionallyRemoveTileTexture(this.player);
    }

    getTileTexture(sprite){
        // Tiles carry screen coords (they scroll), so compare against the player's screen
        // position too. A tile is "under" the player when their centres are within half a tile.
        const half = BaseLevel.TILE_SIZE / 2;
        let texture = '';
        this.spriteGroup.children.iterate(child => {
            if (child.texture
                && Math.abs(child.x - sprite.x) < half
                && Math.abs(child.y - sprite.y) < half){
                    texture = child.texture.key;
                    return false;   // nearest tile found - stop scanning
                }
        });

        return texture;
    }

    conditionallyRemoveTileTexture(sprite){
        const half = BaseLevel.TILE_SIZE / 2;
        this.spriteGroup.children.iterate(child => {
            if (child.texture && child.texture.key === 'dirt-tile'   // dig dirt, not stone
                && Math.abs(child.x - sprite.x) < half
                && Math.abs(child.y - sprite.y) < half){
                    this.dirtCells.delete(child.cellX + ',' + child.cellY);   // free the cell so rocks can fall
                    this.spriteGroup.remove(child);
                    child.destroy();
                    return false;
                }
        });
    }

    updatePositionInfo(){
        const tileX = Math.floor(this.player.absoluteX / BaseLevel.TILE_SIZE);
        const tileY = Math.floor(this.player.absoluteY / BaseLevel.TILE_SIZE);

        const coordsDiv = document.getElementById('coordinates');
        coordsDiv.innerText = tileX + ' ,' + tileY;
    }

    collectDiamonds(){
        for (let i = this.fallers.length - 1; i >= 0; i--){
            const o = this.fallers[i];
            if (!o.dead && o.collectible && o.overlapsPlayer()) this.collectDiamond(o);
        }
    }

    collectDiamond(o){
        if (o.dead) return;
        o.dead = true;
        const i = this.fallers.indexOf(o);
        if (i >= 0) this.fallers.splice(i, 1);
        this.spriteGroup.remove(o);
        o.destroy();
        this.player.diamonds++;
        this.updateDiamondInfo();
    }

    updateDiamondInfo(){
        if (this.diamondText) this.diamondText.setText('Diamonds: ' + this.player.diamonds);
    }

    // --- Grid alignment -----------------------------------------------------

    // Signed distance (px) from the player to the nearest column line, in [-TILE/2, TILE/2).
    // meshShiftX keeps this correct after the world has scrolled.
    alignErrorX(){
        let m = ((this.player.x + this.meshShiftX) % BaseLevel.TILE_SIZE + BaseLevel.TILE_SIZE) % BaseLevel.TILE_SIZE;
        if (m > BaseLevel.TILE_SIZE / 2) m -= BaseLevel.TILE_SIZE;
        return m;
    }

    alignErrorY(){
        let m = ((this.player.y + this.meshShiftY) % BaseLevel.TILE_SIZE + BaseLevel.TILE_SIZE) % BaseLevel.TILE_SIZE;
        if (m > BaseLevel.TILE_SIZE / 2) m -= BaseLevel.TILE_SIZE;
        return m;
    }

    isAlignedX(){ return Math.abs(this.alignErrorX()) <= BaseLevel.ALIGN_TOLERANCE; }

    isAlignedY(){ return Math.abs(this.alignErrorY()) <= BaseLevel.ALIGN_TOLERANCE; }

    // Nudge the player exactly onto the nearest line so corridors stay aligned after a turn.
    snapX(){
        const e = this.alignErrorX();
        this.player.x -= e;
        this.player.absoluteX -= e;
    }

    snapY(){
        const e = this.alignErrorY();
        this.player.y -= e;
        this.player.absoluteY -= e;
    }
}
