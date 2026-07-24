import './style.css'

const rowCount = 10;          // number of scrolling lines
const repeatsPerHalf = 10;    // repeats of "N R" in ONE half of each track

const stage = document.getElementById('stage');

for (let i = 0; i < rowCount; i++) {
  const row = document.createElement('div');
  row.className = 'row ' + (i % 2 === 0 ? 'row-left' : 'row-right');

  const track = document.createElement('div');
  track.className = 'row-track';

  // Build one half, then clone it once to make an identical second half.
  // Because both halves are byte-for-byte identical, translating by -50%
  // lands exactly back on the start frame -> no visible jump, ever.
  let half = '';
  for (let j = 0; j < repeatsPerHalf; j++) {
    half += '<span>N R</span>';
  }
  track.innerHTML = half + half;

  row.appendChild(track);
  stage.appendChild(row);
}