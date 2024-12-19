class Constants{
    static SCREEN_WIDTH = 800;
    static SCREEN_HEIGHT = 600;
}

const WireSlot = Object.freeze({
    EMPTY: {imageId: ''},
    WIRE_STRAIGHT: {imageId: 'wire-section'},
    WIRE_UP: {imageId: 'wire-section-up'},
    WIRE_DOWN: {imageId: 'wire-section-down'},
});

class Floor {
    static COUNT = 0;
    static BUILDING_HEIGHT = Constants.SCREEN_HEIGHT - 100;
    static WIDTH;
    static HEIGHT;

    constructor() {
        this.name = '';
        this.id = Floor.COUNT;
        Floor.COUNT++;
        this.floorLevel = 0;
        this.ceilingConnectors = [];//connector unit is Slot number, not position on screen
        this.bottomConnectors = [];
    }

    init(physics){
        this.sprite = physics.add.sprite(Constants.SCREEN_WIDTH/2 + Ladder.WIDTH/2 - 20, Constants.SCREEN_HEIGHT/this.id, 'floor' + this.id)
    }

    calculateFloorLevel(){
        //should be called only after all floors are created
        this.floorLevel = Math.ceil((this.id + 1) * Floor.BUILDING_HEIGHT / Floor.COUNT);
        this.sprite.y = this.floorLevel;
        console.log(`Floor ${this.id} is on level = ${this.floorLevel}`);
    }

    onFloor(x, y) {
        y += Floor.HEIGHT - 30;
        if (typeof y !== 'number')
            console.warn('Wrong argument'); //defensive programming makes sense in this particular place

        const tolerance = this.floorLevel * 0.05;
        const lowerBoundY = this.floorLevel;
        const upperBoundY = this.floorLevel + tolerance;

        const lowerBoundX = this.getLeftPosition();
        const upperBoundX = lowerBoundX + Floor.WIDTH;
        return x > lowerBoundX && x < upperBoundX  && y >= lowerBoundY && y <= upperBoundY;
    }

    getLeftPosition(){
        return this.sprite.x - Floor.WIDTH/2;
    }

}

class Ladder {
    static WIDTH = 60;

    constructor() {
    }

    init(physics){
        this.sprite = physics.add.sprite(Ladder.WIDTH/2, Constants.SCREEN_HEIGHT/2, 'ladder');
    }

    onLadder(x1){
        const edge1 = this.sprite.x - Ladder.WIDTH /2;
        const edge2 = this.sprite.x + Ladder.WIDTH /2;
        return x1 > edge1 && x1 < edge2;
    }
}

class Building {

    constructor(){
        this.ladder = new Ladder();
        this.floors = [];
        this.wires = [];
        this.leftPowerLine = new PowerLine();
        this.rightPowerLine = new PowerLine();
    }

    init(floorCount, physics){
       this.ladder.init(physics);

       const floorBuilder1 = new FloorBuilder();
       this.floors.push(floorBuilder1.withName('attic').withBottomConnector(3).withBottomConnector(11)
            .withCeilingConnector(5).withCeilingConnector(25).withBottomConnector(28).build());
       const floorBuilder2 = new FloorBuilder();
       this.floors.push(floorBuilder2.withName('living room').withCeilingConnector(2).withCeilingConnector(29)
            .withLampInCenter().withTVInCenterLeft().build());
       const kitchenBuilder = new FloorBuilder();
       this.floors.push(kitchenBuilder.withName('kitchen').withFridgeOnLeft().withLampInCenter().withKitchenSegmentOnRight().build());

       this.floors.forEach(floor => floor.init(physics));
       this.floors.forEach(floor => floor.calculateFloorLevel());

       const connectionPointsCounts = [2, 6, 5];
       this.wires = this.floors.map((floor, i) => {
           const aboveFloor = this.floors[i] || null;
           const belowFloor = this.floors[i - 1] || null;
           return new Wire(i, physics, belowFloor, aboveFloor, connectionPointsCounts[i]);
       });

       this.leftPowerLine.init(physics, 'left');
       this.rightPowerLine.init(physics, 'right');
    }

    includeWiresInInfoFrame() {
        const infoFrame = document.getElementById('connection-status');
        this.wires.forEach((_, i) => {
            const wireDiv = document.createElement('div');
            wireDiv.name = 'wire-info';
            wireDiv.id = 'wire' + i;
            wireDiv.style.fontSize = '1em';
            wireDiv.style.color = 'yellow';
            wireDiv.innerText = 'no power';
            infoFrame.appendChild(wireDiv);
        });
    }

    getCurrentFloor(player) {
        if (!player) return -1;

        const tolerance = 50;
        return this.floors.findIndex(floor =>
            Math.abs(Math.abs(floor.floorLevel - player.y) - 28) < tolerance
        );
    }

    drawWire(player, wireType){
        const currentFloorNumber = this.getCurrentFloor(player);
        if (currentFloorNumber < 0) return;

        const currentFloor = this.floors[currentFloorNumber];

        if (currentFloor.onFloor(player.x, player.y)){
            console.log(`Draw wire over floor ${currentFloorNumber}`);

            if(wireType === WireSlot.WIRE_UP){
                if (currentFloorNumber == 0) return;

                const upperFloor = this.floors[currentFloorNumber-1];
                const index = Math.floor((player.x - currentFloor.getLeftPosition()) / Wire.SIZE);
                const match = upperFloor.bottomConnectors.filter(cnctr => cnctr == index);
                if (match.length > 0){
                    this.wires[currentFloorNumber].place(currentFloor, player, WireSlot.WIRE_UP);
                    this.wires[currentFloorNumber].actualFloorConnections.add(index);
                }
            }
            else if(wireType === WireSlot.WIRE_DOWN) {
                if (currentFloorNumber > this.floors.length - 1) return;

                const lowerFloor = currentFloor;
                const index = Math.floor((player.x - currentFloor.getLeftPosition()) / Wire.SIZE);
                const match = lowerFloor.ceilingConnectors.filter(cnctr => cnctr == index);
                if (match.length > 0){
                    this.wires[currentFloorNumber].place(currentFloor, player, WireSlot.WIRE_DOWN);
                    this.wires[currentFloorNumber].actualFloorConnections.add(index);
                }
            }
            else {
                this.wires[currentFloorNumber].place(currentFloor, player, WireSlot.WIRE_STRAIGHT);
                const index = Math.floor((player.x - currentFloor.getLeftPosition()) / Wire.SIZE);
                if (this.wires[currentFloorNumber].actualFloorConnections.has(index)) {
                        this.wires[currentFloorNumber].actualFloorConnections.delete(index);
                }
            }
        }
    }
}

class PowerLine {
    init(physics, type){
        const objectName = 'power-line-' + type;
        const x = type === 'left' ? Ladder.WIDTH + 30 : Ladder.WIDTH + Floor.WIDTH + 50;
        this.sprite = physics.add.sprite(x, Constants.SCREEN_HEIGHT/2, objectName);
    }
}

class Wire {
    static SIZE = 20;

    constructor(id, physics, floor1, floor2, expectedFloorConnectionsCnt) {
        this.id = id;
        this.physics = physics;
        this.x = floor1 ? floor1.sprite.x : 0;
        this.y = this.calculateY(floor1, floor2);
        this.slots = Array(Math.ceil(Floor.WIDTH / Wire.SIZE)).fill(WireSlot.EMPTY);
        this.sprites = [];
        this.expectedFloorConnectionsCnt = expectedFloorConnectionsCnt;
        this.actualFloorConnections = new Set();

        console.log(`Created ${this.slots.length} wire slots in wire.`);
    }

    calculateY(floor1, floor2) {
        const y1 = floor1 ? floor1.sprite.y : 0;
        const y2 = floor2 ? floor2.sprite.y : 0;
        return (y1 + y2) / 2;
    }

    place(floor, sprite, wireType) {
        const extraInfoDiv = document.getElementById('extra-info');
        extraInfoDiv.innerText = `${floor.id} ${floor.floorLevel}`;

        const index = Math.floor((sprite.x - floor.getLeftPosition()) / Wire.SIZE);
        const x = floor.getLeftPosition() + index * Wire.SIZE;

        if (this.slots[index] !== WireSlot.EMPTY) {
            this.removeOldWireSprite(index);
        }

        this.slots[index] = wireType;
        const newSprite = this.physics.add.sprite(x, this.y, wireType.imageId);
        this.sprites[index] = newSprite;
        console.log(`Placing wire: [${x}, ${this.y}]. Index = ${index}`);
        this.updateWiringInfo();
    }

    removeOldWireSprite(index) {
        const oldSprite = this.sprites[index];
        if (oldSprite) {
            oldSprite.destroy();
            this.sprites[index] = null;
        }
    }

    updateWiringInfo() {
        const filledSlots = this.slots.filter(slot => slot !== WireSlot.EMPTY).length;
        const percentage = Math.ceil((filledSlots / this.slots.length) * 100);
        const wireDiv = document.getElementById(`wire${this.id}`);
        wireDiv.innerText = percentage === 100  && this.expectedFloorConnectionsCnt == this.actualFloorConnections.size ? 'CONNECTED' : `${percentage} %`;
    }
}

class Creator{
    static create3storeBuilding(physics) {
        const building = new Building();
        building.init(3, physics);
        building.includeWiresInInfoFrame();

        return building;
    }
}

class FloorBuilder {

    constructor(){
        this.floor = new Floor();
    }

    build(){
        return this.floor;
    }

    withName(name) {
        this.floor.name = name;
        return this;
    }

    withCeilingConnector(connectorSlot){
        this.floor.ceilingConnectors.push(connectorSlot);
        return this;
    }

    withBottomConnector(connectorSlot) {
        this.floor.bottomConnectors.push(connectorSlot);
        return this;
    }

    withLampInCenter() {
        const lampConnectorX = Math.floor(Floor.WIDTH/Wire.SIZE /2);
        this.withCeilingConnector(lampConnectorX);
        return this;
    }

    withTVInCenterLeft(){
        const tvConnectorX = 12;
        this.withBottomConnector(tvConnectorX);
        return this;
    }

    withFridgeOnLeft(){
        const fridgeConnectorSlot = 2;
        this.withCeilingConnector(fridgeConnectorSlot);
        return this;
    }

    withKitchenSegmentOnRight(){
        const fridge2ConnectorSlot = 29;
        const fanConnectorSlot = 26;
        this.withCeilingConnector(fridge2ConnectorSlot);
        this.withCeilingConnector(fanConnectorSlot);
        return this;
    }
}

module.exports = { Constants, Floor, Ladder, Building, PowerLine, Wire};
