let decisionCurrent = 0;

function nextDecision(step) {
  const currentEl = document.getElementById('dstep' + step);
  const nextEl = document.getElementById('dstep' + (step + 1));
  if (!currentEl || !nextEl) return;

  // Animate out
  currentEl.style.opacity = '0';
  currentEl.style.transform = 'translateY(-12px)';
  currentEl.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    currentEl.classList.remove('active');
    currentEl.style.opacity = '';
    currentEl.style.transform = '';
    currentEl.style.transition = '';

    nextEl.classList.add('active');
    decisionCurrent = step + 1;

    // Update progress dots
    for (let i = 0; i <= 3; i++) {
      const dot = document.getElementById('dpd' + i);
      if (!dot) continue;
      dot.classList.remove('done', 'active');
      if (i < decisionCurrent) dot.classList.add('done');
      else if (i === decisionCurrent) dot.classList.add('active');
    }
  }, 280);
}

// Make globally accessible
window.nextDecision = nextDecision;
