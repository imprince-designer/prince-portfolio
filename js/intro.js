(function () {
  if (!document.getElementById('heroIntro')) return;

  // Skip intro if already seen this session
  if (sessionStorage.getItem('introSeen')) {
    document.body.style.overflow = 'auto';
    const nav = document.getElementById('nav');
    if (nav) nav.style.visibility = 'visible';
    const heroIntro = document.getElementById('heroIntro');
    if (heroIntro) heroIntro.style.display = 'none';
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    const reveal = document.getElementById('hiReveal');
    if (reveal) {
      reveal.style.display = 'flex';
      reveal.style.minHeight = '100vh';
      reveal.style.flexDirection = 'column';
      reveal.style.alignItems = 'center';
      reveal.style.justifyContent = 'center';
    }
    const chatWidget = document.getElementById('ai-widget');
    if (chatWidget) chatWidget.style.display = '';
    const cursor = document.getElementById('hiCursor');
    if (cursor) cursor.style.display = 'none';
    return;
  }
  sessionStorage.setItem('introSeen', 'true');

  // Lock scroll and hide nav + chatbot while intro is active
  document.body.style.overflow = 'hidden';
  var nav = document.getElementById('nav');
  if (nav) nav.style.visibility = 'hidden';
  var chatWidget = document.getElementById('ai-widget');
  if (chatWidget) chatWidget.style.display = 'none';

  // ─── LOADER: Particle field (click to dismiss) ────────────────────────────

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

    // Show screen 1 content inside loader immediately
    const loaderText = document.createElement('div');
    loaderText.id = 'loader-story-text';
    loaderText.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;z-index:2;text-align:center;padding:48px;font-family:Gabarito,sans-serif;';
    loaderText.innerHTML = `
      <div style="font-size:13px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.32);margin-bottom:14px">6+ years in product design teaches you</div>
      <div style="font-size:42px;font-weight:600;color:#fff;line-height:1.18;letter-spacing:-0.02em">uncomfortable truths.</div>
      <div style="margin-top:40px;display:flex;gap:16px;pointer-events:all">
        <button onclick="document.getElementById('loader').click()" style="padding:11px 26px;border-radius:100px;border:1px solid rgba(255,255,255,0.28);background:transparent;color:rgba(255,255,255,0.75);font-size:13px;font-family:Gabarito,sans-serif;font-weight:500;cursor:pointer;">Reveal the truth</button>
        <button onclick="document.getElementById('loader').click()" style="width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fff;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;">→</button>
      </div>`;
    loader.appendChild(loaderText);

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

      const lst = document.getElementById('loader-story-text');
      if (lst) { lst.style.transition = 'opacity 0.4s'; lst.style.opacity = '0'; }
      spawnPts(100, W / 2, H * 0.48, true);
      setTimeout(() => { dismissLoader(); }, 1000);
    });

    function dismissLoader() {
      loader.style.transition = 'opacity 0.7s ease';
      loader.style.opacity    = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }
  })();

  // ─── HERO SCREENS: Canvas particle field + story slides ──────────────────────

  ;(function initHeroScreens() {
    const section = document.querySelector('.hero-intro') || document.getElementById('heroIntro');
    if (!section) return;

    const canvas = document.getElementById('hi-canvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const hlEl   = document.getElementById('hiHl');
    const btnsEl = document.getElementById('hiBtns');
    const dot    = document.getElementById('hiDot');

    const screens = [
      {
        html: 'Not every design problem<br>needs a design solution.',
        allBlue: false,
        bg: '#0F1117',
        ptint: [165, 175, 225],
        cta: null,
        arr: true
      },
      {
        html: 'Perfect is often<br>the enemy of shipped.',
        allBlue: false,
        bg: '#100E14',
        ptint: [188, 172, 218],
        cta: null,
        arr: true
      },
      {
        html: 'Data points the way.<br><span class="hi-dim">Judgment makes the call.</span>',
        allBlue: false,
        bg: '#0E1210',
        ptint: [168, 208, 182],
        cta: null,
        arr: true
      },
      {
        html: 'Alignment is harder<br>than execution.',
        allBlue: false,
        bg: '#0D0F1A',
        ptint: [155, 168, 245],
        cta: null,
        arr: true
      },
      {
        html: 'I design for<br>these realities.',
        allBlue: true,
        bg: '#0A0D1E',
        ptint: [140, 158, 255],
        cta: null,
        arr: 'check'
      }
    ];

    let cur = 0, busy = false, animT = 0, breatheT = 0;
    let W, H, pts = [];
    let ct = { r: 165, g: 175, b: 225 };
    let tt = { r: 165, g: 175, b: 225 };
    let mx = { x: -999, y: -999 };

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 110; i++) {
      pts.push({
        x: Math.random() * 1400, y: Math.random() * 900,
        bx: Math.random() * 1400, by: Math.random() * 900,
        vx: 0, vy: 0,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.3 + 0.06,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.003 + 0.001
      });
    }

    function buildBtns(s) {
      btnsEl.innerHTML = '';
      if (s.cta) {
        const b = document.createElement('button');
        b.className = 'hi-cta';
        b.textContent = s.cta;
        b.onclick = () => go(cur + 1, true);
        btnsEl.appendChild(b);
      }
      if (s.arr) {
        const a = document.createElement('button');
        a.className = 'hi-arr' + (s.arr === 'check' ? ' blue' : '');
        a.innerHTML = s.arr === 'check' ? '✓' : '→';
        a.onclick = () => {
          if (s.arr === 'check') {
            revealHero();
          } else {
            go(cur + 1, true);
          }
        };
        btnsEl.appendChild(a);
      }
    }

    function renderScreen(idx, animate) {
      const s = screens[idx];
      section.style.background = s.bg;
      tt = { r: s.ptint[0], g: s.ptint[1], b: s.ptint[2] };

      if (animate) {
        hlEl.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
        hlEl.style.opacity    = '0';
        setTimeout(() => {
          hlEl.innerHTML  = s.html;
          hlEl.className  = 'hi-hl' + (s.allBlue ? ' all-blue' : '');
          buildBtns(s);
          breatheT = 0;
          hlEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            hlEl.style.opacity   = '1';
            hlEl.style.transform = 'scale(1)';
          }));
        }, 320);
      } else {
        hlEl.innerHTML = s.html;
        hlEl.className = 'hi-hl' + (s.allBlue ? ' all-blue' : '');
        buildBtns(s);
      }
    }

    function go(idx, animate) {
      if (idx < 0) return;
      if (idx >= screens.length) {   // always allow reveal, bypasses busy guard
        revealHero();
        return;
      }
      if (busy) return;
      busy = true;
      const dir = idx > cur ? -20 : 20;
      hlEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      hlEl.style.opacity    = '0';
      hlEl.style.transform  = `translateY(${dir}px)`;
      cur = idx;
      renderScreen(cur, animate);
      setTimeout(() => { busy = false; }, 750);
    }

    function revealHero() {
      const section = document.querySelector('.hero-intro') || document.getElementById('heroIntro');
      section.style.transition = 'opacity 0.8s ease';
      section.style.opacity = '0';
      setTimeout(() => {
        section.style.display = 'none';
        document.body.style.overflow = 'auto';
        const nav = document.querySelector('nav') || document.getElementById('nav');
        if (nav) nav.style.visibility = 'visible';
        const chatWidget = document.getElementById('ai-widget');
        if (chatWidget) chatWidget.style.display = '';
        const reveal = document.getElementById('hiReveal');
        if (reveal) reveal.style.display = 'flex';
        const typed = document.getElementById('hiTyped');
        const cursor = document.getElementById('hiCursor');
        if (typed) {
          typed.textContent = '';
          typed.parentElement.style.color = '#797979';
          const text = "Hello! I'm Prince, I bring ideas and products to life, whether through immersive interactive screens or websites, mobile apps designed for seamless user experiences.";
          let i = 0;
          const type = () => {
            if (i < text.length) { typed.textContent += text[i++]; setTimeout(type, 35); }
          };
          type();
        }
      }, 800);
    }

    renderScreen(0, false);
    document.getElementById('hiOv').style.opacity = '1';
    document.getElementById('hiOv').style.visibility = 'visible';

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === ' ') go(cur + 1, true);
      if (e.key === 'ArrowLeft') go(cur - 1, true);
    });

    section.addEventListener('mousemove', e => {
      const r  = section.getBoundingClientRect();
      mx.x = e.clientX - r.left;
      mx.y = e.clientY - r.top;
      dot.style.left = mx.x + 'px';
      dot.style.top  = mx.y + 'px';
    });
    section.addEventListener('mouseleave', () => { mx.x = -999; mx.y = -999; });

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      animT   += 0.016;
      breatheT += 0.016;

      ct.r += (tt.r - ct.r) * 0.022;
      ct.g += (tt.g - ct.g) * 0.022;
      ct.b += (tt.b - ct.b) * 0.022;

      pts.forEach(p => {
        p.bx += Math.cos(p.ph + animT * p.sp) * 0.16;
        p.by += Math.sin(p.ph + animT * p.sp * 0.8) * 0.13;
        p.bx = Math.max(0, Math.min(W, p.bx));
        p.by = Math.max(0, Math.min(H, p.by));
        const dx   = p.x - mx.x, dy = p.y - mx.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 160) {
          const f = (160 - dist) / 160;
          p.vx += dx / dist * f * 2.8;
          p.vy += dy / dist * f * 2.8;
        }
        p.vx += (p.bx - p.x) * 0.045;
        p.vy += (p.by - p.y) * 0.045;
        p.vx *= 0.78; p.vy *= 0.78;
        p.x += p.vx; p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(ct.r)},${Math.round(ct.g)},${Math.round(ct.b)},${p.a})`;
        ctx.fill();
      });

      if (hlEl.style.opacity !== '0') {
        const s = 1 + Math.sin(breatheT * 0.22) * 0.02;
        hlEl.style.transform = `scale(${s})`;
      }

      requestAnimationFrame(loop);
    })();
  })();

})();
