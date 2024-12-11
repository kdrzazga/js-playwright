const songsArray = [
  ['resources/LN1wastelands.mp3', (2 * 60 + 0) * 1000, 'LAST NINJA 1 - WASTELANDS'],
  ['resources/wilderness.mp3', (4 * 60 + 40) * 1000, 'WILDERNESS'],
  ['resources/BB.mp3', (1 * 60) * 1000, 'BUBBLE BOBBLE'],
  ['../commando64/resources/commando.mp3', (4 * 60 + 40) * 1000, 'COMMANDO (piano version)'],
  ['resources/fst.mp3', (1 * 42) * 1000, 'FST'],
  ['resources/supremacy.mp3', (4 * 60) * 1000, 'SUPREMACY'],
  ['resources/LN2.mp3', (4 * 60 + 40) * 1000, 'LAST NINJA 2'],
  ['resources/natoAC.mp3', (3 * 60 + 15) * 1000, 'NATO ASSAULT COURSE'],
  ['../ik64/resources/ik.mp3', (10 * 60 + 50) * 1000, 'INTERNATIONAL KARATE'],
  ['resources/mikie.mp3', (1 * 45) * 1000, 'MIKIE']
];

const player = new AudioPlayer(songsArray);

function hide() {
  var button = document.getElementById('start-tune');
  button.hidden = true;
  console.log('Button hidden.');
}

