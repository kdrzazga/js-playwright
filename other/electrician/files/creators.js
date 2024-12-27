class Creator {

    static HIGH_FLOOR_LEVEL = 104;
    static LOW_FLOOR_LEVEL = 438;

    static createEnemies(ratsData, batsData, spidersData, physics) {
        const createEnemy = (classType, data) => Creator.createEnemy(classType, data, physics);
        return [].concat(
            ratsData.map(data => createEnemy(Rat, data)),
            batsData.map(data => createEnemy(Bat, data)),
            spidersData.map(data => createEnemy(Spider, data))
        );
    }

    static createEnemy(EnemyClass, data, physics, positionAdjustment = 0) {
        const enemy = new EnemyClass(data.id);
        enemy.active = data.active;
        const y = EnemyClass === Bat ? 555 + 7 * data.id + positionAdjustment : data.y ;
        enemy.init(physics, y);

        Object.assign(enemy, {
            minX: data.minX || enemy.minX,
            maxX: data.maxX || enemy.maxX,
            angularSpeed: data.speed || enemy.angularSpeed,
            currentAngle: data.currentAngle || enemy.currentAngle,
            wireId: EnemyClass === Rat ? data.wireId : undefined
        });

        if (EnemyClass === Bat) {
            enemy.centerX = Constants.SCREEN_WIDTH / 2 + 50 - 39 * data.id;
        }

        if (data.velocity) enemy.sprite.velocity = data.velocity;

        return enemy;
    }

    static createLevel1(physics){
        let building = new Building('Home 2');
        building.init(physics); // Initializes ladder and power lines

        const atticBuilder = new FloorBuilder();
        building.floors.push(atticBuilder.withName('floor2').withCeilingConnectors([7, 12, 23])
            .withBottomConnectors([23,24,25]).build());

       const gymBuilder = new FloorBuilder();
       building.floors.push(gymBuilder.withName('power-room').withCeilingConnectors([7, 12, 19, 20, 21, 26, 27, 28]).build());

       const garageBuilder = new FloorBuilder();
       building.floors.push(garageBuilder.withName('basement').withCeilingConnectors([7, 12, 23]).build());

       building.floors.forEach(floor => floor.init(physics));
       building.floors.forEach(floor => floor.calculateFloorLevel());

       const connectionPointsCounts = [3, 11, 3];
       building.wires = building.floors.map((floor, index) => {
           const aboveFloor = building.floors[index] || null;
           const belowFloor = building.floors[index - 1] || null;
           return new Wire(index, physics, belowFloor, aboveFloor, connectionPointsCounts[index]);
       });

        building.includeWiresInInfoFrame();

        //const MID_FLOOR_LEVEL = 328 - Floor.HEIGHT / 2;
        const ratsData = [
            { id: 1, active: true, y: Building.GROUND_FLOOR_LEVEL },
            { id: 2, active: true, y: Creator.LOW_FLOOR_LEVEL, velocity: { x: 0.7 }, wireId: 2},
            //{ id: 4, active: true, y: MID_FLOOR_LEVEL, velocity: { x: 0.85}, wireId: 1},
            { id: 3, active: true, y: Creator.HIGH_FLOOR_LEVEL, wireId: 0}
        ];

        const batsData = [
            { id: 0, active: true, speed: -0.007 }
        ];

        const spidersData = [
        ];

        building.enemies = Creator.createEnemies(ratsData, batsData, spidersData, physics);

        return building;
    }

    static createLevel2(physics){
       let building = new Building('Office Gym Garage');
       building.init(physics); // Initializes ladder and power lines

       const officeBuilder = new FloorBuilder();
       building.floors.push(officeBuilder.withName('office').withBottomConnectors([5, 9, 13, 16, 19, 26])
            .withCeilingConnectors([5, 12, 20, 26]).build());

       const gymBuilder = new FloorBuilder();
       building.floors.push(gymBuilder.withName('gym').withCeilingConnectors([7, 23]).build());

       const garageBuilder = new FloorBuilder();
       building.floors.push(garageBuilder.withName('garage').withCeilingConnectors([5, 20,22, 29]).build());

       building.floors.forEach(floor => floor.init(physics));
       building.floors.forEach(floor => floor.calculateFloorLevel());

       const connectionPointsCounts = [4, 8, 4];
       building.wires = building.floors.map((floor, index) => {
           const aboveFloor = building.floors[index] || null;
           const belowFloor = building.floors[index - 1] || null;
           return new Wire(index, physics, belowFloor, aboveFloor, connectionPointsCounts[index]);
       });

        building.includeWiresInInfoFrame();
        //const MID_FLOOR_LEVEL = 328 - Floor.HEIGHT / 2;
        const ratsData = [
            { id: 1, active: true, y: Building.GROUND_FLOOR_LEVEL }
        ];

        const batsData = [
            { id: 0, active: true, speed: 0.007 },
            { id: 1, active: true, speed: 0.006 },
            { id: 3, active: true, speed: 0.005 },
            { id: 4, active: true, speed: 0.004 },
            { id: 5, active: true, speed: 0.008 },
            { id: 6, active: true, speed: 0.0053 },
            { id: 7, active: true, speed: 0.009 },
            { id: 8, active: true, speed: 0.0042 },
        ];


        const spidersData = [
        ];

        building.enemies = Creator.createEnemies(ratsData, batsData, spidersData, physics);

        return building;
    }

    static createLevel3(physics) {
       let building = new Building('House');
       building.init(physics); // Initializes ladder and power lines

       const floorBuilder1 = new FloorBuilder();
       building.floors.push(floorBuilder1.withName('attic').withBottomConnectors([3, 11, 28])
           .withCeilingConnectors([5, 25]).build());

       const floorBuilder2 = new FloorBuilder();
       building.floors.push(floorBuilder2.withName('living room').withCeilingConnectors([2, 29])
           .withLampInCenter().withTVInCenterLeft().build());

       const kitchenBuilder = new FloorBuilder();
       building.floors.push(kitchenBuilder.withName('kitchen').withFridgeOnLeft().withLampInCenter().withKitchenSegmentOnRight().build());

       building.floors.forEach(floor => floor.init(physics));
       building.floors.forEach(floor => floor.calculateFloorLevel());

       const connectionPointsCounts = [2, 6, 5];
       building.wires = building.floors.map((floor, index) => {
           const aboveFloor = building.floors[index] || null;
           const belowFloor = building.floors[index - 1] || null;
           return new Wire(index, physics, belowFloor, aboveFloor, connectionPointsCounts[index]);
       });

        building.includeWiresInInfoFrame();
        const MID_FLOOR_LEVEL = 328 - Floor.HEIGHT / 2;

        const ratsData = [
            { id: 1, active: true, y: Building.GROUND_FLOOR_LEVEL },
            { id: 2, active: true, y: Building.GROUND_FLOOR_LEVEL, minX:  Floor.WIDTH / 2, maxX: 2 * Floor.WIDTH / 3, velocity: { x : 3} },
            { id: 3, active: true, y: Building.GROUND_FLOOR_LEVEL, velocity: { x: 1.4 } },
            { id: 4, active: true, y: Creator.LOW_FLOOR_LEVEL, velocity: { x: 0.7 }, wireId: 2},
            { id: 5, active: true, y: MID_FLOOR_LEVEL, minX: 2 * Floor.WIDTH / 4, maxX: 1.15*Floor.WIDTH, velocity: { x: 1.4 }, wireId: 1 },
            { id: 6, active: true, y: MID_FLOOR_LEVEL, minX: 2 * Ladder.WIDTH, velocity: { x: 0.85}, wireId: 1 },
            { id: 7, active: true, y: Creator.HIGH_FLOOR_LEVEL, minX: Floor.WIDTH / 3 + 30, maxX: 1.15*Floor.WIDTH, wireId: 0 }
        ];

        const batsData = [
            { id: 0, active: true, speed: -0.017 },
            { id: 1, active: true, currentAngle: Math.PI / 2, /*speed: 0.001*/ }
        ];

        const spidersData = [
        ];

        building.enemies = Creator.createEnemies(ratsData, batsData, spidersData, physics);

        return building;
    }

    static createLevel4(physics){
        let building = new Building('Electronics Store');
        building.init(physics); // Initializes ladder and power lines

       const musicFloorBuilder = new FloorBuilder();
       building.floors.push(musicFloorBuilder.withName('music-floor').withCeilingConnectors([6, 19])
            .withBottomConnectors([3, 9, 14, 17, 21, 25, 28]).build());

       const computerRoomBuilder = new FloorBuilder();
       building.floors.push(computerRoomBuilder.withName('computer-room').withCeilingConnectors([2, 7, 12, 20])
            .withBottomConnectors([26]).build());

       const groundFloorBuilder = new FloorBuilder();
        building.floors.push(groundFloorBuilder.withName('computer-room2').withCeilingConnectors([5, 12, 15, 19, 25])
            .build());

       building.floors.forEach(floor => floor.init(physics));
       building.floors.forEach(floor => floor.calculateFloorLevel());

       const connectionPointsCounts = [2, 11, 6];
       building.wires = building.floors.map((floor, index) => {
           const aboveFloor = building.floors[index] || null;
           const belowFloor = building.floors[index - 1] || null;
           return new Wire(index, physics, belowFloor, aboveFloor, connectionPointsCounts[index]);
       });

        building.includeWiresInInfoFrame();

        //const MID_FLOOR_LEVEL = 328 - Floor.HEIGHT / 2;
        const ratsData = [
            { id: 1, active: true, y: Building.GROUND_FLOOR_LEVEL, velocity: { x: 0.7 } },
            { id: 2, active: true, y: Building.GROUND_FLOOR_LEVEL, velocity: { x: 0.8 } },
            { id: 3, active: true, y: Building.GROUND_FLOOR_LEVEL, velocity: { x: 0.9 } },
            { id: 4, active: true, y: Creator.LOW_FLOOR_LEVEL, velocity: { x: 0.7 }, wireId: 2},
            { id: 5, active: true, y: Creator.HIGH_FLOOR_LEVEL, wireId: 0},
            { id: 6, active: true, y: Creator.HIGH_FLOOR_LEVEL, wireId: 0, velocity: { x: 0.97 } }
        ];

        const batsData = [
            { id: 0, active: true, speed: -0.007 },
            { id: 1, active: true, speed: -0.006 },
            { id: 2, active: true, speed: 0.003 }
        ];

        const spidersData = [
             { id: 1, active: true, y: 25, velocity: { y: 0.5 } }
        ];

        building.enemies = Creator.createEnemies(ratsData, batsData, spidersData, physics);

        return building;
    }
}

class FrameCreator{

    static createLevel2ExtraInfoFrameContent(){
        const content = "<p><div>Retro computers:</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/c64.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Commodore 64</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/ibmpc286.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>IBM PC 286</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/szmatari.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Atari 800XL</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/a500.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Amiga 500</div>"
                        + "<p><div>Retro cars:</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/maluch.jpeg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Fiat 126p</div>"
                        + "<div onmouseenter='FrameCreator.showPhoto(\"files/polonez.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Polonez</div>";

        return content;
    }

    static createLevel4ExtraInfoFrameContent(){
        const content = "<p>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/fenderAmp.PNG\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Fender Amplifier</div>"
                        + "<p><div>Mainframe<br>retro computers:</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/ibm360.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>IBM S-360</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/ibm709.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>IBM 709</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/Ferranti-Mark-1.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Ferranti Mark 1</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/odra1305.png\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Elwro ODRA 1305</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/BendixG15.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Bendix G-15</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/ray704_f_s-1910516244.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Raytheon 704</div>"
                        + "<p>"
                        + "<div>Analog retro computers:</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/TelefunkenRA770.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Telefunken RA 770</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/TelefunkenRA436_2.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Telefunken RA 436/2</div>"
                        + "    <div onmouseenter='FrameCreator.showPhoto(\"files/Telefunken.jpg\");' onmouseleave='FrameCreator.hidePhotoDiv();'>Telefunken RAT 700/2</div>";

        return content;
    }

    static showPhoto(picLink){
        let photosFrame = document.getElementById('photos');
        photosFrame.style.display = 'block';
        let photoImg = document.getElementById('photo');
        photoImg.setAttribute('src', picLink);
    }

    static hidePhotoDiv(){
        console.log('hide');
        let photosFrame = document.getElementById('photos');
        photosFrame.style.display = 'none';
    }
}
