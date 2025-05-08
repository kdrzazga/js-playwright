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
        this.score = 0;

        this.backgroundColor = 'black';
        this.spriteGroup = null;
        this.damndCounter = 0;
        this.manager = new Manager(this);
    }
	
	preload() {
		this.manager.preload();
	}
	
	create(){
        this.cursors = this.input.keyboard.createCursorKeys();
		this.damnd = this.add.sprite(this.sys.canvas.height/2, this.sys.canvas.height - 150, 'd1');

        this.manager.createAnims();

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

        //const punchFrames = ['dp1', 'dp2', 'dp3', 'dp4'];
        const punchFrames = ['dp2', 'dp3'];

        if (punchFrames.includes(this.damnd.texture.key)){
	        this.spriteGroup.children.iterate(sprite => {
                if (sprite.data)
                    if (sprite.data == 'enemy-alive'){
                        let distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.damnd.x, this.damnd.y);
                        if (distance < 30){
                            const pushback = this.damnd.flipX ? -180 : 180;
                            sprite.x += pushback;
                            this.score++;

                            const scoreDiv = document.getElementById('score');
                            score.innerText = this.score;
                        }
                    }
	        });
	    }
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

            sprite = this.add.sprite(8.5 * (tileWidth + 88) + shift, this.sys.canvas.height - 385 + 27, 'wreck');
            sprite.setDepth(-5);
            this.spriteGroup.add(sprite);

	        for (let i = 13; i < 18; i++) {
                const x = i * (tileWidth + 22) + shift;
                let texture = i == 15 ? 'door-wall' : 'window-wall';
                texture = i == 17 ? 'building-end' : 'window-wall';
                const sprite = this.add.sprite(x, this.sys.canvas.height - 385 + 5, texture);
                sprite.setDepth(-5);
                this.spriteGroup.add(sprite);
            }
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
            this.input.keyboard.checkDown(spaceKey, 100) ||
            this.input.mousePointer.isDown) {
                return 'damnd-punch';
            }
        return '';
    }
}
