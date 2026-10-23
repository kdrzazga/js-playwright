class C64ScreenScene extends Phaser.Scene {
    constructor(machine, frameBuffer, onFramePresented, {
        textureKey = 'c64-screen',
        frameDurationMs = 20,
        maximumFramesPerUpdate = 3,
    } = {}) {
        super({ key: 'C64ScreenScene' });
        this.machine = machine;
        this.frameBuffer = frameBuffer;
        this.onFramePresented = onFramePresented;
        this.textureKey = textureKey;
        this.frameDurationMs = frameDurationMs;
        this.maximumFramesPerUpdate = maximumFramesPerUpdate;
        this.accumulatedMs = 0;
    }

    create() {
        this.screenTexture = this.textures.createCanvas(this.textureKey, this.frameBuffer.width, this.frameBuffer.height);
        this.add.image(0, 0, this.textureKey).setOrigin(0, 0);
        this.emulateOneFrame();
    }

    update(time, deltaMs) {
        this.accumulatedMs += deltaMs;
        let emulatedFrames = 0;
        while (this.accumulatedMs >= this.frameDurationMs && emulatedFrames < this.maximumFramesPerUpdate) {
            this.machine.runFrame();
            this.accumulatedMs -= this.frameDurationMs;
            emulatedFrames++;
        }
        if (emulatedFrames === this.maximumFramesPerUpdate) {
            this.accumulatedMs = 0;
        }
        if (emulatedFrames > 0) {
            this.presentFrame();
        }
    }

    emulateOneFrame() {
        this.machine.runFrame();
        this.presentFrame();
    }

    presentFrame() {
        this.screenTexture.context.putImageData(this.frameBuffer.imageData, 0, 0);
        this.screenTexture.refresh();
        this.onFramePresented();
    }
}
