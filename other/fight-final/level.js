class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static PLAYER_SPEED = 5;
    static CURRENT_ID = 1;

    constructor(name) {
        super(name);

        this.isPunching = false;
        this.isLaughing = false;
        this.punchDuration = 900;
        this.punchEndTime = 0;
        this.laughEndTime = 0;
        this.extraDelay = 0;

        this.backgroundColor = 'black';
        this.spriteGroup = null;
        this.damndCounter = 0;
    }
	
	preload(){
		this.load.image('floor', 'floor.png');
		this.load.image('door-wall', 'door-wall.png');
		this.load.image('window-wall', 'window-wall.png');
		this.load.image('building-end', 'building-end.png');

		this.load.image('d1', 'd1.png');
		this.load.image('d2', 'd2.png');
		this.load.image('d3', 'd3.png');
		this.load.image('dw1', 'dw1.png');
		this.load.image('dw2', 'dw2.png');
		this.load.image('dw3', 'dw3.png');
		this.load.image('dp1', 'dp1.png');
		this.load.image('dp2', 'dp2.png');
		this.load.image('dp3', 'dp3.png');
		this.load.image('dp4', 'dp4.png');

		this.load.image('cw1', 'codyw1.png');
		this.load.image('cw2', 'codyw2.png');
		this.load.image('cw3', 'codyw3.png');
		this.load.image('cw4', 'codyw4.png');
		this.load.image('cw5', 'codyw5.png');

		this.load.image('hw1', 'haggard1.png');
		this.load.image('hw2', 'haggard2.png');
		this.load.image('hw3', 'haggard3.png');
		this.load.image('hw4', 'haggard4.png');
		this.load.image('hw5', 'haggard5.png');

		this.load.image('oriber', 'ffOriber.png');

		this.load.audio('laugh', 'hehe.m4a');
	}
	
	create(){
        this.cursors = this.input.keyboard.createCursorKeys();
		this.damnd = this.add.sprite(this.sys.canvas.height/2, this.sys.canvas.height - 150, 'd1');

		this.anims.create({
            key: 'damnd-stand',
            frames: [
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd2' },
                { key: 'd3' },
                { key: 'd2' },
                { key: 'd3' },
                { key: 'd2' },
                { key: 'd3' },
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd2' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' },
                { key: 'd1' }
            ],
            frameRate: 3,
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
                { key: 'dp3' },
                { key: 'dp4' },
                { key: 'dp4' },
                { key: 'dp3' },
                { key: 'dp2' },
                { key: 'dp1' }
            ],
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'cody-walk',
            frames: [
                { key: 'cw1'},
                { key: 'cw2'},
                { key: 'cw3'},
                { key: 'cw4'},
                { key: 'cw5'},
                { key: 'cw4'},
                { key: 'cw3'},
                { key: 'cw2'},
            ],
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'haggard-walk',
            frames: [
                { key: 'hw1'},
                { key: 'hw2'},
                { key: 'hw3'},
                { key: 'hw4'},
                { key: 'hw5'}
            ],
            frameRate: 5,
            repeat: -1
        });

        this.laughSound = this.sound.add('laugh');

		this.animKey = 'damnd-stand';
		this.damnd.play(this.animKey);
		this.createSpriteGroup();
	}
	
	update(time, delta) {
	    this.move(time);
	    this.damndCounter += 1;
	    this.laughConditionally();
	    this.spriteGroup.children.iterate(sprite => {
	        if (sprite.data)
	        if (sprite.data.startsWith('enemy')){
	                if (sprite.data.endsWith('alive')) sprite.x -= MainScene.PLAYER_SPEED + 2*Math.cos(sprite.id);
	                if (sprite.y > this.damnd.y)
	                    sprite.setDepth(1); //this.damnd who is human player has depth = 0
	                else
	                    sprite.setDepth(-1);
	            }
	    });
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

        for (let shift = 0; shift <= tileWidth * 22 * 8; shift += tileWidth * 22){

	        for (let i = 5; i < 8; i++) {
                const x = i * (tileWidth + 22) + shift;
                const sprite = this.add.sprite(x, this.sys.canvas.height - 385 + 5, 'window-wall');
                sprite.setDepth(-5);
                this.spriteGroup.add(sprite);
            }

            let sprite = this.add.sprite(8.5 * (tileWidth + 11) + shift, this.sys.canvas.height - 385 + 5, 'building-end');
            sprite.setDepth(-5);
            this.spriteGroup.add(sprite);
        }

        for (let i = 0; i < 75; i++){
		    const cody = this.add.sprite(this.sys.canvas.height * 5 + (0.8 + 0.8*Math.random())*i * this.sys.canvas.width, this.sys.canvas.height - 150 - 60*Math.random(), 'cw1');
		    cody.play('cody-walk');
		    cody.data = 'enemy-alive';
		    cody.id = MainScene.CURRENT_ID;
		    MainScene.CURRENT_ID += 1;
		    this.spriteGroup.add(cody);
		}

        for (let i = 0; i < 62; i++){
		    const haggard = this.add.sprite(11111 + (0.8 + 0.8*Math.random())*i * this.sys.canvas.width, this.sys.canvas.height - 150 - 60*Math.random(), 'hw1');
		    haggard.play('haggard-walk');
		    haggard.data = 'enemy-alive';
		    haggard.id = MainScene.CURRENT_ID;
		    MainScene.CURRENT_ID += 1;
		    haggard.setFlipX(true);
		    this.spriteGroup.add(haggard);
		}

        for (let i = 1; i< 24; i += 1){
		    const deadOriber = this.add.sprite(1000 + i*2222 + 1000*Math.random(), this.sys.canvas.height - 150- 60*Math.random(), 'oriber');
		    deadOriber.data = 'enemy-dead';
            deadOriber.setDepth(-4);
            if (i % 2 < 1)
                deadOriber.setFlipX(true);
            this.spriteGroup.add(deadOriber);
        }
	}

	laughConditionally(){
	    if (this.damnd.texture.key === 'd3') //&& this.isLaughing)
	        this.laughSound.play();
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
