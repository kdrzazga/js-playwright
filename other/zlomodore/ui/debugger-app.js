class DebuggerApp {
    constructor(machine, palette, programLibrary) {
        const elementById = id => document.getElementById(id);
        this.assemblerConsole = new AssemblerConsole({
            promptElement: elementById('assembler-prompt'),
            inputElement: elementById('assembler-input'),
            assembleButton: elementById('assemble-button'),
            errorElement: elementById('assembler-error'),
            logElement: elementById('assembler-log'),
        }, machine.codeInstaller, machine.defaultStartAddress);
        this.controlPanel = new ControlPanel({
            sysButton: elementById('sys-button'),
            stopButton: elementById('stop-button'),
            continueButton: elementById('continue-button'),
            stepButton: elementById('step-button'),
            multiStepButton: elementById('multi-step-button'),
            softResetButton: elementById('soft-reset-button'),
            hardResetButton: elementById('hard-reset-button'),
            programSelect: elementById('program-select'),
            loadProgramButton: elementById('load-program-button'),
            speedSelect: elementById('speed-select'),
        }, machine, this.assemblerConsole, programLibrary, () => this.vicRegistersView.forgetChangeHighlights());
        this.vicRegistersView = new VicRegistersView(elementById('vic-panel'), machine.vic);
        this.refreshableViews = [
            this.controlPanel,
            new CpuRegistersView(elementById('cpu-panel'), machine),
            new DisassemblyView(elementById('disassembly-panel'), machine, machine.defaultStartAddress),
            new SpritesView(elementById('sprites-panel'), machine, palette),
            this.vicRegistersView,
        ];
    }

    refresh() {
        this.refreshableViews.forEach(view => view.refresh());
    }
}
