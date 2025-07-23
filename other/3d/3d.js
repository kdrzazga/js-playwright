// Assuming you have included THREE.js in your HTML
// <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"></script>

class MyScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
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
        this.clearColor = 0x000000; // Example color
        this.backgroundColor = 0xcccccc; // Example color
        this.defaultColor = 'black';

        this.planes = [];
        this.animationFrameId = null;
    }

    init() {
        this.setupRenderer();
        this.setupHeaderContent();

        // Setup 2D Canvas for textures
        const canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        canvas.width = 256; // Example size
        canvas.height = 256; // Example size

        // Placeholder for DizzolGame
        // this.dizzolGame = new DizzolGame(canvas, this);

        // For demonstration, fill canvas with some text
        this.drawInitialText(this.context);

        // Create a texture from the canvas
        if (typeof C64Blackbox === 'undefined') {
            window.C64Blackbox = {};
        }
        C64Blackbox.texture = new THREE.CanvasTexture(canvas);

        this.setupPlanes();

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.animate();

        // Position camera to see all three planes
        this.camera.position.z = 15;
        this.camera.position.x = 0;
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.clearColor, 1);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    setupHeaderContent() {
        // Placeholder for header setup if needed
    }

    drawInitialText(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Initial Text', 50, 50);
    }

    setupPlanes() {
        const planeMaterial = new THREE.MeshBasicMaterial({ map: C64Blackbox.texture });
        const spacing = 6; // Distance between planes

        for (let i = 0; i < 3; i++) {
            const plane = new THREE.Mesh(this.planeGeometry, planeMaterial);
            // Position planes side by side along the x-axis
            plane.position.x = (i - 1) * spacing; // -spacing, 0, +spacing
            plane.rotation.x = -Math.PI / 12; // Tilt as original
            this.scene.add(plane);
            this.planes.push(plane);
        }
    }

    handleKeyDown(event) {
        // Implement key handling if needed
        console.log('Key pressed:', event.key);
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        // Rotate each plane for some animation
        this.planes.forEach((plane, index) => {
            plane.rotation.y += 0.01 + index * 0.005;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate and initialize the scene
const myScene = new MyScene();
myScene.init();
