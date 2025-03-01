class Scene2 extends MainScene {
    constructor() {
        super('Scene2');
    }

    preload(){
        super.preload();
        this.load.image('princess', 'files/princess.png');
        this.load.image('kupa', 'files/koopa.png');
        this.load.image('cage', 'files/cage.png');
        this.load.image('help', 'files/help.png');
        this.load.image('save-me', 'files/saveMe.png');
        this.load.image('thank-you', 'files/thankYou.png');
        this.load.image('shit', 'files/sht.png');
        this.load.image('nothing', 'files/nothing.png');
        this.load.image('energy', 'files/energy.png');
    }

    create(){
        super.create();
        const level = document.getElementById('world');
        level.innerText = "1-2";
        this.createSprites();
        this.physics.world.setBounds(0, 733, 200, 600);

        for (let i = 0; i < 14; i++) {
            const x = i * MainScene.TILE_WIDTH;
            this.lastGroundTile = this.add.sprite(x, config.height - 50, 'brick');
        }

        this.add.text(5, 10, 'WICKED PRINCESS', {
                font: 'ArcadeClassic',
                fontSize: '24px',
                fill: '#ffffff',
                align: 'center'
            });
    }

    createSprites() {
        this.princess = this.add.sprite(333, this.commando.y - 80, 'princess');
        this.princess.setDepth(2);
        this.energyGroup = this.add.group();

        let maxEnergyX = 770;
        const forcedLevel = sessionStorage.getItem('force-level');
                if (forcedLevel){
                    if (forcedLevel == '2')
                        maxEnergyX = 120 + 2*31;
                }

        for (let x = 120; x < maxEnergyX; x+= 31) {
            const sprite = this.add.sprite(x, 15, 'energy');
            this.energyGroup.add(sprite);
        }
        this.kupa = this.add.sprite(733, this.commando.y + 20, 'kupa');
        this.kupa.speedY = 0;
        this.cage = this.add.sprite(733, this.commando.y + 20, 'cage');
        this.speechBubble = this.add.sprite(733, this.commando.y -55, 'help');
        this.speechBubble.speedY = 0;
        this.speechBubble.setDepth(2);
    }

    move(time){
        if (this.cursors.down.isDown) {
            this.bulletAngle = 0.05;
        }
        else if (this.cursors.up.isDown) {
            this.bulletAngle = -0.05;
        }
        else this.bulletAngle = 0;

        if (this.cursors.right.isDown) {
            if (time - this.lastTextureChange > 300) {
                this.commando.setTexture(this.currentCommandoTexture);
                this.currentCommandoTexture = (this.currentCommandoTexture === 'commando') ? 'commando2' : 'commando';
                this.lastTextureChange = time;
            }
        }
        else {
            this.commando.setTexture('commando');
        }
    }

    moveEnemies(time){
        const t = time % 20000;
        let texture;
        let multiplier = -1;

        if(this.energyGroup.getLength() == 0){
            if  (this.kupa.speedY < 1)
                texture = 'thank-you';
            else
                texture = 'shit';
        }
        else if (t > 5000 && t < 10000) {
            texture = 'save-me';
            multiplier = -1;
        } else if (t > 15000 && t < 20000) {
            texture = 'help';
            multiplier = 1;
        } else {
            texture = 'nothing';
        }

        this.speechBubble.setTexture(texture);

        const deltaX = 5 * Math.sin(multiplier*time/200);
        const deltaY = 11 * Math.cos(time/200);
        this.princess.x += deltaX;
        this.princess.y += deltaY;
        if (this.princess.y > this.lastGroundTile.y)
            this.princess.y = this.lastGroundTile.y;
        else if (this.princess.y < 30)
            this.princess.y = 30;
    }

    checkHit(bullet) {
        this._checkEnemyDistance(this.princess, bullet.x, bullet.y, 20, princess => {
            const lastSprite = this.energyGroup.getChildren()[this.energyGroup.getLength() - 1];

            if (lastSprite) {
                lastSprite.destroy();
                this.increase('score');
            }
        });

        if(this.energyGroup.getLength() == 0){
            this.princess.destroy();
            this.cage.destroy();
            this.speechBubble.x -=1;
            this.kupa.x -= 1;
            this.kupa.y += this.kupa.speedY;
            this.speechBubble.y += this.speechBubble.speedY;

            if (this.kupa.x < -5)
                if (this.kupa.y > 600){
                    const container = document.getElementById('footer');
                    container.innerHTML = "<td></td><td><img src='files/cry.png'></td><td></td>";
                    this.reset("You've just killed poor Koopa, you moron !!!")
                }
                else{
                    for (var i = 0; i < 50; i++)
                        this.increase('score');

                    const container = document.getElementById('footer');
                    container.innerHTML = "<td colspan='7'><div style='text-align: center;'><img src='files/castleKupa2.png'></div></td>";
                    this.reset('You win! Bonus +50');
                }
        }

        this._checkEnemyDistance(this.kupa, bullet.x, bullet.y, 40, kupa => {
            kupa.speedY = 2;
            this.speechBubble.speedY = 2;
            kupa.setDepth(2);
        });
    }
}
