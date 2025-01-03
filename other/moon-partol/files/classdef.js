class Constants{
    static SCREEN_WIDTH = 1200;
    static SCREEN_HEIGHT = 600;
}

class Ground {
    constructor(scene) {
        this.scene = scene;
        this.sprite = this.scene.add.tileSprite(0, 550, 2600, 100, 'ground');
        this.speed = 4;
    }

    update() {
        this.sprite.tilePositionX += this.speed;
    }
}
