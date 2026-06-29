import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentSections, Eyebrow, ServicesGrid } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { SiteFrame } from "@/components/SiteFrame";
import {
  getPageContent,
  isLang,
  languages,
  pageKeyFromSlug,
  pageSlugs,
  route,
  type Lang,
} from "@/lib/content";
import { ui } from "@/lib/text";

type Params = Promise<{ lang: string; page: string }>;

export function generateStaticParams() {
  return languages.flatMap((lang) =>
    Object.values(pageSlugs[lang]).map((page) => ({ lang, page })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang: rawLang, page } = await params;
  if (!isLang(rawLang)) return {};
  const key = pageKeyFromSlug(rawLang, page);
  if (!key) return {};
  const content = getPageContent(rawLang, key);

  return {
    title: content.headings[0] ?? content.title,
    description: content.description,
  };
}

export default async function ContentPage({ params }: { params: Params }) {
  const { lang: rawLang, page } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;
  const key = pageKeyFromSlug(lang, page);
  if (!key) notFound();

  if (key === "services") {
    return <ServicesPage lang={lang} />;
  }

  if (key === "contact") {
    return <ContactPage lang={lang} />;
  }

  const content = getPageContent(lang, key);

  return (
    <SiteFrame
      lang={lang}
      alternateHref={route(lang === "bs" ? "en" : "bs", key)}
    >
      <InnerHero
        eyebrow="Evolve Up"
        title={content.headings[0]}
        body={content.lines[0] ?? content.description}
      />
      <section className="bg-paper px-4 py-20 text-ink md:px-8">
        <div className="mx-auto max-w-7xl">
          <ContentSections content={content} tone="light" />
        </div>
      </section>
    </SiteFrame>
  );
}

function ServicesPage({ lang }: { lang: Lang }) {
  const content = getPageContent(lang, "services");

  return (
    <SiteFrame
      lang={lang}
      alternateHref={route(lang === "bs" ? "en" : "bs", "services")}
    >
      <InnerHero
        eyebrow={ui[lang].allServices}
        title={content.headings[0]}
        body={content.lines[1] ?? content.description}
      />
      <section className="bg-ink px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ServicesGrid lang={lang} />
        </div>
      </section>
      <section className="bg-paper px-4 py-20 text-ink md:px-8">
        <div className="mx-auto max-w-7xl">
          <ContentSections content={content} tone="light" />
        </div>
      </section>
    </SiteFrame>
  );
}

function ContactPage({ lang }: { lang: Lang }) {
  const content = getPageContent(lang, "contact");
  const form = content.iframes.find((iframe) => iframe.form_id);
  const map = content.iframes.find((iframe) => iframe.src.includes("maps.google"));

  return (
    <SiteFrame
      lang={lang}
      alternateHref={route(lang === "bs" ? "en" : "bs", "contact")}
    >
      <InnerHero
        eyebrow={ui[lang].contactHeading}
        title={content.headings[0]}
        body={content.lines[1] ?? ui[lang].contactBody}
      />
      <section className="bg-paper px-4 py-20 text-ink md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-6xl">{content.headings[1]}</h2>
            <div className="mt-8 space-y-3 text-base leading-7 text-ink/70">
              {content.lines.slice(3, 10).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>

          <Reveal className="overflow-hidden border border-ink/10 bg-white">
            {form ? (
              <iframe
                className="h-[680px] w-full"
                src={form.src}
                title={form.title || "Contact form"}
              />
            ) : null}
          </Reveal>
        </div>
        {map ? (
          <div className="mx-auto mt-10 max-w-7xl overflow-hidden border border-ink/10">
            <iframe className="h-96 w-full" src={map.src} title={map.title || "Map"} />
          </div>
        ) : null}
      </section>
    </SiteFrame>
  );
}

function InnerHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-20 pt-32 md:px-8">
      <div className="hero-grid absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-5xl text-5xl leading-none text-white md:text-8xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-7 text-white/60">{body}</p>
        </Reveal>
      </div>
    </section>
  );
}
