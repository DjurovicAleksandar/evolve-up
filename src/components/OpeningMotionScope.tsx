"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { HeroVisual } from "./HeroVisual";

export function OpeningMotionScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.44, 0.7, 0.9, 1], [1.04, 1.34, 1.72, 1.18, 1.5, 0.3]);
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "0vw"]);
  const y = useTransform(scrollYProgress, [0, 0.44, 0.9, 1], ["0vh", "-1vh", "-2vh", "16vh"]);
  const rotateX = useTransform(scrollYProgress, [0, 0.42, 0.72, 1], [0, 10, -4, 18]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.28, 0.62, 0.9, 1], [0, -6, 8, -4, 12]);
  const opacity = useTransform(scrollYProgress, [0, 0.32, 0.58, 0.78, 0.94, 1], [1, 1, 0.9, 0.92, 0.96, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.46, 0.76, 1], ["blur(0px)", "blur(4px)", "blur(0px)", "blur(14px)"]);

  return (
    <div ref={ref} className="relative bg-ink">
      <div className="pointer-events-none sticky top-0 z-[1] h-dvh overflow-hidden">
        <HeroVisual
          interactive
          objectStyle={{ scale, x, y, rotateX, rotateZ, opacity, filter }}
        />
      </div>
      <motion.div className="relative -mt-[100dvh]">
        {children}
      </motion.div>
    </div>
  );
}
