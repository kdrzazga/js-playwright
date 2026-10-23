class ScreenEditor {
    constructor(bus, geometry, screenCodeConverter = new ScreenCodeConverter(), spaceScreenCode = 32, reverseBit = 0x80) {
        this.bus = bus;
        this.geometry = geometry;
        this.screenCodeConverter = screenCodeConverter;
        this.spaceScreenCode = spaceScreenCode;
        this.reverseBit = reverseBit;
        this.textColor = 14;
        this.cursorRow = 0;
        this.cursorColumn = 0;
        this.isCursorShown = false;
    }

    screenAddressOf(row, column) {
        return this.geometry.screenMemoryAddress + row * this.geometry.columns + column;
    }

    colorAddressOf(row, column) {
        return this.geometry.colorRamAddress + row * this.geometry.columns + column;
    }

    clearScreen(textColor) {
        this.textColor = textColor;
        for (let row = 0; row < this.geometry.rows; row++) {
            this.clearRow(row);
        }
        this.cursorRow = 0;
        this.cursorColumn = 0;
        this.isCursorShown = false;
    }

    clearRow(row) {
        for (let column = 0; column < this.geometry.columns; column++) {
            this.bus.write(this.screenAddressOf(row, column), this.spaceScreenCode);
            this.bus.write(this.colorAddressOf(row, column), this.textColor);
        }
    }

    printLine(text) {
        this.hideCursor();
        this.moveToLineStart();
        [...text.slice(0, this.geometry.columns)].forEach((character, column) => {
            this.bus.write(this.screenAddressOf(this.cursorRow, column), this.screenCodeConverter.fromText(character));
            this.bus.write(this.colorAddressOf(this.cursorRow, column), this.textColor);
        });
        this.moveToNextLine();
    }

    printScreenCodeAtCursor(screenCode) {
        this.hideCursor();
        this.bus.write(this.screenAddressOf(this.cursorRow, this.cursorColumn), screenCode);
        this.bus.write(this.colorAddressOf(this.cursorRow, this.cursorColumn), this.textColor);
        this.cursorColumn++;
        if (this.cursorColumn >= this.geometry.columns) {
            this.moveToNextLine();
        }
    }

    moveToLineStart() {
        if (this.cursorColumn > 0) {
            this.moveToNextLine();
        }
    }

    homeCursor() {
        this.hideCursor();
        this.cursorRow = 0;
        this.cursorColumn = 0;
    }

    newLine() {
        this.hideCursor();
        this.moveToNextLine();
    }

    clearScreenKeepingColor() {
        this.hideCursor();
        this.clearScreen(this.textColor);
    }

    moveToNextLine() {
        this.cursorColumn = 0;
        this.cursorRow++;
        if (this.cursorRow >= this.geometry.rows) {
            this.scrollUp();
            this.cursorRow = this.geometry.rows - 1;
        }
    }

    scrollUp() {
        for (let row = 1; row < this.geometry.rows; row++) {
            for (let column = 0; column < this.geometry.columns; column++) {
                this.bus.write(this.screenAddressOf(row - 1, column), this.bus.read(this.screenAddressOf(row, column)));
                this.bus.write(this.colorAddressOf(row - 1, column), this.bus.read(this.colorAddressOf(row, column)));
            }
        }
        this.clearRow(this.geometry.rows - 1);
    }

    toggleCursor() {
        this.isCursorShown = !this.isCursorShown;
        this.invertCharacterUnderCursor();
    }

    hideCursor() {
        if (this.isCursorShown) {
            this.isCursorShown = false;
            this.invertCharacterUnderCursor();
        }
    }

    invertCharacterUnderCursor() {
        const cursorAddress = this.screenAddressOf(this.cursorRow, this.cursorColumn);
        this.bus.write(cursorAddress, this.bus.read(cursorAddress) ^ this.reverseBit);
        this.bus.write(this.colorAddressOf(this.cursorRow, this.cursorColumn), this.textColor);
    }
}

class MinimalRom {
    constructor(bus, screenEditor, {
        borderColor = 14,
        backgroundColor = 6,
        textColor = 14,
        cursorBlinkIntervalFrames = 20,
        welcomeLines = [
            '',
            '    **** COMMODORE 64 BASIC V2 ****',
            '',
            ' 64K RAM SYSTEM  38911 BASIC BYTES FREE',
            '',
        ],
        readyPrompt = 'READY.',
        vicRegisterBase = 0xD000,
        initialVicRegisterValues = [[0x11, 0x1B], [0x16, 0xC8], [0x18, 0x15]],
        chroutAddress = 0xFFD2,
        returnFromSubroutineOpcode = 0x60,
        screenCodeConverter = new ScreenCodeConverter(),
    } = {}) {
        this.chroutAddress = chroutAddress;
        this.returnFromSubroutineOpcode = returnFromSubroutineOpcode;
        this.screenCodeConverter = screenCodeConverter;
        this.routinesByAddress = new Map([
            [chroutAddress, cpu => this.printPetscii(cpu.a)],
        ]);
        this.controlCodeActions = new Map([
            [13, () => screenEditor.newLine()],
            [141, () => screenEditor.newLine()],
            [19, () => screenEditor.homeCursor()],
            [147, () => screenEditor.clearScreenKeepingColor()],
        ]);
        this.bus = bus;
        this.screenEditor = screenEditor;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.cursorBlinkIntervalFrames = cursorBlinkIntervalFrames;
        this.welcomeLines = welcomeLines;
        this.readyPrompt = readyPrompt;
        this.vicRegisterBase = vicRegisterBase;
        this.initialVicRegisterValues = initialVicRegisterValues;
        this.idleFrameCounter = 0;
    }

    routineAt(address) {
        return this.routinesByAddress.get(address) ?? null;
    }

    installRoutineEntryPoints() {
        this.routinesByAddress.forEach((routine, address) => this.bus.write(address, this.returnFromSubroutineOpcode));
    }

    printPetscii(petsciiCode) {
        const controlCodeAction = this.controlCodeActions.get(petsciiCode);
        if (controlCodeAction) {
            controlCodeAction();
        } else if (this.isPrintablePetscii(petsciiCode)) {
            this.screenEditor.printScreenCodeAtCursor(this.screenCodeConverter.fromPetscii(petsciiCode));
        }
    }

    isPrintablePetscii(petsciiCode) {
        return (petsciiCode >= 32 && petsciiCode <= 127) || petsciiCode >= 160;
    }

    start() {
        this.installRoutineEntryPoints();
        this.initializeVic();
        this.screenEditor.clearScreen(this.textColor);
        this.welcomeLines.forEach(line => this.screenEditor.printLine(line));
        this.printReady();
    }

    initializeVic() {
        this.initialVicRegisterValues.forEach(([register, value]) => this.bus.write(this.vicRegisterBase + register, value));
        this.bus.write(this.vicRegisterBase + VicRegister.BORDER_COLOR, this.borderColor);
        this.bus.write(this.vicRegisterBase + VicRegister.BACKGROUND_COLOR_0, this.backgroundColor);
    }

    echoCommand(commandText) {
        this.screenEditor.printLine(commandText);
    }

    printMessage(messageText) {
        this.screenEditor.printLine(messageText);
    }

    printReady() {
        this.screenEditor.printLine(this.readyPrompt);
        this.idleFrameCounter = 0;
    }

    hideCursor() {
        this.screenEditor.hideCursor();
    }

    tickIdleFrame() {
        this.idleFrameCounter++;
        if (this.idleFrameCounter >= this.cursorBlinkIntervalFrames) {
            this.idleFrameCounter = 0;
            this.screenEditor.toggleCursor();
        }
    }
}
