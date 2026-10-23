class ControlPanel {
    constructor(elements, machine, assemblerConsole, programLibrary, onHardReset = () => {}, speedOptions = [
        ['Full speed', Infinity],
        ['100 instructions / frame', 100],
        ['10 instructions / frame', 10],
        ['1 instruction / frame', 1],
    ], multiStepInstructionCount = 10) {
        this.onHardReset = onHardReset;
        this.speedOptions = speedOptions;
        this.elements = elements;
        this.machine = machine;
        this.assemblerConsole = assemblerConsole;
        this.programLibrary = programLibrary;

        elements.sysButton.addEventListener('click', () => this.machine.sys(this.machine.defaultStartAddress));
        elements.stopButton.addEventListener('click', () => this.machine.stop());
        elements.continueButton.addEventListener('click', () => this.machine.resume());
        elements.stepButton.addEventListener('click', () => this.machine.stepInstruction());
        elements.multiStepButton.textContent = `${multiStepInstructionCount} Steps`;
        elements.multiStepButton.addEventListener('click', () => this.machine.stepInstructions(multiStepInstructionCount));
        elements.softResetButton.addEventListener('click', () => this.machine.softReset());
        elements.hardResetButton.addEventListener('click', () => this.hardReset());
        elements.loadProgramButton.addEventListener('click', () => this.loadSelectedProgram());
        elements.speedSelect.addEventListener('change', () => this.applySelectedSpeed());
        this.populateProgramSelect();
        this.populateSpeedSelect();
    }

    populateSpeedSelect() {
        this.speedOptions.forEach(([label], index) => {
            const option = ElementFactory.create('option', { text: label });
            option.value = index;
            this.elements.speedSelect.append(option);
        });
        this.applySelectedSpeed();
    }

    applySelectedSpeed() {
        const [, instructionsPerFrame] = this.speedOptions[Number(this.elements.speedSelect.value)];
        this.machine.setInstructionsPerFrame(instructionsPerFrame);
    }

    hardReset() {
        this.machine.hardReset();
        this.assemblerConsole.clear(this.machine.defaultStartAddress);
        this.onHardReset();
    }

    populateProgramSelect() {
        const programSelect = this.elements.programSelect;
        if (this.programLibrary.isEmpty) {
            programSelect.append(ElementFactory.create('option', { text: '(no programs yet)' }));
            programSelect.disabled = true;
            this.elements.loadProgramButton.disabled = true;
            return;
        }
        this.programLibrary.programs.forEach((program, index) => {
            const option = ElementFactory.create('option', { text: program.name, title: program.description });
            option.value = index;
            programSelect.append(option);
        });
    }

    loadSelectedProgram() {
        const program = this.programLibrary.programAt(Number(this.elements.programSelect.value));
        try {
            const assemblyResult = this.machine.codeInstaller.installLines(program.sourceLines, program.loadAddress);
            this.assemblerConsole.logLoadedProgram(program.name, assemblyResult);
            this.machine.statusMessage = `Loaded "${program.name}" at ${NumberFormat.hexWord(program.loadAddress)}`;
        } catch (error) {
            if (!(error instanceof AssemblyError)) {
                throw error;
            }
            this.machine.statusMessage = `Cannot load "${program.name}": ${error.message}`;
        }
    }

    refresh() {
        const executionState = this.machine.executionState;
        this.elements.stopButton.disabled = executionState !== ExecutionState.RUNNING;
        this.elements.continueButton.disabled = executionState !== ExecutionState.PAUSED;
        this.elements.stepButton.disabled = executionState === ExecutionState.RUNNING;
        this.elements.multiStepButton.disabled = executionState === ExecutionState.RUNNING;
    }
}
