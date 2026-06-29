"use client";

import { useEffect } from "react";
import type LocomotiveScroll from "locomotive-scroll";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let scroll: LocomotiveScroll | undefined;

    import("locomotive-scroll").then(({ default: Locomotive }) => {
      if (cancelled) return;
      scroll = new Locomotive({
        lenisOptions: {
          duration: 1.05,
          lerp: 0.105,
          smoothWheel: true,
        },
      });
    });

    return () => {
      cancelled = true;
      scroll?.destroy();
    };
  }, []);

  return null;
}
