class AssemblerConsole {
    constructor(elements, codeInstaller, startAddress = 0xC000, maximumLogLines = 200) {
        this.promptText = new LiveText(elements.promptElement);
        this.inputElement = elements.inputElement;
        this.errorText = new LiveText(elements.errorElement);
        this.logElement = elements.logElement;
        this.codeInstaller = codeInstaller;
        this.maximumLogLines = maximumLogLines;
        this.setAddress(startAddress);

        this.inputElement.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                this.assembleInput();
            }
        });
        elements.assembleButton.addEventListener('click', () => this.assembleInput());
    }

    setAddress(address) {
        this.currentAddress = address & 0xFFFF;
        this.promptText.set(NumberFormat.hexWord(this.currentAddress) + '>');
    }

    clear(startAddress) {
        this.logElement.replaceChildren();
        this.errorText.set('');
        this.inputElement.value = '';
        this.setAddress(startAddress);
    }

    assembleInput() {
        const sourceLine = this.inputElement.value;
        if (sourceLine.trim() === '') {
            return;
        }
        try {
            const assemblyResult = this.codeInstaller.installLine(sourceLine, this.currentAddress);
            assemblyResult.statements.forEach(statement => this.appendLogLine(this.formatStatement(statement)));
            this.setAddress(assemblyResult.nextAddress);
            this.errorText.set('');
            this.inputElement.value = '';
        } catch (error) {
            if (!(error instanceof AssemblyError)) {
                throw error;
            }
            this.errorText.set(error.message);
        }
        this.inputElement.focus();
    }

    logLoadedProgram(programName, assemblyResult) {
        this.appendLogLine(`; loaded "${programName}"`);
        assemblyResult.statements.forEach(statement => this.appendLogLine(this.formatStatement(statement)));
        this.setAddress(assemblyResult.nextAddress);
    }

    formatStatement(statement) {
        const hexBytes = statement.bytes.map(byte => NumberFormat.hexDigits(byte, 2)).join(' ');
        return `${NumberFormat.hexDigits(statement.address, 4)}  ${hexBytes.padEnd(9)} ${statement.sourceText.toUpperCase()}`;
    }

    appendLogLine(text) {
        this.logElement.append(ElementFactory.create('div', { text }));
        while (this.logElement.childElementCount > this.maximumLogLines) {
            this.logElement.firstElementChild.remove();
        }
        this.logElement.scrollTop = this.logElement.scrollHeight;
    }
}
