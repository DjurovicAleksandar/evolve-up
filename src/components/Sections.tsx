import Link from "next/link";
import { serviceRoute, services, type Lang, type PageContent } from "@/lib/content";
import { ui } from "@/lib/text";
import { Reveal } from "./Reveal";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-normal text-orange">
      {children}
    </p>
  );
}

export function ContentSections({
  content,
  tone = "dark",
  limit,
}: {
  content: PageContent;
  tone?: "dark" | "light";
  limit?: number;
}) {
  const sections = limit ? content.sections.slice(0, limit) : content.sections;
  const text = tone === "dark" ? "text-white" : "text-ink";
  const muted = tone === "dark" ? "text-white/60" : "text-ink/65";
  const border = tone === "dark" ? "border-white/10" : "border-ink/10";
  const hover = tone === "dark" ? "hover:bg-white/[0.035]" : "hover:bg-ink/[0.025]";
  const numberTone = tone === "dark" ? "border-white/10 bg-white/[0.03]" : "border-ink/10 bg-ink/[0.03]";
  const rowClass =
    tone === "dark"
      ? `group relative grid min-h-40 gap-6 overflow-hidden border-t ${border} py-9 transition ${hover} md:grid-cols-[0.12fr_0.5fr_0.38fr] md:py-12`
      : `group relative grid gap-5 border-t ${border} py-8 transition ${hover} md:grid-cols-[0.12fr_0.48fr_0.4fr] md:py-10`;
  const titleClass = tone === "dark" ? "max-w-3xl text-4xl md:text-6xl" : "max-w-2xl text-3xl md:text-5xl";
  const bodyClass = tone === "dark" ? "text-base leading-8 md:pt-2" : "text-base leading-7";

  return (
    <div>
      {sections.map((section, index) => (
        <Reveal
          key={`${section.title}-${index}`}
          className={rowClass}
        >
          <span className={`w-fit rounded-full border px-3 py-2 font-mono text-xs ${numberTone} ${muted}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {tone === "dark" ? (
            <span className="pointer-events-none absolute right-0 top-9 hidden h-4 w-4 text-orange/70 opacity-0 transition duration-500 group-hover:rotate-45 group-hover:opacity-100 md:block" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            </span>
          ) : null}
          <h2 className={`${titleClass} leading-none ${text}`}>
            {section.title}
          </h2>
          <div className={`space-y-4 ${bodyClass} ${muted}`}>
            {section.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ServicesGrid({ lang }: { lang: Lang }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <Reveal key={service.id}>
          <Link
            href={serviceRoute(lang, service)}
            className="group block min-h-72 border border-white/10 bg-white/[0.03] p-6 transition hover:border-orange/60 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-white/45">{service.eyebrow}</span>
              <span className="text-lg text-orange transition group-hover:translate-x-1">
                →
              </span>
            </div>
            <h3 className="mt-16 text-3xl text-white">{service.labels[lang]}</h3>
            <p className="mt-5 font-mono text-xs uppercase leading-5 text-white/45">
              {ui[lang].viewService}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
