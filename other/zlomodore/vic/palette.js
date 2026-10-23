class PaletteColor {
    constructor(index, name, red, green, blue) {
        this.index = index;
        this.name = name;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    get packedLittleEndianRgba() {
        return ((0xFF << 24) | (this.blue << 16) | (this.green << 8) | this.red) >>> 0;
    }

    get cssColor() {
        return '#' + [this.red, this.green, this.blue].map(component => NumberFormat.hexDigits(component, 2)).join('');
    }
}

class Palette {
    constructor(colorDefinitions = [
        ['black', 0x00, 0x00, 0x00],
        ['white', 0xFF, 0xFF, 0xFF],
        ['red', 0x68, 0x37, 0x2B],
        ['cyan', 0x70, 0xA4, 0xB2],
        ['purple', 0x6F, 0x3D, 0x86],
        ['green', 0x58, 0x8D, 0x43],
        ['blue', 0x35, 0x28, 0x79],
        ['yellow', 0xB8, 0xC7, 0x6F],
        ['orange', 0x6F, 0x4F, 0x25],
        ['brown', 0x43, 0x39, 0x00],
        ['light red', 0x9A, 0x67, 0x59],
        ['dark grey', 0x44, 0x44, 0x44],
        ['grey', 0x6C, 0x6C, 0x6C],
        ['light green', 0x9A, 0xD2, 0x84],
        ['light blue', 0x6C, 0x5E, 0xB5],
        ['light grey', 0x95, 0x95, 0x95],
    ]) {
        this.colors = colorDefinitions.map(([name, red, green, blue], index) => new PaletteColor(index, name, red, green, blue));
        this.packedColors = new Uint32Array(this.colors.map(color => color.packedLittleEndianRgba));
    }

    colorAt(index) {
        return this.colors[index & 0x0F];
    }

    packedColorAt(index) {
        return this.packedColors[index & 0x0F];
    }
}
