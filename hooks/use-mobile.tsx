// hooks/use-mobile.tsx
"use client";

import { useState, useEffect } from 'react';

/**
 * A custom React hook to determine if the current viewport is a mobile size.
 * @returns {boolean} - True if the window width is less than 768px, false otherwise.
 */
export function useMobile(): boolean {
  // We default to `false` to avoid layout shifts during server-side rendering.
  // The `useEffect` will correctly set the value on the client.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This function checks the window width and updates the state.
    // The 768px breakpoint corresponds to Tailwind's `md:` utility.
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Run the check once on initial mount.
    checkScreenSize();

    // Add an event listener to re-check whenever the window is resized.
    window.addEventListener('resize', checkScreenSize);

    // Cleanup function: remove the event listener when the component unmounts
    // to prevent memory leaks.
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []); // The empty dependency array means this effect runs only once on mount.

  return isMobile;
}
