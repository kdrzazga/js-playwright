class Flake {
    constructor(id, canvasWidth, canvasHeight) {
        this.id = id;
        this.enabled = true;
        this.x = Math.random() * canvasWidth;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;
        this.amplitude = Math.random() * 6 + 6;
        this.frequency = Math.random() * 0.005 + 0.005;
        this.phase = Math.random() * Math.PI;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        document.body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * this.frequency + this.phase) * this.amplitude;

        if (this.y > this.canvasHeight && this.enabled) {
            this.y = 0;
            this.x = Math.random() * this.canvasWidth;
        }
    }

    draw(image) {
        this.ctx.drawImage(image, this.x, this.y);
    }
}

class FlakeAnimation {
    constructor(numFlakes) {
        this.flakes = [];
        this.enabled = false;
        this.numFlakes = numFlakes;
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.flakeImage = new Image();
        this.flakeImage.src = 'files/flake.png';

        this.createFlakes();
        this.flakeImage.onload = () => this.animate();
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} Starting to snow...`);

        this.startSnowingIntervals();
    }

    createFlakes() {
        for (let i = 0; i < this.numFlakes; i++) {
            this.flakes.push(new Flake(i, this.canvasWidth, this.canvasHeight));
        }
    }

    startSnowingIntervals() {
        this.setEnableInterval();
        setTimeout(() => {
            this.setDisableInterval();
            const initialDisableTimestamp = new Date().toISOString();
            console.log(`${initialDisableTimestamp} Snowing will be disabled after 7 seconds.`);
        }, 7000);
    }

    setEnableInterval() {
        this.enableInterval = setInterval(() => {
            this.enabled = true;
            this.flakes.forEach(flake => flake.enabled = this.enabled);
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} Snowing enabled.`);
        }, 30000);
    }

    setDisableInterval() {
        this.disableInterval = setInterval(() => {
            this.enabled = false;
            this.flakes.forEach(flake => flake.enabled = this.enabled);
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} Snowing disabled.`);
        }, 30000);
    }

    animate() {
        const periodicMultiplier = new Date().getSeconds() > 45 ? 0.6 : 0.8;

        this.flakes.forEach(flake => {
            flake.update();
            flake.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

            if (flake.id % 2 === 0) {
                flake.x *= periodicMultiplier;
                flake.x += 5 + 7 * flake.id;
                flake.y += flake.id / 3;
            }
            flake.draw(this.flakeImage);
        });

        requestAnimationFrame(() => this.animate());
    }
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const params = new URLSearchParams(url.search);
const snowParam = params.get('snow');

if (snowParam === 'on'){
    const snowAnimation = new FlakeAnimation(20);
}
