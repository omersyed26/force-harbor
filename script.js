// Force Harbor — script.js

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll-aware nav styling ──
const navWrapper = document.querySelector('.nav-wrapper');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navWrapper.style.background = 'rgba(10, 22, 40, 0.97)';
  } else {
    navWrapper.style.background = 'rgba(10, 22, 40, 0.85)';
  }
});

// ── Simple scroll reveal ──
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const revealEls = document.querySelectorAll(
  '.service-card, .exp-item, .process-step, .about-card, .stat, .logo-pill'
);

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  observer.observe(el);
});

// ── Contact form (client-side only; hook up to backend/Formspree later) ──
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#00a896';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3500);
});
