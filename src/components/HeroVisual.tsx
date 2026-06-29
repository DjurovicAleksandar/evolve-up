"use client";

import { motion } from "framer-motion";
import type { MotionStyle } from "framer-motion";

export function HeroVisual({
  interactive = false,
  objectStyle,
}: {
  interactive?: boolean;
  objectStyle?: MotionStyle;
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
        className="absolute left-[61%] top-[52%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 [perspective:1000px] md:h-[40rem] md:w-[40rem]"
      >
        <div className="brand-object relative h-full w-full">
          <span className="brand-infinity-loop brand-infinity-loop-left" />
          <span className="brand-infinity-loop brand-infinity-loop-right" />
          <span className="brand-infinity-cross" />
          <div className="brand-plane" />
          <div className="brand-plane" />
          <div className="brand-plane" />
          <div className="brand-plane" />
        </div>
      </motion.div>
      <div className="hero-shard left-[12%] top-[26%] h-16 w-1 rotate-[63deg]" />
      <div className="hero-shard right-[20%] top-[28%] h-24 w-2 rotate-[35deg]" />
      <div className="hero-shard bottom-[18%] left-[48%] h-12 w-1 -rotate-[24deg]" />
    </div>
  );
}
