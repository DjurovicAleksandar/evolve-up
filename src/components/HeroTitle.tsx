"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export function HeroTitle({
  line,
  prefix,
  words,
}: {
  line: string;
  prefix: string;
  words: string[];
}) {
  const [ready, setReady] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [leavingWord, setLeavingWord] = useState<number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 950);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready || words.length <= 1) return;

    const timeouts: number[] = [];
    const interval = window.setInterval(() => {
      setActiveWord((current) => {
        setLeavingWord(current);
        timeouts.push(window.setTimeout(() => setLeavingWord(null), 720));
        return (current + 1) % words.length;
      });
    }, 3000);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [ready, words.length]);

  return (
    <h1
      className={`mt-7 max-w-5xl text-[clamp(3rem,8.2vw,9rem)] leading-[0.86] tracking-normal text-white ${
        ready ? "hero-title-ready" : ""
      }`}
    >
      <span className="block">{splitLetters(line)}</span>
      <span className="block">
        {splitLetters(prefix, line.length + 3)}{" "}
        <span className="word-rotator align-baseline">
          {words.map((word, wordIndex) => (
            <span
              key={word}
              className={`word-rotator-word ${
                wordIndex === activeWord ? "is-active" : ""
              } ${wordIndex === leavingWord ? "is-leaving" : ""}`}
            >
              {splitRotatingLetters(word)}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}

function splitRotatingLetters(text: string) {
  return Array.from(text).map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="word-rotator-char"
      style={{ "--rot-char-index": index } as CSSProperties}
    >
      {char === " " ? "\u00a0" : char}
    </span>
  ));
}

function splitLetters(text: string, offset = 0) {
  return Array.from(text).map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="hero-char"
      style={{ "--char-index": offset + index } as CSSProperties}
    >
      {char === " " ? "\u00a0" : char}
    </span>
  ));
}
