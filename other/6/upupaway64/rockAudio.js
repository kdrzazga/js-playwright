const songsArray = [
  ['resources/monty.mp3', (6 * 60) * 1000, 'Monty'],
  ['resources/ghostGoblins.mp3', (4 * 60 + 40) * 1000, "Ghost'n'Goblins"],
  ['resources/giana.mp3', (3 * 60) * 1000, 'Giana'],
  ['resources/2020.mp3', (2 * 60 + 35) * 1000, '2020 by MotionRide']
];

const player = new AudioPlayer(songsArray);

function hide() {
  var button = document.getElementById('start-tune');
  button.hidden = true;
  console.log('Button hidden.');
}

