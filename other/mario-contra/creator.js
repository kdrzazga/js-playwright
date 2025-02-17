function createLevel1Group(group){
       let spriteGroup = this.add.group();

        for (let i = 0; i < 200; i++) {
            const x = i * 60;
            const sprite = this.add.sprite(x, this.sys.canvas.height - 50, 'ground');
            this.spriteGroup.add(sprite);
        }
}
