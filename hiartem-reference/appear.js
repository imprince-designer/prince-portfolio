/**
 * hiartem.com — framer-33mvhw COMPLETE animation reconstruction
 * ═══════════════════════════════════════════════════════════════
 *
 * SOURCES:
 *   Script [7]  var animator = (() => { … })()   — WAAPI engine
 *   Script [8]  __framer__appearAnimationsContent — appear keyframes
 *   Script [10] trigger                           — RAF + animateAppearEffects
 *   framer_page.mjs:
 *     - __framer__transformTargets                — scroll-exit positions
 *     - __framer__spring / __framer__transformTrigger — scroll spring config
 *     - gestureHandlers / enabledGestures         — hover class mechanism
 *     - Framer Motion variants on child elements  — hover child movement
 *
 * ═══════════════════════════════════════════════════════════════
 * BEHAVIOUR SUMMARY:
 *
 * 1. APPEAR (page load, WAAPI once):
 *    Cards fly from scattered positions into resting tilted positions.
 *    Hero text fades+slides up.
 *
 * 2. SCROLL EXIT (continuous, scroll-progress based):
 *    When "scroll-target" div (ref:te = hero content) exits viewport,
 *    cards fly to their exit positions.
 *    __framer__transformTrigger: 'onScrollTarget'  threshold:0
 *    Spring: { bounce:0, damping:60, ease:[.44,0,.56,1], stiffness:500 }
 *    → replicated as scroll-progress lerp + WAAPI snap
 *
 * 3. HOVER (via .hover class, CSS transitions handle child movement):
 *    Framer's gestureHandlers add .hover class on mouseenter/mouseleave.
 *    enabledGestures: { GbJsNMcrF: { hover:true, pressed:true } }
 *    Card bg:   rgba(201,201,201,0.12) → rgba(181,181,181,0.16)
 *    Card 1 children move via CSS (framer-5o7m3p, framer-1onszi5)
 *    Card 2 children move via CSS (framer-nlskxx, framer-jzwcp8)
 *    Card 3 children move via CSS (framer-1soyb7r, framer-1ct5bbn)
 *    Spring: { bounce:0.2, delay:0, duration:0.4, type:'spring' }
 *    → replicated as CSS cubic-bezier(0.34,1.15,0.64,1) 0.4s
 *
 * 4. MOUSE PARALLAX (after appear complete):
 *    Subtle depth-layered cursor follow on the three card containers.
 *
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── 1. APPEAR ANIMATION ────────────────────────────────────────
   *
   * WAAPI exact: element.animate([initial, final], { duration, easing, fill:'both' })
   * Cubic beziers from Script 8 JSON verbatim.
   * ─────────────────────────────────────────────────────────────── */

  const EASE_TEXT  = 'cubic-bezier(0.33, 0.85, 0.56, 1.00)';   /* hero text */
  const EASE_CARDS = 'cubic-bezier(0.18, 1.01, 0.27, 0.99)';   /* springy overshoot */

  /* Resting final transforms — used by appear AND by parallax/scroll-exit as base */
  const RESTING = {
    '11d4yik': 'translateX(-50%) translateX(0px) translateY(0px) rotate(2deg)',
    '1xn3g3i': 'translateX(-50%) translateX(0px) translateY(0px) rotate(-11deg)',
    '1kc9msy': 'translateX(-50%) translateX(0px) translateY(0px) rotate(11deg)',
  };

  const APPEAR_SPECS = [
    {
      id: '1g9oc75',
      el: () => document.querySelector('[data-appear="1g9oc75"]'),
      initial: { opacity: 0.001, transform: 'translateY(56px)' },
      final:   { opacity: 1,     transform: 'translateY(0px)'  },
      duration: 400, easing: EASE_TEXT,
    },
    {
      id: '11d4yik',
      el: () => document.getElementById('card-11d4yik'),
      /* transformTemplate: cp = (e,t) => 'translateX(-50%) ' + t
         initial: x:-186, y:157, rotate:28 */
      initial: { transform: 'translateX(-50%) translateX(-186px) translateY(157px) rotate(28deg)' },
      final:   { transform: RESTING['11d4yik'] },
      duration: 1000, easing: EASE_CARDS,
    },
    {
      id: '1xn3g3i',
      el: () => document.getElementById('card-1xn3g3i'),
      /* initial: x:17, y:147, rotate:11 */
      initial: { transform: 'translateX(-50%) translateX(17px) translateY(147px) rotate(11deg)' },
      final:   { transform: RESTING['1xn3g3i'] },
      duration: 1000, easing: EASE_CARDS,
    },
    {
      id: '1kc9msy',
      el: () => document.getElementById('card-1kc9msy'),
      /* initial: x:183, y:157, rotate:-17 */
      initial: { transform: 'translateX(-50%) translateX(183px) translateY(157px) rotate(-17deg)' },
      final:   { transform: RESTING['1kc9msy'] },
      duration: 1000, easing: EASE_CARDS,
    },
  ];

  function applyStyles(el, styles) {
    for (const [k, v] of Object.entries(styles)) el.style[k] = v;
  }

  function runAppear(spec) {
    const el = spec.el();
    if (!el) return;
    applyStyles(el, spec.initial);
    el.style.willChange = 'transform, opacity';
    requestAnimationFrame(() => {
      const anim = el.animate([spec.initial, spec.final], {
        duration: spec.duration, easing: spec.easing, fill: 'both', iterations: 1,
      });
      anim.onfinish = () => {
        applyStyles(el, spec.final);
        el.style.willChange = 'auto';
      };
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fireAppear() {
    for (const spec of APPEAR_SPECS) {
      if (reducedMotion) { const el = spec.el(); if (el) applyStyles(el, spec.final); }
      else runAppear(spec);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fireAppear);
  else fireAppear();


  /* ── 2. SCROLL EXIT ANIMATION ───────────────────────────────────
   *
   * Source: __framer__transformTrigger: 'onScrollTarget'
   *         __framer__transformViewportThreshold: 0  (fires when 0% visible)
   *         ref: te  (the hero content div — #scroll-target)
   *         __framer__spring: { bounce:0, damping:60, duration:.4,
   *                             ease:[.44,0,.56,1], stiffness:500 }
   *
   * EXIT positions from __framer__transformTargets (index[1]):
   *   Card 1 (11d4yik): { rotate:-25, x:-254, y:-170 }
   *   Card 2 (1xn3g3i): { rotate:35,  x:111,  y:-425 }
   *   Card 3 (1kc9msy): { rotate:45,  x:347,  y:-223 }
   *
   * transformTemplate: cp = (e,t) => 'translateX(-50%) ' + t
   * → exit transform: 'translateX(-50%) translateX(Xpx) translateY(Ypx) rotate(Rdeg)'
   *
   * Implementation:
   *   Use IntersectionObserver on #scroll-target with threshold:0.
   *   When it exits, WAAPI animate cards to exit positions.
   *   When it re-enters, animate back to resting.
   *   Use scroll progress for smooth interpolation during partial visibility.
   * ─────────────────────────────────────────────────────────────── */

  /* Exit positions verbatim from __framer__transformTargets[1].target */
  const EXIT_TARGETS = {
    '11d4yik': { rotate: -25, x: -254, y: -170 },
    '1xn3g3i': { rotate:  35, x:  111, y: -425 },
    '1kc9msy': { rotate:  45, x:  347, y: -223 },
  };

  /* Resting positions as { rotate, x, y } for lerp calculations */
  const REST_VALUES = {
    '11d4yik': { rotate:  2, x: 0, y: 0 },
    '1xn3g3i': { rotate: -11, x: 0, y: 0 },
    '1kc9msy': { rotate:  11, x: 0, y: 0 },
  };

  /* Spring: ease:[.44,0,.56,1] matches cubic-bezier(0.44,0,0.56,1), duration:0.4s */
  const SCROLL_EASE = 'cubic-bezier(0.44, 0, 0.56, 1)';
  const SCROLL_DUR  = 400;

  let scrollAnimsRunning = {};
  let appearDone = false;

  /* Mark appear as done after longest card animation (1000ms) + buffer */
  setTimeout(() => { appearDone = true; }, 1200);

  function buildTransform(id, t) {
    /* transformTemplate: cp = (e,t) => 'translateX(-50%) ' + t
       t = 'translateX(Xpx) translateY(Ypx) rotate(Rdeg)' */
    const v = lerp3(REST_VALUES[id], EXIT_TARGETS[id], t);
    return `translateX(-50%) translateX(${v.x.toFixed(1)}px) translateY(${v.y.toFixed(1)}px) rotate(${v.rotate.toFixed(2)}deg)`;
  }

  function lerp3(a, b, t) {
    return { x: a.x + (b.x - a.x)*t, y: a.y + (b.y - a.y)*t, rotate: a.rotate + (b.rotate - a.rotate)*t };
  }

  /* Eased scroll progress using the source spring cubic-bezier approximation */
  function easedProgress(raw) {
    /* cubic-bezier(0.44, 0, 0.56, 1) approximation via CSS-style calc */
    /* For interpolation purposes, use smooth-step: 3t²-2t³ */
    const t = Math.max(0, Math.min(1, raw));
    return t * t * (3 - 2*t);
  }

  const scrollTarget = document.getElementById('scroll-target');
  const cardIds = ['11d4yik', '1xn3g3i', '1kc9msy'];
  let lastProgress = 0;
  let scrollRaf = null;

  function updateScrollExit() {
    if (!scrollTarget || !appearDone) { scrollRaf = null; return; }

    const rect = scrollTarget.getBoundingClientRect();
    const vh   = window.innerHeight;

    /* Progress: 0 = element fully visible, 1 = element completely scrolled above viewport
       Framer's threshold:0 means it starts exiting as soon as top edge hits viewport top */
    let raw = 0;
    if (rect.bottom <= 0) {
      raw = 1; /* fully gone */
    } else if (rect.top < 0) {
      /* Partially scrolled — how far above viewport is the top edge */
      raw = Math.min(1, -rect.top / (rect.height * 0.5));
    }

    const progress = easedProgress(raw);
    if (Math.abs(progress - lastProgress) < 0.0005) { scrollRaf = null; return; }
    lastProgress = progress;

    for (const id of cardIds) {
      const el = document.getElementById(`card-${id}`);
      if (!el) continue;
      el.style.transform = buildTransform(id, progress);
    }
    scrollRaf = requestAnimationFrame(updateScrollExit);
  }

  window.addEventListener('scroll', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollExit);
  }, { passive: true });

  /* Also trigger on resize */
  window.addEventListener('resize', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollExit);
  }, { passive: true });


  /* ── 3. HOVER CLASS MECHANISM ───────────────────────────────────
   *
   * Source (framer_page.mjs):
   *   enabledGestures: {
   *     GbJsNMcrF: { hover:true, pressed:true },   ← Card 1
   *     RVJuN_zzR: { hover:true, pressed:true? },  ← Card 2
   *     nVzzvBDgu: { hover:true }                  ← Card 3
   *   }
   *   gestureHandlers = K({...}).gestureHandlers
   *
   * Framer's K() (useHoverGestures) attaches listeners and adds/removes
   * the '.hover' class on the root element.  We replicate this exactly:
   *   mouseenter → add .hover to .glass-card
   *   mouseleave → remove .hover from .glass-card
   *   pointerdown → add .pressed
   *   pointerup   → remove .pressed
   *
   * CSS then handles all child movements via .framer-vquiZ.hover .framer-5o7m3p etc.
   * Spring-approximated transition on each child (CSS var --spring-hover).
   * ─────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => { card.classList.remove('hover'); card.classList.remove('pressed'); });
    card.addEventListener('pointerdown', () => card.classList.add('pressed'));
    card.addEventListener('pointerup',   () => card.classList.remove('pressed'));
    card.addEventListener('pointercancel', () => { card.classList.remove('hover'); card.classList.remove('pressed'); });
  });


  /* ── 4. MOUSE PARALLAX ──────────────────────────────────────────
   *
   * Framer's runtime adds cursor-follow depth to floating cards.
   * Replicated with smooth lerp per card at different depth factors.
   * Only activates after appear animations complete (1.2s).
   * When scroll progress > 0 (cards exiting), parallax is disabled.
   * ─────────────────────────────────────────────────────────────── */
  const PARALLAX_DEFS = [
    { id: 'card-11d4yik', depth: 14, rest: REST_VALUES['11d4yik'] },
    { id: 'card-1xn3g3i', depth:  9, rest: REST_VALUES['1xn3g3i'] },
    { id: 'card-1kc9msy', depth: 18, rest: REST_VALUES['1kc9msy'] },
  ];

  const pState = PARALLAX_DEFS.map(() => ({ x:0, y:0, tx:0, ty:0 }));
  let pRaf = null;
  let parallaxReady = false;
  setTimeout(() => { parallaxReady = true; }, 1200);

  function tickParallax() {
    const L = 0.07;
    let dirty = false;
    PARALLAX_DEFS.forEach((def, i) => {
      const s = pState[i];
      s.x += (s.tx - s.x) * L;
      s.y += (s.ty - s.y) * L;
      if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05) dirty = true;
      /* Only apply parallax when not in scroll-exit mode */
      if (lastProgress < 0.02) {
        const el = document.getElementById(def.id);
        if (!el) return;
        const r = def.rest;
        el.style.transform = `translateX(-50%) translateX(${s.x.toFixed(2)}px) translateY(${s.y.toFixed(2)}px) rotate(${r.rotate}deg)`;
      }
    });
    pRaf = dirty ? requestAnimationFrame(tickParallax) : null;
  }

  document.addEventListener('mousemove', e => {
    if (!parallaxReady || lastProgress > 0.02) return;
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    PARALLAX_DEFS.forEach((def, i) => {
      pState[i].tx = nx * def.depth;
      pState[i].ty = ny * def.depth * 0.65;
    });
    if (!pRaf) pRaf = requestAnimationFrame(tickParallax);
  });

  document.addEventListener('mouseleave', () => {
    PARALLAX_DEFS.forEach((_, i) => { pState[i].tx = 0; pState[i].ty = 0; });
    if (!pRaf) pRaf = requestAnimationFrame(tickParallax);
  });


  /* ── 5. NAV ACTIVE STATE ─────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(l => {
        const href = l.getAttribute('href').slice(1);
        l.classList.toggle('active', href === id || (href === 'hero' && id === 'hero'));
      });
    });
  }, { threshold: 0.35 })
  .observe(document.getElementById('hero'));

})();
