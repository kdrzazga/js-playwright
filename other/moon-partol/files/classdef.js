class Constants{
    static SCREEN_WIDTH = 800;
    static SCREEN_HEIGHT = 600;
}

class Ground {
    constructor(scene) {
        this.scene = scene;
        this.sprite = this.scene.add.tileSprite(400, 550, 800, 100, 'ground');
        this.speed = 1;
    }

    update() {
        this.sprite.x -= this.speed;

        if (this.sprite.x <= -16300 + 800) {
            this.sprite.x = 163000;
        }
    }
}

