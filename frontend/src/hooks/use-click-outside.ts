import { RefObject, useEffect, useRef } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: (e: MouseEvent) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target && !ref.current?.contains(e.target as Node)) {
        callbackRef.current(e);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref]);
}
