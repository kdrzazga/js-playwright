class VicRegistersView {
    constructor(container, vic, registerCatalog = new VicRegisterCatalog(), baseAddress = 0xD000) {
        this.vic = vic;
        const table = ElementFactory.tableWithHeader(['Addr', 'Name', 'Hex', 'Binary', 'Description']);
        this.registerRows = registerCatalog.descriptions.map(description => {
            const row = ElementFactory.create('tr');
            row.append(
                ElementFactory.create('td', { text: NumberFormat.hexWord(baseAddress + description.offset) }),
                ElementFactory.create('td', { text: description.name })
            );
            const hexText = ElementFactory.liveCell(row, 'value');
            const binaryText = ElementFactory.liveCell(row, 'value');
            row.append(ElementFactory.create('td', { className: 'description', text: description.description }));
            table.append(row);
            return { offset: description.offset, hexText, binaryText, highlighter: new ChangeHighlighter(row) };
        });
        container.append(ElementFactory.create('h2', { text: 'VIC-II registers' }), table);
    }

    forgetChangeHighlights() {
        this.registerRows.forEach(({ highlighter }) => highlighter.forget());
    }

    refresh() {
        this.registerRows.forEach(({ offset, hexText, binaryText, highlighter }) => {
            const value = this.vic.storedRegisterValue(offset);
            hexText.set(NumberFormat.hexDigits(value, 2));
            binaryText.set(NumberFormat.binaryByte(value));
            if (offset !== VicRegister.RASTER && offset !== VicRegister.CONTROL_1) {
                highlighter.observe(value);
            }
        });
    }
}
