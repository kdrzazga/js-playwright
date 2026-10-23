class BrainfuckDebuggerApp {
    constructor(exampleLibrary, runStepsPerFrame = 100000, animateStepsPerFrame = 1) {
        this.exampleLibrary = exampleLibrary;
        this.runStepsPerFrame = runStepsPerFrame;
        this.animateStepsPerFrame = animateStepsPerFrame;
        this.stepsPerFrame = runStepsPerFrame;
        this.interpreter = null;

        this.exampleSelect = document.getElementById('example-select');
        this.sourceEditor = document.getElementById('source-editor');
        this.inputField = document.getElementById('input-field');
        this.outputField = document.getElementById('output-field');

        this.codeView = new CodeView(document.getElementById('code-view'));
        this.tapeView = new TapeView(document.getElementById('tape-table'));
        this.statusView = new StatusView(
            document.getElementById('status'),
            document.getElementById('instruction-pointer'),
            document.getElementById('current-command'),
            document.getElementById('step-count')
        );
        this.executionLoop = new ExecutionLoop(() => this.executeFrame());
    }

    start() {
        this.populateExampleSelect();
        this.bindControls();
        this.loadExample(0);
    }

    populateExampleSelect() {
        this.exampleLibrary.names.forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = name;
            this.exampleSelect.append(option);
        });
    }

    bindControls() {
        this.exampleSelect.addEventListener('change', () => this.loadExample(Number(this.exampleSelect.value)));
        document.getElementById('reset-button').addEventListener('click', () => this.reset());
        document.getElementById('step-button').addEventListener('click', () => this.stepOnce());
        document.getElementById('animate-button').addEventListener('click', () => this.startExecution(this.animateStepsPerFrame));
        document.getElementById('run-button').addEventListener('click', () => this.startExecution(this.runStepsPerFrame));
        document.getElementById('pause-button').addEventListener('click', () => this.pause());
        this.sourceEditor.addEventListener('input', () => this.discardSession());
        this.inputField.addEventListener('input', () => this.discardSession());
    }

    loadExample(index) {
        const example = this.exampleLibrary.exampleAt(index);
        this.sourceEditor.value = example.source;
        this.inputField.value = example.input;
        this.reset();
    }

    reset() {
        this.executionLoop.stop();
        this.interpreter = null;
        this.ensureSession();
        this.render();
    }

    discardSession() {
        this.executionLoop.stop();
        this.interpreter = null;
        this.statusView.showMessage('Source or input changed - press Reset, Step or Run');
        this.statusView.clearInterpreterState();
        this.codeView.render(this.sourceEditor.value, null);
    }

    ensureSession() {
        if (this.interpreter !== null) {
            return true;
        }
        try {
            const program = new Program(this.sourceEditor.value);
            this.interpreter = new Interpreter(program, new InputStream(this.inputField.value));
            this.outputField.value = '';
            this.statusView.showMessage('Ready');
            return true;
        } catch (error) {
            this.showError(error);
            return false;
        }
    }

    stepOnce() {
        this.executionLoop.stop();
        if (!this.ensureSession()) {
            return;
        }
        this.executeSteps(1);
        this.render();
    }

    startExecution(stepsPerFrame) {
        if (!this.ensureSession() || this.interpreter.isFinished) {
            return;
        }
        this.stepsPerFrame = stepsPerFrame;
        this.statusView.showMessage('Running...');
        this.executionLoop.start();
    }

    pause() {
        if (!this.executionLoop.isRunning) {
            return;
        }
        this.executionLoop.stop();
        this.statusView.showMessage('Paused');
        this.render();
    }

    executeFrame() {
        const shouldContinue = this.executeSteps(this.stepsPerFrame);
        this.render();
        return shouldContinue;
    }

    executeSteps(stepCount) {
        try {
            const isFinished = this.interpreter.run(stepCount);
            if (isFinished) {
                this.statusView.showMessage('Finished');
            }
            return !isFinished;
        } catch (error) {
            this.showError(error);
            return false;
        }
    }

    showError(error) {
        this.statusView.showMessage(error.message, true);
        if (error instanceof BrainfuckError) {
            this.codeView.render(this.sourceEditor.value, error.sourceIndex);
        } else {
            console.error(error);
        }
    }

    render() {
        if (this.interpreter === null) {
            this.statusView.clearInterpreterState();
            this.tapeView.render(new Tape());
            this.outputField.value = '';
            return;
        }
        const currentInstruction = this.interpreter.currentInstruction;
        this.codeView.render(this.interpreter.program.source, currentInstruction ? currentInstruction.sourceIndex : null);
        this.tapeView.render(this.interpreter.tape);
        this.statusView.showInterpreterState(this.interpreter);
        this.outputField.value = this.interpreter.outputStream.text;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BrainfuckDebuggerApp(ExampleLibrary.createDefault()).start();
});
