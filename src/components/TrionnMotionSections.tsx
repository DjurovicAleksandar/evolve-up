"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { WordShiftLink } from "./WordShiftLink";

export function AboutStatement({
  eyebrow,
  title,
  body,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 25%"],
  });
  const words = body.split(" ");

  return (
    <section ref={ref} className="relative min-h-dvh overflow-hidden bg-ink px-4 py-36 text-white md:px-8 md:py-40">
      <div className="relative z-10 mx-auto grid max-w-[96rem] gap-12 md:grid-cols-12">
        <p className="font-mono text-xs uppercase text-orange md:col-span-2">{eyebrow}</p>
        <div className="md:col-span-10">
          <SplitAboutTitle title={title} />
          <div className="my-14 flex items-center gap-5 text-white/25">
            <span className="h-px flex-1 bg-current" />
            <span className="relative h-4 w-4">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
            <span className="h-px flex-1 bg-current" />
          </div>
          <p className="max-w-5xl text-[clamp(1.35rem,2.65vw,3.3rem)] leading-[1.12] text-white/25">
            {words.map((word, index) => (
              <ScrollWord
                key={`${word}-${index}`}
                index={index}
                total={words.length}
                progress={scrollYProgress}
              >
                {word}
              </ScrollWord>
            ))}
          </p>
          <WordShiftLink
            href={href}
            text={cta}
            className="mt-12 inline-flex min-w-56 items-center justify-between border-b border-white/35 pb-3 font-mono text-xs uppercase"
          />
        </div>
      </div>
    </section>
  );
}

export function VisionWipeSection({
  top,
  bottom,
  words,
}: {
  top: string;
  bottom: string;
  words: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.78, 0.94], [1, 1, 0]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, -42]);

  return (
    <section ref={ref} className="relative h-[240vh] overflow-visible bg-ink text-white">
      <div className="sticky top-0 h-dvh overflow-hidden">
          <motion.div
          style={{ opacity: titleOpacity }}
          className="relative z-10 flex min-h-dvh flex-col justify-between py-24"
        >
          <div className="mx-auto grid w-full max-w-[96rem] grid-cols-12 px-4 md:px-8">
            <p className="col-span-12 font-mono text-xs uppercase leading-5 text-white/70 md:col-span-4 md:col-start-2">
              {top}
            </p>
          </div>
          <motion.div style={{ y: marqueeY }} className="overflow-hidden">
            <div className="marquee-track flex w-[200%] items-center gap-10 whitespace-nowrap">
              {[...words, ...words].map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="text-[clamp(5rem,13vw,13rem)] font-medium uppercase leading-none text-white/90"
                >
                  {word} <span className="mx-8 text-white/30">+</span>
                </span>
              ))}
            </div>
          </motion.div>
          <div className="mx-auto grid w-full max-w-[96rem] grid-cols-12 px-4 md:px-8">
            <p className="col-span-12 font-mono text-xs uppercase text-white/70 md:col-span-5 md:col-start-7">
              {bottom}
            </p>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <VisionStripe key={index} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitAboutTitle({ title }: { title: string }) {
  let wordIndex = 0;

  return (
    <h2 className="max-w-7xl text-[clamp(2.8rem,6.1vw,7rem)] leading-[0.94]" aria-label={title}>
      {title.split(" ").map((word) => {
        const index = wordIndex++;
        return (
          <span key={`${word}-${index}`}>
            <motion.span
              initial={{ opacity: 0, y: "0.35em", filter: "blur(14px)", rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.75, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block origin-bottom will-change-transform"
              aria-hidden="true"
            >
              {word}
            </motion.span>{" "}
          </span>
        );
      })}
    </h2>
  );
}

function ScrollWord({
  children,
  index,
  total,
  progress,
}: {
  children: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / Math.max(1, total) * 0.72;
  const opacity = useTransform(progress, [start, start + 0.18], [0.25, 1]);
  const y = useTransform(progress, [start, start + 0.18], [18, 0]);
  const blur = useTransform(progress, [start, start + 0.18], ["blur(9px)", "blur(0px)"]);
  const color = useTransform(opacity, [0.25, 1], ["rgba(255,255,255,0.25)", "rgba(255,255,255,0.92)"]);

  return (
    <>
      <motion.span
        style={{ color, y, filter: blur }}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>{" "}
    </>
  );
}

function VisionStripe({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const start = 0.68 + (4 - index) * 0.045;
  const scaleY = useTransform(progress, [start, Math.min(start + 0.2, 1)], [0, 1]);

  return (
    <motion.div
      style={{ scaleY }}
      className="origin-bottom flex-1 bg-paper"
    />
  );
}

export function ServiceWipeTransition({ words }: { words: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const marqueeOpacity = useTransform(scrollYProgress, [0.08, 0.26, 0.82, 1], [0, 0.16, 0.12, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.42, 1], [0, 0.8, 0]);

  return (
    <section ref={ref} className="relative h-[150vh] overflow-visible bg-ink text-white">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="stage-scan absolute inset-0 opacity-30" />
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-1/2 h-[64vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_52%_50%,rgba(255,106,4,0.18),rgba(16,138,237,0.12)_34%,transparent_66%)]"
        />
        <motion.div
          style={{ x: marqueeX, opacity: marqueeOpacity }}
          className="absolute left-0 top-1/2 z-10 flex w-[240%] -translate-y-1/2 items-center gap-10 whitespace-nowrap"
        >
          {[...words, ...words, ...words].map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="text-[clamp(6rem,15vw,15rem)] font-medium uppercase leading-none text-white/80"
            >
              {word} <span className="mx-8 text-white/25">+</span>
            </span>
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center gap-[7vh] py-[12vh]" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <ServiceWipeStripe key={index} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceWipeStripe({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const start = 0.16 + index * 0.045;
  const scaleX = useTransform(progress, [start, start + 0.24, 0.86], [0, 1, 1]);
  const opacity = useTransform(progress, [0.04, start + 0.1, 0.86, 1], [0, 0.62, 0.62, 0]);

  return (
    <motion.div
      style={{ scaleX, opacity }}
      className="h-[11vh] origin-left bg-paper/55 backdrop-blur-md"
    />
  );
}
