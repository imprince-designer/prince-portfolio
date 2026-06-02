(function () {
  var SECTIONS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'problem',   label: 'Problem' },
    { id: 'research',  label: 'Research' },
    { id: 'hmw',       label: 'HMW' },
    { id: 'testing',   label: 'Testing' },
    { id: 'impact',    label: 'Impact' },
    { id: 'design',    label: 'Design' },
    { id: 'learnings', label: 'Learnings' },
  ];

  var nav = document.getElementById('csPageNav');
  if (!nav) return;

  var list = document.createElement('ul');
  list.className = 'cs-page-nav__list';

  var items = [];

  SECTIONS.forEach(function (sec, i) {
    var li = document.createElement('li');
    li.className = 'cs-page-nav__item';
    li.dataset.index = i;

    var btn = document.createElement('button');
    btn.className = 'cs-page-nav__btn';
    btn.setAttribute('aria-label', sec.label);

    var label = document.createElement('span');
    label.className = 'cs-page-nav__label';
    label.textContent = sec.label;

    btn.appendChild(label);
    li.appendChild(btn);
    list.appendChild(li);
    items.push(li);

    btn.addEventListener('click', function () {
      var target = document.getElementById(sec.id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  nav.appendChild(list);

  var activeIndex = -1;

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    items.forEach(function (item, i) {
      item.classList.remove('is-active', 'is-done');
      if (i === index) item.classList.add('is-active');
      else if (i < index) item.classList.add('is-done');
    });
  }

  var sectionEls = SECTIONS.map(function (s) {
    return document.getElementById(s.id);
  }).filter(Boolean);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = sectionEls.indexOf(entry.target);
        if (idx !== -1) setActive(idx);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sectionEls.forEach(function (el) { observer.observe(el); });

  var heroEl = document.querySelector('.cs-hero-img');
  if (heroEl) {
    var showObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          nav.classList.add('cs-page-nav--visible');
        } else {
          nav.classList.remove('cs-page-nav--visible');
        }
      });
    }, { threshold: 0 });
    showObserver.observe(heroEl);
  }
})();
