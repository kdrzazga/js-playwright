class Globals{
	static runningTime = 0;	
	
    static lightgrayColor = '#b3b3b3';
	static screenWidth = 520;
	static screenHeight = 512;
    static colors = ['black', 'white', 'red', 'cyan', 'magenta', 'green', '#4536a6', 'yellow', '#675200', '#c33d00', '#c18178', '#606060', '#8a8a8a', '#b3ec91', '#867ade', Globals.lightgrayColor];
}

class C64Blackbox {
    static rowHeight = 20;
	static currentColorIndex = 7;
	static texture = null;	
    static backgroundColor = Globals.lightgrayColor;
    static secondaryBackgroundColor = Globals.colors[11];
	static logoPictures = ['logo.png'];

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.planeGeometry = new THREE.PlaneGeometry(5, 5);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.functionKeysActivated = true;
		this.delta = 0.006;  
		this.headerLines = [];
		this.context = null;
		this.cursor = null;
		this.bruceGame = null;
		this.dizzolGame = null;
		this.clearColor = Globals.colors[11];
		this.backgroundColor = Globals.lightgrayColor;
		this.defaultColor = 'black';
		this.classRef = C64Blackbox;
		this.param = '';
	}

    init() {
        this.setupRenderer();
		this.setupHeaderContent();
		this.setupHelpContent();
		
        this.functionKeysActivated = true;
        const canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        canvas.width = Globals.screenWidth;
        canvas.height = Globals.screenHeight;
		this.bruceGame = new BruceGame(canvas);
		this.dizzolGame = new DizzolGame(canvas, this);

        C64Blackbox.texture = new THREE.CanvasTexture(canvas);
		this.drawInitialText(this.context);
		
		this.setupPlane();

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        this.readParam();
        this.executeParamAction();
    }

    readParam(){
        const keyParam = sessionStorage.getItem('key');
        if (keyParam != null){
            this.param = keyParam;
        }
    }

    executeParamAction(){
        console.log(this.param);
        switch(this.param){
            case 'F1':
                this.handleHelp();
                break;
            case 'F2':
                this.handleF2();
                break;
            case 'F3':
                this.handleF3();
                break;
            case 'F6':
                this.handleF6();
                break;
            case 'F7':
                this.handleF7();
                break;
            case 'F8':
                this.handleF8();
                break;
            case 'F9':
                this.handleF9();
                break;

        }
    }

    setupHeaderContent(){
		this.headerLines = [
			{ text: '* C-64 BASIC IMPROVED BY BLACK BOX V.3 *', color: Globals.lightgrayColor },
			{ text: '64K RAM SYSTEM   38911  BASIC BYTES FREE', color: Globals.lightgrayColor },
			{ text: 'READY.', color: 'black' }
		];
    }

    setupHelpContent(){
    	this.helpTexts = [
    		[String.fromCharCode(0xe05f) + 'HELP', 2],
    		['F1, 1, Q - ' + String.fromCharCode(0xe05f) + 'HELP, DISPLAY THIS HELP', 1],
    		['F2, 2, U, J - SOFT RESET', 1],
    		['F3, 3, I, K - CHANGE BACKGROUND COLOR', 1],
    		['F5 - HARD RESET/RELOAD', 1],
    		['F6, 6, 0, =, O, L - ' + String.fromCharCode(0xe05f) + 'K&A+ LOGO', 1],
    		['F7, 7, -, P, ; - ' + String.fromCharCode(0xe05f) + 'BRUCE LEE SIMPLE GAME', 1],
    		['F8, 8 - ' + String.fromCharCode(0xe05f) + 'CEBULUS SIMPLE GAME', 1],
    		['F9, 9 - ' + String.fromCharCode(0xe05f) + 'DIZZOL SIMPLE GAME', 2],
    		['READY.', 1]
    	];
    }
	
    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.clearColor, 1);
        document.body.appendChild(this.renderer.domElement);
    }

    setupPlane() {
        const planeMaterial = new THREE.MeshBasicMaterial({ map: C64Blackbox.texture });
        this.plane = new THREE.Mesh(this.planeGeometry, planeMaterial);
        this.plane.rotation.x = -Math.PI / 12;
        this.scene.add(this.plane);
        this.camera.position.z = 5;
    }

    drawInitialText(context) {
		this.cursor = new Cursor(context, this.defaultColor, this.backgroundColor);
		
        context.fillStyle = this.classRef.secondaryBackgroundColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = this.classRef.backgroundColor;
        context.fillRect(0, 90, context.canvas.width, context.canvas.height);
		
	this.renderHeader();
        C64Blackbox.texture.needsUpdate = true;
    }
	
	renderHeader() {
		this.context.font = '13px c64mono';

		this.headerLines.forEach((line, index) => {
			this.context.fillStyle = line.color;
			this.context.fillText(line.text, 0, (2 + index * 2) * C64Blackbox.rowHeight);
		});
	}

    clearOutput() {
        const context = C64Blackbox.texture.image.getContext('2d');
        context.clearRect(0, 0, C64Blackbox.texture.image.width, C64Blackbox.texture.image.height);
        this.drawInitialText(context); 		
		console.log('Output reset. C64 screen redrawn.');
    }
	
    clearOutputBottom(thresholdY) {
        const context = C64Blackbox.texture.image.getContext('2d');
		context.fillStyle = this.backgroundColor;
        context.fillRect(0, thresholdY, C64Blackbox.texture.image.width, C64Blackbox.texture.image.height);
		console.log('Bottom Output reset.');
    }
	
	handleHelp() {
	    if (!this.functionKeysActivated)
	        return;
	        
		console.log("F1. HELP");
		this.clearOutput();
		
		const context = C64Blackbox.texture.image.getContext('2d');
		context.fillStyle = this.defaultColor;

		for (const [text, movement] of this.helpTexts) {
			context.fillText(text, 0, this.cursor.position.y + Math.floor(this.cursor.size / 2));
			this.cursor.position.y += (this.cursor.size + 2) * movement;
		}
	}

    handleF2() {
	    if (!this.functionKeysActivated)
	        return;
        console.log('2 or F2 was pressed. Soft reset.');
        this.softReset(Globals.lightgrayColor);
    }

    softReset(color){
    	this.bruceGame.reset();
    	this.classRef.backgroundColor = color;
    	this.backgroundColor = color;
        this.clearOutput();
    }

    handleF3() {
	    if (!this.functionKeysActivated)
	        return;
        console.log('3, I, K or F3 was pressed. POKE 53281,color');
		this.bruceGame.reset();
		this.cursor.clear();
		const context = C64Blackbox.texture.image.getContext('2d');
		context.fillStyle = this.defaultColor;

		context.fillText('POKE 53281, ' + C64Blackbox.currentColorIndex, 0, this.cursor.position.y + Math.floor(this.cursor.size / 2));
		this.cursor.position.x = 15 * this.cursor.size - 3;
		if (C64Blackbox.currentColorIndex < 10){
			this.cursor.position.x -= this.cursor.size;
		}
		C64Blackbox.texture.needsUpdate = true;

		setTimeout(() => {				
			C64Blackbox.backgroundColor = Globals.colors[C64Blackbox.currentColorIndex];
			this.backgroundColor = C64Blackbox.backgroundColor;
			C64Blackbox.currentColorIndex = (C64Blackbox.currentColorIndex + 1) % 	Globals.colors.length;
			this.clearOutput();
		}, 1000);
    }

    handleF6() {
	    if (!this.functionKeysActivated)
	        return;
        console.log('6, 0, =, O, L or F6 was pressed. LOGO');
		
		this.bruceGame.reset();
		this.clearOutput();
		this.context.fillStyle = this.defaultColor;
        this.context.fillText(String.fromCharCode(0xe05f) + 'K&A+', 0, 7 * C64Blackbox.rowHeight);
        this.context.fillText('http://www.ka-plus.pl', 0, 13 * C64Blackbox.rowHeight + 2);
        this.context.fillText('READY.', 0, 14 * C64Blackbox.rowHeight + 2);
		this.cursor.position = { x: Math.floor(this.cursor.size / 2) + 1, y: 14.5 * C64Blackbox.rowHeight}
		
		this.loadPicture(C64Blackbox.logoPictures[0], 0, 8 * C64Blackbox.rowHeight);
    }
	
	handleF7(){
	    if (!this.functionKeysActivated)
	        return;
		console.log('7, -, P, ; or F7 was pressed. Simple game Bruce');
		this.bruceGame.reset();
		this.bruceGame.activate();
		this.clearOutputBottom(Math.floor(5 * Globals.screenHeight / 6));
				
		this.cursor.clear();
		this.context.fillStyle = this.defaultColor;
		this.context.fillText(String.fromCharCode(0xe05f) + 'BRUCE LEE', 0, this.cursor.position.y + 4);
		this.cursor.moveDown(2);
		this.context.fillStyle = this.defaultColor;
		this.context.fillText('READY.', 0, this.cursor.position.y + 5);
		this.cursor.moveDown(1);
	}

	handleF8(){
	    if (!this.functionKeysActivated)
	        return;
	    console.log('F8 was pressed. Simple game Cebulus');
	    while (this.scene.children.length > 0) {
                    this.scene.remove(this.scene.children[0]);
                }
	    this.stopAnimation();

	    window.location.href = 'cebulus.html';
    }

	handleF9(){
	    if (!this.functionKeysActivated)
	        return;
	    console.log('F9 was pressed. Simple game Dizzol')

        this.bruceGame.reset();
	    this.cursor.clear();
	    this.context.fillStyle = this.defaultColor;
	    this.context.fillText(String.fromCharCode(0xe05f) + 'DIZZY', 0, this.cursor.position.y + 4);
	    this.cursor.moveDown(2);
	    this.context.fillStyle = this.defaultColor;
	    this.context.fillText('LOADING...', 0, this.cursor.position.y + 5);
	    this.cursor.moveDown(1);

		setTimeout(() => {
		    this.clearOutput();
		    this.functionKeysActivated = false;
		    setTimeout(() => {
		                this.dizzolGame.activate();
		                this.dizzolGame.draw();
                    }, 1500);
        }, 6000);
	}
	
	handleMovement(direction) {

        if (!this.bruceGame.active && !this.dizzolGame.active){
            return;
        }

	    let game = this.bruceGame.active ? this.bruceGame : this.dizzolGame;

		if (this.bruceGame.active) {
		    this.clearOutputBottom(Math.floor(5 * Globals.screenHeight / 6));
        }
		switch (direction) {
			case Direction.UP:
				console.log('UP key was pressed.');
				break;
			case Direction.DOWN:
				console.log('DOWN key was pressed.');
				break;
			case Direction.LEFT:
				//console.log('LEFT key was pressed.');
				game.moveFighterLeft(game.player);
				break;
			case Direction.RIGHT:
				//console.log('RIGHT key was pressed.');
				game.moveFighterRight(game.player);
				break;
		}

	}
	
	handleFire(){
		if (this.bruceGame.active){
			console.log('FIRE key was pressed.');
			this.clearOutputBottom(Math.floor(5 * Globals.screenHeight / 6));
			this.bruceGame.punch(this.bruceGame.player);
		}
		else if (this.dizzolGame.active){
			this.dizzolGame.handleFirePressed();
		}
	}
	
	loadPicture(fileName, x, y) {
		let pictureLoader = new PictureLoader(this.context);
		pictureLoader.load(fileName, x, y);		
		C64Blackbox.texture.needsUpdate = true;			
	}

    handleKeyDown(event) {
        const keyMapping = {
            help: () => this.handleHelp(),
            'F2': () => this.handleF2(),
            'F3': () => this.handleF3(),
            'F6': () => this.handleF6(),
            'F7': () => this.handleF7(),
            'F8': () => this.handleF8(),
            'F9': () => this.handleF9(),
            w: () => this.handleMovement(Direction.UP),
            s: () => this.handleMovement(Direction.DOWN),
            a: () => this.handleMovement(Direction.LEFT),
            d: () => this.handleMovement(Direction.RIGHT),
            fire: () => this.handleFire(),
        };

        const keyTriggers = {
            'help': ['F1', 111, '1', 'q'],
            'F2': ['F2', 112, '2', 'u', 'j'],
            'F3': ['F3', 113, '3', 'i', 'k'],
            'F6': ['F6', 115, '6', '0', '=', 'o', 'l'],
            'F7': ['F7', 117, '7', '-', 'p', ';'],
            'F8': ['F8', 118, '8'],
            'F9': ['F9', 119, '9'],
			'w': ['w', 'ArrowUp'],
			's': ['s', 'ArrowDown'],
			'a': ['a', 'ArrowLeft'],
			'd': ['d', 'ArrowRight'],
			'fire' : ['Control', 17, 'Space', 32, 'Enter', 13]
        };

        for (const [key, values] of Object.entries(keyTriggers)) {
            if (values.includes(event.key) || values.includes(event.keyCode)) {
                keyMapping[key]();
                break;
            }
        }
    }

    blinkCursor() {
		this.cursor.blinkCursor();        
        C64Blackbox.texture.needsUpdate = true;
    }
	
    conditionalRotationReset() {
        if (Math.abs(this.plane.rotation.y) > 0.80 * Math.PI / 2) {
            this.delta *= -1;
        }
    }

    animate() {
        Globals.runningTime++;
        this.plane.rotation.y += this.delta;
        this.blinkCursor();
        this.conditionalRotationReset();
        this.renderer.render(this.scene, this.camera);
		this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    stopAnimation() {
        cancelAnimationFrame(this.animationFrameId);
    }
}


class Cursor{
	
	 static blinkInterval = 100;
	
	constructor(context, color, backgroundColor){
		this.context = context;
		this.color = color;
		this.backgroundColor = backgroundColor;
		this.size = C64Blackbox.rowHeight - 7;
        this.position = { x: Math.floor(this.size / 2) + 1, y: 6.5 * C64Blackbox.rowHeight }
		this.visible = true;
	}
	
	moveDown(times){
		this.position.y += times * this.size;
	}
	
	clear(){		
        var x = this.position.x - this.size / 2;
        var y = this.position.y - this.size / 2;
		
		this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(x, y, this.size, this.size);	
	}
	
    blinkCursor() {
        const blinkState = Math.floor(Globals.runningTime / Cursor.blinkInterval) % 2;

        const x = this.position.x - this.size / 2;
        const y = this.position.y - this.size / 2;

        // Clear the rectangle before drawing, to avoid ghosting
        this.clear();

        this.context.clearRect(x, y, this.size, this.size);
        this.context.fillStyle = (blinkState === 0) ? this.color : this.backgroundColor;
        this.context.fillRect(x, y, this.size, this.size);
    }
}

const c64 = new C64Blackbox();
