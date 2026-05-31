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

  // ─── PHASE 1: Particle loader (click to dismiss) ────────────────────────────

  ;(function initLoaderParticles() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const cv  = document.getElementById('loader-canvas');
    const ctx = cv.getContext('2d');
    const dot = document.getElementById('loader-dot');
    let W, H, pts = [], mx = { x: -999, y: -999 }, scattered = false, animT = 0;

    function resize() {
      W = cv.width  = loader.offsetWidth;
      H = cv.height = loader.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawnPts(n, cx, cy, burst) {
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = burst ? (Math.random() * 2.2 + 0.4) : 0;
        pts.push({
          x:  cx != null ? cx + (Math.random() - 0.5) * 380 : Math.random() * W,
          y:  cy != null ? cy + (Math.random() - 0.5) * 120 : Math.random() * H,
          bx: Math.random() * W, by: Math.random() * H,
          vx: burst ? Math.cos(angle) * spd : 0,
          vy: burst ? Math.sin(angle) * spd : 0,
          r:  Math.random() * 1.4 + 0.3,
          a:  Math.random() * 0.36 + 0.07,
          ph: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.003 + 0.001
        });
      }
    }
    spawnPts(115);

    function drawLoop() {
      if (!document.getElementById('loader') ||
          document.getElementById('loader').style.display === 'none') return;
      ctx.clearRect(0, 0, W, H);
      animT += 0.016;
      pts.forEach(p => {
        p.bx += Math.cos(p.ph + animT * p.sp) * 0.18;
        p.by += Math.sin(p.ph + animT * p.sp * 0.75) * 0.14;
        p.bx = Math.max(0, Math.min(W, p.bx));
        p.by = Math.max(0, Math.min(H, p.by));
        const dx   = p.x - mx.x, dy = p.y - mx.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 160) {
          const f = (160 - dist) / 160;
          p.vx += dx / dist * f * 2.8;
          p.vy += dy / dist * f * 2.8;
        }
        const damp = scattered ? 0.93 : 0.76;
        const pull = scattered ? 0.011 : 0.05;
        p.vx += (p.bx - p.x) * pull;
        p.vy += (p.by - p.y) * pull;
        p.vx *= damp; p.vy *= damp;
        p.x += p.vx; p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(drawLoop);
    }
    drawLoop();

    loader.addEventListener('mousemove', e => {
      const r = loader.getBoundingClientRect();
      mx.x = e.clientX - r.left;
      mx.y = e.clientY - r.top;
      dot.style.left = mx.x + 'px';
      dot.style.top  = mx.y + 'px';
    });
    loader.addEventListener('mouseleave', () => { mx.x = -999; mx.y = -999; });

    loader.addEventListener('click', () => {
      if (scattered) return;
      scattered = true;

      const small = document.querySelector('.loader-small');
      const big   = document.querySelector('.loader-big');
      const hint  = document.querySelector('.loader-hint');
      if (small) { small.style.opacity = '0'; small.style.filter = 'blur(10px)'; }
      if (big)   { big.style.opacity   = '0'; big.style.filter   = 'blur(10px)'; }
      if (hint)  { hint.style.opacity  = '0'; hint.style.animation = 'none'; }

      spawnPts(100, W / 2, H * 0.48, true);

      setTimeout(() => { dismissLoader(); }, 1000);
    });

    function dismissLoader() {
      loader.style.transition = 'opacity 0.7s ease';
      loader.style.opacity    = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        startPhase2();   // hand off to story screens; overflow stays locked until Phase 3
      }, 700);
    }
  })();

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
