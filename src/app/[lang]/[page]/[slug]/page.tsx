import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentSections, Eyebrow } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { SiteFrame } from "@/components/SiteFrame";
import {
  getServiceContent,
  isLang,
  languages,
  nav,
  serviceBySlug,
  serviceRoute,
  services,
  type Lang,
} from "@/lib/content";
import { ui } from "@/lib/text";

type Params = Promise<{ lang: string; page: string; slug: string }>;

export function generateStaticParams() {
  return languages.flatMap((lang) =>
    services.map((service) => ({
      lang,
      page: nav[lang].servicePath,
      slug: service.slugs[lang],
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang: rawLang, page, slug } = await params;
  if (!isLang(rawLang) || page !== nav[rawLang].servicePath) return {};
  const service = serviceBySlug(rawLang, slug);
  if (!service) return {};
  const content = getServiceContent(rawLang, service);

  return {
    title: content.headings[0] ?? service.labels[rawLang],
    description: content.description,
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { lang: rawLang, page, slug } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;
  if (page !== nav[lang].servicePath) notFound();

  const service = serviceBySlug(lang, slug);
  if (!service) notFound();

  const content = getServiceContent(lang, service);

  return (
    <SiteFrame
      lang={lang}
      alternateHref={serviceRoute(lang === "bs" ? "en" : "bs", service)}
    >
      <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 md:px-8">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.45fr]">
          <Reveal>
            <Eyebrow>
              {service.eyebrow} / {service.labels[lang]}
            </Eyebrow>
            <h1 className="mt-6 max-w-5xl text-5xl leading-none text-white md:text-8xl">
              {content.headings[0]}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-7 text-white/60">
              {content.lines[1] ?? content.description}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="self-end border border-white/10 bg-white/[0.03] p-6">
            <p className="font-mono text-xs uppercase text-white/45">
              {ui[lang].proof}
            </p>
            <Link
              href={`/${lang}/${nav[lang].servicePath}`}
              className="mt-10 inline-flex border-b border-white/30 pb-3 font-mono text-xs uppercase"
            >
              {ui[lang].backServices} →
            </Link>
          </Reveal>
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
