document.addEventListener('DOMContentLoaded', () => {
  // ===== Scroll Reveal Animation =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  // ===== Active Nav Link Highlighting =====
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let currentId = '';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ===== Mobile Navigation =====
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksEl.classList.toggle('active');
    document.body.style.overflow = navLinksEl.classList.contains('active') ? 'hidden' : '';
  });

  navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksEl.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Back to Top =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Interests Photo Slider =====
  const track = document.getElementById('sliderTrack');
  const slides = track ? track.querySelectorAll('.slide') : [];
  const dotsContainer = document.getElementById('sliderDots');
  let current = 0;

  if (track && slides.length) {
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    document.getElementById('sliderPrev').addEventListener('click', () => goTo(current - 1));
    document.getElementById('sliderNext').addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 4s
    setInterval(() => goTo(current + 1), 4000);
  }

  // ===== Project Card Mouse Spotlight =====
  document.querySelectorAll('.project-card, .skill-category').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });

  // ===== See More / See Less on Project Cards =====
  document.querySelectorAll('.see-more-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const extra = btn.previousElementSibling;
      const isOpen = extra.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.querySelector('span').textContent = isOpen ? 'See less' : 'See more';
    });
  });

  // ===== Lumos / Nox — Light/Dark Mode Toggle =====
  const lumosBtn = document.getElementById('lumosBtn');
  const themeOverlay = document.getElementById('themeOverlay');
  const lumosBtnText = lumosBtn.querySelector('span');
  const lumosBtnIcon = lumosBtn.querySelector('i');
  let isTransitioning = false;

  function toggleTheme() {
    if (isTransitioning) return;
    isTransitioning = true;

    const isCurrentlyDark = !document.body.classList.contains('light-mode');
    const rect = lumosBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    themeOverlay.style.setProperty('--origin-x', originX + 'px');
    themeOverlay.style.setProperty('--origin-y', originY + 'px');

    // Remove old classes
    themeOverlay.classList.remove('expanding', 'collapsing', 'to-light', 'to-dark');

    if (isCurrentlyDark) {
      // Switching to light mode — overlay is light, expands out
      themeOverlay.classList.add('to-light', 'expanding');
    } else {
      // Switching to dark mode — overlay is dark, expands out
      themeOverlay.classList.add('to-dark', 'expanding');
    }

    themeOverlay.addEventListener('animationend', function handler() {
      themeOverlay.removeEventListener('animationend', handler);

      if (isCurrentlyDark) {
        document.body.classList.add('light-mode');
        lumosBtnText.textContent = 'Nox';
        lumosBtnIcon.className = 'fas fa-hat-wizard';
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-mode');
        lumosBtnText.textContent = 'Lumos';
        lumosBtnIcon.className = 'fas fa-magic';
        localStorage.setItem('theme', 'dark');
      }

      // Now collapse the overlay to reveal the new theme underneath
      themeOverlay.classList.remove('expanding');
      themeOverlay.classList.add('collapsing');

      themeOverlay.addEventListener('animationend', function cleanup() {
        themeOverlay.removeEventListener('animationend', cleanup);
        themeOverlay.classList.remove('collapsing', 'to-light', 'to-dark');
        themeOverlay.style.clipPath = '';
        isTransitioning = false;
      });
    });
  }

  lumosBtn.addEventListener('click', toggleTheme);

  // Restore saved theme without animation
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    lumosBtnText.textContent = 'Nox';
    lumosBtnIcon.className = 'fas fa-hat-wizard';
  }
});
