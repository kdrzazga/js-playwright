class DisassemblyView {
    constructor(container, machine, startAddress = 0xC000, lineCount = 20) {
        this.machine = machine;
        this.startAddress = startAddress;
        this.lineCount = lineCount;
        const table = ElementFactory.tableWithHeader(['Addr', 'Bytes', 'Instruction']);
        this.lineRows = Array.from({ length: lineCount }, () => {
            const row = ElementFactory.create('tr');
            const addressText = ElementFactory.liveCell(row);
            const bytesText = ElementFactory.liveCell(row, 'bytes');
            const instructionText = ElementFactory.liveCell(row, 'instruction');
            table.append(row);
            return { row, addressText, bytesText, instructionText };
        });
        container.append(ElementFactory.create('h2', { text: 'Disassembly' }), table);
    }

    refresh() {
        const programCounter = this.machine.cpu.programCounter;
        const isTracingProgram = this.machine.executionState !== ExecutionState.READY;
        const instructions = this.instructionsToShow(programCounter, isTracingProgram);
        instructions.forEach((instruction, index) => {
            const lineRow = this.lineRows[index];
            lineRow.addressText.set(NumberFormat.hexWord(instruction.address));
            lineRow.bytesText.set(instruction.hexBytes);
            lineRow.instructionText.set(instruction.text);
            lineRow.row.classList.toggle('current-instruction', isTracingProgram && instruction.address === programCounter);
        });
    }

    instructionsToShow(programCounter, isTracingProgram) {
        const instructionsFromStart = this.machine.disassembler.disassembleRange(this.startAddress, this.lineCount);
        const isProgramCounterVisible = instructionsFromStart.some(instruction => instruction.address === programCounter);
        if (!isTracingProgram || isProgramCounterVisible) {
            return instructionsFromStart;
        }
        return this.machine.disassembler.disassembleRange(programCounter, this.lineCount);
    }
}
