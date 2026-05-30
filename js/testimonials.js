const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testimonialsDots');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  const dots = dotsContainer.querySelectorAll('.testimonials-dot');
  let cur = 0;
  let autoplay;
  let startX = 0;
  const visible = window.innerWidth < 768 ? 1 : 2;
  const max = cards.length - visible;

  function goTo(i) {
    cur = Math.max(0, Math.min(i, max));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = 'translateX(-' + (cur * cardW) + 'px)';
    dots.forEach((d, idx) => d.classList.toggle('active', idx === cur));
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(cur < max ? cur + 1 : 0), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(cur - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(cur + 1); startAutoplay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(cur + 1) : goTo(cur - 1);
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}
