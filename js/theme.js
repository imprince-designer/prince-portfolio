// THEME TOGGLE
// Switches between light and dark mode.
// Saves preference so it persists on reload.

const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sun = document.getElementById('icon-sun');
const moon = document.getElementById('icon-moon');

// Load saved preference
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
updateIcons(saved);

toggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateIcons(next);
});

function updateIcons(theme) {
  if (theme === 'dark') {
    sun.style.display = 'none';
    moon.style.display = 'block';
  } else {
    sun.style.display = 'block';
    moon.style.display = 'none';
  }
}