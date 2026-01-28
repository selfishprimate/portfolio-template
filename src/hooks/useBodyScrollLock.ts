import { useEffect, useRef } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollPosition.current = window.scrollY;

      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Get saved position before resetting styles
      const savedPosition = scrollPosition.current;

      // Reset body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      // Restore scroll position instantly (no animation)
      window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [isLocked]);
}
