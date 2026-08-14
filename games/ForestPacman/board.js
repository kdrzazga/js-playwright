const WORLD_WIDTH = 100;
const WORLD_DEPTH = 300;

class MovableObject {
    static SPEED = 0.4;
    static currentId = 1;

    constructor(){
        this.width = 1;
        this.id = MovableObject.currentId;
        MovableObject.currentId++;
    }

    move(deltaX, deltaZ) {
        if (deltaX == 0 && deltaZ== 0)
            return;
        let movementSpeed = MovableObject.SPEED;
        if (deltaX !== 0 && deltaZ !== 0)
            movementSpeed *= Math.SQRT1_2;

        console.log(deltaX, deltaZ);

        this.mesh.position.x += deltaX * movementSpeed;
        this.mesh.position.z += deltaZ * movementSpeed;
    }
}

class Plant extends MovableObject{
    constructor(x, z, filename, height) {
        super();
        this.createMesh(x, z, filename, height);
    }

    createMesh(x, z, filename, height){
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(filename);
        // Keep the artwork crisp and let mipmaps ease the alpha edge.
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            // Discard transparent texels so only the sprite's outline is drawn
            // (no more opaque black rectangle behind the artwork).
            alphaTest: 0.5,
            depthWrite: true
        });

        const geometry = new THREE.PlaneGeometry(this.width, height);

        // Two quads crossed at 90 degrees give the flat cut-out real volume,
        // so it reads as a 3D object from any viewing angle.
        const group = new THREE.Group();
        const front = new THREE.Mesh(geometry, material);
        const side = new THREE.Mesh(geometry, material);
        side.rotation.y = Math.PI / 2;
        group.add(front);
        group.add(side);

        this.mesh = group;
        this.mesh.position.set(x, height / 2, z);
    }
}

class Animal extends Plant{
    constructor(x, z, filename, height, walkRadius) {
        super(x, z, filename, height);
        this.speed = 0.07;
        this.dx = this.speed - Math.random()/10;
        this.dz = this.speed + Math.random()/15;

        // Centre of the circular walk. Tracks the board so the fox orbits the
        // board's centre, not the (stationary) player at the world origin.
        this.center = { x: 0, z: 0 };

        const objectGenerator = new ObjectGenerator();
        this.path = objectGenerator.createAnimalPath(walkRadius);
    }

    //@Override
    move(deltaX, deltaZ) {
        // Shift the orbit centre with the board instead of the mesh directly;
        // update() rebuilds the mesh position from this centre every frame.
        if (deltaX == 0 && deltaZ == 0)
            return;
        let movementSpeed = MovableObject.SPEED;
        if (deltaX !== 0 && deltaZ !== 0)
            movementSpeed *= Math.SQRT1_2;

        this.center.x += deltaX * movementSpeed;
        this.center.z += deltaZ * movementSpeed;
    }

    update(){
        const point = this.path.next();
        this.mesh.position.x = this.center.x + point[0];
        this.mesh.position.z = this.center.z + point[1];
    }
}

class Tree extends Plant{
    constructor(x, z){
        super(x, z, 'resources/tree.png', 2);
    }
}

class Mushroom extends Plant{
    constructor(x, z){
        super(x, z, 'resources/mushroom.png', 0.7);
    }
}

class Fox extends Animal{
    constructor(x, z, pathRadius){
        super(x, z, 'resources/fox.png', 0.75, pathRadius);
        this.width = 2;
        this.createMesh(x, z, 'resources/fox.png', 0.75);
    }
}

class ObjectGenerator{

    createAnimalPath(radius){
        const increment = Math.PI / (radius * 50);
        let pathPoints = [];
        for (let alpha = 0; alpha <= 2*Math.PI; alpha+= increment){
            const x = radius * Math.sin(alpha);
            const y = radius * Math.cos(alpha);

            pathPoints.push([x, y]);
        }

        const path = new CircularList(pathPoints);
        return path;
    }

    createTrees(){
        const treePositions = [[1, 0], [-3, 3], [4.2, 7.5], [-1.9, 7.5], [3.1, 5.5], [-2.9, -1.5], [-1.1, -.5]
                    , [-1.1, -19.5], [3, -15.5], [4.9, -14.5], [-4.9, 14.5]]; //+ z=-60
        let trees = [];

        for (let shift2 = -30; shift2 < 30; shift2 += 12.3){
            treePositions.forEach(point =>{
                let t = null;
                for (let shift = -120; shift < 120; shift +=26){
                    t = new Tree(point[0] + shift2, point[1] - shift * Math.random());
                    trees.push(t);
                }
            });
        }

        return trees;
    }

    createMushrooms(){
        const mushroomPositions = [[1.5, -13], [2, 11], [-4, 5], [5.2, 3.5], [-3.9, 14.35]];
        let mushrooms = [];

        for (let shift2 = -30; shift2 < -20; shift2 += 4){
            mushroomPositions.forEach(point =>{
                let m = null;
                for (let shift = -120; shift < 50; shift +=35){
                    m = new Mushroom(shift2 + point[0] + shift/25, point[1] - shift + 3 * Math.random());
                    mushrooms.push(m);
                }
            });
        }

        return mushrooms;
    }

    createAnimals(){
        const foxPositions = [[-2, 12], [5, 3]];
        let animals = [];

        foxPositions.forEach(point =>{
            let fox = new Fox(point[0], point[1], 11 + point[1] + 5*Math.random());
            animals.push(fox);
        });
        return animals;
    }
}

class Board extends MovableObject{
    constructor(scene) {
        super();
        this.geometry = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH);
        this.material = new THREE.MeshBasicMaterial({
            color: 0x00aa00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            map: this.createGridTexture()
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;

        const objectGenerator = new ObjectGenerator();

        this.trees = objectGenerator.createTrees();
        this.mushrooms = objectGenerator.createMushrooms();
        this.animals = objectGenerator.createAnimals();
        scene.add(this.mesh);

        this.trees.forEach(t => scene.add(t.mesh));
        this.mushrooms.forEach(m => scene.add(m.mesh));
        this.animals.forEach(a => scene.add(a.mesh));
    }

    createGridTexture() {
        const size = 10 * Player.SIZE;
        const gridColor = new THREE.Color(0x999999);
        const backgroundColor = new THREE.Color(0x00aa00);

        const canvas = this.createOffscreenCanvas(size);
        const context = canvas.getContext('2d');

        context.fillStyle = `rgba(${backgroundColor.r * 255}, ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, 1)`;
        context.fillRect(0, 0, size, size);

        const squareSize = (Player.SIZE);
        context.strokeStyle = `rgba(${gridColor.r * 255}, ${gridColor.g * 255}, ${gridColor.b * 255}, 1)`;
        context.lineWidth = 2;

        for (let i = 0; i <= 10; i++) {
            context.beginPath();
            context.moveTo(0, i * squareSize);
            context.lineTo(size, i * squareSize);
            context.stroke();
        }

        for (let i = 0; i <= 10; i++) {
            context.beginPath();
            context.moveTo(i * squareSize, 0);
            context.lineTo(i * squareSize, size);
            context.stroke();
        }

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    createOffscreenCanvas(size){
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        return canvas;
    }

    update(){
        this.animals.forEach(animal => {
            animal.update();
        });
        //let positions = this.getAnimalIdPositions();
    }

    //@Override
    move(deltaX, deltaZ) {
        // The whole world scrolls under a fixed player at the origin, so keep the
        // board centre within the plane's half-extents. That stops the player from
        // scrolling off the edge; foxes stay on-board automatically since they are
        // anchored to this same moving centre.
        const clamped = this.clampToBounds(deltaX, deltaZ);
        deltaX = clamped.deltaX;
        deltaZ = clamped.deltaZ;

        super.move(deltaX, deltaZ);
        this.trees.forEach(t => t.move(deltaX, deltaZ));
        this.mushrooms.forEach(m => m.move(deltaX, deltaZ));
        this.animals.forEach(a => a.move(deltaX, deltaZ));
    }

    clampToBounds(deltaX, deltaZ) {
        const halfX = WORLD_WIDTH / 2;
        const halfZ = WORLD_DEPTH / 2;

        // Zeroing one axis removes the diagonal speed scaling on the other, so
        // re-check after each change to catch the full-speed step as well.
        for (let pass = 0; pass < 2; pass++) {
            let speed = MovableObject.SPEED;
            if (deltaX !== 0 && deltaZ !== 0)
                speed *= Math.SQRT1_2;

            const nextX = this.mesh.position.x + deltaX * speed;
            const nextZ = this.mesh.position.z + deltaZ * speed;

            let blocked = false;
            if (deltaX !== 0 && (nextX > halfX || nextX < -halfX)) { deltaX = 0; blocked = true; }
            if (deltaZ !== 0 && (nextZ > halfZ || nextZ < -halfZ)) { deltaZ = 0; blocked = true; }
            if (!blocked)
                break;
        }

        return { deltaX, deltaZ };
    }

    getAnimalIdPositions(){
        const boardPos = this.mesh.position;
        let idPositions = [];
        this.animals.forEach(animal =>{
               let xA = boardPos.x - animal.mesh.position.x;
               let yA = animal.mesh.position.y;
               let zA = boardPos.z - animal.mesh.position.z;
               const json = {[animal.id] : [xA, yA, zA]};
               idPositions.push(json);
        });
        return idPositions;
    }
}
