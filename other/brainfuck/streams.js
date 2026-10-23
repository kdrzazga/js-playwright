class InputStream {
    constructor(text = '', endOfInputByte = 0) {
        this.bytes = new TextEncoder().encode(text);
        this.readPosition = 0;
        this.endOfInputByte = endOfInputByte;
    }

    get isExhausted() {
        return this.readPosition >= this.bytes.length;
    }

    readByte() {
        if (this.isExhausted) {
            return this.endOfInputByte;
        }
        return this.bytes[this.readPosition++];
    }
}

class OutputStream {
    constructor() {
        this.bytes = [];
    }

    writeByte(byte) {
        this.bytes.push(byte);
    }

    get text() {
        return new TextDecoder().decode(new Uint8Array(this.bytes));
    }
}
