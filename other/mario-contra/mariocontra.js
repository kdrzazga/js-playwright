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
    }

    preload() {
        this.load.image('ground', 'files/sprite.png');
        this.load.image('commando', 'files/commando.png');
        this.load.image('commando2', 'files/commando2.png');
        this.load.image('bullet', 'files/bullet.png');
        this.load.image('brick', 'files/brick.png');
        this.currentCommandoTexture = 'commando';
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createSpriteGroup();
        this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
    }

    createSpriteGroup() {
    }

    update(time, delta) {
        this.moveBackground(time);
        this.moveEnemies();
        this.checkVictory();
        this.updateHeader(time);
        this.handleShooting(time);
        this.checkEnemyCollision();
    }

    moveBackground(time){
    }

    moveEnemies(){
    }

    checkVictory(){
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
        return child.texture.key === 'gumba' || child.texture.key === 'turtle';
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
                    this.increase('score');
                });
            }
            else if (child.texture.key === 'question'){
                this._checkEnemyDistance(child, bullet.x, bullet.y, 20, (enemy) => {
                    const randomPrize = Math.random();
                    if (randomPrize < 0.8 || this.bulletFiringRate < 200 || this.bulletRange > 800){
                        child.setTexture('coin');
                        this.increase('coins');
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

    checkEnemyCollision() {
        if (this.spriteGroup == undefined)
            return;

        this.spriteGroup.children.iterate((child) => {
            if (this._isEnemy(child)){
                this._checkEnemyDistance(child, this.commando.x, this.commando.y, 50, () => {
                    window.alert('You lose !');
                    this.reset();
                });
            }
        });
    }

    increase(htmlId){
        const score = document.getElementById(htmlId);
        var scoreAmount = parseInt(score.innerText);
        scoreAmount++;
        score.innerText = scoreAmount;
    }

    reset(){
        console.log('END GAME !');
        location.reload();
    }
}

class Scene1 extends MainScene {
    constructor() {
        super('Scene1');
    }

    preload() {
        super.preload();
        this.load.image('gumba', 'files/gumba.png');
        this.load.image('turtle', 'files/turtle.png');
        this.load.image('cloud', 'files/cloud.png');
        this.load.image('high-hill', 'files/highhill.png');
        this.load.image('low-hill', 'files/lowhill.png');
        this.load.image('castle', 'files/castle.png');
        this.load.image('question', 'files/question.png');
        this.load.image('coin', 'files/blank.png');
        this.load.image('fire-upgrade', 'files/blankFire.png');
    }

    createSpriteGroup() {
        this.spriteGroup = new SpriteGroupHelper(this).createSprites();
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

        this.spriteGroup.children.iterate(child => {
            if (child.texture.key === 'castle') {
                if (child.x <= 1*  MainScene.TILE_WIDTH){
                    window.alert('Great ! The princess is in this particular castle.');
                    this.scene.start('Scene2');
                }
            }
        });
    }

}
