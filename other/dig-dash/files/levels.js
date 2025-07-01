class Level1 extends BaseLevel{

    constructor() {
        super('1');

        this.emptyColumns = [ {'column' : 1, 'start' : 5, 'end' : 7},  {'column' : 3, 'start' : 5, 'end' : 7}];
        this.emptyRows = [ {'row' : 1, 'start' : 1, 'end' : 7}];
        this.boulders = [{'x':4, 'y':5}, {'x':7, 'y':5}, {'x':3, 'y':3}, {'x':8, 'y':2}];
    }
}
