const ExecutionState = Object.freeze({
    READY: 'READY',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
});

class C64Machine {
    constructor(characterRom, frameBuffer, geometry, {
        defaultStartAddress = 0xC000,
        returnTrapAddress = 0xFFFF,
        breakOpcode = 0x00,
        romRoutineCycles = 200,
        vicAddressRange = [0xD000, 0xD3FF],
        colorRamAddressRange = [0xD800, 0xDBFF],
    } = {}) {
        this.geometry = geometry;
        this.defaultStartAddress = defaultStartAddress;
        this.returnTrapAddress = returnTrapAddress;
        this.breakOpcode = breakOpcode;
        this.romRoutineCycles = romRoutineCycles;

        this.ram = new Memory();
        this.colorRam = new ColorRam();
        this.vic = new Vic();
        this.bus = new MemoryBus(this.ram, [
            new MemoryMappedDevice(vicAddressRange[0], vicAddressRange[1], this.vic),
            new MemoryMappedDevice(colorRamAddressRange[0], colorRamAddressRange[1], this.colorRam),
        ]);

        this.opcodeTable = new OpcodeTable(new AddressingModes());
        this.cpu = new Cpu6510(this.bus, this.opcodeTable);
        this.assembler = new Assembler(this.opcodeTable);
        this.disassembler = new Disassembler(this.bus, this.opcodeTable);
        this.codeInstaller = new CodeInstaller(this.assembler, this.bus);

        this.vic.attachLineRenderer(new VicLineRenderer(this.vic, this.ram, this.colorRam, characterRom, frameBuffer, geometry));
        this.rom = new MinimalRom(this.bus, new ScreenEditor(this.bus, geometry));

        this.executionState = ExecutionState.READY;
        this.statusMessage = '';
        this.carriedCycles = 0;
        this.instructionsPerFrame = Infinity;
    }

    setInstructionsPerFrame(instructionsPerFrame) {
        this.instructionsPerFrame = instructionsPerFrame;
    }

    get isRunning() {
        return this.executionState === ExecutionState.RUNNING;
    }

    hardReset() {
        this.ram.clear();
        this.colorRam.clear();
        this.vic.reset();
        this.cpu.powerOn();
        this.startRom();
        this.statusMessage = 'Hard reset - RAM and registers cleared';
    }

    softReset() {
        this.vic.reset();
        this.cpu.reset();
        this.startRom();
        this.statusMessage = 'Soft reset - RAM kept';
    }

    startRom() {
        this.rom.start();
        this.executionState = ExecutionState.READY;
        this.carriedCycles = 0;
    }

    sys(startAddress = this.defaultStartAddress) {
        this.rom.echoCommand(`SYS ${startAddress}`);
        this.beginProgramAt(startAddress);
        this.executionState = ExecutionState.RUNNING;
        this.statusMessage = `Running from ${NumberFormat.hexWord(startAddress)}`;
    }

    beginProgramAt(startAddress) {
        this.rom.hideCursor();
        this.cpu.pushWord((this.returnTrapAddress - 1) & 0xFFFF);
        this.cpu.programCounter = startAddress;
    }

    stop() {
        if (this.executionState === ExecutionState.RUNNING) {
            this.executionState = ExecutionState.PAUSED;
            this.statusMessage = `Paused at ${NumberFormat.hexWord(this.cpu.programCounter)}`;
        }
    }

    resume() {
        if (this.executionState === ExecutionState.PAUSED) {
            this.executionState = ExecutionState.RUNNING;
            this.statusMessage = `Running from ${NumberFormat.hexWord(this.cpu.programCounter)}`;
        }
    }

    stepInstruction() {
        if (this.executionState === ExecutionState.READY) {
            this.beginProgramAt(this.defaultStartAddress);
        }
        this.executionState = ExecutionState.PAUSED;
        const cycles = this.executeInstruction();
        if (this.executionState === ExecutionState.PAUSED) {
            this.statusMessage = `Stepped - next ${NumberFormat.hexWord(this.cpu.programCounter)}`;
        }
        this.vic.advance(cycles);
    }

    stepInstructions(instructionCount) {
        for (let stepIndex = 0; stepIndex < instructionCount; stepIndex++) {
            this.stepInstruction();
            if (this.executionState === ExecutionState.READY) {
                return;
            }
        }
    }

    runFrame() {
        let remainingCycles = this.vic.cyclesPerFrame + this.carriedCycles;
        let executedInstructions = 0;
        while (remainingCycles > 0 && this.isRunning && executedInstructions < this.instructionsPerFrame) {
            const cycles = this.executeInstruction();
            this.vic.advance(cycles);
            remainingCycles -= cycles;
            executedInstructions++;
        }
        if (remainingCycles > 0) {
            this.vic.advance(remainingCycles);
            remainingCycles = 0;
        }
        this.carriedCycles = remainingCycles;
        if (this.executionState === ExecutionState.READY) {
            this.rom.tickIdleFrame();
        }
    }

    executeInstruction() {
        const instructionAddress = this.cpu.programCounter;
        if (instructionAddress === this.returnTrapAddress) {
            this.finishProgram('Program returned with RTS');
            return 0;
        }
        const romRoutine = this.rom.routineAt(instructionAddress);
        if (romRoutine) {
            return this.executeRomRoutine(romRoutine);
        }
        if (this.bus.read(instructionAddress) === this.breakOpcode) {
            this.finishProgram(`BRK at ${NumberFormat.hexWord(instructionAddress)}`, `BREAK AT ${NumberFormat.hexWord(instructionAddress)}`);
            return 0;
        }
        try {
            const cycles = this.cpu.step();
            if (this.cpu.programCounter === this.returnTrapAddress) {
                this.finishProgram('Program returned with RTS');
            }
            return cycles;
        } catch (error) {
            if (!(error instanceof IllegalOpcodeError)) {
                throw error;
            }
            this.finishProgram(error.message, '?ILLEGAL OPCODE  ERROR');
            return 0;
        }
    }

    executeRomRoutine(romRoutine) {
        romRoutine(this.cpu);
        this.cpu.returnFromSubroutine();
        this.cpu.addCycles(this.romRoutineCycles);
        if (this.cpu.programCounter === this.returnTrapAddress) {
            this.finishProgram('Program returned with RTS');
        }
        return this.romRoutineCycles;
    }

    finishProgram(statusMessage, screenMessage = null) {
        this.executionState = ExecutionState.READY;
        this.statusMessage = statusMessage;
        if (screenMessage !== null) {
            this.rom.printMessage(screenMessage);
        }
        this.rom.printReady();
    }
}
