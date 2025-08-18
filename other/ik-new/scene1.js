class Scene1 {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        super.preload();
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown){
        }

        this.digdug.move();
    }

}
