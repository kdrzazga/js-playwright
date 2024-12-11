class Petscii {

  static VERT_S = 179;
  static VERT_LEFT_S = 180;
  static TOP_RIGHT_S = 191;
  static BOTTOM_LEFT_S = 192;
  static HORIZ_UP_S = 193;
  static HORIZ_DOWN_S = 194;
  static VERT_RIGHT_S = 195;
  static HORIZ_S = 196;
  static CROSS_S = 197;
  static BOTTOM_RIGHT_S = 217;
  static TOP_LEFT_S = 218;
  static SPACE = 160;
  static LOWER_HALF_BLOCK = 0x2585;
  static BLOCK = 0xdb;
}

class Pacman64 extends Commodore64 {

  constructor(delay) {
    super();
    this.tableContent = this.generateC64Header();
	
	for (let i = 5; i < 21; i++) {
      this.tableContent.push("&nbsp");
    }
	this.lastRenderTime = 0;
	
	this.cursorCanvas = document.createElement('canvas');
	this.cursorCanvas.style.position = 'relative';
	this.cursorCanvas.style.top = '-2px';
	this.cursorCanvas.style.left = '-16px';
	this.cursorCanvas.width = 16;
	this.cursorCanvas.height = 16;
	this.ctx = this.cursorCanvas.getContext('2d');
	this.delay = delay;
	this.blink = true;
    this.pacmanPos = 30;
    this.pacmanSpeed = 3;
    this.pacmanPic = 'pm.png';
    this.ghostPos = 30;
    this.ghostSpeed = 2;
    this.ghostPic = 'ghost.png';

  }
  
  initTimeLoop(){
	this.cursorContainer = document.getElementById('row6');
	this.cursorContainer.appendChild(this.cursorCanvas);
  }
  
  timeLoop() {
	console.group("%c PACMAN", "color: orange; font-weight: bold;");
	const currentTime = performance.now();
	const timeSinceLastRender = currentTime - this.lastRenderTime;
	
	this.blinkCursor(currentTime, timeSinceLastRender)
	this.movePacman();
	this.moveGhost();

	console.groupEnd();
    requestAnimationFrame(() => this.timeLoop());	
  }
  
  blinkCursor(currentTime, timeSinceLastRender){
 	if (timeSinceLastRender >= 1000 / Commodore64.FPS) {
	    this.ctx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
        if (this.blink) {
          this.ctx.fillStyle = Commodore64.LIGHTBLUE;
        } else {
          this.ctx.fillStyle = Commodore64.BLUE;
        }
		
        this.ctx.fillRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
		this.blink = !this.blink;
		this.lastRenderTime = currentTime;
	}
	
	//console.log("blink = " + this.blink);
  }
 
  movePacman(){
	const pacman = document.getElementById('pacman');
	pacman.style.marginLeft = new String(this.pacmanPos) + 'px';
	pacman.style.marginRight = new String(561 - this.pacmanPos) + 'px';
	
	this.pacmanPos += this.pacmanSpeed;
	
	if (this.pacmanPos > 530 || this.pacmanPos < 30){
			this.pacmanSpeed = -this.pacmanSpeed;
			this.pacmanPic = this.pacmanPic === 'pm.png' ? 'pminv.png' : 'pm.png';	
			const url = "resources/" + this.pacmanPic;
			pacman.setAttribute("src", url);
	}
	//console.log("pacman pos = ", this.pacmanPos);
  }
  
  moveGhost(){
	const ghost = document.getElementById('ghost');
	ghost.style.marginLeft = new String(this.ghostPos) + 'px';
	ghost.style.marginRight = new String(361 - this.ghostPos) + 'px';
	
	this.ghostPos += this.ghostSpeed;
	
	if (this.ghostPos > 222 || this.ghostPos < 30){
			this.ghostSpeed = -this.ghostSpeed;
	}
	//console.log("ghost pos = ", this.ghostPos);
	
  }
 
  frame(){
	let row = [];
	let elements = [];
	
	let topRow = document.getElementById('row7');	
	topRow.textContent = this.createLongFrame(Petscii.TOP_LEFT_S, Petscii.TOP_RIGHT_S);
	
	let frameRow = document.getElementById('row8');
	frameRow.textContent = String.fromCharCode(Petscii.VERT_S) + String.fromCharCode(Petscii.SPACE).repeat(16) + "PACMAN" + String.fromCharCode(Petscii.SPACE).repeat(16) + String.fromCharCode(Petscii.VERT_S);
	
	//Board starts here
	elements = [  [1, Petscii.VERT_RIGHT_S],  [8, Petscii.HORIZ_S],  [1, Petscii.HORIZ_DOWN_S],  [4, Petscii.HORIZ_S],
		[1, Petscii.HORIZ_DOWN_S],  [12, Petscii.HORIZ_S],  [1, Petscii.HORIZ_DOWN_S],  [4, Petscii.HORIZ_S], [1, Petscii.HORIZ_DOWN_S], [6, Petscii.HORIZ_S], [1, Petscii.VERT_LEFT_S]];
	this.generateRow('row9', elements);
		
	elements = [  [1, Petscii.VERT_S],  [8, Petscii.SPACE],  [1, Petscii.VERT_S],  [4, Petscii.SPACE],
		[1, Petscii.VERT_S],  [2, Petscii.SPACE],  [10, Petscii.SPACE],  [1, Petscii.VERT_S], [4, Petscii.SPACE], [1, Petscii.VERT_S], [6, Petscii.SPACE], [1, Petscii.VERT_S] ];
	this.generateRow('row10', elements);
	
	elements = [ [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [2, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [4, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [6, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S],[4, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [1, Petscii.TOP_RIGHT_S],  [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row11', elements);
	
	elements = [ [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [4, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S],[6, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [4, Petscii.SPACE],[1, Petscii.VERT_S], [2, Petscii.SPACE], [2, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row12', elements);
	
	elements = [ [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [2, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [4, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [6, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [4, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row13', elements);
	
	frameRow = document.getElementById('row14');
	frameRow.innerHTML = String.fromCharCode(Petscii.VERT_S)
		+ '&nbsp</td>'
		+ '<td width = "10%"></td>'	
		+ '<td width = "95%"><img id = "pacman" src = "resources/pm.png" style = "margin-left : 50px"></img></td>'
		+ '<td width = "5%"></td>'	
		+ String.fromCharCode(Petscii.SPACE)
		+ String.fromCharCode(Petscii.VERT_S);
	
	elements = [ [1, Petscii.VERT_S] , [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [10, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [6, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.TOP_LEFT_S], [8, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row15', elements);
	
	elements = [ [1, Petscii.VERT_S] , [2, Petscii.SPACE], [1, Petscii.VERT_S], [10, Petscii.SPACE], [1, Petscii.VERT_S]
	,[2, Petscii.SPACE], [1, Petscii.VERT_S], [6, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE]
	, [1, Petscii.VERT_S], [8, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row16', elements);
	
	elements = [ [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [5, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S],[4, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [6, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [8, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row17', elements);
	
	elements = [ [1, Petscii.VERT_S], [8, Petscii.SPACE], [1, Petscii.VERT_S], [4, Petscii.SPACE], [1, Petscii.VERT_S]
	, [2, Petscii.SPACE], [1, Petscii.VERT_S], [6, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S], [8, Petscii.SPACE], [1, Petscii.VERT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row18', elements);
	
	elements = [ [1, Petscii.VERT_RIGHT_S], [5, Petscii.HORIZ_S], [1, Petscii.TOP_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S], [4, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S]
	, [6, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.BOTTOM_LEFT_S]
	, [8, Petscii.HORIZ_S], [1, Petscii.BOTTOM_RIGHT_S], [2, Petscii.SPACE], [1, Petscii.VERT_S]];
	this.generateRow('row19', elements);
		
	frameRow = document.getElementById('row20');
		frameRow.innerHTML = String.fromCharCode(Petscii.VERT_S) + String.fromCharCode(Petscii.SPACE).repeat(5) + String.fromCharCode(Petscii.VERT_S)
		+ '&nbsp</td>'
		+ '<td width = "10%"></td>'	
		+ '<td width = "95%"><img id = "ghost" src = "resources/ghost.png" style = "margin-left : 50px"></img></td>'
		+ '<td width = "5%"></td>'	
		+ String.fromCharCode(Petscii.SPACE).repeat(7)
		+ String.fromCharCode(0xe1a7);
	
	let bottom = this.createLongFrame(Petscii.BOTTOM_LEFT_S, Petscii.BOTTOM_RIGHT_S);
	let bottomRow = document.getElementById('row21');	
	bottomRow.textContent = bottom.substring(0, 6) + String.fromCharCode(Petscii.HORIZ_UP_S) + bottom.substring(7);
  }
  
  generateRow(id, elements) {
    let frameRow = document.getElementById(id);
    let row = [];
    elements.forEach(([count, charCode]) => row.push(String.fromCharCode(charCode).repeat(count)));
    frameRow.textContent = row.join('');
}
  
  createLongFrame(endSign1, endSign2){
	let topLeft = [endSign1]
	let longHorizLine = this.createLongHorizLine();
	let chars = [...topLeft, ...longHorizLine];
	chars.push(endSign2);
	let text = "";
	
	chars.forEach((c) => text += String.fromCharCode(c));
	return text;
  }
  
  createLongHorizLine() {
	let longHorizLine = [];

	for (let i = 1; i < 39; i++){
		longHorizLine.push(Petscii.HORIZ_S);
	}

	return longHorizLine;
  }
	
}
