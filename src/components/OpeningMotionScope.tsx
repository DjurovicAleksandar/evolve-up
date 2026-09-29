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

  const scale = useTransform(scrollYProgress, [0, 0.34, 0.62, 0.86, 1], [0.92, 1, 1.04, 0.98, 0.3]);
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "0vw"]);
  const y = useTransform(scrollYProgress, [0, 0.62, 1], ["0vh", "-1vh", "12vh"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.78, 0.94, 1], [0.66, 0.78, 0.62, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.46, 0.76, 1], ["blur(0px)", "blur(4px)", "blur(0px)", "blur(14px)"]);

  return (
    <div ref={ref} className="relative bg-ink">
      <div className="pointer-events-none sticky top-0 z-[1] h-dvh overflow-hidden">
        <HeroVisual
          interactive
          progress={scrollYProgress}
          objectStyle={{ scale, x, y, rotateX, rotateZ, opacity, filter }}
        />
      </div>
      <motion.div className="relative -mt-[100dvh]">
        {children}
      </motion.div>
    </div>
  );
}
