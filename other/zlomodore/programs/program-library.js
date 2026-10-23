class ProgramLibrary {
    constructor(programs = []) {
        this.programs = programs;
    }

    static createDefault() {
        return new ProgramLibrary([
            new EightSpritesProgram(),
            new WaveProgram(),
            new WaveChroutProgram(),
        ]);
    }

    get isEmpty() {
        return this.programs.length === 0;
    }

    programAt(index) {
        return this.programs[index];
    }
}
