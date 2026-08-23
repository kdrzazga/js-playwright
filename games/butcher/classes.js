class Enemy extends Phaser.GameObjects.Sprite {

    constructor(scene, worldX, worldY, texture, frame) {
        super(scene, worldX, worldY, texture, frame);
        this.worldX = worldX;
        this.worldY = worldY;
        this.inFront = false;
        this.alive = true;
        this.dying = false;
        this.setOrigin(0.5, 0.5);
        this.setDepth(-5);
        scene.add.existing(this);
    }

    cycle(firstKey, secondKey) {
        this.firstKey = firstKey;
        this.secondKey = secondKey;
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.advance, this);
        this.play({ key: firstKey, repeat: 0 });
        this.anims.setProgress(Math.random());
        return this;
    }

    advance(animation) {
        if (!this.alive) {
            return;
        }
        const next = animation.key === this.firstKey ? this.secondKey : this.firstKey;
        this.play({ key: next, repeat: 0 });
    }

    die() {
        if (this.dying) {
            return this;
        }
        this.dying = true;
        this.off(Phaser.Animations.Events.ANIMATION_COMPLETE, this.advance, this);
        this.play({ key: this.deathKey(), repeat: 0 });
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.alive = false;
        });
        return this;
    }

    deathKey() {
        return null;
    }

    sync(cameraX, cameraY) {
        const screenX = this.worldX + this.scene.scale.width / 2 - cameraX;
        const screenY = this.worldY + this.scene.scale.height / 2 - cameraY;
        const onScreen = screenX > -this.displayWidth && screenX < this.scene.scale.width + this.displayWidth
            && screenY > -this.displayHeight && screenY < this.scene.scale.height + this.displayHeight;
        this.setVisible(onScreen);
        if (!onScreen) {
            if (this.alive && this.anims.isPlaying) {
                this.anims.pause();
            }
            return;
        }
        if (this.alive && this.anims.isPaused) {
            this.anims.resume();
        }
        this.setPosition(screenX, screenY);
        const front = this.scene.scale.height / 2.4 < screenY;
        if (front !== this.inFront) {
            this.inFront = front;
            this.setDepth(front ? 5 : -5);
        }
    }
}
