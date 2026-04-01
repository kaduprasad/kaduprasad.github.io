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
  document.querySelectorAll('.project-card, .skill-category, .timeline-content, .cert-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });

  // ===== Collapsible Project Cards =====
  document.querySelectorAll('.card-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const body = card.querySelector('.card-body');
      if (!body) return;
      const isOpen = body.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
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

  // ===== Harry Potter: Magic Cursor Sparkle Trail (interests section only) =====
  const sparkleChars = ['✦', '✧', '★', '·', '✴', '⋆', '✺'];
  const sparkleColors = ['#ffd700', '#ffc107', '#4a90e8', '#7ab4f5', '#ffffff', '#ffecb3'];
  let lastSparkleTime = 0;
  const interestsSection = document.getElementById('interests');

  document.addEventListener('mousemove', (e) => {
    if (!interestsSection) return;
    const rect = interestsSection.getBoundingClientRect();
    const inInterests = e.clientY >= rect.top && e.clientY <= rect.bottom &&
                        e.clientX >= rect.left && e.clientX <= rect.right;
    if (!inInterests) return;

    const now = Date.now();
    if (now - lastSparkleTime < 35) return;
    lastSparkleTime = now;

    const p = document.createElement('span');
    p.className = 'magic-particle';
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    const char  = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    const size  = Math.random() * 14 + 8;
    const dx    = (Math.random() - 0.5) * 50;
    const dy    = -(Math.random() * 55 + 15);

    p.textContent = char;
    p.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${color};font-size:${size}px;`;
    document.body.appendChild(p);

    p.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)',   opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2) rotate(${Math.random() > 0.5 ? 120 : -120}deg)`, opacity: 0 }
      ],
      { duration: 500 + Math.random() * 350, easing: 'ease-out' }
    ).onfinish = () => p.remove();
  });

  // ===== Harry Potter: Spell Cast on Click (HP section only) =====
  const spells = ['Lumos!', 'Accio!', 'Alohomora!', 'Wingardium!', 'Expecto!', 'Nox!', 'Riddikulus!', 'Reparo!'];
  const hpSection = document.querySelector('.hp-subsection');

  document.addEventListener('click', (e) => {
    if (!hpSection) return;
    const rect = hpSection.getBoundingClientRect();
    const inHP = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (!inHP) return;

    const ripple = document.createElement('div');
    ripple.className = 'spell-ripple';
    ripple.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;`;

    const txt = document.createElement('span');
    txt.className = 'spell-text';
    txt.textContent = spells[Math.floor(Math.random() * spells.length)];
    txt.style.cssText = `left:${e.clientX}px;top:${e.clientY - 18}px;`;

    document.body.appendChild(ripple);
    document.body.appendChild(txt);
    setTimeout(() => ripple.remove(), 600);
    setTimeout(() => txt.remove(), 800);
  });

  // ===== Trek thumbnail hover/click switching =====
  const trekMain = document.getElementById('trekMain');
  const trekCaption = document.getElementById('trekCaption');
  if (trekMain) {
    const trekImgEl = trekMain.querySelector('img');
    const trekViewBtn = trekMain.querySelector('.trek-view-btn');
    const trekThumbs = document.querySelectorAll('.trek-thumb');
    trekThumbs.forEach(thumb => {
      const activate = () => {
        trekThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        trekImgEl.style.opacity = '0';
        setTimeout(() => {
          trekImgEl.src = thumb.dataset.src;
          trekImgEl.style.opacity = '1';
        }, 150);
        if (trekCaption) trekCaption.innerHTML = thumb.dataset.caption;
        if (trekViewBtn) trekViewBtn.dataset.src = thumb.dataset.src;
      };
      thumb.addEventListener('mouseenter', activate);
      thumb.addEventListener('click', activate);
    });
  }

  // ===== Photography thumbnail hover/click switching =====
  const photoMain = document.getElementById('photographyMain');
  const photoCaption = document.getElementById('photographyCaption');
  if (photoMain) {
    const photoImgEl = photoMain.querySelector('img');
    const viewBtn = photoMain.querySelector('.photo-view-btn');
    const photoThumbs = document.querySelectorAll('.photography-thumb');
    photoThumbs.forEach(thumb => {
      const activate = () => {
        photoThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        photoImgEl.style.opacity = '0';
        setTimeout(() => {
          photoImgEl.src = thumb.dataset.src;
          photoImgEl.style.opacity = '1';
        }, 150);
        if (photoCaption) photoCaption.innerHTML = thumb.dataset.caption;
        if (viewBtn) viewBtn.dataset.src = thumb.dataset.src;
      };
      thumb.addEventListener('mouseenter', activate);
      thumb.addEventListener('click', activate);
    });
  }

  // ===== Photo Lightbox =====
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightbox) {
    let activeLightboxSet = [];
    let lightboxIndex = 0;

    function openLightbox(thumbs, index) {
      activeLightboxSet = thumbs;
      lightboxIndex = index;
      const thumb = activeLightboxSet[lightboxIndex];
      lightboxImg.src = thumb.dataset.src;
      lightboxCaption.innerHTML = thumb.dataset.caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showPrev() {
      lightboxIndex = (lightboxIndex - 1 + activeLightboxSet.length) % activeLightboxSet.length;
      lightboxImg.src = activeLightboxSet[lightboxIndex].dataset.src;
      lightboxCaption.innerHTML = activeLightboxSet[lightboxIndex].dataset.caption;
    }

    function showNext() {
      lightboxIndex = (lightboxIndex + 1) % activeLightboxSet.length;
      lightboxImg.src = activeLightboxSet[lightboxIndex].dataset.src;
      lightboxCaption.innerHTML = activeLightboxSet[lightboxIndex].dataset.caption;
    }

    // Setup lightbox for each viewer section
    function setupViewerLightbox(thumbSelector, viewBtnSelector) {
      const thumbs = Array.from(document.querySelectorAll(thumbSelector));
      const btn = document.querySelector(viewBtnSelector);
      if (btn) {
        btn.addEventListener('click', () => {
          const activeSrc = btn.dataset.src;
          const idx = thumbs.findIndex(t => t.dataset.src === activeSrc);
          openLightbox(thumbs, idx >= 0 ? idx : 0);
        });
      }
      thumbs.forEach((thumb, i) => {
        thumb.addEventListener('dblclick', () => openLightbox(thumbs, i));
      });
    }

    setupViewerLightbox('.trek-thumb', '.trek-view-btn');
    setupViewerLightbox('.photography-thumb', '.photography-main-img .photo-view-btn');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  // Badminton thumbnail hover/click switching
  const mainImg = document.getElementById('badmintonMain');
  const caption = document.getElementById('badmintonCaption');
  if (mainImg) {
    const imgEl = mainImg.querySelector('img');
    const thumbs = document.querySelectorAll('.badminton-thumb');
    thumbs.forEach(thumb => {
      const activate = () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = thumb.dataset.src;
          imgEl.style.opacity = '1';
        }, 150);
        if (caption) caption.innerHTML = thumb.dataset.caption;
      };
      thumb.addEventListener('mouseenter', activate);
      thumb.addEventListener('click', activate);
    });
  }

});
