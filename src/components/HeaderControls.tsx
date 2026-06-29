"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WordShiftLink } from "./WordShiftLink";

type HeaderLink = {
  href: string;
  label: string;
};

export function HeaderControls({
  alternateHref,
  other,
  talk,
  contactHref,
  links,
}: {
  alternateHref: string;
  other: string;
  talk: string;
  contactHref: string;
  links: HeaderLink[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  const menu = (
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          key="site-menu"
          className="fixed inset-0 z-[70] bg-black/45 px-4 py-4 text-ink backdrop-blur-sm md:px-8 md:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setMenuOpen(false)}
        >
          <motion.nav
            id="site-menu-panel"
            aria-label="Main menu"
            className="ml-auto flex min-h-[34rem] w-full max-w-md flex-col overflow-hidden rounded-lg bg-paper p-5 shadow-2xl md:min-h-[40rem] md:p-7"
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-5 font-mono text-xs uppercase text-ink/55">
              <span>Evolve Up</span>
              <button type="button" onClick={() => setMenuOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-8 flex flex-1 flex-col justify-center gap-2">
              {links.map((link, index) => (
                <div
                  key={link.href}
                  className="flex items-end gap-5 border-b border-ink/10"
                >
                  <span className="font-mono text-xs text-ink/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <WordShiftLink
                    href={link.href}
                    text={link.label}
                    className="flex-1 justify-between py-4 text-5xl leading-none text-ink md:text-6xl"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 border-t border-ink/10 pt-5 font-mono text-xs uppercase leading-5 text-ink/55">
              <span>office@evolveup-consulting.com</span>
              <span>+387 65 354 582</span>
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 font-mono text-[10px] text-white md:flex"
          type="button"
          aria-label="Decorative sound control"
        >
          ✶
        </button>
        <Link
          href={alternateHref}
          className="flex h-10 items-center rounded-full border border-white/30 px-3 font-mono text-xs uppercase text-white"
        >
          {other.toUpperCase()}
        </Link>
        <WordShiftLink
          href={contactHref}
          text={talk}
          arrow={false}
          className="hidden h-10 items-center rounded-full bg-white px-4 font-mono text-xs uppercase text-black sm:flex"
        />
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={() => setMenuOpen((open) => !open)}
          className="group flex h-10 items-center rounded-full border border-white/30 px-4 font-mono text-xs uppercase text-white"
        >
          <span className="relative inline-flex overflow-hidden leading-none">
            <span className="transition-transform duration-500 group-hover:-translate-y-full">
              {menuOpen ? "Close ×" : "Menu ="}
            </span>
            <span className="absolute left-0 top-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
              {menuOpen ? "Menu =" : "Close ×"}
            </span>
          </span>
        </button>
      </div>
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
