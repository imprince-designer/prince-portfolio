/**
 * hiartem.com — framer-33mvhw appear animation reconstruction
 *
 * This implements the exact animation behaviour extracted from:
 *   Script [7]  — var animator = (() => { … })()
 *   Script [8]  — JSON config read via window.__framer__appearAnimationsContent
 *   Script [10] — the trigger: animator.animateAppearEffects(…)
 *
 * Framer's animator uses the Web Animation API (WAAPI).  We replicate
 * the spring‑eased appear exactly by using the cubic‑bezier values from
 * the JSON config and calling element.animate() the same way Framer does.
 *
 * ─── Extracted keyframe data (Script 8) ───────────────────────────────
 *
 * "1g9oc75" (hero text block)
 *   initial → animate:
 *     opacity: 0.001  → 1
 *     y:       56     → 0
 *   transition: { duration: 0.4, ease: [0.33, 0.85, 0.56, 1], type:"tween" }
 *
 * "11d4yik" (Card 1 — "Where I help")
 *   initial → animate:
 *     x: -186,  y: 157,  rotate: 28  → x:0, y:0, rotate:2
 *   transformTemplate: "translateX(-50%) ANIM_TRANSFORM"
 *   transition: { duration: 1, ease: [0.18, 1.01, 0.27, 0.99], type:"tween" }
 *
 * "1xn3g3i" (Card 2 — "How I got here")
 *   initial → animate:
 *     x: 17,  y: 147,  rotate: 11  → x:0, y:0, rotate:-11
 *   transformTemplate: "translateX(-50%) ANIM_TRANSFORM"
 *   transition: { duration: 1, ease: [0.18, 1.01, 0.27, 0.99], type:"tween" }
 *
 * "1kc9msy" (Card 3 — "Life off-screen")
 *   initial → animate:
 *     x: 183,  y: 157,  rotate: -17  → x:0, y:0, rotate:11
 *   transformTemplate: "translateX(-50%) ANIM_TRANSFORM"
 *   transition: { duration: 1, ease: [0.18, 1.01, 0.27, 0.99], type:"tween" }
 *
 * ──────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── cubic-bezier helpers ──────────────────────────────────────────── */
  function cb(a, b, c, d) {
    return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  }

  /* Eases extracted verbatim from Script 8 */
  const EASE_TEXT  = cb(0.33, 0.85, 0.56, 1.00);  /* hero text */
  const EASE_CARDS = cb(0.18, 1.01, 0.27, 0.99);  /* all 3 cards */

  /* ── Animation spec (mirrors Script 8 JSON) ───────────────────────── */
  const APPEAR_CONFIG = {
    '1g9oc75': {
      /* Hero text: slides up + fades in */
      element: () => document.querySelector('[data-appear="1g9oc75"]'),
      initial:  { opacity: 0.001, transform: 'translateY(56px)' },
      final:    { opacity: 1,     transform: 'translateY(0px)' },
      duration: 400,
      easing:   EASE_TEXT,
    },
    '11d4yik': {
      /* Card 1 — starts at translateX(-50%) + offset + big rotate, lands at translateX(-50%) rotate(2deg) */
      element: () => document.getElementById('card-11d4yik'),
      initial:  { transform: 'translateX(-50%) translateX(-186px) translateY(157px) rotate(28deg)' },
      final:    { transform: 'translateX(-50%) translateX(0px) translateY(0px) rotate(2deg)' },
      duration: 1000,
      easing:   EASE_CARDS,
    },
    '1xn3g3i': {
      /* Card 2 — starts offset-right and tilted, lands at translateX(-50%) rotate(-11deg) */
      element: () => document.getElementById('card-1xn3g3i'),
      initial:  { transform: 'translateX(-50%) translateX(17px) translateY(147px) rotate(11deg)' },
      final:    { transform: 'translateX(-50%) translateX(0px) translateY(0px) rotate(-11deg)' },
      duration: 1000,
      easing:   EASE_CARDS,
    },
    '1kc9msy': {
      /* Card 3 — starts far right and opposite tilt, lands at translateX(-50%) rotate(11deg) */
      element: () => document.getElementById('card-1kc9msy'),
      initial:  { transform: 'translateX(-50%) translateX(183px) translateY(157px) rotate(-17deg)' },
      final:    { transform: 'translateX(-50%) translateX(0px) translateY(0px) rotate(11deg)' },
      duration: 1000,
      easing:   EASE_CARDS,
    },
  };

  /* ── Framer "optimised appear" recreation ─────────────────────────────
   *
   * Framer's startOptimizedAppearAnimation (Script 7) does:
   *   1. Immediately set initial state so the element renders in its
   *      starting position before the first paint (zero flash).
   *   2. On RAF: fire a WAAPI .animate() call with fill:"both" so the
   *      element stays in its final state when the animation finishes.
   *   3. The animation runs once (iterations: 1).
   *
   * We replicate this using element.animate() with fill:'both'.
   * ─────────────────────────────────────────────────────────────────── */
  function applyInitial(el, initial) {
    for (const [prop, val] of Object.entries(initial)) {
      el.style[prop] = val;
    }
  }

  function runAppearAnimation(key, cfg) {
    const el = cfg.element();
    if (!el) return;

    /* Step 1 — set initial state immediately (before paint) */
    applyInitial(el, cfg.initial);

    /* Step 2 — fire WAAPI on next RAF (mirrors Framer's requestAnimationFrame wrapper) */
    requestAnimationFrame(() => {
      const keyframes = [cfg.initial, cfg.final];
      const options = {
        duration:   cfg.duration,
        easing:     cfg.easing,
        fill:       'both',      /* Framer uses fill:'both' */
        iterations: 1,
      };

      const anim = el.animate(keyframes, options);

      /* When done, commit the final CSS value so transitions work normally */
      anim.onfinish = () => {
        for (const [prop, val] of Object.entries(cfg.final)) {
          el.style[prop] = val;
        }
        /* Remove will-change after animation finishes (perf hygiene) */
        el.style.willChange = 'auto';
      };
    });
  }

  /* ── Trigger (mirrors Script 10 logic) ────────────────────────────────
   *
   * Script 10:
   *   requestAnimationFrame(() => {
   *     animator.animateAppearEffects(config, (selector, keyframes, options) => {
   *       const el = document.querySelector(selector);
   *       if (el) for (const [prop, frames] of Object.entries(keyframes))
   *         animator.startOptimizedAppearAnimation(el, prop, frames, options[prop]);
   *     }, attrName, transformPlaceholder, reducedMotion, breakpointHash);
   *   })
   *
   * We skip the breakpoint-hash logic (single desktop view) and fire all
   * animations at once from requestAnimationFrame, matching the trigger.
   * ─────────────────────────────────────────────────────────────────── */
  function animateAppearEffects() {
    /* Check prefers-reduced-motion — Framer respects it (Script 10, third arg) */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (const [key, cfg] of Object.entries(APPEAR_CONFIG)) {
      if (reducedMotion) {
        /* Skip animation, just show the final state */
        const el = cfg.element();
        if (el) applyInitial(el, cfg.final);
      } else {
        runAppearAnimation(key, cfg);
      }
    }
  }

  /* ── Fire on DOMContentLoaded (same timing as Framer) ──────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateAppearEffects);
  } else {
    animateAppearEffects();
  }


  /* ════════════════════════════════════════════════════════════════════
     MOUSE PARALLAX  (subtle hover interaction on framer-33mvhw)
     ──────────────────────────────────────────────────────────────────
     Framer's runtime adds a gentle mouse-follow parallax to the
     floating cards.  Each card moves at a slightly different depth
     factor giving a parallax illusion.  We replicate this with smooth
     lerp on mousemove.
     ════════════════════════════════════════════════════════════════ */
  const PARALLAX_CARDS = [
    { id: 'card-11d4yik', depth: 0.012, finalRotate:  2 },
    { id: 'card-1xn3g3i', depth: 0.008, finalRotate: -11 },
    { id: 'card-1kc9msy', depth: 0.015, finalRotate:  11 },
  ];

  /* Current and target parallax offsets per card */
  const state = PARALLAX_CARDS.map(() => ({
    tx: 0, ty: 0,    /* current rendered offset */
    tx_: 0, ty_: 0,  /* target offset */
  }));

  let rafActive = false;

  function lerpParallax() {
    const LERP = 0.08;  /* smoothing factor — lower = more lag */
    let stillMoving = false;

    PARALLAX_CARDS.forEach((cfg, i) => {
      const s = state[i];
      s.tx += (s.tx_ - s.tx) * LERP;
      s.ty += (s.ty_ - s.ty) * LERP;

      if (Math.abs(s.tx_ - s.tx) > 0.01 || Math.abs(s.ty_ - s.ty) > 0.01) {
        stillMoving = true;
      }

      const el = document.getElementById(cfg.id);
      if (!el) return;
      /* Compose transform: keep the centering + resting rotation, add parallax offset */
      el.style.transform =
        `translateX(-50%) translateX(${s.tx.toFixed(2)}px) translateY(${s.ty.toFixed(2)}px) rotate(${cfg.finalRotate}deg)`;
    });

    if (stillMoving) {
      rafActive = true;
      requestAnimationFrame(lerpParallax);
    } else {
      rafActive = false;
    }
  }

  /* Only activate parallax AFTER appear animations complete (1s + buffer) */
  let parallaxReady = false;
  setTimeout(() => { parallaxReady = true; }, 1200);

  document.addEventListener('mousemove', (e) => {
    if (!parallaxReady) return;

    /* Normalise cursor position relative to viewport centre (-1 … +1) */
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    PARALLAX_CARDS.forEach((cfg, i) => {
      const maxMove = Math.min(window.innerWidth, 600) * cfg.depth;
      state[i].tx_ = nx * maxMove * 60;
      state[i].ty_ = ny * maxMove * 40;
    });

    if (!rafActive) {
      rafActive = true;
      requestAnimationFrame(lerpParallax);
    }
  });

  /* Reset parallax on mouse leave */
  document.addEventListener('mouseleave', () => {
    if (!parallaxReady) return;
    PARALLAX_CARDS.forEach((_, i) => {
      state[i].tx_ = 0;
      state[i].ty_ = 0;
    });
    if (!rafActive) {
      rafActive = true;
      requestAnimationFrame(lerpParallax);
    }
  });


  /* ── Nav active-state on scroll ──────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['hero', 'work-section', 'story', 'life', 'contact'];

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(l => {
        const href = l.getAttribute('href').replace('#', '');
        l.classList.toggle('active',
          href === id ||
          (id === 'hero' && href === 'hero') ||
          (id === 'work-section' && href === 'hero')
        );
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

})();
