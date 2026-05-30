const cards = Array.from(document.querySelectorAll('.photo-card'));
const total = cards.length;
let current = 0;
const S0 = 1.0, S1 = 0.80, S2 = 0.64;

function getW(card) {
  return card.classList.contains('portrait') ? 300 : 650;
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
      shadow = '0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.12)';
    } else if (Math.abs(diff) === 1) {
      const sW = getW(card);
      const cEdge = (cW * S0) / 2;
      const sHalf = (sW * S1) / 2;
      tx = (cEdge + sHalf) * s;
      rotY = -30 * s;
      scale = S1;
      brightness = 0.70;
      zIndex = 5;
    } else if (Math.abs(diff) === 2) {
      const adj = cards[(current + s + total) % total];
      const adjW = getW(adj);
      const sW = getW(card);
      const cEdge = (cW * S0) / 2;
      const adjCenter = cEdge + (adjW * S1) / 2;
      const adjFarEdge = adjCenter + (adjW * S1) / 2;
      tx = (adjFarEdge + (sW * S2) / 2) * s;
      rotY = -44 * s;
      scale = S2;
      brightness = 0.50;
      zIndex = 2;
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

function goNext() { current = (current + 1) % total; positionCards(); }
function goPrev() { current = (current - 1 + total) % total; positionCards(); }

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

const stage = document.querySelector('.photo-stage');
let startX = 0;
stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
}, { passive: true });

let auto = setInterval(goNext, 4000);
[document.getElementById('photoNext'), document.getElementById('photoPrev')].forEach(btn => {
  btn.addEventListener('click', () => { clearInterval(auto); auto = setInterval(goNext, 4000); });
});

stage.addEventListener('mouseenter', () => clearInterval(auto));
stage.addEventListener('mouseleave', () => { auto = setInterval(goNext, 4000); });

positionCards();
