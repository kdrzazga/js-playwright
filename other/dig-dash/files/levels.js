class Level1 extends BaseLevel{

    constructor() {
        super('1');

        this.emptyColumns = [ {'column' : 1, 'start' : 5, 'end' : 7},  {'column' : 3, 'start' : 5, 'end' : 7}];
        this.emptyRows = [ {'row' : 1, 'start' : 1, 'end' : 7}, {'row' : 5, 'start' : 1, 'end' : 7}
            , {'row' : 7, 'start' : 7, 'end' : 17}, {'row' : 8, 'start' : 8, 'end' : 17}
            , {'row' : 9, 'start' : 9, 'end' : 17}, {'row' : 10, 'start' : 10, 'end' : 17}
            , {'row' : 13, 'start' : 2, 'end' : 17}, {'row' : 10, 'start' : 10, 'end' : 17}
            , {'row' : 11, 'start' : 11, 'end' : 24}, {'row' : 12, 'start' : 12, 'end' : 17}
            , {'row' : 21, 'start' : 1, 'end' : 17}, {'row' : 23, 'start' : 12, 'end' : 17}
            ];
        this.boulders = [{'x':4, 'y':5}, {'x':7, 'y':5}, {'x':3, 'y':3}, {'x':8, 'y':2}];
        this.diamonds = [{'x':1, 'y':6}, {'x':1, 'y':7}, {'x':3, 'y':7}, {'x':11, 'y':11}, {'x':11, 'y':12}
            ,{'x':11, 'y':13}, {'x':11, 'y':14},{'x':11, 'y':15}, {'x':11, 'y':16},{'x':11, 'y':17}, {'x':11, 'y':18}, ]
        this.monsters = [{'x':7, 'y':1}, {'x':14, 'y':10}, {'x':11, 'y':21}, {'x':14, 'y':23}, ]
    }
}
