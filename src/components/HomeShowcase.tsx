"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { WordShiftLink } from "./WordShiftLink";

type ShowcaseItem = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
};

export function HorizontalShowcase({
  title,
  cta,
  exploreLabel,
  finalHeading,
  finalCta,
  items,
}: {
  title: string;
  cta: string;
  exploreLabel: string;
  finalHeading: string;
  finalCta: string;
  items: ShowcaseItem[];
}) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travelDistance, setTravelDistance] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 0.94, 1], [0, -travelDistance, -travelDistance]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const plusRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const plusOpacity = useTransform(scrollYProgress, [0, 0.05, 0.96, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const updateDistance = () => {
      const track = trackRef.current;
      if (!track) return;
      setTravelDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    updateDistance();
    const observer = new ResizeObserver(updateDistance);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", updateDistance);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDistance);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="work-section"
      className="relative min-h-[360vh] bg-paper text-ink"
      style={{ height: `${Math.max(360, (items.length + 2) * 68)}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="pointer-events-none absolute right-6 top-0 z-20 hidden h-full items-center md:flex">
          <div className="relative h-full w-px bg-ink/10">
            <motion.div
              style={{ scaleY: progressScale }}
              className="absolute inset-x-0 top-0 h-full origin-top bg-ink/30"
            />
            <motion.div
              style={{ rotate: plusRotate, opacity: plusOpacity }}
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-ink/70"
            >
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </motion.div>
          </div>
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative z-10 flex h-full w-max will-change-transform"
        >
          <Panel className="w-screen md:w-[50vw]">
            <div className="title-block mx-auto max-w-xl text-center">
              <SplitShowcaseTitle title={title} />
              <WordShiftLink
                href={items[0]?.href ?? "#"}
                text={cta}
                className="mt-10 inline-flex min-w-52 items-center justify-between border-b border-ink/40 pb-3 font-mono text-xs uppercase"
              />
            </div>
          </Panel>

          {items.map((item, index) => (
            <ShowcaseCardPanel
              key={item.href}
              item={item}
              index={index}
              count={items.length}
              exploreLabel={exploreLabel}
              progress={scrollYProgress}
            />
          ))}

          <FinalPanel progress={scrollYProgress}>
            <div className="mx-auto max-w-lg text-center js-work-card-inner">
              <h3 className="text-4xl leading-tight md:text-5xl">
                {finalHeading}
              </h3>
              <WordShiftLink
                href={items[0]?.href ?? "#"}
                text={finalCta}
                className="mt-10 inline-flex min-w-56 items-center justify-between border-b border-ink/40 pb-3 font-mono text-xs uppercase"
              />
            </div>
          </FinalPanel>
        </motion.div>
      </div>
    </section>
  );
}

function SplitShowcaseTitle({ title }: { title: string }) {
  const lines = title.includes(" & ")
    ? title.replace(" & ", "\n& ").split("\n")
    : [title];
  let charIndex = 0;

  return (
    <h2 className="text-5xl leading-none md:text-7xl" aria-label={title}>
      {lines.map((line, lineIndex) => (
        <span key={line} className="block">
          {Array.from(line).map((char) => {
            const delay = charIndex++ * 0.05;
            return (
              <motion.span
                key={`${char}-${lineIndex}-${charIndex}`}
                initial={{ opacity: 0, y: "0.42em", filter: "blur(14px)", rotateX: 24 }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
                viewport={{ once: false, amount: 0.55 }}
                transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block origin-bottom will-change-transform"
                aria-hidden="true"
              >
                {char === " " ? "\u00a0" : char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function ShowcaseCardPanel({
  item,
  index,
  count,
  exploreLabel,
  progress,
}: {
  item: ShowcaseItem;
  index: number;
  count: number;
  exploreLabel: string;
  progress: MotionValue<number>;
}) {
  const start = index * (0.78 / Math.max(count, 1));
  const lineStart = Math.max(0, start - 0.03);
  const revealEnd = Math.min(start + 0.14, 1);
  const lineScale = useTransform(progress, [lineStart, Math.min(start + 0.1, 1)], [0, 1]);
  const y = useTransform(progress, [lineStart, revealEnd], [220, 0]);
  const opacity = useTransform(progress, [lineStart, Math.min(start + 0.08, 1)], [0, 1]);

  return (
    <Panel className="js-work-card w-screen md:w-[50vw]">
      <div className="relative flex h-full w-full flex-col justify-center px-6 md:px-16 lg:px-20">
        <motion.div
          style={{ scaleY: lineScale }}
          className="js-card-line absolute left-0 top-0 hidden h-full w-px origin-top bg-ink/10 md:block"
        />
        <motion.div
          style={{ scaleX: lineScale }}
          className="js-card-line-horizontal absolute bottom-0 left-0 h-px w-full origin-left bg-ink/10 md:hidden"
        />
        <motion.div
          style={{ y, opacity }}
          className="js-work-card-inner w-full will-change-transform"
        >
          <ShowcasePoster item={item} index={index} />
          <div className="mt-6 flex flex-col gap-5 text-ink sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-4xl leading-none md:text-5xl">
                {item.title}
              </h3>
              <p className="line-clamp-3 mt-4 max-w-md text-sm leading-6 text-ink/60 md:text-base">
                {item.body}
              </p>
            </div>
            <WordShiftLink
              href={item.href}
              text={exploreLabel}
              className="inline-flex min-w-52 items-center justify-between border-b border-ink/40 pb-3 font-mono text-xs uppercase"
            />
          </div>
        </motion.div>
      </div>
    </Panel>
  );
}

function ShowcasePoster({
  item,
  index,
}: {
  item: ShowcaseItem;
  index: number;
}) {
  return (
    <div className="showcase-poster group relative aspect-[1.45] w-full overflow-hidden rounded-lg bg-[#d7d7d7]">
      <div className="showcase-poster-grid absolute inset-0" />
      <div className="absolute left-5 top-5 z-10 font-mono text-xs uppercase text-ink/45">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="absolute right-5 top-5 z-10 max-w-36 text-right font-mono text-[10px] uppercase leading-4 text-ink/45">
        {item.eyebrow}
      </div>
      <div className="showcase-poster-mark absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2">
        <span />
        <span />
        <span />
      </div>
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-4">
        <p className="max-w-44 font-mono text-[10px] uppercase leading-4 text-ink/45">
          system / service / growth
        </p>
        <div className="relative h-5 w-5 text-ink/55">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        </div>
      </div>
    </div>
  );
}

function FinalPanel({
  children,
  progress,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
}) {
  const lineScale = useTransform(progress, [0.76, 0.86], [0, 1]);
  const y = useTransform(progress, [0.76, 0.86], [160, 0]);
  const opacity = useTransform(progress, [0.72, 0.82], [0, 1]);

  return (
    <Panel className="js-work-card w-screen md:w-[50vw]">
      <div className="relative flex h-full w-full items-center justify-center px-6 md:px-16">
        <motion.div
          style={{ scaleY: lineScale }}
          className="js-card-line absolute left-0 top-0 hidden h-full w-px origin-top bg-ink/10 md:block"
        />
        <motion.div
          style={{ y, opacity }}
          className="w-full will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </Panel>
  );
}

function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div className={`flex h-full shrink-0 items-center justify-center border-r border-ink/10 bg-paper ${className}`}>
      {children}
    </div>
  );
}
