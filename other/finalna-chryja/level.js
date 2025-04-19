class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static PLAYER_SPEED = 5;

    constructor(name) {
        super(name);

        this.isPunching = false;
        this.punchDuration = 500;
        this.punchEndTime = 0;
        this.extraDelay = 0;

        this.backgroundColor = 'black';
        this.spriteGroup = null;
        this.damndCounter = 0;
    }
	
	preload(){
		this.load.image('floor', 'floor.png');
		this.load.image('d1', 'd1.png');
		this.load.image('d2', 'd2.png');
		this.load.image('d3', 'd3.png');
		this.load.image('dw1', 'dw1.png');
		this.load.image('dw2', 'dw2.png');
		this.load.image('dw3', 'dw3.png');
		this.load.image('dp1', 'dp1.png');
		this.load.image('dp2', 'dp2.png');
	}
	
	create(){
        this.cursors = this.input.keyboard.createCursorKeys();
		this.damnd = this.add.sprite(this.sys.canvas.height/2, this.sys.canvas.height - 150, 'd1');
		
		this.anims.create({
            key: 'damnd-stand',
            frames: [
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd2' },
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd2' },
                { key: 'd3' }
            ],
            frameRate: 2,
            repeat: -1
        });

		this.anims.create({
            key: 'damnd-walk',
            frames: [
                { key: 'dw1' },
                { key: 'dw2' },
                { key: 'dw3' }
            ],
            frameRate: 7,
            repeat: -1
        });

		this.anims.create({
            key: 'damnd-punch',
            frames: [
                { key: 'dp1' },
                { key: 'dp2' },
                { key: 'dp1' }
            ],
            frameRate: 4,
            repeat: 1
        });

		this.animKey = 'damnd-stand';
		this.damnd.play(this.animKey);
		this.createSpriteGroup();
	}
	
	update(time, delta) {
	    this.move(time);
	    this.damndCounter += 1;
	}

	createSpriteGroup(){

	    const tileWidth = 240;
	    this.spriteGroup = this.add.group();

	    for (let i = 0; i < 240; i++) {
            const x = i * tileWidth;
            const sprite = this.add.sprite(x, this.sys.canvas.height - 73, 'floor');
            sprite.setDepth(-5);
            this.spriteGroup.add(sprite);
        }
	}

    move(time) {
        let newAnimKey = 'damnd-stand';

        if (this.isPunching) {
            if (time < this.punchEndTime) {
                newAnimKey = 'damnd-punch';
            } else {
                this.isPunching = false;
            }
        }

        if (this.cursors.down.isDown && this.damnd.y <= this.sys.canvas.height - 120) {
            this.damnd.y += 2 * MainScene.PLAYER_SPEED / 3;
            newAnimKey = 'damnd-walk';
        } else if (this.cursors.up.isDown && this.damnd.y > 360) {
            this.damnd.y -= 2 * MainScene.PLAYER_SPEED / 3;
            newAnimKey = 'damnd-walk';
        }

        if (this.cursors.right.isDown) {
            this.damnd.setFlipX(false);
            if (this.damnd.x < 7 * this.sys.canvas.height / 8) {
                this.damnd.x += MainScene.PLAYER_SPEED;
            } else {
                this.spriteGroup.children.iterate(function (child) {
                    child.x -= MainScene.PLAYER_SPEED;
                });
            }
            newAnimKey = 'damnd-walk';
        } else if (this.cursors.left.isDown && this.damnd.x > 44) {
            this.damnd.x -= MainScene.PLAYER_SPEED;
            this.damnd.setFlipX(true);
            newAnimKey = 'damnd-walk';
        } else {
            const key = this.checkPunchKeys();
            if (key === 'damnd-punch') {
                this.isPunching = true;
                this.punchEndTime = time + this.punchDuration;
                newAnimKey = 'damnd-punch';
            }
        }

        if (newAnimKey !== this.animKey) {
            this.animKey = newAnimKey;
            this.damnd.play(this.animKey);
        }
    }

    checkPunchKeys(){
        const ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        const shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        if (this.input.keyboard.checkDown(ctrlKey, 100) ||
            this.input.keyboard.checkDown(shiftKey, 100) ||
            this.input.keyboard.checkDown(spaceKey, 100)) {
                return 'damnd-punch';
            }
        return '';
    }
}
