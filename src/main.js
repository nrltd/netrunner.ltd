import './style.css'

const repeatsPerHalf = 10;   // repeats of "N R" in ONE half of each track
const MIN_ROWS = 10;
const MAX_ROWS = 60;

const stage = document.getElementById('stage');

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

// Figures out how many rows are needed to cover the viewport, given the
// current font size/line-height/gap and the stage's rotate+scale transform.
// This is what lets the same code produce ~10 rows on a wide desktop screen
// (big vw-based text) and many more on a narrow, tall phone screen (small
// vw-based text) without a hardcoded count that only suits one shape.
function computeRowCount() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const textSizeVw = parseFloat(cssVar('--text-size'));
  const lineHeight = parseFloat(cssVar('--line-height'));
  const rowGapVh = parseFloat(cssVar('--row-gap'));
  const rotationDeg = parseFloat(cssVar('--rotation'));
  const zoom = parseFloat(cssVar('--zoom'));

  const fontPx = (textSizeVw / 100) * w;
  const rowGapPx = (rowGapVh / 100) * h;
  const rowBlockPx = fontPx * lineHeight + rowGapPx;

  // Pre-transform content height needed so that, after rotating by
  // rotationDeg and scaling by zoom, it still covers the viewport.
  const theta = Math.abs(rotationDeg) * (Math.PI / 180);
  const neededPreTransformHeight =
    (h * Math.cos(theta) + w * Math.sin(theta)) / zoom;

  const rows = Math.ceil(neededPreTransformHeight / rowBlockPx);
  return Math.min(MAX_ROWS, Math.max(MIN_ROWS, rows));
}

function buildRows(rowCount) {
  stage.innerHTML = '';

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
}

let currentRowCount = 0;

function render() {
  const rowCount = computeRowCount();
  if (rowCount === currentRowCount) return;
  currentRowCount = rowCount;
  buildRows(rowCount);
}

render();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(render, 200);
});
