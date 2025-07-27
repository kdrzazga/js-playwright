let globalCounter = 0;

class BruceLeeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.planeGeometry = new THREE.PlaneGeometry(5, 5);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.functionKeysActivated = true;
        this.delta = 0.006;
        this.headerLines = [];
        this.context = null;
        this.cursor = null;
        this.clearColor = 0xaaaaaa; // Example color
        this.backgroundColor = 0xcccccc; // Example color
        this.defaultColor = 'black';

        this.planes = [];
        this.textures = []; // Array to hold individual textures
        this.animationFrameId = null;
        this.rotationCoeff = 0.01;
        this.counter = 0;
    }

    init() {
        this.setupRenderer();

        const imagePaths1 = ['11.bmp', '21.bmp', '31.bmp', '41.bmp'];
        this.loadTextures(imagePaths1, () => {
            this.setupPlanes();
            this.animate();
        });

        this.camera.position.z = 15;
        this.camera.position.x = 0;

        window.addEventListener('resize', () => {
            this.renderer.setSize(0.8*window.innerWidth, 0.8*window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    reset(){
        console.log('reset');
        this.planes.forEach((plane, index) => {
            plane.rotation.x = 0;
            plane.rotation.y = 0;
        });
    }

    setupRenderer() {
        const container = document.getElementById('scene-container');
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.clearColor, 1);
        document.body.appendChild(this.renderer.domElement);
    }

    loadTextures(imagePaths, callback) {
        const loader = new THREE.TextureLoader();
        let loadedCount = 0;
        this.textures = [];

        imagePaths.forEach((path, index) => {
            loader.load(
                path,
                (texture) => {
                    this.textures[index] = texture;
                    loadedCount++;
                    if (loadedCount === imagePaths.length) {
                        callback();
                    }
                },
                undefined,
                (err) => {
                    console.error('Error loading texture:', path);
                }
            );
        });
    }

    setupPlanes() {
        const spacing = 5;

        for (let x = 0; x < 4; x++) {
            const material = new THREE.MeshBasicMaterial({ map: this.textures[x] });
            const plane = new THREE.Mesh(this.planeGeometry, material);
            plane.position.x = (x - 1) * spacing; // -spacing, 0, +spacing
            plane.rotation.x = -Math.PI / 12;
            this.scene.add(plane);
            this.planes.push(plane);
        }
    }

    handleKeyDown(event) {
        console.log('Key pressed:', event.key);
        if (event.key === '+' && this.camera.position.z > 1)
            this.camera.position.z--;
        else if (event.key === '-')
            this.camera.position.z++;
        else if (event.key === '4')
            this.camera.position.x+=0.4;
        else if (event.key === '6')
            this.camera.position.x-=0.4;
        else if (event.key === '8')
            this.camera.position.y-=0.2;
        else if (event.key === '2')
            this.camera.position.y+=0.2;
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        this.counter++;
        this.renderer.render(this.scene, this.camera);
    }
}

const myScene = new BruceLeeScene();
myScene.init();


function tick1Second(){
    globalCounter++;
}

setInterval(tick1Second, 1000);

