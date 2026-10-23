class PredefinedProgram {
    constructor(name, description, sourceLines, loadAddress = 0xC000) {
        this.name = name;
        this.description = description;
        this.sourceLines = sourceLines;
        this.loadAddress = loadAddress;
    }
}

class ProgramLibrary {
    constructor(programs = []) {
        this.programs = programs;
    }

    static createDefault() {
        return new ProgramLibrary([]);
    }

    get isEmpty() {
        return this.programs.length === 0;
    }

    programAt(index) {
        return this.programs[index];
    }
}
