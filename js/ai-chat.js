// ============================================================
// PRINCE'S PORTFOLIO BUDDY — AI Chat Widget
// Smart static version with rich knowledge base,
// visitor name collection, and Google Sheets logging.
// ============================================================

// ---- FORMSPREE CONFIG --------------------------------------
const FORMSPREE_URL = 'https://formspree.io/f/xykaynlo';
// -----------------------------------------------------------

// ---- SESSION STATE ----------------------------------------
let visitorName = null;
let awaitingName = true;
let sessionLog = [];

// ---- KNOWLEDGE BASE ---------------------------------------
const kb = {

  greetings: ["hi", "hello", "hey", "sup", "hiya", "yo", "howdy", "what's up", "whats up"],

  topics: [

    // --- SYFE ---
    {
      id: 'syfe',
      keywords: ["syfe", "singapore", "wealth", "advisory", "digital advisory", "rebalancing", "accredited", "withdrawal", "ai buddy", "portfolio", "investment"],
      answer: (name) => `${name ? `Great question, ${name}! ` : ''}At Syfe - a Singapore-based wealth platform - I led design on three major 0-to-1 initiatives:

1. **AI-powered Digital Advisory** - a smart portfolio platform that drove a 22% increase in portfolio rebalancing.
2. **Withdrawal Journey for Accredited Investors** - redesigned the full flow, cutting support tickets by 40%.
3. **Syfe AI Buddy** - a conversational investment interface that boosted investment activity by 35%.

All three were built from scratch. Want to dig into any one of them?`,
      link: '/work/syfe.html',
      linkLabel: 'View Syfe case study'
    },

    // --- BHARATPE ---
    {
      id: 'bharatpe',
      keywords: ["bharatpe", "bharat pe", "merchant", "upi", "mutual fund", "credit line", "emi", "tpap", "onboarding", "fintech", "india"],
      answer: (name) => `${name ? `Sure, ${name}! ` : ''}BharatPe is one of India's largest merchant fintech platforms - 100M+ merchants. Here's what I shipped there:

1. **0-to-1 Mutual Funds Platform** - 15,000 investors in the first 2 weeks.
2. **Credit Line on UPI** - featured at Global Fintech Fest 2025.
3. **Auto EMI Card** - grew subscriptions 10x through redesign.
4. **TPAP Onboarding** - cut completion time from 12 minutes to 5 minutes.

Big scale, real impact.`,
      link: '/work/bharatpe.html',
      linkLabel: 'View BharatPe case study'
    },

    // --- CHEFKART ---
    {
      id: 'chefkart',
      keywords: ["chefkart", "chef", "food", "cook", "consumer", "founding", "dau", "partner app", "research"],
      answer: (name) => `${name ? `Oh, ChefKart is a good one, ${name}! ` : ''}ChefKart is where I was the founding designer - employee #1 on design. I built the design practice from nothing:

- Scaled the customer app to **50K+ DAU**
- Grew the website to **100K+ DAU**
- Led a research study with **200+ users** → 90% partner app adoption
- Built and grew the design team from **1 to 10 people**

It's the project that shaped how I think about design at scale.`,
      link: '/work/chefkart-2.html',
      linkLabel: 'View ChefKart case study'
    },

    // --- DECKROOSTER ---
    {
      id: 'deckrooster',
      keywords: ["deckrooster", "deck rooster", "australia", "pitch deck", "startup", "presentation"],
      answer: (name) => `${name ? `Nice, ${name}! ` : ''}Deckrooster was an Australia-based startup focused on pitch decks and presentation design. It's where I got deep exposure to B2B design and storytelling through decks - a very different muscle than product design, and one I'm glad I built.`,
      link: null
    },

    // --- PHOTOGRAPHY ---
    {
      id: 'photography',
      keywords: ["photo", "photography", "camera", "pexels", "shoot", "lens", "street", "portrait"],
      answer: (name) => `${name ? `Love that you asked, ${name}! ` : ''}Photography is a decade-long parallel practice. I shoot people, streets, stillness - mostly in India. My work is on Pexels and it's directly shaped how I approach design: composition, hierarchy, what deserves attention and what doesn't.

It's not a hobby. It's the other half of how I see.`,
      link: '/work/photography.html',
      linkLabel: 'See photography'
    },

    // --- MENTORSHIP ---
    {
      id: 'mentorship',
      keywords: ["mentor", "mentorship", "topmate", "coach", "guide", "session", "community"],
      answer: (name) => `${name ? `${name}, ` : ''}Mentoring is something I take seriously. On Topmate:

- **32 sessions** completed
- **4.7 rating** from mentees
- **13 testimonials**
- **Top 1%** mentor on the platform

I mentor designers on breaking into product design, career transitions, portfolio reviews and navigating fintech. If you're looking for guidance, reach out.`,
      link: 'https://topmate.io/prince',
      linkLabel: 'Visit Topmate profile'
    },

    // --- AI / AI EXPLORATIONS ---
    {
      id: 'ai',
      keywords: ["ai", "artificial intelligence", "llm", "conversational", "buddy", "ai native", "ai design", "chatbot", "claude"],
      answer: (name) => `${name ? `Great question, ${name}! ` : ''}AI-native UX is where I've invested deeply:

- Designed **Syfe AI Buddy** - a conversational portfolio interface
- Built the **AI-powered Digital Advisory** platform at Syfe
- Using AI as a design and build tool (this portfolio was built with Claude)
- This very widget you're talking to is part of my AI explorations

I'm particularly interested in how AI changes the shape of interaction - not just adding a chatbot, but rethinking flows entirely.`,
      link: '/work/ai-explorations.html',
      linkLabel: 'See AI explorations'
    },

    // --- DESIGN PHILOSOPHY ---
    {
      id: 'philosophy',
      keywords: ["philosophy", "approach", "believe", "think", "opinion", "design thinking", "process", "how do you", "principles"],
      answer: (name) => `${name ? `Honestly ${name}, ` : ''}a few things I genuinely believe:

"Not every design problem needs a design solution." Sometimes the answer is a better conversation, a simpler system, or just saying no.

I care about decisions more than deliverables. The artefact is the output - the thinking is the work. I try to work at the intersection of rigour and instinct, and I get uncomfortable when design is just styling.`,
      link: null
    },

    // --- SKILLS & TOOLS ---
    {
      id: 'skills',
      keywords: ["skill", "tool", "figma", "design system", "framer", "adobe", "code", "stack", "software"],
      answer: (name) => `${name ? `Sure ${name}! ` : ''}Core skills: interaction design, financial UX, design systems, mobile-first thinking, research.

Tools: Figma, Figma Make, Claude Code, Framer, Adobe suite. Increasingly, I'm building in code - this entire portfolio is hand-coded in HTML, CSS and Vanilla JS. No frameworks.`,
      link: null
    },

    // --- EXPERIENCE / BACKGROUND ---
    {
      id: 'experience',
      keywords: ["experience", "years", "background", "career", "work history", "resume", "cv", "senior"],
      answer: (name) => `${name ? `${name}, ` : ''}6+ years across fintech and consumer products. The trail: ChefKart (founding designer) → Deckrooster (Australia) → Syfe (Singapore) → BharatPe (India). Senior Product Designer across all of it.

I specialise in end-to-end product design - from research and strategy through to shipped product - with a growing edge in AI-native product experiences.`,
      link: null
    },

    // --- METRICS / IMPACT ---
    {
      id: 'impact',
      keywords: ["impact", "metric", "result", "outcome", "number", "data", "growth", "kpi", "stat"],
      answer: (name) => `${name ? `Here are the numbers, ${name}: ` : ''}Some highlights across the career:

- **22%** increase in portfolio rebalancing (Syfe Digital Advisory)
- **35%** investment boost via AI Buddy
- **15K** mutual fund investors in 2 weeks (BharatPe)
- **10x** growth in card subscriptions
- **40%** reduction in support tickets
- **85%** onboarding conversion
- **100K+** DAU at ChefKart
- **50K+** DAU on ChefKart's consumer app`,
      link: null
    },

    // --- AVAILABILITY / HIRE ---
    {
      id: 'hire',
      keywords: ["available", "hire", "job", "open", "freelance", "contact", "reach", "email", "opportunity", "role", "position"],
      answer: (name) => `${name ? `${name}, ` : ''}yes - open to senior product design roles in fintech, consumer apps or AI products. Available immediately. Based in Gurugram, India, but open to remote globally.

Best way to reach out: **prince.design10@gmail.com**

Or just browse the case studies - the work speaks for itself.`,
      link: null
    },

    // --- EDUCATION ---
    {
      id: 'education',
      keywords: ["education", "nift", "degree", "study", "college", "university", "bachelor", "graduate"],
      answer: (name) => `${name ? `${name}, ` : ''}studied at **NIFT** - National Institute of Fashion Technology - graduating with a Bachelor of Design in 2020. Design thinking, craft and systems thinking were baked in from day one. It's a strong foundation for a product design career.`,
      link: null
    },

    // --- THIS PORTFOLIO / WEBSITE ---
    {
      id: 'portfolio',
      keywords: ["this", "website", "portfolio", "site", "built", "code", "html", "css", "javascript", "how was this made"],
      answer: (name) => `${name ? `Good eye, ${name}! ` : ''}This portfolio was designed and built entirely in code - pure HTML, CSS, and Vanilla JS. No frameworks, no Webflow, no templates.

I built it from scratch as a designer who wanted to learn to ship. Claude was my co-pilot throughout. It has a cinematic intro, 3D photo carousel, AI chat (hi 👋), dark mode, and more.

It's live proof that the best designers today can both design and build.`,
      link: null
    },

    // --- WHO ARE YOU / ABOUT PRINCE ---
    {
      id: 'about',
      keywords: ["who is prince", "about prince", "tell me about", "who are you", "about you", "introduce", "yourself"],
      answer: (name) => `${name ? `Happy to, ${name}! ` : ''}Prince Kumar is a Senior Product Designer with 6+ years of experience across fintech and consumer products. He's worked at Syfe (Singapore), BharatPe, ChefKart and Deckrooster (Australia).

He's known for 0-to-1 product thinking, strong design systems, and a growing edge in AI-native experiences. Outside of work: photographer, mentor, and the person who built this entire site by hand.

I'm his portfolio buddy - ask me anything.`,
      link: null
    },

  ],

  fallback: (name) => `${name ? `Hmm ${name}, ` : 'Hmm, '}that's one I'd rather Prince answer directly. Drop him a line at **prince.design10@gmail.com** - he's good at responding. Or browse the case studies above for the full picture.`
};

// ---- MATCHING ENGINE --------------------------------------
function getAnswer(input) {
  const q = input.toLowerCase().trim();

  // Score each topic by how many keywords match
  let bestScore = 0;
  let bestTopic = null;

  for (const topic of kb.topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && bestScore > 0) {
    return {
      text: bestTopic.answer(visitorName),
      link: bestTopic.link,
      linkLabel: bestTopic.linkLabel
    };
  }

  return {
    text: kb.fallback(visitorName),
    link: null
  };
}

// ---- FORMSPREE LOGGING ------------------------------------
function logToSheets(question) {
  try {
    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:      visitorName || 'Anonymous',
        question:  question,
        timestamp: new Date().toISOString(),
        page:      window.location.href,
      })
    });
  } catch (e) {
    // Silent fail — logging should never break the widget
  }
}

// ---- BUILD WIDGET UI --------------------------------------
function buildWidget() {
  const widget = document.createElement('div');
  widget.id = 'ai-widget';
  widget.innerHTML = `
    <div id="ai-toggle" aria-label="Chat with Prince's portfolio buddy">
      <div id="ai-toggle-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <span id="ai-toggle-label">Ask about my work</span>
      <div id="ai-toggle-dot"></div>
    </div>

    <div id="ai-panel">
      <div id="ai-header">
        <div id="ai-header-left">
          <div id="ai-header-avatar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div id="ai-header-name">Prince's Buddy</div>
            <div id="ai-header-status">
              <span id="ai-status-dot"></span>
              Online
            </div>
          </div>
        </div>
        <button id="ai-close" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div id="ai-messages">
        <div class="ai-msg ai-msg--bot">
          Hey there 👋 I'm Prince's portfolio buddy - think of me as his hype person who actually knows the work. Before we dive in, what's your name?
        </div>
      </div>

      <div id="ai-suggestions" style="display:none;">
        <button class="ai-suggestion">Tell me about Syfe</button>
        <button class="ai-suggestion">What's Prince's background?</button>
        <button class="ai-suggestion">Is he available to hire?</button>
        <button class="ai-suggestion">How was this site built?</button>
      </div>

      <div id="ai-input-row">
        <input id="ai-input" type="text" placeholder="Your name..." autocomplete="off" />
        <button id="ai-send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  applyWidgetStyles();

  if (!document.body.classList.contains('intro-phase')) {
    document.body.appendChild(widget);
    bindEvents();
  } else {
    document.addEventListener('introComplete', () => {
      document.body.appendChild(widget);
      bindEvents();
    });
  }
}

// ---- STYLES -----------------------------------------------
function applyWidgetStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* === WIDGET CONTAINER === */
    #ai-widget {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9000;
      font-family: var(--font-sans, 'Satoshi', sans-serif);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      position: relative;
    }

    /* === TOGGLE PILL === */
    #ai-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--color-text-primary, #111110);
      color: var(--color-bg, #FAFAF8);
      padding: 10px 18px 10px 12px;
      border-radius: 100px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1);
      transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease;
      user-select: none;
      letter-spacing: -0.01em;
    }
    #ai-toggle:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }
    #ai-toggle-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #ai-toggle-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      flex-shrink: 0;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
      animation: pulse-dot 2s ease infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.3); }
      50% { box-shadow: 0 0 0 5px rgba(74,222,128,0.1); }
    }

    /* === PANEL === */
    #ai-panel {
      position: absolute;
      bottom: calc(100% + 12px);
      right: 0;
      margin-bottom: 0;
      display: none;
      flex-direction: column;
      width: 360px;
      max-height: 520px;
      background: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, rgba(0,0,0,0.08));
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
      transform: translateY(8px) scale(0.97);
      opacity: 0;
      transition: opacity 250ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    }
    #ai-panel.open {
      display: flex;
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* === HEADER === */
    #ai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border, rgba(0,0,0,0.07));
      background: var(--color-surface, #fff);
    }
    #ai-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #ai-header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-text-primary, #111110);
      color: var(--color-bg, #FAFAF8);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #ai-header-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary, #111110);
      letter-spacing: -0.01em;
    }
    #ai-header-status {
      font-size: 11px;
      color: var(--color-text-muted, #888);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 1px;
    }
    #ai-status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }
    #ai-close {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-bg-secondary, rgba(0,0,0,0.05));
      border: none;
      cursor: pointer;
      color: var(--color-text-muted, #888);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms ease, color 150ms ease;
    }
    #ai-close:hover {
      background: var(--color-border, rgba(0,0,0,0.1));
      color: var(--color-text-primary, #111);
    }

    /* === MESSAGES === */
    #ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #ai-messages::-webkit-scrollbar { width: 4px; }
    #ai-messages::-webkit-scrollbar-track { background: transparent; }
    #ai-messages::-webkit-scrollbar-thumb { background: var(--color-border, #e0e0e0); border-radius: 4px; }

    .ai-msg {
      font-size: 13px;
      line-height: 1.65;
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      animation: msg-in 200ms ease forwards;
    }
    @keyframes msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ai-msg--bot {
      background: var(--color-bg-secondary, #f4f4f2);
      color: var(--color-text-primary, #111110);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .ai-msg--user {
      background: var(--color-text-primary, #111110);
      color: var(--color-bg, #FAFAF8);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .ai-msg--typing {
      background: var(--color-bg-secondary, #f4f4f2);
      color: var(--color-text-muted, #888);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
    }
    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-text-muted, #aaa);
      animation: typing-bounce 1.2s ease infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }
    .ai-msg a.ai-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-primary, #285DC6);
      text-decoration: none;
      border-bottom: 1px solid rgba(40,93,198,0.3);
      padding-bottom: 1px;
      transition: border-color 150ms ease;
    }
    .ai-msg a.ai-link:hover { border-color: var(--color-primary, #285DC6); }

    /* === SUGGESTIONS === */
    #ai-suggestions {
      padding: 8px 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      border-top: 1px solid var(--color-border, rgba(0,0,0,0.06));
    }
    .ai-suggestion {
      font-size: 11.5px;
      font-family: var(--font-sans, 'Satoshi', sans-serif);
      color: var(--color-text-primary, #111);
      background: var(--color-bg-secondary, #f4f4f2);
      border: 1px solid var(--color-border, rgba(0,0,0,0.08));
      border-radius: 100px;
      padding: 5px 12px;
      cursor: pointer;
      transition: background 150ms ease, transform 150ms ease;
      font-weight: 500;
      white-space: nowrap;
    }
    .ai-suggestion:hover {
      background: var(--color-border, rgba(0,0,0,0.1));
      transform: translateY(-1px);
    }

    /* === INPUT ROW === */
    #ai-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid var(--color-border, rgba(0,0,0,0.07));
      background: var(--color-surface, #fff);
    }
    #ai-input {
      flex: 1;
      border: 1px solid var(--color-border, rgba(0,0,0,0.1));
      border-radius: 10px;
      padding: 9px 13px;
      font-size: 13px;
      font-family: var(--font-sans, 'Satoshi', sans-serif);
      background: var(--color-bg, #FAFAF8);
      color: var(--color-text-primary, #111);
      outline: none;
      transition: border-color 150ms ease, box-shadow 150ms ease;
      letter-spacing: -0.01em;
    }
    #ai-input:focus {
      border-color: var(--color-primary, #285DC6);
      box-shadow: 0 0 0 3px rgba(40,93,198,0.1);
    }
    #ai-input::placeholder { color: var(--color-text-muted, #aaa); }
    #ai-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--color-text-primary, #111110);
      color: var(--color-bg, #FAFAF8);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 150ms ease, transform 150ms ease;
    }
    #ai-send:hover { opacity: 0.85; transform: scale(1.05); }
    #ai-send:active { transform: scale(0.95); }

    /* === RESPONSIVE === */
    @media (max-width: 480px) {
      #ai-widget { bottom: 20px; right: 16px; left: 16px; }
      #ai-panel { width: 100%; border-radius: 16px; }
      #ai-toggle-label { display: none; }
    }
  `;
  document.head.appendChild(style);
}

// ---- BIND EVENTS ------------------------------------------
function bindEvents() {
  const toggle      = document.getElementById('ai-toggle');
  const panel       = document.getElementById('ai-panel');
  const closeBtn    = document.getElementById('ai-close');
  const input       = document.getElementById('ai-input');
  const send        = document.getElementById('ai-send');
  const messages    = document.getElementById('ai-messages');
  const suggestions = document.getElementById('ai-suggestions');

  // Toggle panel open/close
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
    } else {
      panel.style.display = 'flex';
      requestAnimationFrame(() => {
        panel.classList.add('open');
        input.focus();
      });
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Send message
  function sendMessage(text) {
    const val = (text || input.value).trim();
    if (!val) return;
    input.value = '';

    addMessage(val, 'user');

    // Typing indicator
    const typing = addTyping();

    setTimeout(() => {
      typing.remove();

      if (awaitingName) {
        // Store the name
        visitorName = val.split(' ')[0]; // use first name
        awaitingName = false;

        // Show suggestions after name collected
        suggestions.style.display = 'flex';
        input.placeholder = `Ask me anything, ${visitorName}...`;

        addBotMessage(`Nice to meet you, ${visitorName}! 🙌 What would you like to know about Prince - his projects, his process, or whether he's available?`, null, null);
      } else {
        // Log to Formspree
        logToSheets(val);

        const result = getAnswer(val);
        addBotMessage(result.text, result.link, result.linkLabel);
      }
    }, 900);
  }

  send.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Suggestion pills
  suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('ai-suggestion')) {
      sendMessage(e.target.textContent);
    }
  });

  // ---- HELPERS ----
  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ai-msg--${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function addBotMessage(text, link, linkLabel) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg ai-msg--bot';

    // Convert **bold** to <strong>
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    msg.innerHTML = formatted;

    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.className = 'ai-link';
      anchor.textContent = linkLabel || 'View more';
      anchor.target = link.startsWith('http') ? '_blank' : '_self';
      msg.appendChild(document.createElement('br'));
      msg.appendChild(anchor);
    }

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function addTyping() {
    const msg = document.createElement('div');
    msg.className = 'ai-msg ai-msg--typing';
    msg.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }
}

// ---- INIT -------------------------------------------------
buildWidget();
