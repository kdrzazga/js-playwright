class NumberFormat {
    static hexDigits(value, width) {
        return value.toString(16).toUpperCase().padStart(width, '0');
    }

    static hexByte(value) {
        return '$' + NumberFormat.hexDigits(value, 2);
    }

    static hexWord(value) {
        return '$' + NumberFormat.hexDigits(value, 4);
    }

    static binaryByte(value) {
        return value.toString(2).padStart(8, '0');
    }
}
