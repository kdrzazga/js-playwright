

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

 preload() {
  // Load a simple sprite sheet or image for the sprite
  this.load.image('ground', 'temp/sprite.png');
  this.load.image('commando', 'temp/commando.png');
}

// Create game objects
 create() {
  this.cursors = this.input.keyboard.createCursorKeys();

  // Create a group to hold all the sprites
  this.spriteGroup = this.add.group();

  // Loop through 20 iterations
  for (let i = 0; i < 200; i++) {
    // Calculate the x position based on the iteration number
    const x = i * 60;

    // Create a new sprite at the calculated x position and bottom of the screen
    const sprite = this.add.sprite(x, this.sys.canvas.height - 50, 'ground');

    // Add the sprite to the group
    this.spriteGroup.add(sprite);

    this.commando = this.add.sprite(70, this.sys.canvas.height - 150, 'commando');
  }
}

// Update game logic
 update(time, delta) {
  // Check if the right arrow key is pressed
  if (this.cursors.right.isDown) {
    // Move all sprites in the group to the left
    this.spriteGroup.children.iterate(function (child) {
      child.x -= 5;
    });
  }
}
}

// Create a Phaser game instance
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  scene:     [MainScene]

};
const game = new Phaser.Game(config);