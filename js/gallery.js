const photoData = [
  { word: 'stillness',  color: '#E8820C' },
  { word: 'devotion',   color: '#D4A017' },
  { word: 'harmony',    color: '#E07B39' },
  { word: 'resilience', color: '#C0C0C0' },
  { word: 'peace',      color: '#C17E3A' },
  { word: 'innocence',  color: '#A8A8A8' },
  { word: 'faith',      color: '#7BA7BC' },
  { word: 'solitude',   color: '#B8A898' },
  { word: 'surrender',  color: '#E05C3A' },
  { word: 'wonder',     color: '#7A9E7E' },
];

const cards = Array.from(document.querySelectorAll('.photo-card'));
const wordEl = document.getElementById('photoWord');
const total = cards.length;
let current = 0;
let isAnimating = false;

const S0 = 1.0, S1 = 0.80, S2 = 0.64;
const GAP = 12;

function getW(card) {
  return card.classList.contains('portrait') ? 270 : 580;
}

function positionCards() {
  const cW = getW(cards[current]);
  cards.forEach((card, i) => {
    let diff = i - current;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    const s = Math.sign(diff);
    let tx = 0, rotY = 0, scale = S0, brightness = 1, zIndex = 1, shadow = 'none', opacity = 1;

    if (diff === 0) {
      tx = 0; rotY = 0; scale = S0; brightness = 1; zIndex = 10;
      shadow = '0 40px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.3)';
    } else if (Math.abs(diff) === 1) {
      const sW = getW(card);
      tx = ((cW * S0) / 2 + GAP + (sW * S1) / 2) * s;
      rotY = -28 * s; scale = S1; brightness = 0.65; zIndex = 5;
    } else if (Math.abs(diff) === 2) {
      const adj = cards[(current + s + total) % total];
      const adjW = getW(adj);
      const sW = getW(card);
      const adjCenter = (cW * S0) / 2 + GAP + (adjW * S1) / 2;
      const adjEdge = adjCenter + (adjW * S1) / 2;
      tx = (adjEdge + GAP + (sW * S2) / 2) * s;
      rotY = -42 * s; scale = S2; brightness = 0.35; zIndex = 2;
    } else {
      opacity = 0; scale = 0.3; zIndex = 0;
    }

    card.style.transform = `translateX(${tx}px) rotateY(${rotY}deg) scale(${scale})`;
    card.style.filter = `brightness(${brightness})`;
    card.style.zIndex = zIndex;
    card.style.boxShadow = shadow;
    card.style.opacity = opacity;
  });
}

function updateWord() {
  const newWord = photoData[current].word;
  const newColor = photoData[current].color;

  wordEl.classList.add('fade-out');
  wordEl.classList.remove('fade-in');

  setTimeout(() => {
    wordEl.textContent = newWord;
    wordEl.style.color = newColor;
    wordEl.getBoundingClientRect();
    wordEl.classList.remove('fade-out');
    wordEl.classList.add('fade-in');
  }, 380);
}

function goTo(index) {
  if (isAnimating) return;
  isAnimating = true;
  current = (index + total) % total;
  positionCards();
  updateWord();
  setTimeout(() => { isAnimating = false; }, 700);
}

function goNext() { goTo(current + 1); }
function goPrev() { goTo(current - 1); }

document.getElementById('photoNext').addEventListener('click', goNext);
document.getElementById('photoPrev').addEventListener('click', goPrev);

cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    let diff = i - current;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff === 0) return;
    if (diff > 0) for (let j = 0; j < diff; j++) goNext();
    else for (let j = 0; j < Math.abs(diff); j++) goPrev();
  });
});

/* Touch swipe */
let startX = 0;
const stage = document.querySelector('.photo-stage');
stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
}, { passive: true });

/* Autoplay — pause on hover */
let auto = setInterval(goNext, 4500);
stage.addEventListener('mouseenter', () => clearInterval(auto));
stage.addEventListener('mouseleave', () => { auto = setInterval(goNext, 4500); });
[document.getElementById('photoNext'), document.getElementById('photoPrev')].forEach(btn => {
  btn.addEventListener('click', () => { clearInterval(auto); auto = setInterval(goNext, 4500); });
});

/* Init */
positionCards();
wordEl.classList.add('fade-in');
