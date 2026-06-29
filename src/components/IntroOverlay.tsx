"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroOverlay() {
  const [transitionLabel, setTransitionLabel] = useState("");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const start = (event: Event) => {
      const label =
        event instanceof CustomEvent && typeof event.detail?.label === "string"
          ? event.detail.label
          : "Evolve Up";
      setTransitionLabel(label);
      clearTimeout(timeout);
      timeout = setTimeout(() => setTransitionLabel(""), 1200);
    };

    window.addEventListener("evolveup:navigate", start);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("evolveup:navigate", start);
    };
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[90] flex bg-paper text-ink"
      >
        <OverlayBelts direction="out" />
        <FlyingPluses direction="out" />
        <OverlayBadge label="Evolve Up" />
      </motion.div>

      <AnimatePresence>
        {transitionLabel ? (
          <motion.div
            key="route-transition"
            aria-hidden="true"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[95] flex bg-paper text-ink"
          >
            <OverlayBelts direction="in" />
            <FlyingPluses direction="in" />
            <OverlayBadge label={transitionLabel} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function OverlayBelts({ direction }: { direction: "in" | "out" }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scaleY: direction === "in" ? 0 : 1 }}
          animate={{ scaleY: direction === "in" ? 1 : 0 }}
          transition={{
            delay: direction === "in" ? index * 0.06 : 0.45 + index * 0.08,
            duration: direction === "in" ? 0.55 : 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="origin-top flex-1 border-r border-ink/10 bg-paper"
        />
      ))}
    </>
  );
}

function FlyingPluses({ direction }: { direction: "in" | "out" }) {
  const points = [
    { x: "18vw", y: "24vh", tx: "50vw", ty: "50vh" },
    { x: "82vw", y: "18vh", tx: "50vw", ty: "50vh" },
    { x: "20vw", y: "82vh", tx: "50vw", ty: "50vh" },
    { x: "84vw", y: "78vh", tx: "50vw", ty: "50vh" },
  ];

  return (
    <>
      {points.map((point, index) => (
        <motion.span
          key={`${point.x}-${point.y}`}
          initial={{
            left: direction === "in" ? point.x : point.tx,
            top: direction === "in" ? point.y : point.ty,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            left: direction === "in" ? point.tx : point.x,
            top: direction === "in" ? point.ty : point.y,
            opacity: [0, 0.45, 0.45, 0],
            rotate: direction === "in" ? 180 : -180,
          }}
          transition={{
            duration: 0.95,
            delay: 0.08 + index * 0.06,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-ink/50"
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        </motion.span>
      ))}
    </>
  );
}

function OverlayBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8], scale: [0.96, 1, 1, 0.98] }}
      transition={{ duration: 1.1, times: [0, 0.22, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-ink/15 px-4 text-center"
    >
      <span className="font-mono text-xs uppercase tracking-normal">{label}</span>
      <OverlayCounter />
      <span className="absolute -left-2 -top-2 h-4 w-4 text-ink/50">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      </span>
      <span className="absolute -bottom-2 -right-2 h-4 w-4 text-ink/50">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      </span>
    </motion.div>
  );
}

function OverlayCounter() {
  return (
    <div className="absolute -bottom-10 flex items-center gap-1 font-mono text-[10px] uppercase text-ink/45">
      {[8, 9, 9].map((offset, index) => (
        <span key={`${offset}-${index}`} className="h-3 overflow-hidden">
          <motion.span
            animate={{ y: `${offset * -0.75}rem` }}
            transition={{
              duration: 0.85,
              delay: 0.12 + index * 0.08,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="block"
          >
            {"0123456789".split("").map((digit) => (
              <span key={digit} className="block h-3 leading-3">
                {digit}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
      <span>/100</span>
    </div>
  );
}
