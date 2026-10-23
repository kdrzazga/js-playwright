class WaveChroutProgram extends PredefinedProgram {
    constructor({
        wavePattern = new WavePattern(),
        clearScreenPetsciiCode = 147,
        waitRasterLine = 251,
    } = {}) {
        super(
            'wave (CHROUT)',
            `Prints CHR$ ${wavePattern.petsciiCodes.join(', ')} with JSR $FFD2 in an endless loop, one pattern per frame (Stop to end)`,
            [
                `LDA #${clearScreenPetsciiCode} : JSR $FFD2`,
                'LDX #0',
                'LDA $C100,X : JSR $FFD2',
                `INX : CPX #${wavePattern.length} : BNE $C007`,
                `LDA $D012 : CMP #${waitRasterLine} : BNE $C012`,
                `LDA $D012 : CMP #${waitRasterLine} : BEQ $C019`,
                'JMP $C005',
                `*=$C100 : .BYTE ${wavePattern.petsciiCodes.join(',')}`,
            ]
        );
        this.wavePattern = wavePattern;
    }
}
