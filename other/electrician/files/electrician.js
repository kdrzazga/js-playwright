const levelsJson = {'lvl1' : Level1Scene, 'lvl2': Level2Scene, 'lvl3': Level3Scene}

let level = sessionStorage.getItem("level");
let levelObject = Level1Scene;
if (level == null) levelObject = Level1Scene;
else {
    levelObject = levelsJson[level];
}

const config = {
    type: Phaser.AUTO,
    width: Constants.SCREEN_WIDTH,
    height: Constants.SCREEN_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [levelObject]
};

let game = new Phaser.Game(config);
/*
Hacking:

game.scene.scenes[0].building.enemies[8].active = false;
game.scene.scenes[0].player.y=0;
*/
