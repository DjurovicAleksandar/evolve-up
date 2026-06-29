import Image from "next/image";
import Link from "next/link";
import { HeaderControls } from "./HeaderControls";
import { IntroOverlay } from "./IntroOverlay";
import { nav, route, type Lang } from "@/lib/content";
import { WordShiftLink } from "./WordShiftLink";

export function SiteFrame({
  lang,
  children,
  alternateHref,
}: {
  lang: Lang;
  children: React.ReactNode;
  alternateHref?: string;
}) {
  return (
    <>
      <IntroOverlay />
      <Header lang={lang} alternateHref={alternateHref} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}

function Header({ lang, alternateHref }: { lang: Lang; alternateHref?: string }) {
  const other = lang === "bs" ? "en" : "bs";
  const talk = lang === "bs" ? "Konsultacije" : "Let's talk";
  const labels = nav[lang];
  const links = [
    { href: `/${lang}`, label: labels.home },
    { href: route(lang, "services"), label: labels.services },
    { href: route(lang, "about"), label: labels.about },
    { href: route(lang, "contact"), label: labels.contact },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex h-20 max-w-[96rem] items-center justify-between px-4 text-white md:h-24 md:px-8">
        <Link href={`/${lang}`} className="pointer-events-auto flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Evolve Up"
            width={154}
            height={34}
            priority
            className="header-logo"
          />
        </Link>

        <HeaderControls
          alternateHref={alternateHref ?? `/${other}`}
          other={other}
          talk={talk}
          contactHref={route(lang, "contact")}
          links={links}
        />
      </div>
    </header>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const labels = nav[lang];
  const footerTitle =
    lang === "bs"
      ? "Razgovor koji pravi sljedeći korak jasnim."
      : "A conversation that makes the next move clear.";
  const footerBody =
    lang === "bs"
      ? "Ako rast zavisi od previše odluka odjednom, počinjemo od sistema: šta mjerimo, šta popravljamo i koji kanal prvo nosi rezultat."
      : "If growth depends on too many decisions at once, we start with the system: what we measure, what we fix, and which channel should move first.";
  const cta = lang === "bs" ? "Zakaži konsultacije" : "Book a consultation";

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink px-4 py-16 text-white md:px-8 md:py-24">
      <div className="stage-scan absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,106,4,0.12),transparent_28%),linear-gradient(180deg,#11161a,#050505_68%)]" />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-12 md:pb-20">
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase text-orange">Evolve Up Consulting</p>
            <h2 className="mt-5 max-w-5xl text-[clamp(3rem,8vw,8rem)] leading-[0.88]">
              {footerTitle}
            </h2>
          </div>
          <div className="self-end md:col-span-4 md:col-start-9">
            <p className="max-w-md text-sm leading-6 text-white/60 md:text-base md:leading-7">
              {footerBody}
            </p>
            <WordShiftLink
              href={route(lang, "contact")}
              text={cta}
              className="mt-8 inline-flex min-w-64 items-center justify-between border-b border-white/35 pb-3 font-mono text-xs uppercase text-white"
            />
          </div>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-12 md:pt-12">
          <div className="md:col-span-5">
            <Image src="/logo.svg" alt="Evolve Up" width={180} height={40} />
            <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
              Evolve Up Consulting. Lojalan partner za kontinuiran poslovni rast i
              napredne digitalne strategije.
            </p>
          </div>
          <nav className="font-mono text-xs uppercase leading-7 text-white/55 md:col-span-2 md:col-start-8">
            <p className="mb-3 text-white">{labels.services}</p>
            <Link className="block border-b border-white/10 py-2 transition hover:text-white" href={route(lang, "services")}>
              {labels.services}
            </Link>
            <Link className="block border-b border-white/10 py-2 transition hover:text-white" href={route(lang, "about")}>
              {labels.about}
            </Link>
            <Link className="block border-b border-white/10 py-2 transition hover:text-white" href={route(lang, "contact")}>
              {labels.contact}
            </Link>
          </nav>
          <div className="text-sm leading-7 text-white/60 md:col-span-3 md:col-start-10">
            <p className="font-mono text-xs uppercase text-white">{lang === "bs" ? "Kontakt" : "Contact"}</p>
            <p className="mt-3">Ive Andrića 17, Istočno Sarajevo</p>
            <p>office@evolveup-consulting.com</p>
            <p>+387 65 354 582</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
