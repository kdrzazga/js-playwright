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

class Ufo {
    constructor(scene, group, index) {
        this.scene = scene;
        this.baseDistance = 8 * (index + 1);
        this.phase = index * 0.9;
        this.centerY = 120;
        this.orbitRadius = 45;
        this.angularSpeed = 0.002;

        this.sprite = group.create(-200, -200, 'ufo');
        this.sprite.body.allowGravity = false;
        this.sprite.setDepth(6);
    }

    update(pxPerUnit, groundScrollX, time) {
        if (!this.sprite.active)
            return;

        const angle = time * this.angularSpeed + this.phase;
        this.sprite.x = 100 + this.baseDistance * pxPerUnit - groundScrollX + Math.cos(angle) * this.orbitRadius;
        this.sprite.y = this.centerY + Math.sin(angle) * this.orbitRadius;
    }
}
