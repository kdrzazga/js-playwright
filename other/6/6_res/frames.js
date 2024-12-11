var counter = 3;
const counterMax = 3;

function moveBruceLee() {
    var bruce = document.getElementById('bruce');
    bruce.style.left = (parseInt(bruce.style.left) - 40) + 'px';
    //console.log("Bruce Lee position = ", bruce.style.left);
}

function moveScroll() {
    var scroll = document.getElementById('scroll');
    scroll.style.left = (parseInt(scroll.style.left) - 5) + 'px';
    //console.log("Scroll position = ", scroll.style.left);
}

function conditionalBruceReset() {
    var bruce = document.getElementById('bruce');
    if (parseInt(bruce.style.left) < -10000) {
        bruce.style.left = '2677px';
    }
}

function conditionalScrollReset() {
    var scroll = document.getElementById('scroll');
    if (parseInt(scroll.style.left) < -5000) {
        scroll.style.left = '2677px';
    }
}

function timeLoop() {
    var _this = this;
    var lastRenderTime = 0;
    //console.log("time loop");
    var currentTime = performance.now();
    var timeSinceLastRender = currentTime - lastRenderTime;
    if (timeSinceLastRender >= 15) {
        if (counter < 0) {
            moveBruceLee();
            conditionalBruceReset();
            moveScroll();
            conditionalScrollReset();
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
