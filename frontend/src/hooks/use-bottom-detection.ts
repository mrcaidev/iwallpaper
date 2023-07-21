import { RefObject, useEffect, useRef } from "react";

export function useBottomDetection(
  bottomRef: RefObject<HTMLElement>,
  callback: () => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const bottom = bottomRef.current;

    if (!bottom) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(bottom);
    return () => observer.unobserve(bottom);
  }, [bottomRef]);
}
