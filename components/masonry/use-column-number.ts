import { useLayoutEffect, useState } from "react";

export function useColumnNumber() {
  const [columnNumber, setColumnNumber] = useState(3);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setColumnNumber(2);
        return;
      }

      setColumnNumber(3);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columnNumber;
}
