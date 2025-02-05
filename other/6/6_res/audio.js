class AudioPlayer {
  constructor(audioArray) {
    this.audioArray = audioArray;
    this.currentAudio = 0;
    this.audio = new Audio(this.audioArray[this.currentAudio][0]);
  }

  playAudio() {
    this.audio.src = this.audioArray[this.currentAudio][0];
    const tuneTitle = document.getElementById('bottom-border');
    if (tuneTitle != null) {
        tuneTitle.style.fontFamily = 'c64mono';
        tuneTitle.innerText = 'Playing track: ' + this.audioArray[this.currentAudio][2];
    }

    setTimeout(() => {
      if (tuneTitle != null) tuneTitle.innerText = '';
    }, 6500);

    this.audio.play();

    const now = Date.now();
    const formattedTimestamp = new Date(now).toISOString();
    console.log(`${formattedTimestamp} Music started - ${this.audioArray[this.currentAudio][0]} duration: ${this.audioArray[this.currentAudio][1]}`);

    setTimeout(() => {
      this.currentAudio = (this.currentAudio + 1) % this.audioArray.length;
      this.playAudio();
    }, this.audioArray[this.currentAudio][1]);
  }

  startPlayback() {
    const alreadyPlaying = sessionStorage.getItem('already-playing');
    if (alreadyPlaying !== 'true') {
      sessionStorage.setItem('already-playing', 'true');
      this.playAudio();
    }
  }
}


