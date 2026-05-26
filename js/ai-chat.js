// AI CHAT WIDGET
// Smart static version — no API needed.
// Answers questions about Prince's work from
// a built-in knowledge base.

const knowledge = {
  greetings: ["hi", "hello", "hey", "sup", "hiya"],
  questions: [
    {
      keywords: ["syfe", "wealth", "singapore", "advisory"],
      answer: "At Syfe, I led design on three major initiatives — an AI-powered Digital Advisory platform that drove a 22% increase in portfolio rebalancing, a redesigned withdrawal journey for Accredited Investors that cut support tickets by 40%, and Syfe AI Buddy, a conversational interface that boosted investment by 35%. All 0-to-1 work."
    },
    {
      keywords: ["bharatpe", "bharat", "merchant", "upi", "mutual fund", "credit"],
      answer: "At BharatPe I designed for 100M+ merchants across India. I launched a 0-to-1 Mutual Funds platform (15K investors in 2 weeks), designed Credit Line on UPI featured at Global Fintech Fest 2025, grew Auto EMI card subscriptions 10x, and redesigned the TPAP onboarding to cut completion time from 12 to 5 minutes."
    },
    {
      keywords: ["chefkart", "chef", "food", "consumer", "founding"],
      answer: "At ChefKart I was the founding designer — I built the design practice from scratch, scaled the customer app to 50K+ DAU and the website to 100K+ DAU, led a research study with 200+ users resulting in 90% partner app adoption, and grew the design team from 1 to 10."
    },
    {
      keywords: ["photo", "photography", "camera", "pexels", "lens"],
      answer: "Photography has been a 2-year parallel practice for me. I shoot people, streets, stillness — mostly in India. You can see my work on Pexels. It's directly shaped how I think about composition, hierarchy and what deserves attention in a design."
    },
    {
      keywords: ["experience", "years", "background", "career", "work"],
      answer: "6+ years across fintech and consumer products. I've worked in India, Singapore and Australia — at Syfe, BharatPe, ChefKart and Deckrooster. I specialise in end-to-end product design, with a growing edge in AI-native product experiences and conversational UX."
    },
    {
      keywords: ["skill", "tool", "figma", "design system", "process"],
      answer: "My core is interaction design, financial UX, design systems and mobile-first thinking. Tools: Figma, Figma Make, Claude Code, Framer, Adobe suite. I'm also actively building in code now — this website is a live example of that."
    },
    {
      keywords: ["ai", "artificial intelligence", "llm", "conversational", "buddy"],
      answer: "AI-native UX is where I've spent significant time recently — I designed Syfe AI Buddy (a conversational portfolio interface) and the AI-powered Digital Advisory platform. I'm also using AI as a design and build tool, which is how this portfolio was made."
    },
    {
      keywords: ["available", "hire", "job", "open", "freelance", "contact"],
      answer: "Yes — I'm available immediately and open to senior product design roles in fintech, consumer apps or AI products. I'm based in Gurugram but open to remote globally. Reach me at prince.design10@gmail.com"
    },
    {
      keywords: ["education", "nift", "degree", "study", "college"],
      answer: "I studied at NIFT — National Institute of Fashion Technology — graduating with a Bachelor of Design in 2020. Design thinking, craft and systems thinking were baked in from day one."
    },
    {
      keywords: ["impact", "metric", "result", "outcome", "number"],
      answer: "Some highlights: 22% increase in portfolio rebalancing at Syfe · 35% investment boost via AI Buddy · 15K mutual fund investors in 2 weeks at BharatPe · 10x growth in card subscriptions · 40% reduction in support tickets · 85% onboarding conversion · 100K+ DAU at ChefKart."
    },
    {
      keywords: ["this", "website", "portfolio", "site", "built", "code"],
      answer: "This portfolio was designed and built entirely in code — HTML, CSS, and Vanilla JS — with no frameworks or third-party dependencies. I built it from scratch as a designer learning to code, using Claude as a collaborator. It reflects my belief that the best designers today can both design and ship."
    }
  ],
  fallback: "Good question. I'd say the best way to get a full answer is to reach out directly — prince.design10@gmail.com. Or browse the case studies above to see the work in detail."
};

function getAnswer(input) {
  const q = input.toLowerCase().trim();

  // Greetings
  if (knowledge.greetings.some(g => q.includes(g))) {
    return "Hey! I'm an AI trained on Prince's work. Ask me about his projects, skills, experience or availability — I'll do my best to answer.";
  }

  // Match keywords
  for (const item of knowledge.questions) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.answer;
    }
  }

  return knowledge.fallback;
}

// --- BUILD THE WIDGET UI ---
function buildWidget() {
  const widget = document.createElement('div');
  widget.id = 'ai-widget';
  widget.innerHTML = `
    <div id="ai-toggle" aria-label="Ask me anything">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Ask about my work</span>
    </div>
    <div id="ai-panel">
      <div id="ai-header">
        <span>Ask Prince anything</span>
        <button id="ai-close">✕</button>
      </div>
      <div id="ai-messages">
        <div class="ai-msg ai-msg--bot">Hey! Ask me about Prince's work, skills, or availability.</div>
      </div>
      <div id="ai-input-row">
        <input id="ai-input" type="text" placeholder="e.g. Tell me about Syfe..." autocomplete="off" />
        <button id="ai-send">→</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);
  applyWidgetStyles();
  bindEvents();
}

function applyWidgetStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #ai-widget {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9000;
      font-family: var(--font-sans);
    }
    #ai-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--color-text-primary);
      color: var(--color-bg);
      padding: 12px 20px;
      border-radius: 100px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      transition: transform 200ms ease, box-shadow 200ms ease;
      user-select: none;
    }
    #ai-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.16);
    }
    #ai-panel {
      display: none;
      flex-direction: column;
      width: 360px;
      max-height: 480px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12);
      margin-bottom: 12px;
    }
    #ai-panel.open {
      display: flex;
    }
    #ai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    #ai-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted);
      font-size: 14px;
      padding: 4px;
    }
    #ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ai-msg {
      font-size: 13px;
      line-height: 1.6;
      max-width: 88%;
      padding: 10px 14px;
      border-radius: 12px;
    }
    .ai-msg--bot {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .ai-msg--user {
      background: var(--color-text-primary);
      color: var(--color-bg);
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .ai-msg--typing {
      background: var(--color-bg-secondary);
      color: var(--color-text-muted);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      font-style: italic;
    }
    #ai-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--color-border);
    }
    #ai-input {
      flex: 1;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      font-family: var(--font-sans);
      background: var(--color-bg);
      color: var(--color-text-primary);
      outline: none;
      transition: border-color 150ms ease;
    }
    #ai-input:focus {
      border-color: var(--color-text-muted);
    }
    #ai-send {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-text-primary);
      color: var(--color-bg);
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 150ms ease;
    }
    #ai-send:hover { opacity: 0.8; }

    @media (max-width: 480px) {
      #ai-widget { bottom: 20px; right: 16px; left: 16px; }
      #ai-panel { width: 100%; }
    }
  `;
  document.head.appendChild(style);
}

function bindEvents() {
  const toggle = document.getElementById('ai-toggle');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close');
  const input = document.getElementById('ai-input');
  const send = document.getElementById('ai-send');
  const messages = document.getElementById('ai-messages');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  function sendMessage() {
    const val = input.value.trim();
    if (!val) return;

    // User message
    addMessage(val, 'user');
    input.value = '';

    // Typing indicator
    const typing = addMessage('Thinking...', 'typing');

    setTimeout(() => {
      typing.remove();
      addMessage(getAnswer(val), 'bot');
    }, 800);
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ai-msg--${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }
}

// Init
buildWidget();