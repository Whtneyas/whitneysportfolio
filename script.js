// script.js — organized semantically
(() => {
  'use strict';

  // small helpers
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // bootstrap after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHamburger();
    initLightbox();
    initGallerySlider();
  });

  // Load header.html into #header
  function initHeader() {
    fetch('header.html')
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(html => {
        const headerEl = q('#header');
        if (headerEl) headerEl.innerHTML = html;
      })
      .catch(err => console.warn('Failed to load header.html:', err));
  }

  // Toggle navigation (hamburger)
  function initHamburger() {
    const hamburgerButton = q('button.hamburger');
    const navigationList = q('nav ul');
    if (!hamburgerButton || !navigationList) return;
    hamburgerButton.addEventListener('click', () => navigationList.classList.toggle('active'));
  }

  // Simple lightbox wiring (open/close)
  function initLightbox() {
    const lightbox = q('#lightbox');
    const lightboxImg = q('#lightboxImg');
    const closeBtn = q('#closeBtn');
    const galleryImgs = qa('figure img');
    if (!lightbox) return;

    galleryImgs.forEach(img => {
      img.addEventListener('click', () => {
        if (lightboxImg) lightboxImg.src = img.src;
        lightbox.classList.add('open');
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('open'));
    // optional: close on background click or Esc key
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  // Slider / swipe / keyboard support
  function initGallerySlider() {
    // try to use currentScript parent if present, otherwise fall back to a container selector
    const container = (document.currentScript && document.currentScript.parentElement) || q('.sg-slider');
    if (!container) return;

    const track = q('.sg-track', container);
    const slides = Array.from(track?.children || []);
    const prevBtn = q('.sg-prev', container);
    const nextBtn = q('.sg-next', container);
    const dotsWrap = q('.sg-dots', container);

    if (!track || slides.length === 0 || !dotsWrap) return;

    let index = 0;
    let startX = 0, currentX = 0, dragging = false, trackWidth = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      Array.from(dotsWrap.children).forEach((btn, i) => btn.setAttribute('aria-selected', i === index));
    }

    // build dots
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => { index = i; update(); });
      dotsWrap.appendChild(btn);
    });

    prevBtn?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    nextBtn?.addEventListener('click', () => { index = Math.min(slides.length - 1, index + 1); update(); });

    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevBtn?.click();
      if (e.key === 'ArrowRight') nextBtn?.click();
    });
    container.tabIndex = 0;

    const posX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    track.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = posX(e);
      track.style.transition = 'none';
      track.setPointerCapture?.(e.pointerId);
      trackWidth = track.getBoundingClientRect().width / slides.length;
    });

    track.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      currentX = posX(e);
      const dx = currentX - startX;
      const percent = (dx / trackWidth) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      const dx = (currentX || posX(e)) - startX;
      if (Math.abs(dx) > (trackWidth * 0.25)) {
        index = dx < 0 ? Math.min(slides.length - 1, index + 1) : Math.max(0, index - 1);
      }
      currentX = 0;
      update();
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    update();
  }
})();


