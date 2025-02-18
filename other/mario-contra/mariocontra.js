class MainScene extends Phaser.Scene {
    static TILE_WIDTH = 60;
    static COMMANDO_SPEED = 5;
    constructor() {
        super('MainScene');
        this.lastTextureChange = 0;
        this.lastBulletTime = 0;
        this.bullets = [];
        this.bulletAngle = 0;
    }

    preload() {
        this.load.image('ground', 'files/sprite.png');
        this.load.image('commando', 'files/commando.png');
        this.load.image('commando2', 'files/commando2.png');
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('turtle', 'files/turtle.png');
        this.load.image('cloud', 'files/cloud.png');
        this.load.image('high-hill', 'files/highhill.png');
        this.load.image('low-hill', 'files/lowhill.png');
        this.load.image('castle', 'files/castle.png');
        this.load.image('bullet', 'files/bullet.png');
        this.currentCommandoTexture = 'commando';
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
        this.spriteGroup = new SpriteGroupHelper(this).createSprites();
    }

    update(time, delta) {
        this.moveBackground(time);
        this.moveEnemies();
        this.checkVictory();
        this.updateHeader(time);
        this.handleShooting(time);
        this.checkEnemyCollision();
    }

    handleShooting(time) {
        if (time - this.lastBulletTime > 400) {
            this.createBullet();
            this.lastBulletTime = time;
        }
        this.moveBullets();
    }

    createBullet() {
        const bullet = this.add.sprite(this.commando.x + 20, this.commando.y - 19, 'bullet');
        this.bullets.push(bullet);
    }

    moveBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += 10*Math.cos(this.bulletAngle);
            bullet.y += 50*Math.sin(this.bulletAngle);
            this.checkEnemyHit(bullet);

            if (bullet.x > 400) {
                bullet.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }

    _isEnemy(child) {
        return child.texture.key === 'gumba' || child.texture.key === 'turtle';
    }

    _checkEnemyDistance(child, targetX, targetY, radius, onHit) {
        if (!this._isEnemy(child)) {
            return;
        }

        const dx = child.x - targetX;
        const dy = child.y - targetY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < radius * radius) {
            onHit(child);
        }
    }

    checkEnemyHit(bullet) {
        this.spriteGroup.children.iterate((child) => {
            this._checkEnemyDistance(child, bullet.x, bullet.y, 20, (enemy) => {
                enemy.speedY = 4;
                this.increaseScore();
            });
        });
    }

    checkEnemyCollision() {
        this.spriteGroup.children.iterate((child) => {
            this._checkEnemyDistance(child, this.commando.x, this.commando.y, 50, () => {
                window.alert('You lose !');
                location.reload();
            });
        });
    }

    increaseScore(){
        const score = document.getElementById('score');
        var scoreAmount = parseInt(score.innerText);
        scoreAmount++;
        score.innerText = scoreAmount;
    }

    moveBackground(time){
        this.cameras.main.setBackgroundColor(0x507fff);
        if (this.cursors.down.isDown) {
            this.bulletAngle = 0.05;
        }
        else if (this.cursors.up.isDown) {
            this.bulletAngle = -0.05;
        }
        else this.bulletAngle = 0;
        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= MainScene.COMMANDO_SPEED;
            });
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

    moveEnemies(){
        this.spriteGroup.children.iterate((child)=> {
            if (this._isEnemy(child)) {
                child.x -= child.speedX;
                child.y += child.speedY;
            }
        });
    }

    checkVictory(){

        this.spriteGroup.children.iterate(function (child) {
            if (child.texture.key === 'castle') {
                if (child.x <= 1*  MainScene.TILE_WIDTH){
                    window.alert('You win ! The princess is in this particular castle.');
                    location.reload();
                }
            }
        });
    }

    updateHeader(time){
        var timeCell = document.getElementById('time');
        const seconds = Math.floor(time/1000) % 1000;
        timeCell.innerText = String(seconds).padStart(3, '0');
    }
}
