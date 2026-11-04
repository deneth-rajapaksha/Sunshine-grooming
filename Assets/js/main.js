// =========================
// Mobile Navigation Toggle
// =========================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// =========================
// Smooth Scroll for Nav + Footer Links
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
    // Close mobile nav after click
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    }
  });
});

// =========================
// FAQ Accordion
// =========================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const answer = faqItem.querySelector('.faq-answer');

    // Toggle open/close
    faqItem.classList.toggle('open');

    if (faqItem.classList.contains('open')) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = "0";
    }
  });
});

// Photo viewer: native touch scrolling keeps swiping smooth on phones.
const gallery = document.querySelector('.gallery');
const thumbnails = gallery ? [...gallery.querySelectorAll('.gallery-photo')] : [];

if (thumbnails.length) {
  const strip = gallery.querySelector('.gallery-grid');
  const viewer = document.createElement('div');
  viewer.className = 'gallery-viewer';
  const track = document.createElement('div');
  track.className = 'gallery-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Pet photos. Swipe or use left and right arrow keys to browse.');

  thumbnails.forEach((thumbnail, index) => {
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `Photo ${index + 1} of ${thumbnails.length}`);
    const photo = thumbnail.querySelector('img').cloneNode();
    photo.removeAttribute('width');
    photo.removeAttribute('height');
    photo.loading = index === 0 ? 'eager' : 'lazy';
    photo.draggable = false;
    slide.append(photo);
    track.append(slide);
  });

  function arrow(label, symbol, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-arrow ${className}`;
    button.setAttribute('aria-label', label);
    button.textContent = symbol;
    return button;
  }
  const previous = arrow('Previous photo', '‹', 'gallery-previous');
  const next = arrow('Next photo', '›', 'gallery-next');
  const position = document.createElement('p');
  position.className = 'gallery-position';
  position.setAttribute('role', 'status');
  position.setAttribute('aria-live', 'polite');
  position.setAttribute('aria-atomic', 'true');
  viewer.append(track, previous, next);
  strip.before(viewer, position);
  gallery.classList.add('gallery-ready');
  let current = -1;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function update(index) {
    if (index === current) return;
    current = index;
    thumbnails.forEach((thumbnail, number) => {
      thumbnail.setAttribute('aria-current', String(number === index));
      thumbnail.setAttribute('aria-label', `Show photo ${number + 1} of ${thumbnails.length}`);
    });
    previous.disabled = index === 0;
    next.disabled = index === thumbnails.length - 1;
    position.textContent = `${index + 1} / ${thumbnails.length}`;
    const selected = thumbnails[index];
    strip.scrollTo({
      left: selected.offsetLeft - strip.offsetLeft - (strip.clientWidth - selected.clientWidth) / 2,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }

  function show(index) {
    index = Math.max(0, Math.min(thumbnails.length - 1, index));
    track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', event => {
      event.preventDefault();
      show(index);
    });
  });
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(thumbnails.length - 1);
    else show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {
    if (track.clientWidth) update(Math.max(0, Math.min(thumbnails.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
  }, { passive: true });
  new ResizeObserver(() => {
    track.scrollTo({ left: Math.max(0, current) * track.clientWidth, behavior: 'instant' });
  }).observe(track);
  update(0);
}
