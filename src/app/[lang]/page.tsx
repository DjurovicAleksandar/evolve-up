import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroTitle } from "@/components/HeroTitle";
import { HorizontalShowcase } from "@/components/HomeShowcase";
import { KeyFacts } from "@/components/KeyFacts";
import { OpeningMotionScope } from "@/components/OpeningMotionScope";
import { ContentSections, Eyebrow } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { ServicesStage } from "@/components/ServicesStage";
import { SiteFrame } from "@/components/SiteFrame";
import { AboutStatement, ServiceWipeTransition, VisionWipeSection } from "@/components/TrionnMotionSections";
import { WordShiftLink } from "@/components/WordShiftLink";
import {
  getPageContent,
  getServiceContent,
  isLang,
  languages,
  route,
  serviceRoute,
  services,
  type Lang,
} from "@/lib/content";
import { ui } from "@/lib/text";

type Params = Promise<{ lang: string }>;

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) return {};
  const content = getPageContent(rawLang, "home");

  return {
    title: content.headings[0] ?? content.title,
    description: content.description,
  };
}

export default async function HomePage({ params }: { params: Params }) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();

  const lang: Lang = rawLang;
  const content = getPageContent(lang, "home");
  const heroLine = lang === "bs" ? "Strategija" : "Strategy";
  const heroPrefix = lang === "bs" ? "koja znači" : "that means";
  const heroWords =
    lang === "bs"
      ? ["rast.", "prodaju.", "sistem.", "jasnoću."]
      : ["growth.", "sales.", "systems.", "clarity."];
  const subtitle = content.lines[1] ?? content.description;
  const secondary = content.headings[1];
  const serviceItems = services.map((service) => {
    const serviceContent = getServiceContent(lang, service);
    return {
      eyebrow: service.eyebrow,
      title: service.labels[lang],
      body:
        serviceContent.lines.find((line) => line.length > 80) ??
        serviceContent.description,
      href: serviceRoute(lang, service),
    };
  });
  const proofItems: Array<[string, string]> =
    lang === "bs"
      ? [
          ["3.3M KM", "managed ad spend"],
          ["10+ god.", "prodaja i biznis"],
          ["6", "ključnih kanala"],
        ]
      : [
          ["3.3M KM", "managed ad spend"],
          ["10+ yrs", "sales and business"],
          ["6", "core channels"],
        ];

  return (
    <SiteFrame lang={lang} alternateHref={lang === "bs" ? "/en" : "/bs"}>
      <OpeningMotionScope>
        <section className="relative flex min-h-dvh overflow-hidden bg-ink px-4 pb-8 pt-24 md:px-8 md:pt-28">
          <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-[96rem] content-between gap-10">
            <div className="grid min-h-[calc(100dvh-8rem)] gap-10 md:grid-cols-12">
              <Reveal className="pointer-events-auto self-start md:col-span-8">
                <Eyebrow>Evolve Up Consulting</Eyebrow>
                <HeroTitle line={heroLine} prefix={heroPrefix} words={heroWords} />
                <p className="mt-8 max-w-xl text-base leading-7 text-white/65 md:text-lg">
                  {content.headings[0]}. {subtitle}
                </p>
                <WordShiftLink
                  href={route(lang, "contact")}
                  text={lang === "bs" ? "Započni projekat" : "Start a project"}
                  className="mt-8 inline-flex min-w-72 items-center justify-between border-b border-white/40 pb-3 font-mono text-xs uppercase text-white"
                />
              </Reveal>

              <Reveal className="pointer-events-auto self-end md:col-span-4 md:justify-self-end" delay={0.15}>
                <div className="w-full max-w-sm">
                  <div className="grid grid-cols-2 border border-white/10 bg-white/[0.035] backdrop-blur-sm">
                    <div className="border-r border-white/10 p-5">
                      <p className="font-mono text-xs uppercase text-white/45">Est.</p>
                      <p className="mt-8 text-2xl text-white">2025</p>
                    </div>
                    <div className="p-5">
                      <p className="font-mono text-xs uppercase text-white/45">Direction</p>
                      <p className="mt-8 text-xl leading-tight text-white">
                        {lang === "bs" ? "Digitalni rast" : "Digital growth"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-lg leading-6 text-white/75">{secondary}</p>
                </div>
              </Reveal>

              <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-center font-mono text-xs uppercase leading-5 text-white/70 md:block">
                <p>{lang === "bs" ? "Strategija u pokretu" : "Strategy in motion"}</p>
                <p>{lang === "bs" ? "Sistem koji se vidi." : "Systems you can see."}</p>
              </div>
            </div>
          </div>
        </section>

        <AboutStatement
          eyebrow={lang === "bs" ? "O nama" : "About"}
          title={content.headings[2]}
          body={content.lines[5] ?? content.description}
          cta={lang === "bs" ? "Više o nama" : "More about us"}
          href={route(lang, "about")}
        />

        <VisionWipeSection
          top={lang === "bs" ? "Fokusirana vizija. Mjerljiva egzekucija." : "Focused vision. Measured execution."}
          bottom={lang === "bs" ? "Različiti kanali. Jedan standard sistema." : "Different channels. One standard of system."}
          words={lang === "bs" ? ["Strategija", "Vidljivost", "Prodaja", "Sistem"] : ["Strategy", "Visibility", "Sales", "Systems"]}
        />
      </OpeningMotionScope>

      <KeyFacts
        eyebrow="Key facts"
        title={lang === "bs" ? "Rast koji se mjeri." : "Growth you can measure."}
        items={proofItems}
      />

      <HorizontalShowcase
        title={lang === "bs" ? "Sistemi, usluge & rast" : "Systems, services & growth"}
        cta={ui[lang].allServices}
        exploreLabel={ui[lang].viewService}
        finalHeading={
          lang === "bs"
            ? "Digitalni rast nije jedan kanal. To je sistem između svih kanala."
            : "Digital growth is not one channel. It is the system between them."
        }
        finalCta={ui[lang].allServices}
        items={serviceItems}
      />

      <ServiceWipeTransition
        words={lang === "bs" ? ["Strategija", "Vidljivost", "Sistem"] : ["Strategy", "Visibility", "Systems"]}
      />

      <ServicesStage
        eyebrow={ui[lang].proof}
        words={lang === "bs" ? ["SEO", "ADS", "WEB", "EMAIL", "STRATEGIJA"] : ["SEO", "ADS", "WEB", "EMAIL", "STRATEGY"]}
        cta={ui[lang].allServices}
        href={route(lang, "services")}
        items={serviceItems}
      />

      <section className="relative overflow-hidden bg-ink px-4 pb-32 pt-44 text-white md:px-8 md:pt-52">
        <div className="stage-scan absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(255,106,4,0.16),transparent_28%),radial-gradient(circle_at_12%_36%,rgba(16,138,237,0.1),transparent_30%),linear-gradient(180deg,#10161a,#050505_62%)]" />
        <div className="pointer-events-none absolute inset-x-4 top-28 h-px bg-white/10 md:inset-x-8" />
        <div className="relative mx-auto max-w-[96rem]">
          <div className="grid gap-10 border-b border-white/10 pb-16 md:grid-cols-12 md:pb-20">
            <div className="md:col-span-3">
              <Eyebrow>{lang === "bs" ? "Kako radimo" : "How we work"}</Eyebrow>
              <p className="mt-8 max-w-48 font-mono text-xs uppercase leading-5 text-white/45">
                {lang === "bs" ? "01 / 05 mapa procesa" : "01 / 05 process map"}
              </p>
            </div>
            <Reveal className="md:col-span-8 md:col-start-5">
              <h2 className="max-w-6xl text-[clamp(3.8rem,8.2vw,8.4rem)] leading-[0.9]">
                {content.headings[8]}
              </h2>
            </Reveal>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-[12%] top-0 hidden h-full w-px bg-white/10 md:block" />
            <ContentSections content={content} tone="dark" limit={5} />
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
