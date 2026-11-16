import gsap from 'gsap';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Soft fade and rise for a whole page when the route changes
export const reveal = (el) => {
  if (!el || reduced()) return;
  gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' });
};

// Staggered entrance for a set of elements (used on the login and register screens)
export const stagger = (targets) => {
  if (!targets || !targets.length || reduced()) return;
  gsap.from(targets, { opacity: 0, y: 16, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'all' });
};
