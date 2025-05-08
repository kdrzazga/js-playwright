class Manager {

    constructor(scene){
        this.scene = scene;
    }

    preload(){
		this.scene.load.image('floor', 'floor.png');
		this.scene.load.image('door-wall', 'door-wall.png');
		this.scene.load.image('window-wall', 'window-wall.png');
		this.scene.load.image('skyline', 'skyline.png');
		this.scene.load.image('fence', 'barbed-wire2.png');
        this.scene.load.image('building-end', 'building-end.png');
        this.scene.load.image('wreck', 'wreck.png');

        this.scene.load.image('d1', 'd1.png');
        this.scene.load.image('d2', 'd2.png');
        this.scene.load.image('d3', 'd3.png');
        this.scene.load.image('dw1', 'dw1.png');
        this.scene.load.image('dw2', 'dw2.png');
        this.scene.load.image('dw3', 'dw3.png');
        this.scene.load.image('dp1', 'dp1.png');
        this.scene.load.image('dp2', 'dp2.png');
        this.scene.load.image('dp3', 'dp3.png');
        this.scene.load.image('dp4', 'dp4.png');

        this.scene.load.image('cw1', 'codyw1.png');
        this.scene.load.image('cw2', 'codyw2.png');
        this.scene.load.image('cw3', 'codyw3.png');
        this.scene.load.image('cw4', 'codyw4.png');
        this.scene.load.image('cw5', 'codyw5.png');

        this.scene.load.image('hw1', 'haggard1.png');
        this.scene.load.image('hw2', 'haggard2.png');
        this.scene.load.image('hw3', 'haggard3.png');
        this.scene.load.image('hw4', 'haggard4.png');
        this.scene.load.image('hw5', 'haggard5.png');

		this.scene.load.image('oriber', 'ffOriber.png');

		this.scene.load.audio('laugh', 'hehe.m4a');
        return this.scene;
    }

    createAnims(){

		this.scene.anims.create({
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

		this.scene.anims.create({
            key: 'damnd-walk',
            frames: [
                { key: 'dw1' },
                { key: 'dw2' },
                { key: 'dw3' }
            ],
            frameRate: 7,
            repeat: -1
        });

		this.scene.anims.create({
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

        this.scene.anims.create({
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

        this.scene.anims.create({
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

    }
}
