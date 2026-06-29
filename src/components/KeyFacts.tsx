"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";

export function KeyFacts({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Array<[string, string]>;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "start start"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [0.25, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.35], [32, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.35], ["blur(12px)", "blur(0px)"]);

  return (
    <section ref={ref} id="keyfacts-section" className="relative z-20 min-h-dvh bg-paper px-4 py-24 text-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-[96rem]">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleBlur }}
          className="text-center"
        >
          <p className="font-mono text-xs uppercase tracking-normal text-orange">{eyebrow}</p>
          <h2 className="mt-4 text-6xl leading-none md:text-8xl">{title}</h2>
        </motion.div>
        <div className="mt-16 flex gap-4 overflow-x-auto pb-4 [perspective:1400px] md:justify-center md:overflow-visible md:pb-0">
          {items.map(([number, label], index) => (
            <FactCard
              key={label}
              number={number}
              label={label}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FactCard({
  number,
  label,
  index,
  progress,
}: {
  number: string;
  label: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.08 + index * 0.18;
  const end = start + 0.46;
  const rotateX = useTransform(progress, [start, end], [-92, 0]);
  const opacity = useTransform(progress, [start, start + 0.18, end], [0, 0.35, 1]);
  const y = useTransform(progress, [start, end], [36, 0]);

  return (
    <motion.div
      data-kf-card
      style={{ opacity, rotateX, y }}
      className="min-h-72 w-[82vw] shrink-0 origin-top rounded-lg border border-ink/10 bg-paper p-8 shadow-[0_26px_70px_rgba(5,5,5,0.08)] [transform-style:preserve-3d] md:w-[30%] md:min-w-80"
    >
      <p className="text-5xl md:text-7xl">{number}</p>
      <p className="mt-24 max-w-44 font-mono text-xs uppercase leading-5 text-ink/55">
        {label}
      </p>
    </motion.div>
  );
}
