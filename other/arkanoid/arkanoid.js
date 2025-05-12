class Velocity {
    constructor(speed) {
        this.speed = speed;
        this.directions = [Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4, -Math.PI / 4];
        this.currentIndex = 0;
    }

    deflectOnLeft() {
        this.currentIndex = (this.currentIndex + 1) % 4;
        this.angle = this.directions[this.currentIndex];
    }

    deflectOnRight() {
        this.currentIndex = (this.currentIndex + 3) % 4; // Equivalent to -1 index rotation
        this.angle = this.directions[this.currentIndex];
    }

    deflectOnTop() {
        this.currentIndex = 0;
        this.angle = this.directions[this.currentIndex];
    }

    deflectOnBottom() {
        this.currentIndex = 2;
        this.angle = this.directions[this.currentIndex];
    }

    getVelocityVector() {
        const x = this.speed * Math.cos(this.angle);
        const y = this.speed * Math.sin(this.angle);
        return { x, y };
    }
}

class Ball{

    constructor(sprite){
        this.sprite = sprite;
        this.velocity = new Velocity(3);
    }
}

class Bat{

    constructor(){
        #TODO
    }
}

class Brick{

    static WIDTH = 30;
    static HEIGHT = 10;

    constructor(color){
        this.color = color;
    }
}

class Board{

    constructor(){
        this.bricks =[new Brick()];
        this.bat = new Bat();
        this.ball = new Ball();
    }
}
