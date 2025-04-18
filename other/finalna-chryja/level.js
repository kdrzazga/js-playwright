class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static COMMANDO_SPEED = 5;
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
		this.load.image('d1', 'd1.bmp');
		this.load.image('d2', 'd2.bmp');
		this.load.image('d3', 'd3.bmp');
	}
	
	create(){
		this.damnd = this.add.sprite(70, this.sys.canvas.height - 150, 'd1');
		
		this.anims.create({
            key: 'damnd-walk',
            frames: [
                { key: 'd1' },
                { key: 'd2' },
                { key: 'd3' }
            ],
            frameRate: 3,
            repeat: -1
        });
		
		this.damnd.play('damnd-walk');
		
		this.floor = this.add.sprite(70, this.sys.canvas.height - 150, 'floor');
		this.floor.setDepth(-5);
	}
	
	update(time, delta) {
	}
}



