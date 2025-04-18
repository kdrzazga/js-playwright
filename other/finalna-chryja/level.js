class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static PLAYER_SPEED = 5;
    constructor(name) {
        super(name);
        this.lastTextureChange = 0;
        this.lastBulletTime = 0;
        this.bullets = [];
        this.bulletAngle = 0;
        this.bulletRange = 460;
        this.bulletFiringRate = 400;
        this.playerCanJump = true;
        this.playerFalling = false;
        this.extraDelay = 0;

        this.mainCharacterPic = 'commando';
        this.mainCharacterRunningPic = 'commando2';
        this.backgroundColor = 'black';
        this.spriteGroup = null;
    }
	
	preload(){
		this.load.image('floor', 'floor.png');
		this.load.image('d1', 'd1.png');
		this.load.image('d2', 'd2.png');
		this.load.image('d3', 'd3.png');
	}
	
	create(){

		this.physics.world.setBounds(0, 0, config.width, config.height);
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
		
		this.damnd.play('damnd-stand');
		
		this.createSpriteGroup();
	}
	
	update(time, delta) {
	    this.move(time);
	}

	createSpriteGroup(){

	    const tileWidth = 240;
	    this.spriteGroup = this.add.group();

	    for (let i = 0; i < 240; i++) {
            const x = i * tileWidth;
            const sprite = this.add.sprite(x, config.height - 73, 'floor');
            sprite.setDepth(-5);
            this.spriteGroup.add(sprite);
        }
	}

	 move(time){
         //this.cameras.main.setBackgroundColor(this.backgroundColor);
         if (this.cursors.down.isDown && this.damnd.y <= config.height - 120) {
             this.damnd.y += 2*MainScene.PLAYER_SPEED/3;
         }
         else if (this.cursors.up.isDown && this.damnd.y > 360) {
             this.damnd.y -= 2*MainScene.PLAYER_SPEED/3;
         }

         if (this.cursors.right.isDown) {

             if (this.damnd.x <7*config.height/8){
                this.damnd.x += MainScene.PLAYER_SPEED;
             }
             else this.spriteGroup.children.iterate(function (child) {
                 child.x -= MainScene.PLAYER_SPEED;
             });

         }
         else if (this.cursors.left.isDown && this.damnd.x> 44) {
             this.damnd.x -= MainScene.PLAYER_SPEED;
         }
     }
}



