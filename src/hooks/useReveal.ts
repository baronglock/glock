import { useEffect, useRef, useCallback } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observe();

    // Re-observe when DOM changes (language/theme switch causes re-render)
    const el = ref.current;
    if (!el) return cleanup;

    const mutationObserver = new MutationObserver(() => {
      // New elements appeared — observe them
      const unrevealed = el.querySelectorAll('.reveal:not(.visible)');
      if (unrevealed.length > 0) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        unrevealed.forEach((child) => io.observe(child));
      }
    });

    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      cleanup?.();
      mutationObserver.disconnect();
    };
  }, [observe]);

  return ref;
}
