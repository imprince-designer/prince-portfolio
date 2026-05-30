const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoplay;
  let startX = 0;

  // Apply ql span colours from data-color
  cards.forEach(card => {
    const ql = card.querySelector('.testimonial-ql');
    if (ql) {
      const color = ql.dataset.color;
      ql.querySelectorAll('span').forEach(span => {
        span.style.background = color;
      });
    }
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}
