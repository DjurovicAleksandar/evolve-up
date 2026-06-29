import fs from "node:fs";
import path from "node:path";

export type Lang = "bs" | "en";

export const languages: Lang[] = ["bs", "en"];

type ScrapedPage = {
  url: string;
  html: {
    title: string;
    meta: Record<string, string>;
    headings: Array<{ level: string; text: string }>;
    text: string;
    iframes: Array<{ src: string; title: string; form_id?: string }>;
  };
};

type Scrape = { pages: ScrapedPage[] };

export type PageContent = {
  title: string;
  description: string;
  headings: string[];
  lines: string[];
  sections: Array<{ title: string; body: string[] }>;
  iframes: ScrapedPage["html"]["iframes"];
};

export type Service = {
  id: string;
  slugs: Record<Lang, string>;
  labels: Record<Lang, string>;
  sourcePaths: Record<Lang, string>;
  eyebrow: string;
};

const scrapePath = path.join(process.cwd(), "outputs/evolveup_site_scrape.json");

let cachedScrape: Scrape | null = null;

function scrape() {
  cachedScrape ??= JSON.parse(fs.readFileSync(scrapePath, "utf8")) as Scrape;
  return cachedScrape;
}

const pagePaths = {
  home: { bs: "/", en: "/en/" },
  about: { bs: "/about/", en: "/en/about/" },
  contact: { bs: "/kontakt/", en: "/en/kontakt/" },
  services: {
    bs: "/usluge-evolve-up-consulting/",
    en: "/en/usluge-evolve-up-consulting/",
  },
} as const;

const commonLines = new Set([
  "Home",
  "About",
  "Services",
  "Blog",
  "Contact Us",
  "Skip to content",
  "Скочите на садржај",
  "EN",
  "SR",
  "EVOLVE UP CONSULTING",
  "Evolve up CONSULTING",
]);

export const nav = {
  bs: {
    home: "Početna",
    about: "O nama",
    services: "Usluge",
    contact: "Kontakt",
    cta: "Zakaži konsultacije",
    servicePath: "usluge",
  },
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    cta: "Book a consultation",
    servicePath: "services",
  },
} as const;

export const pageSlugs = {
  bs: { about: "o-nama", services: "usluge", contact: "kontakt" },
  en: { about: "about", services: "services", contact: "contact" },
} as const;

export const services: Service[] = [
  {
    id: "web-development",
    slugs: { bs: "web-development", en: "web-development" },
    labels: { bs: "Web development", en: "Web development" },
    sourcePaths: { bs: "/web-development/", en: "/en/web-development/" },
    eyebrow: "01",
  },
  {
    id: "seo",
    slugs: { bs: "seo-optimizacija", en: "seo-optimization" },
    labels: { bs: "SEO optimizacija", en: "SEO optimization" },
    sourcePaths: { bs: "/seo-optimizacija/", en: "/en/seo-optimizacija/" },
    eyebrow: "02",
  },
  {
    id: "social",
    slugs: { bs: "razvoj-drustvenih-mreza", en: "social-media-growth" },
    labels: { bs: "Razvoj društvenih mreža", en: "Social media growth" },
    sourcePaths: {
      bs: "/razvoj-drusvenih-mreza/",
      en: "/en/razvoj-drusvenih-mreza/",
    },
    eyebrow: "03",
  },
  {
    id: "email",
    slugs: { bs: "email-marketing", en: "email-marketing" },
    labels: { bs: "Email marketing", en: "Email marketing" },
    sourcePaths: { bs: "/email-marketing/", en: "/en/email-marketing/" },
    eyebrow: "04",
  },
  {
    id: "ads",
    slugs: { bs: "google-i-meta-ads", en: "google-meta-ads" },
    labels: { bs: "Google i Meta Ads", en: "Google & Meta Ads" },
    sourcePaths: { bs: "/google-i-meta-ads/", en: "/en/google-i-meta-ads/" },
    eyebrow: "05",
  },
  {
    id: "strategy",
    slugs: {
      bs: "izrada-marketing-strategije",
      en: "marketing-strategy",
    },
    labels: { bs: "Marketing strategija", en: "Marketing strategy" },
    sourcePaths: {
      bs: "/izrada-marketing-strategije/",
      en: "/en/izrada-marketing-strategije/",
    },
    eyebrow: "06",
  },
  {
    id: "meta-profit",
    slugs: { bs: "meta-profit-sistem", en: "meta-profit-system" },
    labels: { bs: "Meta Profit Sistem", en: "Meta Profit System" },
    sourcePaths: { bs: "/meta-profit-sistem/", en: "/en/meta-profit-sistem/" },
    eyebrow: "07",
  },
];

export function isLang(value: string): value is Lang {
  return languages.includes(value as Lang);
}

export function route(lang: Lang, key: keyof typeof pageSlugs.bs) {
  return `/${lang}/${pageSlugs[lang][key]}`;
}

export function serviceRoute(lang: Lang, service: Service) {
  return `/${lang}/${nav[lang].servicePath}/${service.slugs[lang]}`;
}

export function serviceBySlug(lang: Lang, slug: string) {
  return services.find((service) => service.slugs[lang] === slug);
}

export function pageKeyFromSlug(lang: Lang, slug: string) {
  return (Object.keys(pageSlugs[lang]) as Array<keyof typeof pageSlugs.bs>).find(
    (key) => pageSlugs[lang][key] === slug,
  );
}

export function getPageContent(
  lang: Lang,
  key: keyof typeof pagePaths,
): PageContent {
  return contentFromPath(pagePaths[key][lang]);
}

export function getServiceContent(lang: Lang, service: Service): PageContent {
  return contentFromPath(service.sourcePaths[lang]);
}

function contentFromPath(sourcePath: string): PageContent {
  const url = `https://evolveup-consulting.com${sourcePath}`;
  const page = scrape().pages.find((item) => item.url === url);

  if (!page) {
    throw new Error(`Missing scraped page: ${url}`);
  }

  const headings = page.html.headings.map((heading) => clean(heading.text));
  const lines = page.html.text
    .split("\n")
    .map(clean)
    .filter((line) => line && !commonLines.has(line));

  return {
    title: page.html.title,
    description: page.html.meta.description ?? "",
    headings,
    lines,
    sections: toSections(lines, headings),
    iframes: page.html.iframes,
  };
}

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toSections(lines: string[], headings: string[]) {
  const headingSet = new Set(headings);
  const sections: Array<{ title: string; body: string[] }> = [];
  let current: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    if (headingSet.has(line)) {
      if (current) sections.push(current);
      current = { title: line, body: [] };
      continue;
    }

    if (!current) {
      current = { title: line, body: [] };
      continue;
    }

    current.body.push(line);
  }

  if (current) sections.push(current);
  return sections;
}
