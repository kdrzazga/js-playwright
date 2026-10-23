class CodeInstaller {
    constructor(assembler, bus) {
        this.assembler = assembler;
        this.bus = bus;
    }

    installLine(sourceLine, startAddress) {
        return this.writeToMemory(this.assembler.assembleLine(sourceLine, startAddress));
    }

    installLines(sourceLines, startAddress) {
        return this.writeToMemory(this.assembler.assembleLines(sourceLines, startAddress));
    }

    writeToMemory(assemblyResult) {
        assemblyResult.statements.forEach(statement => {
            statement.bytes.forEach((byte, offset) => this.bus.write((statement.address + offset) & 0xFFFF, byte));
        });
        return assemblyResult;
    }
}
