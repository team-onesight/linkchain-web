import {useEffect, useState} from "react";

const MOBILE_BREAKPOINT = 768;

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return isMobile;
};
