// Falling objects for the Boulder-Dash side of the game.
// BDObject owns the picture and the shared "fall down an empty tunnel" behaviour;
// Boulder and Diamond only specialise how they react to the player.
class BDObject extends Phaser.GameObjects.Sprite {

    static KEY = '';        // texture key   (set per subclass)
    static PICTURE = '';    // path to picture (set per subclass, loaded in preload)

    constructor(scene, cellX, cellY) {
        super(scene, cellX * BaseLevel.TILE_SIZE, cellY * BaseLevel.TILE_SIZE, new.target.KEY);
        this.cellX = cellX;
        this.cellY = cellY;
        this.falling = false;
        this.wasPushed = false;
        this.dead = false;
        this.setDepth(-5);
        scene.add.existing(this);
        scene.spriteGroup.add(this);   // so it scrolls with the world
        scene.fallers.push(this);      // so the scene updates it
    }

    // --- traits (overridden by subclasses) ---
    get blocksPlayer()     { return false; }   // stops the player walking through
    get pushable()         { return false; }   // can be shoved sideways
    get collectible()      { return false; }   // picked up on contact
    get crushesFromAbove() { return false; }   // landing directly above the player counts as a hit
    onPlayerContact()      {}                   // reaction when this object meets the player

    overlapsPlayer() {
        const T = BaseLevel.TILE_SIZE, p = this.scene.player;
        return Math.abs(this.x - p.x) < T * 0.5 && Math.abs(this.y - p.y) < T * 0.5;
    }

    // Is the cell below blocked, so this object stays put?
    isSupported() {
        const lvl = this.scene;
        return (this.cellY + 1 >= BaseLevel.BOARD_HEIGHT)          // ground
            || lvl.isSolidCell(this.cellX, this.cellY + 1, this)   // dirt / another resting object
            || lvl.playerAtCell(this.cellX, this.cellY + 1);       // resting on the player's head -> nothing
    }

    // Ease a half-pushed object back onto the grid once it is no longer being shoved.
    settle() {
        if (this.falling || this.wasPushed) return;
        const cx = this.scene.cellScreenX(this.cellX);
        if (this.x !== cx)
            this.x = (Math.abs(this.x - cx) <= BaseLevel.SPEED) ? cx : this.x + Math.sign(cx - this.x) * BaseLevel.SPEED;
    }

    // Fall one step down an empty tunnel, reacting if it meets the player.
    fall() {
        const lvl = this.scene;
        if (!this.falling) {
            if (this.isSupported()) return;
            this.falling = true;                                  // clear gap below -> start falling
        }
        const targetY = lvl.cellScreenY(this.cellY + 1);
        this.x = lvl.cellScreenX(this.cellX);                     // stay locked to its column
        this.y = Math.min(this.y + BaseLevel.FALL_SPEED, targetY);

        if (this.overlapsPlayer()) { this.onPlayerContact(); return; }   // player is in its way

        if (this.y >= targetY) {                                  // dropped a whole tile
            this.cellY += 1;
            if (lvl.playerAtCell(this.cellX, this.cellY)) { this.onPlayerContact(); return; }              // fell into the player
            if (this.crushesFromAbove && lvl.playerAtCell(this.cellX, this.cellY + 1)) { this.onPlayerContact(); return; }  // onto their head
            if (this.isSupported()) this.falling = false;         // came to rest
        }
    }
}

class Boulder extends BDObject {

    static KEY = 'boulder';
    static PICTURE = 'files/stone.png';

    constructor(scene, cellX, cellY) {
        super(scene, cellX, cellY);
        this.setDisplaySize(BaseLevel.TILE_SIZE, BaseLevel.TILE_SIZE);   // exactly one tile
    }

    get blocksPlayer()     { return true; }
    get pushable()         { return true; }
    get crushesFromAbove() { return true; }
    onPlayerContact()      { this.scene.killPlayer(); }
}

class Diamond extends BDObject {

    static KEY = 'diamond';
    static PICTURE = 'files/diamond.png';

    constructor(scene, cellX, cellY) {
        super(scene, cellX, cellY);
        this.setDepth(1);                                               // above dirt/rocks & mesh, below the player
        this.setScale(BaseLevel.TILE_SIZE * 0.72 / Math.max(this.width, this.height));  // fit a tile, keep aspect
    }

    get collectible() { return true; }
    onPlayerContact() { this.scene.collectDiamond(this); }

    // A diamond does not rest on the player's head - it falls into them and is collected.
    isSupported() {
        const lvl = this.scene;
        return (this.cellY + 1 >= BaseLevel.BOARD_HEIGHT)
            || lvl.isSolidCell(this.cellX, this.cellY + 1, this);
    }
}

// A Pac-Man-style ghost that roams the dug tunnels. Dig Dug can pump it with the hose;
// each pump raises `inflated` (which is also the sprite's scale) until it bursts.
class Monster extends Phaser.GameObjects.Sprite {

    static KEY = 'monster';
    static PICTURE = 'files/ghost.png';
    static SPEED = 2;             // px per frame (slower than the player, so it is dodgeable)
    static MAX_INFLATION = 2;     // bursts once inflated exceeds this
    static PUMP_STEP = 0.25;      // inflation added per press of fire
    static DEFLATE = 0.01;        // per-frame shrink-back once you stop pumping
    static DEFLATE_GRACE = 60;    // frames after a pump before it starts deflating

    constructor(scene, cellX, cellY) {
        super(scene, cellX * BaseLevel.TILE_SIZE, cellY * BaseLevel.TILE_SIZE, Monster.KEY);
        this.worldX = cellX * BaseLevel.TILE_SIZE;   // world-pixel position (screen = world - meshShift)
        this.worldY = cellY * BaseLevel.TILE_SIZE;
        this.destX = this.worldX;
        this.destY = this.worldY;
        this.dir = null;                             // {dx, dy} of current travel
        this.inflated = 1;                           // also the sprite scale
        this.deflateTimer = 0;
        this.dead = false;
        this.setDepth(5);                            // above dirt/diamonds, below the player
        this.setScale(this.inflated);
        scene.add.existing(this);
        scene.monsterSprites.push(this);
    }

    get cellX() { return Math.round(this.worldX / BaseLevel.TILE_SIZE); }
    get cellY() { return Math.round(this.worldY / BaseLevel.TILE_SIZE); }

    // Dig Dug pumped it once.
    pump() {
        this.inflated += Monster.PUMP_STEP;
        this.deflateTimer = Monster.DEFLATE_GRACE;
        this.setScale(this.inflated);
        if (this.inflated > Monster.MAX_INFLATION) this.burst();
    }

    burst() {
        this.dead = true;
        const i = this.scene.monsterSprites.indexOf(this);
        if (i >= 0) this.scene.monsterSprites.splice(i, 1);
        this.destroy();
    }

    wander() {
        if (this.dead) return;

        // While inflated the monster is stunned (harmless); it slowly deflates once you stop pumping.
        if (this.inflated > 1) {
            if (this.deflateTimer > 0) this.deflateTimer--;
            else { this.inflated = Math.max(1, this.inflated - Monster.DEFLATE); this.setScale(this.inflated); }
            this.syncScreen();
            return;
        }

        if (this.atDest()) this.chooseDirection();
        if (this.dir) {
            this.worldX = this.approach(this.worldX, this.destX);
            this.worldY = this.approach(this.worldY, this.destY);
        }
        this.syncScreen();

        // touching Dig Dug is fatal
        const T = BaseLevel.TILE_SIZE, p = this.scene.player;
        if (Math.abs(this.x - p.x) < T * 0.5 && Math.abs(this.y - p.y) < T * 0.5) this.scene.killPlayer();
    }

    atDest() { return this.worldX === this.destX && this.worldY === this.destY; }

    approach(cur, target) {
        const s = Monster.SPEED;
        if (cur < target) return Math.min(cur + s, target);
        if (cur > target) return Math.max(cur - s, target);
        return cur;
    }

    // At a cell centre, pick an open neighbouring tunnel, preferring not to double back.
    chooseDirection() {
        const cx = this.cellX, cy = this.cellY;
        const dirs = [{dx:1,dy:0}, {dx:-1,dy:0}, {dx:0,dy:1}, {dx:0,dy:-1}];
        const open = dirs.filter(d => this.canEnter(cx + d.dx, cy + d.dy));
        if (open.length === 0) { this.dir = null; return; }
        const forward = open.filter(d => !this.dir || d.dx !== -this.dir.dx || d.dy !== -this.dir.dy);
        this.dir = Phaser.Utils.Array.GetRandom(forward.length ? forward : open);
        this.destX = (cx + this.dir.dx) * BaseLevel.TILE_SIZE;
        this.destY = (cy + this.dir.dy) * BaseLevel.TILE_SIZE;
    }

    canEnter(cx, cy) {
        if (cx < 0 || cx >= BaseLevel.BOARD_WIDTH || cy < 0 || cy >= BaseLevel.BOARD_HEIGHT) return false;
        return !this.scene.isSolidCell(cx, cy, null);   // only open (dug) tunnels, not dirt/rocks
    }

    syncScreen() {
        this.x = this.worldX - this.scene.meshShiftX;
        this.y = this.worldY - this.scene.meshShiftY;
    }
}

// The pump hose: a stretched & rotated sprite drawn from Dig Dug to the monster while pumping.
class Hose extends Phaser.GameObjects.Sprite {

    static KEY = 'hose';
    static PICTURE = 'files/hose.png';

    constructor(scene) {
        super(scene, 0, 0, Hose.KEY);
        this.setOrigin(0, 0.5);     // grows out from (x1,y1) toward the target
        this.setDepth(4);           // under the monster, so it looks plugged in
        this.setVisible(false);
        scene.add.existing(this);
    }

    // Stretch and rotate so the hose spans exactly from (x1,y1) to (x2,y2).
    aim(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const dist = Math.max(1, Math.hypot(dx, dy));
        this.setPosition(x1, y1);
        this.setRotation(Math.atan2(dy, dx));
        this.setScale(dist / this.width, (BaseLevel.TILE_SIZE * 0.3) / this.height);
        this.setVisible(true);
    }

    hide() { this.setVisible(false); }
}