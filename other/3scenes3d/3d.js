class MyScene {
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
    }

    init() {
        this.setupRenderer();
        this.setupHeaderContent();

        const imagePaths = ['a800xl.png', 'c64.jpg', 'zxs.png'];
        this.loadTextures(imagePaths, () => {
            this.setupPlanes();
            this.animate();
        });

        // Position camera to see all three planes
        this.camera.position.z = 15;
        this.camera.position.x = 0;

        window.addEventListener('resize', () => {
            this.renderer.setSize(0.8*window.innerWidth, 0.8*window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
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

    setupHeaderContent() {
        // Placeholder for header setup if needed
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
        const spacing = 6; // Distance between planes

        for (let i = 0; i < 3; i++) {
            const material = new THREE.MeshBasicMaterial({ map: this.textures[i] });
            const plane = new THREE.Mesh(this.planeGeometry, material);
            plane.position.x = (i - 1) * spacing; // -spacing, 0, +spacing
            plane.rotation.x = -Math.PI / 12; // Tilt as original
            this.scene.add(plane);
            this.planes.push(plane);
        }
    }

    handleKeyDown(event) {
        console.log('Key pressed:', event.key);
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        // Rotate each plane for some animation
        this.planes.forEach((plane, index) => {
            plane.rotation.y += this.rotationCoeff + index * 0.005;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

const myScene = new MyScene();
myScene.init();
