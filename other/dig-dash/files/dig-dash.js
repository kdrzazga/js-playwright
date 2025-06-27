class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  preload() {
    this.load.image('player', 'files/dd.bmp')
  }

  create() {
    this.playerSize = 32;
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.isMoving = false;
    this.moveDirection = null;
    this.targetPosition = new Phaser.Math.Vector2();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (!this.isMoving) {
      if (this.cursors.left.isDown) {
        this.startMove('left');
      } else if (this.cursors.right.isDown) {
        this.startMove('right');
      } else if (this.cursors.up.isDown) {
        this.startMove('up');
      } else if (this.cursors.down.isDown) {
        this.startMove('down');
      }
    } else {
      const speed = 100;
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.targetPosition.x,
        this.targetPosition.y
      );

      if (distance < speed * delta / 1000) {
        this.player.x = this.targetPosition.x;
        this.player.y = this.targetPosition.y;
        this.isMoving = false;
        this.moveDirection = null;
        this.player.body.setVelocity(0, 0);
      } else {
        this.physics.velocityFromRotation(
          Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            this.targetPosition.x,
            this.targetPosition.y
          ),
          speed,
          this.player.body.velocity
        );
      }
    }
  }

  startMove(direction) {
    this.moveDirection = direction;
    let { x, y } = this.player;

    switch (direction) {
      case 'left':
        this.targetPosition.x = x - (x % this.playerSize);
        this.targetPosition.y = y;
        break;
      case 'right':
        this.targetPosition.x = x + (this.playerSize - (x % this.playerSize));
        this.targetPosition.y = y;
        break;
      case 'up':
        this.targetPosition.x = x;
        this.targetPosition.y = y - (y % this.playerSize);
        break;
      case 'down':
        this.targetPosition.x = x;
        this.targetPosition.y = y + (this.playerSize - (y % this.playerSize));
        break;
    }

    this.isMoving = true;
  }

  getDirectionVector(direction) {
    switch (direction) {
      case 'left': return new Phaser.Math.Vector2(-1, 0);
      case 'right': return new Phaser.Math.Vector2(1, 0);
      case 'up': return new Phaser.Math.Vector2(0, -1);
      case 'down': return new Phaser.Math.Vector2(0, 1);
      default: return new Phaser.Math.Vector2(0, 0);
    }
  }
}
