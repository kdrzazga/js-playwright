class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('ground', 'temp/sprite.png');
        this.load.image('commando', 'temp/commando.png');
        this.load.image('gumba', 'temp/gumba.png');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
        this.spriteGroup = this.add.group();
        for (let i = 0; i < 200; i++) {
            const x = i * 60;
            const sprite = this.add.sprite(x, this.sys.canvas.height - 50, 'ground');
            this.spriteGroup.add(sprite);
        }

        const gumba1 = this.add.sprite(900, this.sys.canvas.height - 105, 'gumba');
        const gumba2 = this.add.sprite(1050, this.sys.canvas.height - 105, 'gumba');
        this.spriteGroup.add(gumba1);
        this.spriteGroup.add(gumba2);
    }

    update(time, delta) {
        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= 5;
            });
        }

        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'gumba') {
                child.x -= 1;
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [MainScene]
};

const game = new Phaser.Game(config);
