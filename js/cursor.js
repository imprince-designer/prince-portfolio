// CUSTOM CURSOR
// Small dot that follows your mouse.
// Expands into a circle when hovering links.

const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

let cursorTimeout;
document.addEventListener('mousemove', () => {
  cursor.style.opacity = '1';
  clearTimeout(cursorTimeout);
  cursorTimeout = setTimeout(() => {
    cursor.style.opacity = '0';
  }, 2000);
});

// Expand on hoverable elements
const hoverables = document.querySelectorAll('a, button, .work-card');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});