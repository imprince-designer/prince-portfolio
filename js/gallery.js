const photos = [
  'https://images.pexels.com/photos/2421468/pexels-photo-2421468.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421467/pexels-photo-2421467.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421470/pexels-photo-2421470.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421477/pexels-photo-2421477.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421476/pexels-photo-2421476.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421475/pexels-photo-2421475.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421474/pexels-photo-2421474.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2421473/pexels-photo-2421473.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/19781105/pexels-photo-19781105.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const lightbox = document.getElementById('lightbox');
const backdrop = document.getElementById('lightboxBackdrop');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let current = 0;

function openLightbox(index) {
  current = index;
  lightboxImg.src = photos[current];
  lightboxCounter.textContent = (current + 1) + ' / ' + photos.length;
  lightbox.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  current = (current - 1 + photos.length) % photos.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = photos[current];
    lightboxCounter.textContent = (current + 1) + ' / ' + photos.length;
    lightboxImg.style.opacity = '1';
  }, 150);
}

function showNext() {
  current = (current + 1) % photos.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = photos[current];
    lightboxCounter.textContent = (current + 1) + ' / ' + photos.length;
    lightboxImg.style.opacity = '1';
  }, 150);
}

document.querySelectorAll('.photo-item').forEach((item) => {
  item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
});

lightboxClose.addEventListener('click', closeLightbox);
backdrop.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});
