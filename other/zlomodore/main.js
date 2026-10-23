class ZlomodoreBootstrap {
    constructor({
        fontFamily = 'C64 Pro Mono',
        fontUrl = '../../common/fonts/C64_Pro_Mono-STYLE.ttf',
        screenParentId = 'screen',
        zoom = 1,
    } = {}) {
        this.fontFamily = fontFamily;
        this.fontUrl = fontUrl;
        this.screenParentId = screenParentId;
        this.zoom = zoom;
    }

    async start() {
        await this.loadFont();
        const palette = new Palette();
        const geometry = new ScreenGeometry();
        const frameBuffer = new FrameBuffer(geometry.width, geometry.height, palette);
        const characterRom = new CharacterRomBuilder(this.fontFamily).build();
        const machine = new C64Machine(characterRom, frameBuffer, geometry);
        machine.hardReset();

        const debuggerApp = new DebuggerApp(machine, palette, ProgramLibrary.createDefault());
        this.startPhaser(geometry, new C64ScreenScene(machine, frameBuffer, () => debuggerApp.refresh()));
    }

    async loadFont() {
        const fontFace = new FontFace(this.fontFamily, `url("${this.fontUrl}")`);
        await fontFace.load();
        document.fonts.add(fontFace);
    }

    startPhaser(geometry, scene) {
        return new Phaser.Game({
            type: Phaser.AUTO,
            parent: this.screenParentId,
            width: geometry.width,
            height: geometry.height,
            zoom: this.zoom,
            pixelArt: true,
            backgroundColor: '#000000',
            scene,
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ZlomodoreBootstrap().start().catch(error => {
        document.getElementById('startup-error').textContent = `Startup failed: ${error.message}`;
        console.error(error);
    });
});
