class WaveProgram extends PredefinedProgram {
    constructor({
        wavePattern = new WavePattern(),
        framesPerStep = 3,
        waitRasterLine = 251,
    } = {}) {
        super(
            'wave',
            `Writes CHR$ ${wavePattern.petsciiCodes.join(', ')} directly to screen memory and scrolls the wave every ${framesPerStep} frames (Stop to end)`,
            [
                'LDA #0 : STA $FB',
                `LDX #${framesPerStep}`,
                `LDA $D012 : CMP #${waitRasterLine} : BNE $C006`,
                `LDA $D012 : CMP #${waitRasterLine} : BEQ $C00D`,
                'DEX : BNE $C006',
                'LDA #$00 : STA $FC : LDA #$04 : STA $FD',
                'LDX $FB : LDY #0',
                'LDA $C100,X : STA ($FC),Y',
                `INX : CPX #${wavePattern.length} : BNE $C02F : LDX #0`,
                'INY : BNE $C034 : INC $FD',
                'LDA $FD : CMP #$07 : BNE $C023 : CPY #$E8 : BNE $C023',
                `LDA $FB : CLC : ADC #1 : CMP #${wavePattern.length} : BNE $C049 : LDA #0`,
                'STA $FB : JMP $C004',
                `*=$C100 : .BYTE ${wavePattern.screenCodes.join(',')}`,
            ]
        );
        this.wavePattern = wavePattern;
    }
}
