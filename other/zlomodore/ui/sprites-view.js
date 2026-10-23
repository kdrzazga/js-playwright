class SpritesView {
    constructor(container, machine, palette, spriteBlockSize = 64) {
        this.machine = machine;
        this.palette = palette;
        this.spriteBlockSize = spriteBlockSize;
        const table = ElementFactory.tableWithHeader(['#', 'On', 'X', 'Y', 'Color', 'Ptr', 'Data', 'MC', '2W', '2H', 'Behind']);
        this.spriteRows = Array.from({ length: machine.vic.spriteCount }, (_, spriteIndex) => {
            const row = ElementFactory.create('tr');
            row.append(ElementFactory.create('td', { text: spriteIndex }));
            const enabledText = ElementFactory.liveCell(row);
            const xText = ElementFactory.liveCell(row);
            const yText = ElementFactory.liveCell(row);
            const colorCell = ElementFactory.create('td');
            const colorSwatch = ElementFactory.create('span', { className: 'swatch' });
            const colorText = new LiveText(ElementFactory.create('span'));
            colorCell.append(colorSwatch, colorText.element);
            row.append(colorCell);
            const pointerText = ElementFactory.liveCell(row);
            const dataAddressText = ElementFactory.liveCell(row);
            const multicolorText = ElementFactory.liveCell(row);
            const expandXText = ElementFactory.liveCell(row);
            const expandYText = ElementFactory.liveCell(row);
            const behindText = ElementFactory.liveCell(row);
            table.append(row);
            return {
                spriteIndex, row, enabledText, xText, yText, colorSwatch, colorText,
                pointerText, dataAddressText, multicolorText, expandXText, expandYText, behindText,
            };
        });
        container.append(ElementFactory.create('h2', { text: 'Sprites' }), table);
    }

    refresh() {
        const vic = this.machine.vic;
        const pointerBaseAddress = this.machine.geometry.spritePointerAddress;
        const yesNo = isSet => (isSet ? 'yes' : '-');
        this.spriteRows.forEach(spriteRow => {
            const spriteIndex = spriteRow.spriteIndex;
            const pointer = this.machine.ram.read(pointerBaseAddress + spriteIndex);
            const color = this.palette.colorAt(vic.spriteColor(spriteIndex));
            const isEnabled = vic.isSpriteEnabled(spriteIndex);
            spriteRow.row.classList.toggle('sprite-disabled', !isEnabled);
            spriteRow.enabledText.set(yesNo(isEnabled));
            spriteRow.xText.set(vic.spriteX(spriteIndex));
            spriteRow.yText.set(vic.spriteY(spriteIndex));
            spriteRow.colorSwatch.style.backgroundColor = color.cssColor;
            spriteRow.colorText.set(`${color.index} ${color.name}`);
            spriteRow.pointerText.set(NumberFormat.hexByte(pointer));
            spriteRow.dataAddressText.set(NumberFormat.hexWord(pointer * this.spriteBlockSize));
            spriteRow.multicolorText.set(yesNo(vic.isSpriteMulticolor(spriteIndex)));
            spriteRow.expandXText.set(yesNo(vic.isSpriteExpandedX(spriteIndex)));
            spriteRow.expandYText.set(yesNo(vic.isSpriteExpandedY(spriteIndex)));
            spriteRow.behindText.set(yesNo(vic.isSpriteBehindBackground(spriteIndex)));
        });
    }
}
