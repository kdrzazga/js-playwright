class DemoSprite {

    constructor(scene, limitX){
        this.scene = scene;
        this.limitX = limitX;
    }

    move(yPos){
        if (yPos > 400)
            ;
        else{
            this.sprite.x++;
            }

        if (this.sprite.x > 2000){
            this.sprite.x = 0;
        }
    }

    moveLeft(){
        this.sprite.flipX = true;
        if (this.sprite.x > -10){
            this.sprite.x--;
        }
    }

    moveRight(){
        this.sprite.flipX = false;
        if (this.sprite.x < this.limitX){
            this.sprite.x++;
        }
    }
}

class DigDug extends DemoSprite{
    constructor(scene, limitX){
        super(scene, 999);
        this.scene.anims.create({
            key: 'dig-dug-walk',
            frames: [
                { key: 'dig-dug1' },
                { key: 'dig-dug2' },
                { key: 'dig-dug3' }
            ],
            frameRate: 7,
            repeat: -1
        });
        this.sprite = scene.add.sprite(500, 450, 'dig-dug');
        this.sprite.setDepth(-5);
        this.sprite.play('dig-dug-walk');
    }
}

class Saboteur extends DemoSprite{
    constructor(scene){
        super(scene);
        this.scene.anims.create({
            key: 'saboteur-walk',
            frames: [
                { key: 'saboteur1' },
                { key: 'saboteur2' },
                { key: 'saboteur3' }
            ],
            frameRate: 7,
            repeat: -1
        });
        this.sprite = scene.add.sprite(0, 545, 'saboteur1');
        this.sprite.setDepth(-5);
        this.sprite.play('saboteur-walk');
    }
}

class SpriteManager {

    static createSaboteur(scene){
        return new Saboteur(scene);
    }

    static createDigDug(scene, limitX){
        return new DigDug(scene, limitX);
    }

    static createLoadingHeader(scene){
        scene.add
    }

    static createGianaCalm(scene){
        scene.anims.create({
            key: 'karateka-walk',
            frames: [
                { key: 'giana-calm1' },
                { key: 'giana-calm2' },
                { key: 'giana-calm3' }
            ],
            frameRate: 3,
            repeat: -1
        });
    }

    static createGianaCrazy(scene){
        scene.anims.create({
            key: 'karateka-walk',
            frames: [
                { key: 'giana-crazy1' },
                { key: 'giana-crazy2' },
                { key: 'giana-crazy3' }
            ],
            frameRate: 3,
            repeat: -1
        });
    }
}
