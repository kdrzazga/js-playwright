class MainScene extends Phaser.Scene {

    constructor() {
        super('main');
    }

    preload() {
        Butcher.preload(this);
        Floor.preload(this);
        Bat.preload(this);
        Cave.preload(this);
        Obelisk.preload(this);
        Minotaur.preload(this);
        Magog.preload(this);
        Cacodemon.preload(this);
        HellBaron.preload(this);
        this.load.audio('music', 'files/diab.mp3');
    }

    create() {
        Butcher.slice(this);
        Butcher.createAnimations(this);
        Floor.slice(this);
        Bat.slice(this);
        Bat.createAnimations(this);
        Cave.slice(this);
        Obelisk.slice(this);
        Obelisk.createAnimations(this);
        Minotaur.slice(this);
        Minotaur.createAnimations(this);
        Magog.slice(this);
        Magog.createAnimations(this);
        Cacodemon.slice(this);
        Cacodemon.createAnimations(this);
        HellBaron.slice(this);
        HellBaron.createAnimations(this);
        this.floor = new Floor(this);
        this.cameraX = this.floor.worldWidth / 2;
        this.cameraY = this.floor.worldHeight / 2;
        this.caves = this.createCaves(1234);
        this.obelisks = this.createObelisks(250);
        this.minotaurs = this.createBelt(30, 7, 20, (x, y) => new Minotaur(this, x, y));
        this.magogs = this.createBelt(50, 21, 25, (x, y) => new Magog(this, x, y));
        this.hellbarons = this.createBelt(45, 25, 30, (x, y) => new HellBaron(this, x, y));
        this.cacodemons = this.createBelt(50, 25, 30, (x, y) => new Cacodemon(this, x, y));
        this.butcher = new Butcher(this, this.scale.width / 2, this.scale.height / 2, Direction.DOWN);
        this.swarms = this.createSwarms(1000);
        this.createControls();
        this.playMusic();
        this.sound.play(TauntSound);
        this.floor.render(this.cameraX, this.cameraY);
    }

    playMusic() {
        const music = this.sound.add('music', { loop: true, volume: 0.5 });
        if (this.sound.locked) {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () => music.play());
        } else {
            music.play();
        }
    }

    createCaves(count) {
        const caves = [];
        for (let index = 0; index < count; index++) {
            const worldX = Math.random() * this.floor.worldWidth;
            const worldY = Math.random() * this.floor.worldHeight;
            caves.push(new Cave(this, worldX, worldY));
        }
        return caves;
    }

    createObelisks(count) {
        const obelisks = [];
        for (let index = 0; index < count; index++) {
            const worldX = Math.random() * this.floor.worldWidth;
            const worldY = Math.random() * this.floor.worldHeight;
            obelisks.push(new Obelisk(this, worldX, worldY));
        }
        return obelisks;
    }

    killFacingEnemies() {
        const facing = DirectionVectors[this.butcher.direction];
        const facingLength = Math.hypot(facing.x, facing.y);
        const reach = 0.3 * TileWidth;
        const enemies = this.minotaurs.concat(this.magogs, this.hellbarons, this.cacodemons);
        for (const enemy of enemies) {
            if (!enemy.active || enemy.dying) {
                continue;
            }
            const dx = enemy.worldX - this.cameraX;
            const dy = enemy.worldY - this.cameraY;
            const distance = Math.hypot(dx, dy);
            if (distance === 0 || distance > reach) {
                continue;
            }
            const alignment = (facing.x * dx + facing.y * dy) / (facingLength * distance);
            if (alignment > 0.7) {
                enemy.die();
            }
        }
    }

    createBelt(count, minTiles, maxTiles, spawn) {
        const belt = [];
        for (let index = 0; index < count; index++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = (minTiles + Math.random() * (maxTiles - minTiles)) * TileWidth;
            const worldX = this.cameraX + Math.cos(angle) * radius;
            const worldY = this.cameraY + Math.sin(angle) * radius;
            belt.push(spawn(worldX, worldY));
        }
        return belt;
    }

    createSwarms(count) {
        const swarms = [];
        for (let index = 0; index < count; index++) {
            const nearPlayer = index < 2;
            const worldX = nearPlayer
                ? this.cameraX + (Math.random() - 0.5) * this.scale.width
                : Math.random() * this.floor.worldWidth;
            const worldY = nearPlayer
                ? this.cameraY + (Math.random() - 0.5) * this.scale.height
                : Math.random() * this.floor.worldHeight;
            const size = 4 + Math.floor(Math.random() * 5);
            swarms.push(new Swarm(this, worldX, worldY, size, this.floor.worldWidth));
        }
        return swarms;
    }

    createControls() {
        this.movementKeys = this.input.keyboard.addKeys({
            up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
            w: 'W', a: 'A', s: 'S', d: 'D'
        });
        this.input.keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']);
        this.attackCodes = new Set(['Space', 'AltRight', 'ControlRight', 'ShiftRight']);
        this.tauntCodes = new Set(['Enter', 'Backspace', 'Backslash']);
        this.talking = false;
        this.pressedAttacks = new Set();
        this.input.keyboard.on('keydown', (event) => {
            if (this.attackCodes.has(event.code)) {
                event.preventDefault();
                this.pressedAttacks.add(event.code);
            } else if (this.tauntCodes.has(event.code) && !event.repeat) {
                event.preventDefault();
                this.sayFreshMeat();
            }
        });
        this.input.keyboard.on('keyup', (event) => this.pressedAttacks.delete(event.code));
        this.game.events.on(Phaser.Core.Events.BLUR, () => this.pressedAttacks.clear());
    }

    update(time, delta) {
        const seconds = delta / 1000;
        const movement = this.readMovement();
        if (movement) {
            this.butcher.face(DirectionByVector[`${movement.x},${movement.y}`]);
            this.scrollFloor(movement, seconds);
        }
        if (this.pressedAttacks.size > 0) {
            this.butcher.attack1();
            this.killFacingEnemies();
        } else if (movement) {
            this.butcher.walk();
        } else {
            this.butcher.stand();
        }
        this.floor.render(this.cameraX, this.cameraY);
        for (const cave of this.caves) {
            cave.sync(this.cameraX, this.cameraY);
        }
        for (const obelisk of this.obelisks) {
            obelisk.sync(this.cameraX, this.cameraY);
        }
        for (const minotaur of this.minotaurs) {
            minotaur.sync(this.cameraX, this.cameraY);
        }
        for (const magog of this.magogs) {
            magog.sync(this.cameraX, this.cameraY);
        }
        for (const hellbaron of this.hellbarons) {
            hellbaron.sync(this.cameraX, this.cameraY);
        }
        for (const cacodemon of this.cacodemons) {
            cacodemon.sync(this.cameraX, this.cameraY);
        }
        for (const swarm of this.swarms) {
            swarm.update(seconds, time, this.cameraX, this.cameraY);
        }
    }

    scrollFloor(movement, seconds) {
        const length = Math.hypot(movement.x, movement.y);
        const step = this.butcher.speed * seconds / length;
        this.cameraX = Phaser.Math.Clamp(this.cameraX + movement.x * step,
            this.scale.width / 2, this.floor.worldWidth - this.scale.width / 2);
        this.cameraY = Phaser.Math.Clamp(this.cameraY + movement.y * step,
            this.scale.height / 2, this.floor.worldHeight - this.scale.height / 2);
    }

    sayFreshMeat() {
        if (this.talking) {
            return;
        }
        this.talking = true;
        this.time.delayedCall(2000, () => this.talking = false);
        this.sound.play(TauntSound);
        const taunt = this.add.text(this.butcher.x, this.butcher.y - this.butcher.displayHeight - 6,
            'FRESH MEAT!', {
                fontFamily: 'monospace', fontSize: '22px', color: '#ff3b3b', fontStyle: 'bold'
            });
        taunt.setOrigin(0.5, 1).setDepth(1000);
        this.tweens.add({
            targets: taunt,
            y: taunt.y - 40,
            alpha: 0,
            duration: 900,
            ease: 'Cubic.easeOut',
            onComplete: () => taunt.destroy()
        });
    }

    readMovement() {
        const keys = this.movementKeys;
        const left = keys.left.isDown || keys.a.isDown;
        const right = keys.right.isDown || keys.d.isDown;
        const up = keys.up.isDown || keys.w.isDown;
        const down = keys.down.isDown || keys.s.isDown;
        const x = (right ? 1 : 0) - (left ? 1 : 0);
        const y = (down ? 1 : 0) - (up ? 1 : 0);
        return x === 0 && y === 0 ? null : { x, y };
    }
}
