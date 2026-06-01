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

  // Build nav list
  var ul = document.createElement('ul');
  ul.className = 'cs-page-nav__list';

  SECTIONS.forEach(function (sec) {
    var li = document.createElement('li');
    li.className = 'cs-page-nav__item';
    li.dataset.id = sec.id;

    var btn = document.createElement('button');
    btn.className = 'cs-page-nav__btn';
    btn.setAttribute('data-target', sec.id);
    btn.setAttribute('aria-label', sec.label);

    var dot = document.createElement('span');
    dot.className = 'cs-page-nav__dot';

    var label = document.createElement('span');
    label.className = 'cs-page-nav__label';
    label.textContent = sec.label;

    btn.appendChild(dot);
    btn.appendChild(label);
    li.appendChild(btn);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Smooth scroll on click
  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('.cs-page-nav__btn');
    if (!btn) return;
    var target = document.getElementById(btn.getAttribute('data-target'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });

  // Active section — always pick the topmost section visible in the upper viewport
  var activeId = null;
  var visibleIds = new Set();

  function updateActive() {
    for (var i = 0; i < SECTIONS.length; i++) {
      if (visibleIds.has(SECTIONS[i].id)) {
        setActive(SECTIONS[i].id);
        return;
      }
    }
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    ul.querySelectorAll('.cs-page-nav__item').forEach(function (item) {
      item.classList.toggle('is-active', item.dataset.id === id);
    });
  }

  var sectionEls = SECTIONS.map(function (s) {
    return document.getElementById(s.id);
  }).filter(Boolean);

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visibleIds.add(entry.target.id);
      } else {
        visibleIds.delete(entry.target.id);
      }
    });
    updateActive();
  }, {
    rootMargin: '0px 0px -50% 0px',
    threshold: 0
  });

  sectionEls.forEach(function (el) { sectionObserver.observe(el); });

  // Show nav once #overview has entered or passed the top of the viewport
  var overviewSection = document.getElementById('overview');
  var showNavObserver = new IntersectionObserver(
    function (entries) {
      var entry = entries[0];
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
        nav.classList.add('cs-page-nav--visible');
      } else {
        nav.classList.remove('cs-page-nav--visible');
      }
    },
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );
  if (overviewSection) showNavObserver.observe(overviewSection);
}());
