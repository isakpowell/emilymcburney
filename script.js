/* =============================================
   EMILY McBURNEY PORTFOLIO – script.js
   ============================================= */

/* --- Page load overlay --- */
(function () {
  const overlay = document.getElementById('page-load-overlay');
  if (!overlay) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.querySelectorAll('.overlay-slide').forEach(el => el.classList.add('hide'));
      setTimeout(() => { overlay.style.display = 'none'; }, 750);
    }, 200);
  });
})();

/* --- Custom cursor --- */
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = -100, mouseY = -100;
  let curX = -100, curY = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow on hoverable elements
  const hoverTargets = 'a, button, [role="button"]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('is-hovering');
  });
})();

/* --- Navigation overlay --- */
(function () {
  const hamburger = document.getElementById('hamburger-btn');
  const overlay   = document.getElementById('nav-overlay');
  const navEl     = document.getElementById('nav');
  if (!hamburger || !overlay) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    overlay.classList.add('is-open');
    navEl.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    overlay.classList.remove('is-open');
    navEl.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  overlay.querySelectorAll('.huge-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();

/* --- Nav brand/hamburger color change via IntersectionObserver --- */
(function () {
  const brand    = document.getElementById('nav-brand');
  const lines    = document.querySelectorAll('.hamburger-line');
  if (!brand) return;

  function setBlack(yes) {
    brand.classList.toggle('is-black', yes);
    lines.forEach(l => l.classList.toggle('is-black', yes));
  }

  // Watch white-background sections
  const whiteSections = document.querySelectorAll('.waypoint-white');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // When a white section's top crosses the nav (60px down)
      if (entry.isIntersecting) {
        setBlack(true);
      } else {
        // Check if any white section is still intersecting
        const anyWhite = [...whiteSections].some(el => {
          const r = el.getBoundingClientRect();
          return r.top < 80 && r.bottom > 0;
        });
        setBlack(anyWhite);
      }
    });
  }, { rootMargin: '-60px 0px 0px 0px', threshold: 0 });

  whiteSections.forEach(el => observer.observe(el));
})();

/* --- Hero slider --- */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    const prev = current;
    current = (index + slides.length) % slides.length;

    slides[prev].classList.add('leaving');
    slides[prev].classList.remove('active');
    dots[prev].classList.remove('active');
    dots[prev].setAttribute('aria-pressed', 'false');

    // After leaving anim, remove class
    setTimeout(() => slides[prev].classList.remove('leaving'), 800);

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-pressed', 'true');
  }

  function next() { goTo(current + 1); }

  function startAuto() { timer = setInterval(next, 4000); }
  function stopAuto()  { clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.slide));
      startAuto();
    });
  });

  document.querySelector('.hero-arrow-prev')?.addEventListener('click', () => {
    stopAuto(); goTo(current - 1); startAuto();
  });
  document.querySelector('.hero-arrow-next')?.addEventListener('click', () => {
    stopAuto(); goTo(current + 1); startAuto();
  });

  startAuto();
})();

/* --- About section – Swiper sliders --- */
(function () {
  if (typeof Swiper === 'undefined') return;

  const photoSwiper = new Swiper('.swiper.is-photos', {
    effect: 'cards',
    grabCursor: true,
    loop: true,
    keyboard: true,
    navigation: {
      nextEl: '.arrow.is-right',
      prevEl: '.arrow.is-left',
    },
  });

  const contentSwiper = new Swiper('.swiper.is-content', {
    speed: 0,
    loop: true,
    followFinger: false,
    effect: 'fade',
    fadeEffect: { crossFade: true },
  });

  // Link the two swipers
  photoSwiper.controller.control   = contentSwiper;
  contentSwiper.controller.control = photoSwiper;
})();

/* --- Smooth scroll for anchor links --- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* --- Contact form (basic submit handler) --- */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.hidden = false;
  });
})();
