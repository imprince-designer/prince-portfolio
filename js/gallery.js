const swiper = new Swiper('.photo-swiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  speed: 700,
  coverflowEffect: {
    rotate: 18,
    stretch: -40,
    depth: 220,
    modifier: 1.2,
    slideShadows: false,
  },
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  keyboard: {
    enabled: true,
  },
  on: {
    slideChange: function () {
      const slides = document.querySelectorAll('.photo-swiper .swiper-slide');
      slides.forEach(slide => {
        slide.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    }
  }
});
