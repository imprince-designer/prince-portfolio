/* ============================================================
   Draggable carousel — hiartem.com reference
   Uses GSAP for smooth kinetic scrolling.
   ============================================================ */

(function () {
  'use strict';

  const viewport  = document.getElementById('carouselViewport');
  const track     = document.getElementById('carouselTrack');
  const dots      = document.querySelectorAll('.dot');
  const counter   = document.getElementById('carouselCounter');
  const navLinks  = document.querySelectorAll('.nav-link');
  const dragHint  = document.getElementById('dragHint');

  if (!viewport || !track) return;

  /* ── State ── */
  let isDragging    = false;
  let startX        = 0;
  let startTransX   = 0;
  let velX          = 0;
  let lastX         = 0;
  let rafId         = null;
  let currentIndex  = 0;
  let hasDragged    = false;

  /* ── Measure ── */
  function cardGap()    { return 16; }
  function cardWidth()  { return track.children[0]?.offsetWidth ?? 340; }
  function maxOffset()  {
    const total = track.scrollWidth + 32; // 32 = right padding
    return -(total - viewport.offsetWidth);
  }

  /* ── Clamp with soft spring at edges ── */
  function clamp(val, lo, hi) {
    if (val > 0)  return val * 0.15;
    if (val < hi) return hi + (val - hi) * 0.15;
    return val;
  }

  /* ── Get transform X from element ── */
  function getTransX() {
    const m = new WebKitCSSMatrix(getComputedStyle(track).transform);
    return m.m41;
  }

  /* ── Snap to closest card ── */
  function snapToIndex(idx) {
    const cards    = track.children;
    const count    = cards.length;
    idx            = Math.max(0, Math.min(count - 1, idx));
    currentIndex   = idx;

    const card     = cards[idx];
    const trackPad = 32; // left padding of track
    const target   = -(card.offsetLeft - trackPad);
    const maxOff   = maxOffset();
    const clamped  = Math.max(maxOff, Math.min(0, target));

    gsap.to(track, {
      x: clamped,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: () => updateActiveByX(getTransX()),
    });

    setActiveDot(idx);
    updateCounter(idx + 1, count);
  }

  function updateActiveByX(x) {
    const cw    = cardWidth() + cardGap();
    const idx   = Math.round(-x / cw);
    const cards = track.children;
    setActiveDot(Math.max(0, Math.min(cards.length - 1, idx)));
  }

  /* ── Dots ── */
  function setActiveDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => snapToIndex(+dot.dataset.dot));
  });

  /* ── Counter ── */
  function updateCounter(current, total) {
    const el = counter?.querySelector('.counter-current');
    if (el) el.textContent = String(current).padStart(2, '0');
  }

  /* ── Pointer drag (mouse + touch) ── */
  viewport.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup',   onUp);
  window.addEventListener('pointercancel', onUp);

  function onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging  = true;
    startX      = e.clientX;
    startTransX = getTransX();
    velX        = 0;
    lastX       = e.clientX;
    gsap.killTweensOf(track);
    viewport.setPointerCapture(e.pointerId);
    cancelAnimationFrame(rafId);
  }

  function onMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) hasDragged = true;

    velX  = e.clientX - lastX;
    lastX = e.clientX;

    const next = clamp(startTransX + dx, maxOffset(), 0);
    gsap.set(track, { x: next });
  }

  function onUp(e) {
    if (!isDragging) return;
    isDragging = false;

    if (!hasDragged) { hasDragged = false; return; }
    hasDragged = false;

    /* Kinetic flick */
    const cw      = cardWidth() + cardGap();
    const curX    = getTransX();
    const flicked = curX + velX * 6; // momentum projection
    const idx     = Math.round(-flicked / cw);

    snapToIndex(idx);
  }

  /* ── Touch swipe (passive-safe) ── */
  let touchStartX = 0;
  let touchStartY = 0;
  let touchActive = false;

  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
    gsap.killTweensOf(track);
  }, { passive: true });

  viewport.addEventListener('touchmove', e => {
    if (!touchActive) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx)) { touchActive = false; return; }
    e.preventDefault();
    const next = clamp(getTransX() + dx * 0.6, maxOffset(), 0);
    gsap.set(track, { x: next });
    touchStartX = e.touches[0].clientX;
  }, { passive: false });

  viewport.addEventListener('touchend', e => {
    if (!touchActive) return;
    touchActive = false;
    const cw  = cardWidth() + cardGap();
    const idx = Math.round(-getTransX() / cw);
    snapToIndex(idx);
  }, { passive: true });

  /* ── Card click (navigate) — only when not dragging ── */
  track.addEventListener('click', e => {
    if (hasDragged) return;
    const card = e.target.closest('.work-card');
    if (card) {
      const idx = +card.dataset.index;
      snapToIndex(idx);
    }
  });

  /* ── Keyboard nav ── */
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') snapToIndex(currentIndex + 1);
    if (e.key === 'ArrowLeft')  snapToIndex(currentIndex - 1);
  });

  /* ── Nav active state on scroll ── */
  const sections = ['hero','work','story','testimonials','contact'];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id || (entry.target.id === 'hero' && l.dataset.section === 'work')));
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  /* ── Hide drag hint after first interaction ── */
  viewport.addEventListener('pointerdown', () => {
    if (dragHint) dragHint.classList.add('hidden');
  }, { once: true });

  /* ── Hero entrance animation ── */
  gsap.fromTo('.hero-badge', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
  gsap.fromTo('.hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' });
  gsap.fromTo('.hero-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: 'power2.out' });
  gsap.fromTo('.hero-stats', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' });

  /* ── Work cards stagger on scroll enter ── */
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = track.querySelectorAll('.work-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
        );
        cardObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const workSection = document.getElementById('work');
  if (workSection) cardObserver.observe(workSection);

  /* ── Initial setup ── */
  gsap.set(track, { x: 0 });

})();
