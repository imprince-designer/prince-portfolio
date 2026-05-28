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
