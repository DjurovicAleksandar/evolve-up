"use client";

import { motion } from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import { HeroThreeObject } from "./HeroThreeObject";

export function HeroVisual({
  interactive = false,
  objectStyle,
  progress,
}: {
  interactive?: boolean;
  objectStyle?: MotionStyle;
  progress?: MotionValue<number>;
}) {
  return (
    <div
      className="hero-visual pointer-events-none absolute inset-0 overflow-hidden"
      data-blasting={interactive ? "false" : "false"}
    >
      <div className="hero-grid absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="hero-fade absolute inset-0" />
      <div className="orbital-line" />
      <div className="orbital-line scale-125 opacity-60" />
      <div className="hero-ray hero-ray-a" />
      <div className="hero-ray hero-ray-b" />
      <div className="hero-ray hero-ray-c" />
      <motion.div
        style={objectStyle}
        className="absolute left-[60%] top-[48%] h-[30rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 opacity-80 md:h-[38rem] md:w-[72rem] lg:h-[42rem] lg:w-[82rem]"
      >
        <HeroThreeObject progress={progress} />
      </motion.div>
      <div className="hero-shard left-[12%] top-[26%] h-16 w-1 rotate-[63deg]" />
      <div className="hero-shard right-[20%] top-[28%] h-24 w-2 rotate-[35deg]" />
      <div className="hero-shard bottom-[18%] left-[48%] h-12 w-1 -rotate-[24deg]" />
    </div>
  );
}
