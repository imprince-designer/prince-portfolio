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

  var screenBgs = ['#0E0E0D', '#0F1117', '#100E14', '#0E1210', '#0D1020'];

  var currentScreen = 0;

  // Give GSAP a concrete inline starting value so bg transitions always work (BUG 3)
  gsap.set(heroIntro, { backgroundColor: '#0E0E0D' });

  // Lock body scroll, fix the section to viewport, hide chatbot
  document.body.style.overflow = 'hidden';
  document.body.classList.add('intro-phase');
  heroIntro.classList.add('phase-active');

  var chatWidget = document.getElementById('ai-widget');
  if (chatWidget) chatWidget.style.display = 'none';

  // ─── PHASE 1: Loader overlay ────────────────────────────────────────────────

  var overlay  = document.createElement('div');
  var loadLine = document.createElement('div');
  var loadText = document.createElement('p');

  overlay.id         = 'intro-overlay';
  loadLine.className = 'hi-load-line';
  loadText.textContent = '6 years in product design teaches you one uncomfortable truth.';

  overlay.appendChild(loadLine);
  overlay.appendChild(loadText);
  document.body.appendChild(overlay);

  Object.assign(overlay.style, {
    position: 'fixed', inset: '0',
    backgroundColor: '#0E0E0D',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: '9998', gap: '20px',
  });

  Object.assign(loadLine.style, {
    width: '1px', height: '48px',
    background: '#FAFAF8', opacity: '0',
  });

  Object.assign(loadText.style, {
    fontFamily: "'Gabarito', sans-serif",
    fontSize: '22px', fontWeight: '500',
    color: '#FAFAF8', opacity: '0',
    textAlign: 'center', maxWidth: '480px',
    padding: '0 24px', lineHeight: '1.6',
  });

  // Line in → text fades in over 1.2s → hold 1.8s → overlay fades out 0.8s
  gsap.fromTo(loadLine, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.inOut' });
  gsap.fromTo(loadText, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.3, ease: 'power2.inOut' });

  // Start fade-out at: 0.3 + 1.2 + 1.8 = 3.3s after init
  setTimeout(function () {
    gsap.to(overlay, {
      opacity: 0, duration: 0.8, ease: 'power2.inOut',
      onComplete: function () { overlay.remove(); startPhase2(); }
    });
  }, 3300);

  // ─── PHASE 2: Story screens ─────────────────────────────────────────────────

  function startPhase2() {
    hiProgress.classList.add('visible');
    // Also drive opacity via GSAP in case CSS transition doesn't fire (BUG 4)
    gsap.to(hiProgress, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(hiStory, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    showScreen(0, true);
  }

  function showScreen(index, isFirst) {
    currentScreen = index;

    // Transition section background colour
    gsap.to(heroIntro, { backgroundColor: screenBgs[index], duration: 0.8, ease: 'power2.inOut' });

    // Fill progress bars up to (but not including) current screen
    for (var i = 0; i < 5; i++) {
      var fill = document.getElementById('hpb' + i);
      if (fill) fill.classList.toggle('done', i < index);
    }

    var newText = screens[index];
    var headlineColor = index === 4 ? '#4F8EF7' : '#FAFAF8';

    if (isFirst) {
      gsap.set(hiGhost, { opacity: 0 });
      hiGhost.textContent = '';
      hiHeadline.textContent = newText;
      hiHeadline.style.color = headlineColor;
      gsap.fromTo(hiHeadline,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
      );
    } else {
      // Page-turn: outgoing slides up, incoming slides up from below
      gsap.to(hiHeadline, {
        opacity: 0, y: -32, duration: 0.45, ease: 'power2.in',
        onComplete: function () {
          // Ghost fades in with previous line
          gsap.set(hiGhost, { opacity: 0 });
          hiGhost.textContent = screens[index - 1];
          gsap.fromTo(hiGhost,
            { opacity: 0 },
            { opacity: 0.18, duration: 0.5, ease: 'power2.out' }
          );

          // New headline rises in
          hiHeadline.textContent = newText;
          hiHeadline.style.color = headlineColor;
          gsap.fromTo(hiHeadline,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }
          );
        }
      });
    }

    hiArrow.textContent   = index === 4 ? '✓' : '→';
    hiArrow.style.borderColor = index === 4 ? 'rgba(255,255,255,0.5)' : '';
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
    for (var i = 0; i < 5; i++) {
      var fill = document.getElementById('hpb' + i);
      if (fill) fill.classList.add('done');
    }

    gsap.to(hiStory, {
      opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: function () {
        hiStory.style.display = 'none';
        gsap.to(hiProgress, { opacity: 0, duration: 0.3 });

        // Clear GSAP inline bg so CSS .revealed takes effect (BUG 1)
        heroIntro.style.position = 'relative';
        heroIntro.style.height = 'auto';
        heroIntro.style.backgroundColor = '';
        heroIntro.style.removeProperty('background-color');
        gsap.set(heroIntro, { clearProps: 'background,backgroundColor' });

        // Unfix the section, switch to theme background
        heroIntro.classList.remove('phase-active');
        heroIntro.classList.add('revealed');

        // Restore scroll + page visibility + chatbot
        document.body.style.overflow = '';
        document.body.classList.remove('intro-phase');
        if (chatWidget) chatWidget.style.display = '';

        // Fade nav in
        if (nav) {
          gsap.set(nav, { opacity: 0 });
          gsap.to(nav, { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' });
        }

        // Fade reveal panel in
        hiReveal.style.display = 'flex';
        gsap.fromTo(hiReveal,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );

        startTypewriter();

        // Init Lenis only after reveal settles
        setTimeout(function () {
          if (window.Lenis) {
            var lenis = new Lenis({
              duration: 1.1,
              easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
              smooth: true,
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
          }
        }, 800);
      }
    });
  }

  function startTypewriter() {
    var fullText = "Hello! I'm Prince — I bring ideas and products to life, whether through immersive interactive screens or websites, mobile apps designed for seamless user experiences.";
    var typeEl   = document.getElementById('hiTypeText');
    var cursor   = document.getElementById('hiCursor');
    if (!typeEl) return;
    var i = 0;
    var iv = setInterval(function () {
      if (i < fullText.length) { typeEl.textContent += fullText[i]; i++; }
      else { clearInterval(iv); if (cursor) cursor.style.display = 'none'; }
    }, 35);
  }

})();
