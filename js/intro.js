// INTRO ANIMATION
// A single line fades in letter by letter,
// holds for a moment, then the page reveals.
// Runs only on the homepage, only on first visit.

(function () {

  // Only run on homepage
  if (!document.querySelector('.hero')) return;

  const phrase = "Designing what matters.";
  const duration = 2000; // how long intro shows (ms)

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.innerHTML = `<p id="intro-text"></p>`;
  document.body.appendChild(overlay);

  // Style it via JS (no extra CSS file needed)
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'var(--color-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9998',
    transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
  });

  const text = document.getElementById('intro-text');
  Object.assign(text.style, {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    fontWeight: '500',
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    overflow: 'hidden',
  });

  // Type the phrase letter by letter
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < phrase.length) {
      text.textContent += phrase[i];
      i++;
    } else {
      clearInterval(typeInterval);
      // Hold, then fade out
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          // Trigger scroll animations after overlay gone
          document.querySelectorAll('.reveal').forEach(el => {
            el.style.transition = 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)';
          });
        }, 600);
      }, duration);
    }
  }, 55); // speed of typing (ms per letter)

})();