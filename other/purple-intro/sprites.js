class Saboteur{

    constructor(scene){
        this.scene = scene;
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
}

class SpriteManager {

    static createSaboteur(scene){
        return new Saboteur(scene);
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
