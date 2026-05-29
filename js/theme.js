// THEME TOGGLE
// Switches between light and dark mode; CSS handles icon visibility via [data-theme].

const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Mobile drawer
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileDrawerOverlay');
const mobileTrigger = document.getElementById('mobileMenuTrigger');
const mobileClose = document.getElementById('mobileDrawerClose');

if (mobileTrigger) {
  mobileTrigger.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', closeDrawer);
}
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', closeDrawer);
}
function closeDrawer() {
  mobileDrawer.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Page transitions
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('tel')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 200);
  });
});

// Mega dropdown card switching
document.querySelectorAll('.nav-mega-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const cardId = item.getAttribute('data-card');
    if (!cardId) return;
    const mega = item.closest('.nav-mega');
    // Update active link
    mega.querySelectorAll('.nav-mega-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    // Update active card
    mega.querySelectorAll('.nav-card-item').forEach(card => {
      card.classList.remove('active');
      card.style.position = 'absolute';
      card.style.opacity = '0';
    });
    const activeCard = mega.querySelector(`[data-card-id="${cardId}"]`);
    if (activeCard) {
      activeCard.classList.add('active');
      activeCard.style.position = 'relative';
      activeCard.style.opacity = '1';
    }
  });
});
