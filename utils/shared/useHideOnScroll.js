import { useEffect, useRef, useState } from "react";

// Hides a fixed header when scrolling down and brings it back on the first
// upward scroll (or whenever the page is near the top).
export default function useHideOnScroll({ offset = 80, disabled = false } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }
    lastY.current = window.scrollY;
    let frame = null;

    const update = () => {
      frame = null;
      const y = Math.max(window.scrollY, 0);
      const diff = y - lastY.current;
      if (y <= offset) {
        setHidden(false);
      } else if (diff > 2) {
        setHidden(true);
      } else if (diff < -2) {
        setHidden(false);
      }
      if (Math.abs(diff) > 2 || y <= offset) lastY.current = y;
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [offset, disabled]);

  return hidden;
}
