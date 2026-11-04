(() => {
  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
  });

  // Show the header logo only once the big hero logo has scrolled away
  const heroBrand = document.querySelector('.hero__brand');
  if (heroBrand && 'IntersectionObserver' in window) {
    document.body.classList.add('at-top');
    new IntersectionObserver(([e]) => document.body.classList.toggle('at-top', e.isIntersecting))
      .observe(heroBrand);
  }

  // Click-to-load video embeds (Instagram + YouTube) – keeps page fast & private until played
  document.querySelectorAll('[data-embed]').forEach(box => {
    const btn = box.querySelector('.play');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = box.dataset.embed;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      f.title = 'Littlepreneurs video';
      box.innerHTML = '';
      box.appendChild(f);
    });
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('p');
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  document.querySelectorAll('img[data-lb]').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src; lbImg.alt = img.alt;
      lbCap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
      lb.hidden = false; document.body.style.overflow = 'hidden';
    });
  });
  lb.addEventListener('click', e => { if (e.target !== lbImg) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Reveal on scroll
  const targets = document.querySelectorAll('.section .wrap > *, .hero .wrap > *');
  targets.forEach(t => t.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .08 });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('in'));
})();

// Keep anchor jumps flush under the sticky header (no extra gap)
(() => {
  const nav = document.querySelector('.nav');
  const set = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  set();
  addEventListener('resize', set);
  addEventListener('load', set);
})();
