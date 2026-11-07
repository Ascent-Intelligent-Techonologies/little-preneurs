// === NAV SCROLL ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// === MOBILE NAV ===
const burger = document.querySelector('.nav__burger');
let overlay = document.querySelector('.nav-overlay');

if (!overlay) {
  overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.innerHTML = `
    <a href="#littlepreneurs" onclick="closeNav()">Littlepreneurs</a>
    <a href="#about"   onclick="closeNav()">About</a>
    <a href="#events"  onclick="closeNav()">Events</a>
    <a href="#gallery" onclick="closeNav()">Gallery</a>
    <a href="#reviews" onclick="closeNav()">Reviews</a>
    <a href="#contact" onclick="closeNav()">Contact</a>
  `;
  document.body.appendChild(overlay);
}

function closeNav() {
  overlay.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  const isOpen = overlay.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// === SCROLL REVEAL ===
const revealEls = document.querySelectorAll(
  '.event-card, .insta__text, .review-card, .gallery__item, .pillar, .contact__item, .about__text, .about__visual, .mood-card, .tier-card, .press-card, .reel-card, .mstat'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// === SMOOTH ANCHOR SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// === CONTACT FORM (static — opens mailto) ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value;
    const email   = form.email.value;
    const subject = form.subject.value || 'Late Checkout Enquiry';
    const message = form.message.value;
    const mailto  = `mailto:hello@latecheckoutclub.in?subject=${encodeURIComponent(subject + ' — ' + name)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
    window.location.href = mailto;
  });
}

// === GALLERY LIGHTBOX (minimal) ===
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:999;cursor:zoom-out';
    const i = document.createElement('img');
    i.src = img.src;
    i.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px';
    lb.appendChild(i);
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  });
});

// === ACTIVE NAV LINK HIGHLIGHT ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--cream)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));
