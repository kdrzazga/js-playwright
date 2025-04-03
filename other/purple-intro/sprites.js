class SpriteManager {

    static createSaboteur(scene){
        scene.anims.create({
            key: 'saboteur-walk',
            frames: [
                { key: 'saboteur1' },
                { key: 'saboteur2' },
                { key: 'saboteur3' }
            ],
            frameRate: 7,
            repeat: -1
        });

        const saboteur = scene.add.sprite(0, 545, 'saboteur1');
        saboteur.setDepth(-5);
        saboteur.play('saboteur-walk');

        return saboteur;
    }

    static moveSaboteur(saboteur, yPos){
        if (yPos > 400)
            ;
        else{
            saboteur.x++;
            }

        if (saboteur.x > 2000){
            saboteur.x = 0;
        }
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
