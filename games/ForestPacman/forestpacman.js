class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(2, 1, 2.5);
        this.camera.lookAt(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.player = new Player(this.scene);
        this.board = new Board(this.scene);
        this.keyState = {};

        this.infoFrame = document.getElementById('infoFrame');

        this.keyboardHandler = new KeyboardHandler(this.handleKeyDown.bind(this), this.handleKeyUp.bind(this));
        this.keyboardHandler.initializeControls();

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));

        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    handleKeyDown(event) {
        this.keyState[event.key] = true;
    }

    handleKeyUp(event) {
        this.keyState[event.key] = false;
    }

    update() {
        const movementKeys = {
            'w': { deltaX: 0, deltaZ: 1 },
            's': { deltaX: 0, deltaZ: -1 },
            'a': { deltaX: 1, deltaZ: 0 },
            'd': { deltaX: -1, deltaZ: 0 },
            'ArrowUp': { deltaX: 0, deltaZ: 1 },
            'ArrowDown': { deltaX: 0, deltaZ: -1 },
            'ArrowLeft': { deltaX: 1, deltaZ: 0 },
            'ArrowRight': { deltaX: -1, deltaZ: 0 }
        };

        let deltaX = 0;
        let deltaZ = 0;

        for (const key in movementKeys) {
            if (this.keyState[key]) {
                deltaX += movementKeys[key].deltaX;
                deltaZ += movementKeys[key].deltaZ;
            }
        }

        this.board.move(deltaX, deltaZ);
        this.updateInfoFrame();
    }

    getPlayerIdPosition() {
        const boardPos = this.board.mesh.position;
        const playerId = this.player.id;
        const playerPos = this.player.mesh.position;
        return { [playerId]: [boardPos.x, playerPos.y, boardPos.z] };
    }

    updateInfoFrame() {
        const animalIdPositions = this.board.getAnimalIdPositions();
        const playerIdPos = this.getPlayerIdPosition();

        const playerId = Object.keys(playerIdPos)[0];
        const playerPosition = playerIdPos[playerId].map(pos => pos.toFixed(2)).join(", ");
        let caption = `Player Position: <br>${playerId}: [${playerPosition}]<br>Animals Position: <br>`;

        animalIdPositions.forEach(animal => {
            const animalId = Object.keys(animal)[0];
            const positions = animal[animalId].map(pos => pos.toFixed(2)).join(", ");
            caption += `${animalId}: [${positions}]<br>`;
        });

        this.infoFrame.innerHTML = caption;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.player.update();
        this.board.update();
        this.renderer.render(this.scene, this.camera);
    }
}

class KeyboardHandler {
    constructor(onKeyDown, onKeyUp) {
        this.onKeyDown = onKeyDown;
        this.onKeyUp = onKeyUp;
    }

    simulateKeyPress(key) {
        const event = this.createSyntheticEvent(key);
        this.onKeyDown(event);
    }

    simulateKeyRelease(key) {
        const event = this.createSyntheticEvent(key);
        this.onKeyUp(event);
    }

    createSyntheticEvent(key) {
        return {
            target: document.body,
            key: key,
            charCode: 0,
            keyCode: this.getKeyCode(key),
            preventDefault: () => {},
            stopPropagation: () => {},
        };
    }

    getKeyCode(key) {
        const keyCodes = {
            "ArrowUp": 38,
            "ArrowDown": 40,
            "ArrowLeft": 37,
            "ArrowRight": 39
        };
        return keyCodes[key] || 0;
    }

    initializeControls() {
        const buttons = document.querySelectorAll('#controls button');

        buttons.forEach(button => {
            const key = button.getAttribute('data-key');
            button.addEventListener('mousedown', () => this.simulateKeyPress(key));
            button.addEventListener('touchstart', () => this.simulateKeyPress(key));
            button.addEventListener('mouseup', () => this.simulateKeyRelease(key));
            button.addEventListener('touchend', () => this.simulateKeyRelease(key));
        });
    }
}

const game = new Game();
