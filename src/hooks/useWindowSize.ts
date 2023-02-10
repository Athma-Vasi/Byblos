import { useCallback, useEffect, useState } from "react";

import { WindowSize } from "../types";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const setSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth ?? 0,
      height: window.innerHeight ?? 0,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", setSize);
    setSize();
    window.addEventListener("orientationchange", setSize);

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("orientationchange", setSize);
    };
  }, []);

  return windowSize;
}

export { useWindowSize };
