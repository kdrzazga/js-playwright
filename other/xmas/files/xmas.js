var counter = 3;
const counterMax = 3;

function play() {
  var audio = new Audio('files/carols.mp3');
  audio.play();
  setInterval(function() {
    audio.play();
  }, 11037);
  console.log('Music started.');
}

function startPlayback(){
  const alreadyPlaying = sessionStorage.getItem('carols-playing');
  //if (alreadyPlaying !== 'true'){
	  sessionStorage.setItem('carols-playing', 'true');
	  play();
  //}
}

function moveSanta1() {
    var santa1 = document.getElementById('santa1');
    santa1.style.left = (parseInt(santa1.style.left) + 6) + 'px';
    santa1.style.top = (parseInt(santa1.style.top) + 1) + 'px';
}

function conditionalSanta1Reset() {
    var santa1 = document.getElementById('santa1');
    if (parseInt(santa1.style.left) > 3000) {
        santa1.style.left = '-300px';
        santa1.style.top = '200px';
    }
}

function timeLoop() {
    var _this = this;
    var lastRenderTime = 0;
    var currentTime = performance.now();
    var timeSinceLastRender = currentTime - lastRenderTime;
    if (timeSinceLastRender >= 15) {
        if (counter < 0) {
            moveSanta1();
            conditionalSanta1Reset();
            counter = counterMax;
            lastRenderTime = currentTime;
        }
        else {
            counter--;
        }
    }
    requestAnimationFrame(function () { return _this.timeLoop(); });
}

timeLoop();
