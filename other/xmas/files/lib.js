class Scroller {
    constructor(step) {
        this.step = step < 0 ? window.innerHeight / 300 : step;
        this.stepX = step < 0 ? window.innerWidth / 300 : step;
        this.x = 0;
        this.y = 0;
        this.direction = 1;
        this.isScrolling = false;
    }

    smoothScroll() {
        this.y += this.step * this.direction;

        if (this.y >= document.body.scrollHeight - window.innerHeight || this.y <= 0) {
            this.direction *= -1;
        }

        window.scrollTo(0, this.y);

        if (this.isScrolling) {
            requestAnimationFrame(this.smoothScroll.bind(this));
        }
    }

    smoothScrollHorizontal(){
        this.x += this.stepX * this.direction;
        if (this.x >= document.body.scrollWidth - window.innerWidth || this.x <= 0) {
            this.direction *= -1;
        }

        window.scrollTo(this.x, 0);

        if (this.isScrolling) {
            requestAnimationFrame(this.smoothScrollHorizontal.bind(this));
        }

    }

    startScrolling() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.smoothScroll();
        }
    }

    startScrollingHorizontal() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.smoothScrollHorizontal();
        }
    }

    stopScrolling() {
        this.isScrolling = false;
    }
}
