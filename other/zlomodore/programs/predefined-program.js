class PredefinedProgram {
    constructor(name, description, sourceLines, loadAddress = 0xC000) {
        this.name = name;
        this.description = description;
        this.sourceLines = sourceLines;
        this.loadAddress = loadAddress;
    }
}
