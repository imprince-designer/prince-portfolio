const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scrambleWord(el) {
  const word = el.dataset.word;
  let iteration = 0;
  const total = word.length * 6;

  const interval = setInterval(() => {
    el.textContent = word
      .split('')
      .map((letter, i) => {
        if (i < Math.floor(iteration / 6)) return letter;
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
  if (!strip) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((word, i) => {
          setTimeout(() => scrambleWord(word), i * 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(strip);
}

document.addEventListener('DOMContentLoaded', initScramble);
