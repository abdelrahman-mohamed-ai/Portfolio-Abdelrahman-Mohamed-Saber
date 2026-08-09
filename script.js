const navToggle = document.querySelector('#nav-toggle');
const navLinks = document.querySelector('#nav-links');
const year = document.querySelector('#year');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('has-js');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle instanceof HTMLButtonElement && navLinks instanceof HTMLElement) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}

const pageLinks = document.querySelectorAll('a[data-page-link]');

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (navLinks instanceof HTMLElement) {
      navLinks.classList.remove('open');
      if (navToggle instanceof HTMLButtonElement) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
      }
    }

    const destination = new URL(link.href, window.location.href);
    const current = new URL(window.location.href);
    const isSameDocument = destination.pathname === current.pathname && destination.search === current.search && destination.hash === current.hash;
    const canUseFallback = !reducedMotion;

    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || isSameDocument || !canUseFallback) return;

    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => window.location.assign(destination.href), 190);
  });
});

window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));

window.requestAnimationFrame(() => document.body.classList.add('page-ready'));

const revealItems = document.querySelectorAll('[data-reveal]');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}
