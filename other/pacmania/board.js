class MovableObject {
    static SPEED = 0.02;

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

        const width = 1;
        const depth = 0.03;

        const geometry = new THREE.BoxGeometry(width, height, depth);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(filename);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, height / 2, z);
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

class Board extends MovableObject{
    constructor(scene) {
        super();
        this.geometry = new THREE.PlaneGeometry(12, 40);
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

        this.trees = [];
        this.mushrooms = [];

        const treePositions = [[1, 0], [-3, 3], [4.2, 7.5], [-1.9, 7.5], [3.1, 5.5], [-2.9, -1.5], [-1.1, -.5]
            , [-1.1, -19.5], [3, -15.5], [4.9, -14.5], [-4.9, 14.5]];

        const mushroomPositions = [[1.5, -13], [2, 11], [-4, 5], [5.2, 3.5], [-3.9, 14.35]];

        treePositions.forEach(point =>{
            let t = new Tree(point[0], point[1]);
            this.trees.push(t);
        });

        mushroomPositions.forEach(point =>{
            let m = new Mushroom(point[0], point[1]);
            this.mushrooms.push(m);
        });

        scene.add(this.mesh);

        this.trees.forEach(t => scene.add(t.mesh));
        this.mushrooms.forEach(m => scene.add(m.mesh));
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

    //@Override
    move(deltaX, deltaZ) {
        super.move(deltaX, deltaZ);
        this.trees.forEach(t => t.move(deltaX, deltaZ));
        this.mushrooms.forEach(m => m.move(deltaX, deltaZ));
    }

}