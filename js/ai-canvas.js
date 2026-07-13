(function () {
  var viewport = document.getElementById('aiCanvasViewport');
  var canvas = document.getElementById('aiCanvas');
  var hint = document.getElementById('aiDragHint');
  if (!viewport || !canvas) return;

  var HINT_KEY = 'ai-canvas-drag-hint-seen';
  var DRAG_THRESHOLD = 4;
  var PAN_MARGIN = 600;

  var cards = Array.prototype.slice.call(canvas.querySelectorAll('.ai-card'));
  var topZ = 1;

  /* ---- agent detail dialog ---- */

  var dialogOverlay = document.getElementById('aiDialogOverlay');
  var dialogClose = document.getElementById('aiDialogClose');
  var lastFocused = null;

  /* ---- result card: cycles through example matches once the terminal
     hands off to it, for as long as the dialog stays open ---- */

  var resultCard = document.querySelector('.ai-result-card');
  var resultMark = resultCard && resultCard.querySelector('.ai-result-mark');
  var resultRole = resultCard && resultCard.querySelector('.ai-result-role');
  var resultCo = resultCard && resultCard.querySelector('.ai-result-co');
  var resultPill = resultCard && resultCard.querySelector('.ai-result-pill');
  var resultWhy = resultCard && resultCard.querySelector('.ai-result-why');

  var MATCHES = [
    { mark: 'R', role: 'Senior Product Designer', co: 'Ramp', fit: '91%', why: 'Strong overlap in fintech UX and 0→1 systems work — closest match this run.' },
    { mark: 'N', role: 'Product Designer', co: 'Notion', fit: '88%', why: 'Consumer-grade craft bar matches recent case studies closely.' },
    { mark: 'V', role: 'Staff Designer', co: 'Vercel', fit: '74%', why: 'Developer-tooling design experience, though seniority skews higher than usual.' },
    { mark: 'B', role: 'Lead Product Designer', co: 'Brex', fit: '82%', why: 'Second fintech match this week — strong domain repeat.' }
  ];

  var MATCH_REVEAL_DELAY = 4300; // matches the CSS terminal-to-card handoff timing
  var MATCH_SWAP_INTERVAL = 3400;
  var MATCH_SWAP_FADE = 260;

  var matchIndex = 0;
  var matchTimer = null;
  var matchRevealTimer = null;

  function renderMatch(i) {
    if (!resultCard) return;
    var m = MATCHES[i];
    resultMark.textContent = m.mark;
    resultRole.textContent = m.role;
    resultCo.textContent = m.co;
    resultPill.textContent = m.fit + ' fit';
    resultWhy.textContent = m.why;
  }

  function swapMatch() {
    if (!resultCard) return;
    resultCard.classList.add('is-swapping');
    window.setTimeout(function () {
      matchIndex = (matchIndex + 1) % MATCHES.length;
      renderMatch(matchIndex);
      resultCard.classList.remove('is-swapping');
    }, MATCH_SWAP_FADE);
  }

  function stopMatchCycle() {
    if (matchTimer) {
      window.clearInterval(matchTimer);
      matchTimer = null;
    }
    if (matchRevealTimer) {
      window.clearTimeout(matchRevealTimer);
      matchRevealTimer = null;
    }
  }

  function startMatchCycle() {
    if (!resultCard) return;
    stopMatchCycle();
    matchIndex = 0;
    renderMatch(0);
    matchRevealTimer = window.setTimeout(function () {
      matchTimer = window.setInterval(swapMatch, MATCH_SWAP_INTERVAL);
    }, MATCH_REVEAL_DELAY);
  }

  function openDialog() {
    if (!dialogOverlay) return;
    lastFocused = document.activeElement;
    dialogOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (dialogClose) dialogClose.focus();
    startMatchCycle();
  }

  function closeDialog() {
    if (!dialogOverlay) return;
    dialogOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    stopMatchCycle();
    if (resultCard) resultCard.classList.remove('is-swapping');
  }

  if (dialogOverlay) {
    if (dialogClose) dialogClose.addEventListener('click', closeDialog);

    dialogOverlay.addEventListener('pointerdown', function (e) {
      if (e.target === dialogOverlay) closeDialog();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dialogOverlay.classList.contains('is-open')) closeDialog();
    });
  }

  /* ---- shared helpers ---- */

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function dismissHint() {
    if (!hint) return;
    hint.classList.add('is-hidden');
    try { localStorage.setItem(HINT_KEY, '1'); } catch (e) {}
  }

  try {
    if (localStorage.getItem(HINT_KEY) && hint) {
      hint.classList.add('is-hidden');
    }
  } catch (e) {}

  /* ---- canvas panning ---- */

  var panDragging = false;
  var panStartX = 0;
  var panStartY = 0;
  var panOriginX = 0;
  var panOriginY = 0;
  var panX = 0;
  var panY = 0;
  var panMoved = false;

  function panBounds() {
    var vw = viewport.clientWidth;
    var vh = viewport.clientHeight;
    var cw = canvas.offsetWidth;
    var ch = canvas.offsetHeight;
    return {
      minX: Math.min(0, vw - cw) - PAN_MARGIN,
      maxX: PAN_MARGIN,
      minY: Math.min(0, vh - ch) - PAN_MARGIN,
      maxY: PAN_MARGIN
    };
  }

  function applyPanTransform() {
    canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px)';
  }

  // Centers the pan on whatever cards currently exist, rather than a
  // hardcoded offset — so the cluster stays centered in the viewport
  // however many cards are on the canvas at any given time.
  function centerCanvasOnCards() {
    if (!cards.length || !viewport.clientWidth) return;

    var minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity;
    cards.forEach(function (card) {
      var left = card.offsetLeft;
      var top = card.offsetTop;
      minLeft = Math.min(minLeft, left);
      minTop = Math.min(minTop, top);
      maxRight = Math.max(maxRight, left + card.offsetWidth);
      maxBottom = Math.max(maxBottom, top + card.offsetHeight);
    });

    var clusterCenterX = (minLeft + maxRight) / 2;
    var clusterCenterY = (minTop + maxBottom) / 2;

    var b = panBounds();
    panX = clamp(viewport.clientWidth / 2 - clusterCenterX, b.minX, b.maxX);
    panY = clamp(viewport.clientHeight / 2 - clusterCenterY, b.minY, b.maxY);
    applyPanTransform();
  }

  centerCanvasOnCards();

  function onViewportPointerDown(e) {
    panDragging = true;
    panMoved = false;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panOriginX = panX;
    panOriginY = panY;
    viewport.classList.add('is-dragging');
    if (viewport.setPointerCapture && e.pointerId != null) {
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onViewportPointerMove(e) {
    if (!panDragging) return;
    var dx = e.clientX - panStartX;
    var dy = e.clientY - panStartY;

    if (!panMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      panMoved = true;
      dismissHint();
    }

    if (!panMoved) return;

    var b = panBounds();
    panX = clamp(panOriginX + dx, b.minX, b.maxX);
    panY = clamp(panOriginY + dy, b.minY, b.maxY);
    applyPanTransform();
  }

  function onViewportPointerUp() {
    panDragging = false;
    viewport.classList.remove('is-dragging');
  }

  viewport.addEventListener('pointerdown', onViewportPointerDown);
  window.addEventListener('pointermove', onViewportPointerMove);
  window.addEventListener('pointerup', onViewportPointerUp);
  window.addEventListener('pointercancel', onViewportPointerUp);

  window.addEventListener('resize', function () {
    var b = panBounds();
    panX = clamp(panX, b.minX, b.maxX);
    panY = clamp(panY, b.minY, b.maxY);
    applyPanTransform();
  });

  /* ---- individual card dragging ---- */

  var activeCardDrag = null;

  function cardBounds(card) {
    return {
      maxLeft: Math.max(0, canvas.offsetWidth - card.offsetWidth),
      maxTop: Math.max(0, canvas.offsetHeight - card.offsetHeight)
    };
  }

  function onCardPointerDown(e, card) {
    e.stopPropagation();
    activeCardDrag = {
      card: card,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originLeft: card.offsetLeft,
      originTop: card.offsetTop,
      moved: false
    };
    if (card.setPointerCapture && e.pointerId != null) {
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onCardPointerMove(e) {
    if (!activeCardDrag) return;
    var state = activeCardDrag;
    var dx = e.clientX - state.startX;
    var dy = e.clientY - state.startY;

    if (!state.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      state.moved = true;
      state.card.classList.add('ai-card--dragging');
      topZ += 1;
      state.card.style.zIndex = String(topZ);
      dismissHint();
    }

    if (!state.moved) return;

    var b = cardBounds(state.card);
    var left = clamp(state.originLeft + dx, 0, b.maxLeft);
    var top = clamp(state.originTop + dy, 0, b.maxTop);
    state.card.style.left = left + 'px';
    state.card.style.top = top + 'px';
  }

  function onCardPointerUp() {
    if (!activeCardDrag) return;
    var state = activeCardDrag;
    state.card.classList.remove('ai-card--dragging');

    if (!state.moved && state.card.classList.contains('ai-card--active')) {
      state.card.classList.remove('ai-card--clicked');
      // force reflow so the animation can restart on repeated clicks
      void state.card.offsetWidth;
      state.card.classList.add('ai-card--clicked');
      openDialog();
    }

    activeCardDrag = null;
  }

  cards.forEach(function (card) {
    card.addEventListener('pointerdown', function (e) { onCardPointerDown(e, card); });
  });
  window.addEventListener('pointermove', onCardPointerMove);
  window.addEventListener('pointerup', onCardPointerUp);
  window.addEventListener('pointercancel', onCardPointerUp);

  var activeCard = canvas.querySelector('.ai-card--active');
  if (activeCard) {
    activeCard.addEventListener('animationend', function () {
      activeCard.classList.remove('ai-card--clicked');
    });
  }

  /* ---- mobile stacked list: active card tap opens the dialog directly (not draggable) ---- */

  var mobileActiveCard = document.querySelector('.ai-card-list .ai-card--active');
  if (mobileActiveCard) {
    mobileActiveCard.addEventListener('click', function () {
      mobileActiveCard.classList.remove('ai-card--clicked');
      void mobileActiveCard.offsetWidth;
      mobileActiveCard.classList.add('ai-card--clicked');
      openDialog();
    });
    mobileActiveCard.addEventListener('animationend', function () {
      mobileActiveCard.classList.remove('ai-card--clicked');
    });
  }

  /* ---- mobile stacked list: cards 3+ are plain, permanent list items that start
     coiled tightly behind the previous card and straighten out (margin-top eases
     toward 0) as the user scrolls to them — like pulling slack thread straight.
     No pinning, no scroll-jacking — the list just naturally grows as each one
     un-coils, exactly like cards 1 and 2 always have. ---- */

  var stackedCards = Array.prototype.slice.call(document.querySelectorAll('.ai-card-list .ai-card--stacked'));
  if (stackedCards.length && window.matchMedia('(max-width: 768px)').matches) {
    var GAP_PX = 24; // matches --space-6, the list's normal gap
    var PEEK_PX = 16; // sliver still visible while fully coiled
    var cardHeight = stackedCards[0].offsetHeight;
    var coiledMargin = -(cardHeight - PEEK_PX) - GAP_PX;

    // Measure each card's natural (fully-uncoiled) document position BEFORE
    // applying any coiling. This is a fixed reference, independent of scroll
    // and of the card's own animated state — using the card's own live
    // rect.top instead would be a feedback loop, since coiling pulls it
    // toward the top of the viewport, which made the reveal condition look
    // satisfied immediately at load, before any real scrolling happened.
    var naturalDocTop = stackedCards.map(function (card) {
      return card.getBoundingClientRect().top + window.scrollY;
    });

    // Cards stay fully opaque throughout — their own solid background is what
    // makes the "peeking" look read cleanly (later card cleanly covers the
    // one behind it). Dimming opacity here would let both cards' text blend
    // together while overlapped, which is hard to read.
    stackedCards.forEach(function (card) {
      card.style.marginTop = coiledMargin + 'px';
    });

    var stackRAF = false;
    var updateStackedCards = function () {
      stackRAF = false;
      var vh = window.innerHeight;
      var revealAt = vh * 0.72; // fully straight once its natural top reaches here
      var startAt = vh * 1.0;   // still fully coiled while its natural top is below the viewport

      stackedCards.forEach(function (card, i) {
        var top = naturalDocTop[i] - window.scrollY;
        var t = clamp((startAt - top) / (startAt - revealAt), 0, 1);
        card.style.marginTop = (coiledMargin * (1 - t)) + 'px';
      });
    };

    window.addEventListener('scroll', function () {
      if (!stackRAF) {
        stackRAF = true;
        requestAnimationFrame(updateStackedCards);
      }
    }, { passive: true });
    window.addEventListener('resize', updateStackedCards);
    updateStackedCards();
  }

  /* ---- cursor spotlight ---- */

  var spotlight = document.getElementById('aiCanvasSpotlight');
  if (spotlight) {
    var spotlightRAF = null;
    var spotPendingX = 0;
    var spotPendingY = 0;

    var updateSpotlight = function () {
      spotlightRAF = null;
      spotlight.style.setProperty('--spot-x', spotPendingX + 'px');
      spotlight.style.setProperty('--spot-y', spotPendingY + 'px');
    };

    viewport.addEventListener('pointermove', function (e) {
      var rect = viewport.getBoundingClientRect();
      spotPendingX = e.clientX - rect.left;
      spotPendingY = e.clientY - rect.top;
      if (spotlightRAF == null) {
        spotlightRAF = requestAnimationFrame(updateSpotlight);
      }
    });

    viewport.addEventListener('pointerenter', function () {
      spotlight.classList.add('is-active');
    });

    viewport.addEventListener('pointerleave', function () {
      spotlight.classList.remove('is-active');
    });
  }
})();
