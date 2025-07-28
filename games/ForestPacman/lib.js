class CircularList {
    constructor(simpleList) {
        if (!Array.isArray(simpleList) || simpleList.length === 0) {
            throw new Error("Input must be a non-empty array.");
        }
        this.points = simpleList;
        this.index = 0;
    }

    next() {
        const elem = this.points[this.index];
        this.index = (this.index + 1) % this.points.length;
        return elem;
    }
}
