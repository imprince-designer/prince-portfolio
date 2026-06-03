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
  if (!href || href.startsWith('#') || href.startsWith('/#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('tel')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 200);
  });
});

// Dropdown open/close on button hover only
document.querySelectorAll('.nav-item--dropdown').forEach(function(item) {
  const trigger = item.querySelector('.nav-dropdown-trigger');
  const mega = item.querySelector('.nav-mega');
  if (!trigger || !mega) return;
  let closeTimer = null;
  function open() { clearTimeout(closeTimer); item.classList.add('is-open'); }
  function close() { closeTimer = setTimeout(function() { item.classList.remove('is-open'); }, 120); }
  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', close);
  mega.addEventListener('mouseenter', open);
  mega.addEventListener('mouseleave', close);
});

// Mega dropdown thumbnail switching
document.querySelectorAll('.nav-mega-item').forEach(function(item) {
  item.addEventListener('mouseenter', function() {
    const cardId = this.getAttribute('data-card');
    if (!cardId) return;
    const mega = this.closest('.nav-mega');
    mega.querySelectorAll('.nav-mega-item').forEach(function(i) { i.classList.remove('active'); });
    this.classList.add('active');
    mega.querySelectorAll('.nav-thumb-item').forEach(function(t) { t.classList.remove('active'); });
    const thumb = mega.querySelector('[data-thumb="' + cardId + '"]');
    if (thumb) thumb.classList.add('active');
  });
});

// Product Case Studies — smooth scroll to #work on homepage
document.querySelectorAll('a.nav-mega-item[href="/#work"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      e.preventDefault();
      const target = document.querySelector('#work');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      const dropdown = document.querySelector('.nav-item--dropdown');
      if (dropdown) dropdown.classList.remove('is-open');
    }
  });
});
