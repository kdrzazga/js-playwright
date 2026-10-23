class CpuRegistersView {
    constructor(container, machine, flagLabels = ['N', 'V', '-', 'B', 'D', 'I', 'Z', 'C']) {
        this.machine = machine;
        this.flagLabels = flagLabels;
        this.registerReaders = [
            ['A', () => this.machine.cpu.a, 2],
            ['X', () => this.machine.cpu.x, 2],
            ['Y', () => this.machine.cpu.y, 2],
            ['SP', () => this.machine.cpu.stackPointer, 2],
            ['PC', () => this.machine.cpu.programCounter, 4],
            ['P', () => this.machine.cpu.statusRegister, 2],
        ];
        container.append(
            ElementFactory.create('h2', { text: 'CPU 6510' }),
            this.buildRegistersTable(),
            this.buildFlagsTable(),
            this.buildStatusTable()
        );
    }

    buildRegistersTable() {
        const table = ElementFactory.tableWithHeader(['', ...this.registerReaders.map(([name]) => name)]);
        const hexRow = ElementFactory.create('tr');
        const decimalRow = ElementFactory.create('tr');
        hexRow.append(ElementFactory.create('th', { text: 'hex' }));
        decimalRow.append(ElementFactory.create('th', { text: 'dec' }));
        this.registerCells = this.registerReaders.map(([name, readValue, hexWidth]) => ({
            readValue,
            hexWidth,
            hexText: ElementFactory.liveCell(hexRow),
            decimalText: ElementFactory.liveCell(decimalRow),
        }));
        table.append(hexRow, decimalRow);
        return table;
    }

    buildFlagsTable() {
        const table = ElementFactory.tableWithHeader(this.flagLabels);
        const valueRow = ElementFactory.create('tr');
        this.flagCells = this.flagLabels.map(() => {
            const cell = ElementFactory.create('td', { className: 'flag' });
            valueRow.append(cell);
            return { cell, text: new LiveText(cell) };
        });
        table.append(valueRow);
        return table;
    }

    buildStatusTable() {
        const table = ElementFactory.create('table', { className: 'debug-table status-table' });
        const addStatusRow = label => {
            const row = ElementFactory.create('tr');
            row.append(ElementFactory.create('th', { text: label }));
            table.append(row);
            return ElementFactory.liveCell(row);
        };
        this.stateText = addStatusRow('State');
        this.messageText = addStatusRow('Message');
        this.cyclesText = addStatusRow('Cycles');
        this.rasterText = addStatusRow('Raster');
        return table;
    }

    refresh() {
        this.registerCells.forEach(({ readValue, hexWidth, hexText, decimalText }) => {
            const value = readValue();
            hexText.set(NumberFormat.hexDigits(value, hexWidth));
            decimalText.set(value);
        });
        const statusRegister = this.machine.cpu.statusRegister;
        this.flagCells.forEach(({ cell, text }, index) => {
            const isSet = ((statusRegister >> (7 - index)) & 1) === 1;
            text.set(isSet ? '1' : '0');
            cell.classList.toggle('flag-set', isSet);
        });
        this.stateText.set(this.machine.executionState);
        this.messageText.set(this.machine.statusMessage);
        this.cyclesText.set(this.machine.cpu.totalCycles);
        this.rasterText.set(this.machine.vic.rasterLine);
    }
}
