(function () {
  if (!document.getElementById('heroIntro')) return;

  var nav        = document.getElementById('nav');
  var heroIntro  = document.getElementById('heroIntro');
  var hiStory    = document.getElementById('hiStory');
  var hiReveal   = document.getElementById('hiReveal');
  var hiProgress = document.getElementById('hiProgress');
  var hiGhost    = document.getElementById('hiGhost');
  var hiHeadline = document.getElementById('hiHeadline');
  var hiArrow    = document.getElementById('hiArrow');

  var screens = [
    "Not every design problem needs a design solution.",
    "Perfect is often the enemy of shipped.",
    "Data points the way. Judgment makes the call.",
    "Alignment is harder than execution.",
    "I design for these realities."
  ];

  var currentScreen = 0;

  // Hide nav + all page sections except the hero during phases 1 & 2
  document.body.classList.add('intro-phase');

  // ─── PHASE 1: Loader overlay ────────────────────────────────────────────────

  var overlay = document.createElement('div');
  overlay.id = 'intro-overlay';

  var loadLine = document.createElement('div');
  loadLine.className = 'hi-load-line';

  var loadText = document.createElement('p');
  loadText.className = 'hi-load-text';
  loadText.textContent = '6 years in product design teaches you one uncomfortable truth.';

  overlay.appendChild(loadLine);
  overlay.appendChild(loadText);
  document.body.appendChild(overlay);

  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: '#0E0E0D',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9998',
    gap: '20px',
  });

  Object.assign(loadLine.style, {
    width: '1px',
    height: '48px',
    background: '#FAFAF8',
    opacity: '0',
  });

  Object.assign(loadText.style, {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    color: '#FAFAF8',
    opacity: '0',
    textAlign: 'center',
    maxWidth: '400px',
    padding: '0 24px',
    lineHeight: '1.6',
  });

  gsap.to(loadLine, { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.2 });
  gsap.to(loadText, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.5 });

  setTimeout(function () {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: function () {
        overlay.remove();
        startPhase2();
      }
    });
  }, 2500);

  // ─── PHASE 2: Story screens ─────────────────────────────────────────────────

  function startPhase2() {
    hiProgress.classList.add('visible');
    gsap.to(hiStory, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    showScreen(0, true);
  }

  function showScreen(index, isFirst) {
    currentScreen = index;

    // Fill progress bars for every completed screen
    for (var i = 0; i < 5; i++) {
      var fill = document.getElementById('hpb' + i);
      if (fill) fill.classList.toggle('done', i < index);
    }

    // Ghost text: the previous screen's line (empty on screen 0)
    if (hiGhost) hiGhost.textContent = index > 0 ? screens[index - 1] : '';

    var newText = screens[index];
    var isBlue  = index === 4;

    if (isFirst) {
      hiHeadline.textContent = newText;
      hiHeadline.style.color = '#FAFAF8';
      gsap.fromTo(hiHeadline,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    } else {
      gsap.to(hiHeadline, {
        opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
        onComplete: function () {
          hiHeadline.textContent = newText;
          hiHeadline.style.color = isBlue ? '#285DC6' : '#FAFAF8';
          gsap.fromTo(hiHeadline,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
    }

    // Arrow: ✓ on the last screen, → otherwise
    hiArrow.textContent = index === 4 ? '✓' : '→';
    hiArrow.style.borderColor = index === 4
      ? 'rgba(255,255,255,0.5)'
      : '';
  }

  hiArrow.addEventListener('click', function () {
    if (currentScreen < 4) {
      var fill = document.getElementById('hpb' + currentScreen);
      if (fill) fill.classList.add('done');
      showScreen(currentScreen + 1, false);
    } else {
      startPhase3();
    }
  });

  // ─── PHASE 3: Reveal ────────────────────────────────────────────────────────

  function startPhase3() {
    // Fill all 5 progress bars
    for (var i = 0; i < 5; i++) {
      var fill = document.getElementById('hpb' + i);
      if (fill) fill.classList.add('done');
    }

    gsap.to(hiStory, {
      opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: function () {
        hiStory.style.display = 'none';
        gsap.to(hiProgress, { opacity: 0, duration: 0.3 });

        // Switch hero background to the current theme
        heroIntro.classList.add('revealed');

        // Fade in the reveal panel
        hiReveal.style.display = 'flex';
        gsap.fromTo(hiReveal,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );

        // Show nav + rest of page
        document.body.classList.remove('intro-phase');
        if (nav) {
          gsap.set(nav, { opacity: 0 });
          gsap.to(nav, { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' });
        }

        startTypewriter();

        // Init Lenis smooth scroll once the reveal animation has settled
        setTimeout(function () {
          if (window.Lenis) {
            var lenis = new Lenis({
              duration: 1.2,
              easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
          }
        }, 800);
      }
    });
  }

  function startTypewriter() {
    var fullText  = "Hello! I'm Prince — I bring ideas and products to life, whether through immersive interactive screens or websites, mobile apps designed for seamless user experiences.";
    var typeEl    = document.getElementById('hiTypeText');
    var cursor    = document.getElementById('hiCursor');
    if (!typeEl) return;
    var i = 0;
    var interval = setInterval(function () {
      if (i < fullText.length) {
        typeEl.textContent += fullText[i];
        i++;
      } else {
        clearInterval(interval);
        if (cursor) cursor.style.display = 'none';
      }
    }, 35);
  }

})();
