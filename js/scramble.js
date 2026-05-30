const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&';

function scrambleWord(el) {
  const word = el.dataset.word;
  let iteration = 0;
  const total = word.length * 8;

  const interval = setInterval(() => {
    el.textContent = word
      .split('')
      .map((letter, i) => {
        if (i < Math.floor(iteration / 8)) return letter;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    iteration++;
    if (iteration >= total) {
      el.textContent = word;
      clearInterval(interval);
    }
  }, 30);
}

function initScramble() {
  const words = document.querySelectorAll('.scramble-word');
  const strip = document.querySelector('.scramble-strip');
  if (!strip || !words.length) return;

  // Start all words as scrambled immediately
  words.forEach(el => {
    const word = el.dataset.word;
    el.textContent = word.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  });

  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        words.forEach((word, i) => {
          setTimeout(() => scrambleWord(word), i * 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(strip);
}

document.addEventListener('DOMContentLoaded', initScramble);
