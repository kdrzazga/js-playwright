class Tape {
    constructor(cellModulus = 256) {
        this.cellModulus = cellModulus;
        this.reset();
    }

    reset() {
        this.cells = [0];
        this.headPosition = 0;
    }

    get length() {
        return this.cells.length;
    }

    get currentValue() {
        return this.cells[this.headPosition];
    }

    set currentValue(value) {
        this.cells[this.headPosition] = this.wrapToCellRange(value);
    }

    valueAt(cellIndex) {
        return this.cells[cellIndex] ?? 0;
    }

    increment() {
        this.currentValue = this.currentValue + 1;
    }

    decrement() {
        this.currentValue = this.currentValue - 1;
    }

    moveRight() {
        this.headPosition++;
        if (this.headPosition === this.cells.length) {
            this.cells.push(0);
        }
    }

    moveLeft() {
        if (this.headPosition === 0) {
            throw new TapeBoundaryError('Cannot move left of cell 0');
        }
        this.headPosition--;
    }

    wrapToCellRange(value) {
        return ((value % this.cellModulus) + this.cellModulus) % this.cellModulus;
    }
}
