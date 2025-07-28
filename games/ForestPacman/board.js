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
        const depth = 0.03;

        const geometry = new THREE.BoxGeometry(this.width, height, depth);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(filename);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, height / 2, z);
    }
}

class Animal extends Plant{
    constructor(x, z, filename, height, walkRadius) {
        super(x, z, filename, height);
        this.speed = 0.07;
        this.dx = this.speed - Math.random()/10;
        this.dz = this.speed + Math.random()/15;

        const objectGenerator = new ObjectGenerator();
        this.path = objectGenerator.createAnimalPath(walkRadius);
    }

    update(){
        const point = this.path.next();
        this.mesh.position.x = point[0];
        this.mesh.position.z = point[1];
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
        super.move(deltaX, deltaZ);
        this.trees.forEach(t => t.move(deltaX, deltaZ));
        this.mushrooms.forEach(m => m.move(deltaX, deltaZ));
        this.animals.forEach(a => a.move(deltaX, deltaZ));
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
