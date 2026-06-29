"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function WordShiftLink({
  href,
  text,
  className = "",
  arrow = true,
}: {
  href: string;
  text: string;
  className?: string;
  arrow?: boolean;
}) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    window.dispatchEvent(new CustomEvent("evolveup:navigate", { detail: { label: text } }));
    setTimeout(() => router.push(href), 520);
  };

  return (
    <Link
      href={href}
      aria-label={text}
      onClick={handleClick}
      className={`group inline-flex items-center ${className}`}
    >
      <span className="relative inline-block overflow-hidden whitespace-nowrap leading-none">
        <span className="word-shift-text" data-text={text}>
          {text}
        </span>
      </span>
      {arrow ? (
        <span className="ml-auto transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      ) : null}
    </Link>
  );
}
