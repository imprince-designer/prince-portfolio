const swiper = new Swiper('.photo-swiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 120,
    modifier: 1,
    slideShadows: false,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  keyboard: {
    enabled: true,
  },
  mousewheel: false,
});
