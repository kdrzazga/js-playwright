const maxWidth = 640;
const maxHeight = 640;

const config = {
    type: Phaser.AUTO,
    parent: 'mandelbrot',
    width: maxWidth,
    height: maxHeight,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let graphics = null;

function preload() {
}

function create() {
    graphics = this.add.graphics();
    drawMandelbrot(graphics, -2.0, 1.0, 1.0, -1.0, maxWidth, maxHeight, 100);
}

function getParamsFromUi(){
    const iterationsSlider = document.getElementById('iterationSliderM');
    const iterations = iterationsSlider.value;
    drawMandelbrot(graphics, -2.0, 1.0, 1.0, -1.0,  maxWidth, maxHeight, iterations);
}

function update() {
}

function drawMandelbrot(graphics, xMin, xMax, yMin, yMax, width, height, maxIter) {
    const pixelWidth = 1;

    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            let x0 = xMin + (px / width) * (xMax - xMin);
            let y0 = yMin + (py / height) * (yMax - yMin);
            let x = 0, y = 0;
            let iteration = 0;

            while (x * x + y * y <= 4 && iteration < maxIter) {
                let xtemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xtemp;
                iteration++;
            }

            const colorValue = (iteration === maxIter) ? 0 : (iteration / maxIter) * 255;
            const color = Phaser.Display.Color.GetColor(colorValue, colorValue, 0); // Gradient from black to green

            graphics.fillStyle(color, 1);
            graphics.fillRect(px * pixelWidth, py * pixelWidth, pixelWidth, pixelWidth);
        }
    }
}
