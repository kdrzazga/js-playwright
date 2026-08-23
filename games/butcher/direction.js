const Direction = Object.freeze({
    DOWN: 0,
    DOWN_LEFT: 1,
    LEFT: 2,
    UP_LEFT: 3,
    UP: 4,
    UP_RIGHT: 5,
    RIGHT: 6,
    DOWN_RIGHT: 7
});

const DirectionByVector = Object.freeze({
    '0,1': Direction.DOWN,
    '-1,1': Direction.DOWN_LEFT,
    '-1,0': Direction.LEFT,
    '-1,-1': Direction.UP_LEFT,
    '0,-1': Direction.UP,
    '1,-1': Direction.UP_RIGHT,
    '1,0': Direction.RIGHT,
    '1,1': Direction.DOWN_RIGHT
});

const DirectionVectors = Object.freeze([
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
]);
