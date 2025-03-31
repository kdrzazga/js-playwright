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
        this.bulletPic = 'files/bullet.png';
        this.spriteGroup = null;
    }

    preload() {
        this.load.image('ground', 'files/sprite.png');
        this.load.image('commando', 'files/commando.png');
        this.load.image('commando2', 'files/commando2.png');
        this.load.image('bullet', this.bulletPic);
        this.load.image('gumba', 'files/scythe1.png');
        this.load.image('gumbaL', 'files/scythe2.png');
        this.currentCommandoTexture = 'kupa';
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
        this.spriteGroup = this.add.group();
    }

    update(time, delta) {
        this.move(time);
        this.moveEnemies(time);
        this.checkVictory();
        this.updateHeader(time);
        this.handleShooting(time);
        this.checkEnemyCollision();
    }

    move(time){
    }

    moveEnemies(time){
    }

    checkVictory(){
        const forcedLevel = sessionStorage.getItem('force-level');
        if (forcedLevel) {
            this.extraDelay = 70000;
        }
    }

    updateHeader(time){
        var timeCell = document.getElementById('time');
        const seconds = Math.floor(time/1000) % 1000;
        timeCell.innerText = String(seconds).padStart(3, '0');
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
            this.checkHit(bullet);

            if (bullet.x > this.bulletRange) {
                bullet.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }

    handleShooting(time) {
        if (time - this.lastBulletTime > this.bulletFiringRate) {
            this.createBullet();
            this.lastBulletTime = time;
        }
        this.moveBullets();
    }

    _isEnemy(child) {
        const pic = child.texture.key;
        return pic === 'gumba' || pic === 'gumbaL' || pic === 'turtle' || pic === 'hole'
            || pic.startsWith('runner') || pic.startsWith('scorp');
    }

    _checkEnemyDistance(child, targetX, targetY, radius, onHit) {
        const dx = child.x - targetX;
        const dy = child.y - targetY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < radius * radius) {
            onHit(child);
        }
    }

    checkHit(bullet) {
        if (this.spriteGroup == undefined)
            return;

        this.spriteGroup.children.iterate((child) => {
            if (this._isEnemy(child)){
                this._checkEnemyDistance(child, bullet.x, bullet.y, 20, (enemy) => {
                    enemy.speedY = 4;
                    this.increase('score', 5);
                });
            }
            else if (child.texture.key === 'question'){
                this._checkEnemyDistance(child, bullet.x, bullet.y, 20, (enemy) => {
                    const randomPrize = Math.random();
                    if (randomPrize < 0.8 || this.bulletFiringRate < 200 || this.bulletRange > 800){
                        child.setTexture('coin');
                        this.increase('coins', 1);
                        this.increase('score', 1);
                    }
                    else if (randomPrize <= 0.9){
                        child.setTexture('fire-upgrade');
                        this.bulletFiringRate *= 0.4;
                    }
                    else{
                        child.setTexture('fire-upgrade');
                        this.bulletRange *= 1.2;
                    }
                });
            }
        });
    }

    move(time){
        this.cameras.main.setBackgroundColor(this.backgroundColor);
        if (this.cursors.down.isDown) {
            this.bulletAngle = 0.05;
        }
        else if (this.cursors.up.isDown) {
            this.bulletAngle = -0.05;
        }
        else this.bulletAngle = 0;

        this.checkJumpKeys(750);

        if (this.cursors.right.isDown) {
            this.spriteGroup.children.iterate(function (child) {
                child.x -= MainScene.COMMANDO_SPEED;
            });
            if (time - this.lastTextureChange > 300) {
                this.commando.setTexture(this.currentCommandoTexture);
                this.currentCommandoTexture = (this.currentCommandoTexture === this.mainCharacterPic) ? this.mainCharacterRunningPic : this.mainCharacterPic;
                this.lastTextureChange = time;
            }
        }
        else {
            this.commando.setTexture(this.currentCommandoTexture);
        }
    }

    checkJumpKeys(duration){
        const ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        const shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        if (this.input.keyboard.checkDown(ctrlKey, 100) ||
            this.input.keyboard.checkDown(shiftKey, 100) ||
            this.input.keyboard.checkDown(spaceKey, 100)) {
                this.jump(duration);
            }
    }

    jump(duration) {
        if (!this.playerCanJump || this.playerFalling) return;

        this.playerCanJump = false;
        const jumpHeight = 100;

        const jumpTween = {
            targets: this.commando,
            y: this.commando.y - jumpHeight,
            duration: duration / 2, // move up for half the duration
            ease: 'Linear',
            onComplete: () => {

                const comeDownTween = {
                    targets: this.commando,
                    y: this.commando.y + jumpHeight, // Move down
                    duration: duration / 2,
                    ease: 'Linear',
                    onComplete: () => {
                        this.playerCanJump = true;
                    }
                };
                this.tweens.add(comeDownTween);
            }
        }

        this.tweens.add(jumpTween);
    }


    checkEnemyCollision() {
        if (this.spriteGroup == undefined)
            return;

        this.spriteGroup.children.iterate((child) => {
            if (this._isEnemy(child)){
                this._checkEnemyDistance(child, this.commando.x, this.commando.y, 50, () => {
                    const footer = document.getElementById('footer');
                    footer.innerHTML = "<td colspan='7'><table><tr><div style='text-align: center;'><img src='files/lose.png'></div></td></tr>"
                        + "<tr><td>&nbsp;</td></tr><tr><td colspan='7'><div style='text-align: center;'><img src='files/logo.png'></div></td></tr></table>";
                    this.reset('Game&nbsp;&nbsp;&nbsp;Over');
                });
            }
        });
    }

    increase(htmlId, amount){
        const score = document.getElementById(htmlId);
        var scoreAmount = parseInt(score.innerText);
        scoreAmount += amount;
        score.innerText = scoreAmount;
    }

    reset(message){
        this.scene.stop(this.name);
        let container = document.getElementById('game-container');
        container.innerHTML = message;
        const delay = 7000 + this.extraDelay
        console.log('END GAME ! [' + delay + ']');

        this.reloadPageAfterDelay(delay)
            .then(() => {
                window.location.reload();
            });
    }

    reloadPageAfterDelay(delay) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delay);
      });
    }
}
