class WavePattern {
    constructor(risingPetsciiCodes = [175, 210, 198, 195, 196, 197, 183], screenCodeConverter = new ScreenCodeConverter()) {
        const fallingPetsciiCodes = risingPetsciiCodes.slice(1, -1).reverse();
        this.petsciiCodes = [...risingPetsciiCodes, ...fallingPetsciiCodes];
        this.screenCodes = this.petsciiCodes.map(petsciiCode => screenCodeConverter.fromPetscii(petsciiCode));
    }

    get length() {
        return this.petsciiCodes.length;
    }
}
