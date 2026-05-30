import EmblaCarousel from 'https://unpkg.com/embla-carousel/embla-carousel.esm.js'

const viewport = document.querySelector('.testimonials-viewport')
const prevBtn = document.getElementById('testimonialPrev')
const nextBtn = document.getElementById('testimonialNext')
const dots = document.querySelectorAll('.testimonials-dot')

if (viewport) {
  const embla = EmblaCarousel(viewport, {
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  })

  function updateDots() {
    const index = embla.selectedScrollSnap()
    dots.forEach((d, i) => d.classList.toggle('active', i === index))
  }

  prevBtn.addEventListener('click', () => embla.scrollPrev())
  nextBtn.addEventListener('click', () => embla.scrollNext())
  dots.forEach((d, i) => d.addEventListener('click', () => embla.scrollTo(i)))

  embla.on('select', updateDots)
  embla.on('init', updateDots)

  let autoplay = setInterval(() => embla.scrollNext(), 5000)

  viewport.addEventListener('mouseenter', () => clearInterval(autoplay))
  viewport.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => embla.scrollNext(), 5000)
  })
}
