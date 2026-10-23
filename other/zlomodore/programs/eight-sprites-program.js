class EightSpritesProgram extends PredefinedProgram {
    constructor({
        spriteDataBlock = 13,
        spriteColors = [1, 2, 3, 4, 5, 7, 8, 13],
        spritePositions = [
            [90, 100], [140, 100], [190, 100], [240, 100],
            [90, 150], [140, 150], [190, 150], [240, 150],
        ],
    } = {}) {
        const spriteDataAddress = NumberFormat.hexWord(spriteDataBlock * 64);
        super(
            '8sprites',
            'Enables 8 sprites, places and colors them, then fills their square shape row by row',
            [
                'LDA #$FF : STA $D015',
                'LDX #15',
                'LDA $C048,X : STA $D000,X : DEX : BPL $C007',
                'LDA #0 : STA $D010',
                `LDX #7 : LDA #${spriteDataBlock} : STA $07F8,X`,
                'LDA $C040,X : STA $D027,X : DEX : BPL $C017',
                'LDA #$FF : LDX #62',
                `STA ${spriteDataAddress},X : DEX : BPL $C029`,
                'RTS',
                `*=$C040 : .BYTE ${spriteColors.join(',')}`,
                `*=$C048 : .BYTE ${spritePositions.flat().join(',')}`,
            ]
        );
    }
}
