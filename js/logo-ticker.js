(function() {
  function startTicker() {
    const track = document.getElementById('logoTrack');
    if (!track) return;
    let x = 0;
    const speed = 0.5;
    let paused = false;
    let halfWidth = track.scrollWidth / 2;

    track.querySelectorAll('.logo-tick').forEach(logo => {
      logo.addEventListener('mouseenter', () => { paused = true; });
      logo.addEventListener('mouseleave', () => { paused = false; });
    });

    function tick() {
      if (!paused) {
        x -= speed;
        if (Math.abs(x) >= halfWidth) x = 0;
        track.style.transform = 'translateX(' + x + 'px)';
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  // For session skip — hiReveal already visible on load
  const reveal = document.getElementById('hiReveal');
  if (reveal && reveal.style.display !== 'none') {
    startTicker();
    return;
  }

  // For first time users — start ticker when hiReveal becomes visible
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.target.style.display === 'flex') {
        setTimeout(startTicker, 100);
        observer.disconnect();
      }
    });
  });

  if (reveal) {
    observer.observe(reveal, { attributes: true, attributeFilter: ['style'] });
  }
})();
