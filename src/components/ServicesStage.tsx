"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { WordShiftLink } from "./WordShiftLink";

type StageItem = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
};

type Particle = {
  id: string;
  char: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  color: string;
};

export function ServicesStage({
  eyebrow,
  words,
  cta,
  href,
  items,
}: {
  eyebrow: string;
  words: string[];
  cta: string;
  href: string;
  items: StageItem[];
}) {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28, 0.5], [1, 0.3, 0]);
  const titleRotateX = useTransform(scrollYProgress, [0, 0.42, 0.68], [0, 0, -12]);
  const stageCardsOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 0.96], [0, 1, 1, 0]);
  return (
    <section ref={ref} className="relative h-[360vh] bg-ink text-white">
      <div className="sticky top-0 h-dvh overflow-hidden [perspective:1200px]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1d2227_0%,#0a0d10_46%,#050505_100%)]" />
        <div className="stage-scan absolute inset-0 opacity-40" />
        <ServiceFrameLayer progress={scrollYProgress} />
        <ServiceParticleBurst sectionRef={ref} sourceRef={titleRef} progress={scrollYProgress} />
        <motion.div
          style={{ y: titleY, opacity: titleOpacity, rotateX: titleRotateX }}
          className="relative z-10 mx-auto flex h-full max-w-[96rem] flex-col justify-center px-4 [transform-style:preserve-3d] md:px-8"
        >
          <p className="font-mono text-xs uppercase text-orange">{eyebrow}</p>
          <h2
            ref={titleRef}
            aria-label={words.join(" ")}
            className="mt-5 max-w-7xl text-[clamp(4.6rem,11vw,11rem)] font-medium uppercase leading-[0.74] text-white [transform-style:preserve-3d]"
          >
            {words.map((word, wordIndex) => (
              <SplitServiceWord
                key={word}
                word={word}
                wordIndex={wordIndex}
                progress={scrollYProgress}
              />
            ))}
          </h2>
          <WordShiftLink
            href={href}
            text={cta}
            className="absolute bottom-12 right-4 hidden min-w-48 items-center justify-between border-b border-white/30 pb-3 font-mono text-xs uppercase text-white md:right-8 md:flex"
          />
        </motion.div>

        <motion.div
          style={{ opacity: stageCardsOpacity }}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden [perspective:1400px]"
        >
          {items.slice(0, 6).map((item, index) => (
            <AnimatedStageCard
              key={item.href}
              item={item}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SplitServiceWord({
  word,
  wordIndex,
  progress,
}: {
  word: string;
  wordIndex: number;
  progress: MotionValue<number>;
}) {
  return (
    <span className="block" data-line aria-hidden="true">
      {Array.from(word).map((char, index) => (
        <ServiceLetter
          key={`${char}-${index}`}
          char={char}
          index={index}
          wordIndex={wordIndex}
          progress={progress}
        />
      ))}
    </span>
  );
}

function ServiceLetter({
  char,
  index,
  wordIndex,
  progress,
}: {
  char: string;
  index: number;
  wordIndex: number;
  progress: MotionValue<number>;
}) {
  const direction = (index + wordIndex) % 2 === 0 ? 1 : -1;
  const spread = 44 + index * 10 + wordIndex * 18;
  const start = 0.34 + wordIndex * 0.018 + index * 0.004;
  const end = start + 0.2;
  const fadeEnd = Math.min(end + 0.16, 0.98);
  const x = useTransform(progress, [start, end], [0, direction * spread]);
  const y = useTransform(progress, [start, end], [0, -90 + wordIndex * 26 + index * 5]);
  const rotate = useTransform(progress, [start, end], [0, direction * (90 + index * 16)]);
  const rotateX = useTransform(progress, [start, end], [0, 68 + wordIndex * 12]);
  const rotateY = useTransform(progress, [start, end], [0, direction * (32 + index * 7)]);
  const z = useTransform(progress, [start, start + 0.08, end], [0, index % 7 === 0 ? 180 : 40, -220]);
  const scale = useTransform(progress, [start, start + 0.08, end], [1, index % 7 === 0 ? 2.55 : 1.16, 0.68]);
  const opacity = useTransform(progress, [0, start, end, fadeEnd], [1, 1, 0.45, 0.12]);
  const filter = useTransform(progress, [start, end, fadeEnd], ["blur(0px)", "blur(1px)", "blur(7px)"]);

  return (
    <motion.span
      data-service-letter
      style={{ x, y, z, rotate, rotateX, rotateY, scale, opacity, filter }}
      className="inline-block will-change-transform [transform-style:preserve-3d]"
    >
      {char === " " ? "\u00a0" : char}
    </motion.span>
  );
}

function ServiceParticleBurst({
  sectionRef,
  sourceRef,
  progress,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  sourceRef: RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const wasInZone = useRef(false);
  const clearTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerBurst = (progressValue?: number) => {
      const section = sectionRef.current;
      const range = section ? section.offsetHeight - window.innerHeight : 0;
      const rect = section?.getBoundingClientRect();
      const value = progressValue ?? (rect && range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0);
      const inZone = value > 0.36 && value < 0.53;
      if (!inZone) {
        wasInZone.current = false;
        if (clearTimeoutRef.current) {
          window.clearTimeout(clearTimeoutRef.current);
          clearTimeoutRef.current = null;
          setParticles([]);
        }
        return;
      }
      if (wasInZone.current) return;

      wasInZone.current = true;
      const source = sourceRef.current;
      if (!source) return;

      const letters = Array.from(source.querySelectorAll<HTMLElement>("[data-line] [data-service-letter]"));
      const heroIndexes = new Set(
        letters
          .map((_, index) => index)
          .filter((index) => index % Math.max(7, Math.floor(letters.length / 3)) === 0)
          .slice(0, 3),
      );
      const viewport = Math.max(window.innerWidth, window.innerHeight);

      const measured = letters
        .map((element, index) => {
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return null;
          const styles = window.getComputedStyle(element);
          const angle = ((index * 47) % 360) * (Math.PI / 180);
          const isHero = heroIndexes.has(index);
          const distance = isHero ? viewport * 0.12 : 220 + ((index * 31) % Math.round(viewport * 0.52));
          const centerX = window.innerWidth / 2 + (((index * 23) % 120) - 60);
          const centerY = window.innerHeight / 2 + (((index * 19) % 100) - 50);

          return {
            id: `${index}-${element.textContent ?? ""}-${Date.now()}`,
            char: element.textContent || "",
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            dx: isHero ? centerX - (rect.left + rect.width / 2) : Math.cos(angle) * distance,
            dy: isHero ? centerY - (rect.top + rect.height / 2) : Math.sin(angle) * distance - 120,
            rotate: ((index * 71) % 420) - 210,
            rotateX: ((index * 43) % 420) - 210,
            rotateY: ((index * 59) % 420) - 210,
            scale: isHero ? 7 + (index % 3) : 0.82,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            fontWeight: styles.fontWeight,
            color: styles.color,
          };
        })
        .filter((particle): particle is Particle => Boolean(particle));

      setParticles(measured);
      if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = window.setTimeout(() => {
        setParticles([]);
        clearTimeoutRef.current = null;
      }, 1200);
    };

  useMotionValueEvent(progress, "change", triggerBurst);

  useEffect(() => {
    const triggerFromDom = () => triggerBurst();

    window.addEventListener("scroll", triggerFromDom, { passive: true });
    window.addEventListener("resize", triggerFromDom);
    // ponytail: cheap progress polling for this one burst; use ScrollTrigger if more services timelines need orchestration.
    const interval = window.setInterval(triggerFromDom, 120);
    triggerFromDom();
    return () => {
      window.removeEventListener("scroll", triggerFromDom);
      window.removeEventListener("resize", triggerFromDom);
      window.clearInterval(interval);
    };
  }, [sectionRef, sourceRef]);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);
    };
  }, []);

  if (!mounted || !particles.length) return null;

  return createPortal(
    <div className="service-particle-layer pointer-events-none fixed inset-0 z-[60] mix-blend-difference" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1, rotate: 0, rotateX: 0, rotateY: 0 }}
          animate={{
            x: particle.x + particle.dx,
            y: particle.y + particle.dy,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotate,
            rotateX: particle.rotateX,
            rotateY: particle.rotateY,
          }}
          transition={{ duration: 1.12, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 whitespace-nowrap leading-none will-change-transform [transform-style:preserve-3d]"
          style={{
            fontSize: particle.fontSize,
            fontFamily: particle.fontFamily,
            fontWeight: particle.fontWeight,
            color: particle.color,
          }}
        >
          {particle.char}
        </motion.span>
      ))}
    </div>,
    document.body,
  );
}

function ServiceFrameLayer({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.18, 0.3, 0.72, 0.96], [0, 0.48, 0.38, 0]);
  const scale = useTransform(progress, [0.18, 0.72], [1.08, 1]);
  const x = useTransform(progress, [0.18, 0.46, 0.72], [-80, 24, 0]);
  const y = useTransform(progress, [0.18, 0.46, 0.72], [80, -22, 0]);
  const rotateX = useTransform(progress, [0.18, 0.46, 0.72], [18, 0, -8]);
  const rotateY = useTransform(progress, [0.18, 0.46, 0.72], [-20, 12, 0]);
  const clipPath = useTransform(
    progress,
    [0.18, 0.46, 0.72],
    ["inset(42% 38% 42% 38%)", "inset(10% 18% 10% 18%)", "inset(0% 0% 0% 0%)"],
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, x, y, rotateX, rotateY, scale, clipPath }}
      className="service-frame-layer pointer-events-none absolute inset-0 z-[4] mix-blend-screen [transform-style:preserve-3d]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,4,0.28),transparent_34%),radial-gradient(circle_at_62%_52%,rgba(16,138,237,0.24),transparent_32%)]" />
      <div className="service-frame-window absolute left-1/2 top-1/2 h-[66vmin] w-[66vmin] -translate-x-1/2 -translate-y-1/2 border border-white/15">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="absolute border border-white/10"
            style={{ inset: `${index * 8}%`, transform: `translateZ(${index * 36}px)` }}
          />
        ))}
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
      </div>
      <div className="service-frame-slit absolute left-[14%] top-[28%] h-px w-[34vw] rotate-[-12deg] bg-orange/55" />
      <div className="service-frame-slit absolute bottom-[24%] right-[10%] h-px w-[28vw] rotate-[-12deg] bg-white/35" />
      <div className="absolute left-[22%] top-[18%] font-mono text-[10px] uppercase text-white/50">
        frame 371
      </div>
      <div className="absolute bottom-[16%] right-[18%] font-mono text-[10px] uppercase text-white/50">
        scroll indexed
      </div>
    </motion.div>
  );
}

function AnimatedStageCard({
  item,
  index,
  progress,
}: {
  item: StageItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const pair = Math.floor(index / 2);
  const isLeft = index % 2 === 0;
  const start = 0.56 + pair * 0.11;
  const input = [start, start + 0.055, Math.min(start + 0.19, 0.9), Math.min(start + 0.255, 0.94)];
  const x = useTransform(
    progress,
    input,
    isLeft ? ["-42vw", "7vw", "9vw", "-76vw"] : ["108vw", "66vw", "64vw", "126vw"],
  );
  const y = useTransform(
    progress,
    input,
    isLeft ? ["112vh", "58vh", "24vh", "-54vh"] : ["-36vh", "18vh", "54vh", "132vh"],
  );
  const opacity = useTransform(progress, input, [0, 1, 1, 0]);
  const rotateX = useTransform(progress, input, [isLeft ? 12 : -12, 0, 0, isLeft ? -10 : 10]);
  const rotateY = useTransform(progress, input, [isLeft ? -18 : 18, isLeft ? -4 : 4, isLeft ? 4 : -4, isLeft ? 18 : -18]);
  const z = useTransform(progress, input, [-220, 0, 0, -180]);
  const scale = useTransform(progress, input, [0.92, 1, 1, 0.92]);
  const iconProgress = useTransform(progress, (value) =>
    Math.max(0, Math.min(1, (value - (start + 0.06)) / 0.1)),
  );

  return (
    <motion.div
      style={{ x, y, z, rotateX, rotateY, scale, opacity }}
      className="absolute left-0 top-0 w-[min(27rem,84vw)] [transform-style:preserve-3d]"
    >
      <Link
        href={item.href}
        className="service-stage-card pointer-events-auto group relative block min-h-52 overflow-hidden border border-white/10 bg-black/80 p-5 backdrop-blur-md transition hover:border-orange/70"
        style={{ animationDelay: `${index * 90}ms` }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-xs text-white/45">{item.eyebrow}</p>
          <ServiceIcon progress={iconProgress} />
        </div>
        <h3 className="mt-8 text-2xl leading-none text-white md:text-3xl">
          {item.title}
        </h3>
        <p className="line-clamp-3 mt-4 text-sm leading-6 text-white/55">
          {item.body}
        </p>
      </Link>
    </motion.div>
  );
}

function ServiceIcon({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg className="h-12 w-12 text-white/65" viewBox="0 0 60 60" fill="none">
      <motion.path style={{ pathLength: progress }} d="M8 30h44" stroke="currentColor" />
      <motion.path style={{ pathLength: progress }} d="M30 8v44" stroke="currentColor" />
      <motion.path
        style={{ pathLength: progress }}
        d="M14 14c11 10 21 21 32 32M46 14C35 24 24 35 14 46"
        stroke="currentColor"
      />
    </svg>
  );
}
