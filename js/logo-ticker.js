(function() {
  const track = document.getElementById('logoTrack');
  if (!track) return;
  let x = 0;
  const speed = 0.5;
  let paused = false;
  let halfWidth = 0;

  window.addEventListener('load', function() {
    halfWidth = track.scrollWidth / 2;
  });

  track.querySelectorAll('.logo-tick').forEach(logo => {
    logo.addEventListener('mouseenter', () => { paused = true; });
    logo.addEventListener('mouseleave', () => { paused = false; });
  });

  function tick() {
    if (!paused && halfWidth > 0) {
      x -= speed;
      if (Math.abs(x) >= halfWidth) x = 0;
      track.style.transform = 'translateX(' + x + 'px)';
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
