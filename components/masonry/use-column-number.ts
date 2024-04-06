import { useLayoutEffect, useState } from "react";

export function useColumnNumber() {
  const [columnNumber, setColumnNumber] = useState(3);

  useLayoutEffect(() => {
    const handleResize = () => setColumnNumber(getColumnNumber());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columnNumber;
}

function getColumnNumber() {
  if (typeof window === "undefined") {
    return 3;
  }

  if (window.innerWidth < 1024) {
    return 2;
  }

  return 3;
}
