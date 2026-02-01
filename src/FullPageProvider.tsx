import React, { useEffect, useRef, useState, useCallback } from 'react';
import FullPageContext from './FullPageContext';
import { scrollToPosition, cancelScrollAnimation } from './utils/scrollTo';
import type { FullPageOptions, SectionInfo } from './types';

export interface FullPageProviderProps extends FullPageOptions {
  children: React.ReactNode;
}

export function FullPageProvider({
  children,
  scrollingSpeed = 1000,
  anchors = [],
  menu,
  lockAnchors = false,
  onSectionChange,
  beforeScroll,
  afterScroll,
  keyboardScrolling = true,
  touchScrolling = true,
  wheelScrolling = true,
  scrollThreshold = 50,
  touchThreshold = 50,
}: FullPageProviderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [allowScrolling, setAllowScrolling] = useState(true);

  const touchStartY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
  const wheelDelta = useRef<number>(0);

  // Add fullpage-active class to body on mount
  useEffect(() => {
    document.body.classList.add('fullpage-active');
    return () => {
      document.body.classList.remove('fullpage-active');
    };
  }, []);

  // Register section elements
  const registerSection = useCallback((element: HTMLElement) => {
    setSections((prev) => {
      if (prev.includes(element)) return prev;
      return [...prev, element].sort((a, b) => {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
    });

    return () => {
      setSections((prev) => prev.filter((el) => el !== element));
    };
  }, []);

  // Scroll to section by index or anchor
  const moveTo = useCallback((target: number | string) => {
    if (isScrolling || !allowScrolling) return;

    let targetIndex: number;

    if (typeof target === 'string') {
      targetIndex = anchors.indexOf(target);
      if (targetIndex === -1) return;
    } else {
      targetIndex = target;
    }

    if (targetIndex < 0 || targetIndex >= sections.length) return;
    if (targetIndex === activeIndex) return;

    const origin: SectionInfo = {
      index: activeIndex,
      anchor: anchors[activeIndex] || null,
      element: sections[activeIndex] || null,
    };

    const destination: SectionInfo = {
      index: targetIndex,
      anchor: anchors[targetIndex] || null,
      element: sections[targetIndex] || null,
    };

    if (beforeScroll) {
      beforeScroll(origin, destination);
    }

    setIsScrolling(true);
    setScrollDirection(targetIndex > activeIndex ? 'down' : 'up');

    const targetElement = sections[targetIndex];
    const targetY = targetElement?.offsetTop || 0;

    scrollToPosition({
      targetY,
      duration: scrollingSpeed,
      onComplete: () => {
        setActiveIndex(targetIndex);
        setIsScrolling(false);
        setScrollDirection(null);

        // Update URL hash
        if (anchors[targetIndex] && !lockAnchors) {
          window.history.pushState(null, '', `#${anchors[targetIndex]}`);
        }

        // Update menu
        if (menu) {
          updateMenuHighlight(menu, targetIndex);
        }

        if (afterScroll) {
          afterScroll(origin, destination);
        }

        if (onSectionChange) {
          onSectionChange(activeIndex, targetIndex);
        }
      },
    });
  }, [
    isScrolling,
    allowScrolling,
    activeIndex,
    sections,
    anchors,
    scrollingSpeed,
    lockAnchors,
    menu,
    beforeScroll,
    afterScroll,
    onSectionChange,
  ]);

  const moveNext = useCallback(() => {
    if (activeIndex < sections.length - 1) {
      moveTo(activeIndex + 1);
    }
  }, [activeIndex, sections.length, moveTo]);

  const movePrevious = useCallback(() => {
    if (activeIndex > 0) {
      moveTo(activeIndex - 1);
    }
  }, [activeIndex, moveTo]);

  const getActiveSection = useCallback((): SectionInfo => {
    return {
      index: activeIndex,
      anchor: anchors[activeIndex] || null,
      element: sections[activeIndex] || null,
    };
  }, [activeIndex, anchors, sections]);

  // Mouse wheel handler
  useEffect(() => {
    if (!wheelScrolling) return;

    const handleWheel = (e: WheelEvent) => {
      if (!allowScrolling || isScrolling) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastWheelTime.current;

      // Accumulate delta for threshold detection
      if (timeDiff < 200) {
        wheelDelta.current += e.deltaY;
      } else {
        wheelDelta.current = e.deltaY;
      }

      lastWheelTime.current = now;

      // Check threshold
      if (Math.abs(wheelDelta.current) < scrollThreshold) return;

      e.preventDefault();

      if (wheelDelta.current > 0) {
        moveNext();
      } else {
        movePrevious();
      }

      wheelDelta.current = 0;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [wheelScrolling, allowScrolling, isScrolling, scrollThreshold, moveNext, movePrevious]);

  // Keyboard navigation
  useEffect(() => {
    if (!keyboardScrolling) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!allowScrolling || isScrolling) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          if (activeIndex > 0) {
            moveTo(activeIndex - 1);
          }
          break;
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (activeIndex < sections.length - 1) {
            moveTo(activeIndex + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          if (e.shiftKey) {
            if (activeIndex > 0) {
              moveTo(activeIndex - 1);
            }
          } else {
            if (activeIndex < sections.length - 1) {
              moveTo(activeIndex + 1);
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          moveTo(0);
          break;
        case 'End':
          e.preventDefault();
          moveTo(sections.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardScrolling, allowScrolling, isScrolling, activeIndex, sections.length, moveTo]);

  // Touch navigation
  useEffect(() => {
    if (!touchScrolling) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!allowScrolling || isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) < touchThreshold) return;

      if (diff > 0) {
        moveNext();
      } else {
        movePrevious();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchScrolling, allowScrolling, isScrolling, touchThreshold, moveNext, movePrevious]);

  // Hash navigation on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && anchors.includes(hash)) {
        const index = anchors.indexOf(hash);
        if (index !== activeIndex) {
          moveTo(index);
        }
      }
    };

    // Initial hash navigation
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [anchors, activeIndex, moveTo]);

  // Menu sync on active index change
  useEffect(() => {
    if (menu) {
      updateMenuHighlight(menu, activeIndex);
    }
  }, [menu, activeIndex]);

  const contextValue = {
    activeIndex,
    isScrolling,
    scrollDirection,
    totalSections: sections.length,
    anchors,
    moveTo,
    moveNext,
    movePrevious,
    getActiveSection,
    setAllowScrolling,
    registerSection,
  };

  return (
    <FullPageContext.Provider value={contextValue}>
      {children}
    </FullPageContext.Provider>
  );
}

// Helper function to update menu highlighting
function updateMenuHighlight(menuSelector: string, activeIndex: number) {
  const menuEl = document.querySelector(menuSelector);
  if (!menuEl) return;

  const items = menuEl.querySelectorAll('[data-menuanchor]');

  items.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
