// Force Harbor — script.js
// Animations use Motion (https://motion.dev), loaded from vendor/motion.min.js as window.Motion.
// If Motion fails to load or the visitor prefers reduced motion, the page stays fully usable without animation.

window.__fhReady = true;

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const M = !reduceMotion && window.Motion ? window.Motion : null;

if (!M) root.classList.remove('js-motion');

const EASE_OUT = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 380, damping: 26 };
const SOFT_SPRING = { type: 'spring', stiffness: 160, damping: 20 };

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ── Mobile hamburger menu ──
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  if (open && M) {
    M.animate($$('a', mobileMenu), { opacity: [0, 1], y: [-8, 0] }, { delay: M.stagger(0.05), duration: 0.3, ease: EASE_OUT });
  }
}

hamburger?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
$$('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));

// ── Scroll-aware nav styling ──
const navWrapper = $('.nav-wrapper');
const updateNav = () => navWrapper.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Stat counters ──
const counters = $$('[data-count]');
if (!M) counters.forEach(el => { el.textContent = el.dataset.count; });

// ── Cloud tabs (works with or without Motion) ──
const tabList = $('#cloudTabs');
const tabs = $$('.cloud-tab', tabList);
const indicator = $('#cloudIndicator');

function moveIndicator(tab, instant) {
  if (!M) return;
  M.animate(indicator, { x: tab.offsetLeft, width: tab.offsetWidth }, instant ? { duration: 0 } : SPRING);
}

function selectTab(tab, focus) {
  if (tab.classList.contains('is-active')) return;
  tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  if (focus) tab.focus();
  moveIndicator(tab);

  if (M) {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    M.animate(
      $$('.cloud-panel-text, .cloud-features li', panel),
      { opacity: [0, 1], x: [-16, 0] },
      { delay: M.stagger(0.06), duration: 0.45, ease: EASE_OUT }
    );
  }
}

tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab)));
tabList?.addEventListener('keydown', e => {
  const i = tabs.indexOf(document.activeElement);
  if (i === -1) return;
  const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  selectTab(tabs[(next + tabs.length) % tabs.length], true);
});
window.addEventListener('resize', () => moveIndicator($('.cloud-tab.is-active'), true));
moveIndicator(tabs[0], true);

// ── Contact form (client-side only; hook up to backend/Formspree later) ──
const contactForm = $('#contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#00a896';
  btn.disabled = true;
  if (M) M.animate(btn, { scale: [1, 1.05, 1] }, { duration: 0.45, ease: EASE_OUT });
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3500);
});

// ════════════════════════════════════════════
//  Motion-only enhancements below this point
// ════════════════════════════════════════════
if (M) {
  const { animate, inView, scroll, stagger, hover, press } = M;

  // ── Hero entrance ──
  animate('[data-hero]', { opacity: [0, 1], y: [28, 0] }, { delay: stagger(0.12, { startDelay: 0.1 }), duration: 0.8, ease: EASE_OUT });
  animate('#orbitHub', { scale: [0.4, 1], opacity: [0, 1] }, { ...SOFT_SPRING, delay: 0.5 });
  // Opacity only — .orbit-node / .orbit-label positions come from CSS transforms Motion would overwrite
  animate('.orbit-node', { opacity: [0, 1] }, { delay: stagger(0.08, { startDelay: 0.7 }), duration: 0.5, ease: EASE_OUT });

  // ── Rotating product word ──
  const words = ['Agentforce', 'Sales Cloud', 'Service Cloud', 'Data Cloud', 'MuleSoft', 'Health Cloud'];
  const wordEl = $('#rotatorWord');
  let wordIndex = 0;
  setInterval(async () => {
    if (document.hidden) return;
    await animate(wordEl, { y: ['0%', '-110%'], opacity: [1, 0] }, { duration: 0.35, ease: 'easeIn' });
    wordIndex = (wordIndex + 1) % words.length;
    wordEl.textContent = words[wordIndex];
    animate(wordEl, { y: ['110%', '0%'], opacity: [0, 1] }, { duration: 0.45, ease: EASE_OUT });
  }, 2600);

  // ── Orbiting clouds (labels counter-rotate to stay upright; pauses off-screen) ──
  const orbitTrack = $('#orbitTrack');
  const orbit = animate(0, 360, {
    duration: 60,
    repeat: Infinity,
    ease: 'linear',
    onUpdate: deg => {
      orbitTrack.style.transform = `rotate(${deg}deg)`;
      orbitTrack.style.setProperty('--spin', `${deg}deg`);
    },
  });
  inView('#hero', () => { orbit.play(); return () => orbit.pause(); });

  // Gentle pulse on the hub
  animate('#orbitHub', { boxShadow: [
    '0 0 40px rgba(0,200,180,0.2), inset 0 0 30px rgba(0,161,224,0.15)',
    '0 0 80px rgba(0,200,180,0.4), inset 0 0 30px rgba(0,161,224,0.25)',
  ] }, { duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1.2 });

  // ── Hero parallax ──
  const heroScroll = { target: $('#hero'), offset: ['start start', 'end start'] };
  scroll(animate('.hero-orb--1', { y: [0, 220] }, { ease: 'linear' }), heroScroll);
  scroll(animate('.hero-orb--2', { y: [0, -120] }, { ease: 'linear' }), heroScroll);
  scroll(animate('.hero-visual', { y: [0, 120], opacity: [1, 0.3] }, { ease: 'linear' }), heroScroll);

  // ── Page scroll progress bar ──
  scroll(animate('#scrollProgress', { scaleX: [0, 1] }, { ease: 'linear' }));

  // ── Infinite product marquee (duplicate items for a seamless loop; slows on hover) ──
  const marqueeTrack = $('#marqueeTrack');
  $$('span', marqueeTrack).forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.appendChild(clone);
  });
  const marquee = animate(marqueeTrack, { x: ['0%', '-50%'] }, { duration: 40, repeat: Infinity, ease: 'linear' });
  hover('.marquee', () => { marquee.speed = 0.25; return () => { marquee.speed = 1; }; });

  // ── Section reveals ──
  $$('[data-reveal]').forEach(el => {
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [32, 0] }, { duration: 0.8, ease: EASE_OUT });
    }, { amount: 0.25 });
  });

  // ── Staggered grids ──
  $$('[data-stagger]').forEach(group => {
    inView(group, () => {
      animate($$('[data-item]', group), { opacity: [0, 1], y: [40, 0], scale: [0.96, 1] }, { delay: stagger(0.08), duration: 0.7, ease: EASE_OUT });
    }, { amount: 0.2 });
  });

  // ── Counters ──
  counters.forEach(el => {
    inView(el, () => {
      const target = Number(el.dataset.count);
      animate(0, target, { duration: 1.8, ease: EASE_OUT, onUpdate: v => { el.textContent = Math.round(v); } });
    }, { amount: 0.6 });
  });

  // ── 3D tilt + cursor glow on cards ──
  $$('[data-tilt]').forEach(card => {
    hover(card, () => {
      animate(card, { y: -6 }, SPRING);
      let frame = 0;
      const onMove = e => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', `${px * 100}%`);
          card.style.setProperty('--my', `${py * 100}%`);
          animate(card, { rotateX: (0.5 - py) * 8, rotateY: (px - 0.5) * 10 }, { duration: 0.3, ease: 'easeOut' });
        });
      };
      card.addEventListener('pointermove', onMove);
      return () => {
        cancelAnimationFrame(frame);
        card.removeEventListener('pointermove', onMove);
        animate(card, { y: 0, rotateX: 0, rotateY: 0 }, SOFT_SPRING);
      };
    });
  });

  // ── Button hover + press springs ──
  $$('[data-press], .btn-nav').forEach(btn => {
    hover(btn, () => {
      animate(btn, { scale: 1.04 }, SPRING);
      return () => animate(btn, { scale: 1 }, SPRING);
    });
    press(btn, () => {
      animate(btn, { scale: 0.95 }, SPRING);
      return () => animate(btn, { scale: 1 }, SPRING);
    });
  });

  // ── Floating "why us" cards ──
  $$('[data-float]').forEach((card, i) => {
    animate(card, { y: [0, -14, 0] }, { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 });
  });

  // ── Approach timeline: line fills with scroll, steps light up as they enter ──
  scroll(animate('#timelineFill', { scaleY: [0, 1] }, { ease: 'linear' }), {
    target: $('#timeline'),
    offset: ['start 70%', 'end 60%'],
  });
  $$('[data-step]').forEach(step => {
    inView(step, () => {
      step.classList.add('is-active');
      animate(step, { opacity: [0, 1], x: [32, 0] }, { duration: 0.7, ease: EASE_OUT });
      animate($('.timeline-dot', step), { scale: [0.5, 1.15, 1] }, { duration: 0.6, ease: EASE_OUT });
    }, { amount: 0.6 });
  });
} else {
  $$('[data-step]').forEach(step => step.classList.add('is-active'));
}
