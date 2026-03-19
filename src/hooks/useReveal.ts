import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observeAll = () => {
      const children = el.querySelectorAll('.reveal:not(.visible)');
      children.forEach((child) => {
        // If already in viewport, show immediately
        const rect = child.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          child.classList.add('visible');
        } else {
          observer.observe(child);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Initial observation
    observeAll();

    // Re-observe when DOM changes (language switch, theme switch)
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(observeAll);
    });
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  });

  return ref;
}
