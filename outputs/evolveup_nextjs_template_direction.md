# Evolve Up Next.js Direction

Reference inspected: https://landing-page-template-1.aniq-ui.com/

## Verdict

Yes, this direction fits Evolve Up well. The template is already a Next.js/Tailwind style landing page with a black/white brutalist visual system, Framer Motion reveal animations, canvas noise background, cursor follower, big typography, thin borders, low-radius cards, and grayscale-to-color project cards.

For Evolve Up, use the template as a design language, not as copy:

- Keep: black base, white typography, neutral borders, sharp cards, big hero, scroll reveal, hover motion, noise canvas, service cards, process timeline, contact block.
- Adapt: replace "minimal design studio" language with digital-growth/marketing-system language.
- Add brand accent: Evolve Up orange/blue from the logo: `#ff6a04`, `#fc7800`, `#108aed`, `#0a74ff`.
- Avoid: copying the pricing section as-is. Evolve Up sells services/systems, so use "Paketi saradnje" or "Kako izgleda saradnja" instead.

## Template Anatomy

- Fixed navbar, transparent at top, black/blur after scroll.
- Hero with badge, 3-line huge headline, CTA buttons, and animated geometric square.
- Features section: 4 cards, `border-2 border-white/20`, `bg-white/5`, hover border/opacity.
- Work section: 2-column cards, grayscale images, hover color reveal, image scale, bottom overlay slide-up.
- Process section: vertical timeline with numbered steps.
- Testimonials carousel.
- Pricing cards with annual/monthly toggle.
- Contact form + contact info card.
- Footer with anchors and social links.

## Animation Notes

- Framer Motion is used for most motion.
- Section headings animate with `initial: { opacity: 0, y: 20 }`, `whileInView: { opacity: 1, y: 0 }`, `duration: .5`.
- Hero headline uses word reveal: spans start `opacity: 0`, `filter: blur(10px)`, then animate to visible/blur 0.
- Hero geometric shape uses staggered border drawing:
  - outer container fade in
  - panel scale from `.92` to `1`
  - borders animate `scaleX` / `scaleY`
  - center square spring-scales in
- Cursor follower uses `requestAnimationFrame`, mousemove, and link hover scale.
- Background noise is a full-screen canvas, regenerated on animation frames, opacity around `5%`.
- Work cards use pure Tailwind hover:
  - `grayscale group-hover:grayscale-0`
  - `group-hover:scale-105`
  - overlay `translate-y-full group-hover:translate-y-0`

## Evolve Up Content Mapping

Homepage:

- Hero: "Digitalna transformacija počinje sa jasnom strategijom i pravim timom"
- Supporting line: use existing home copy about quality product, stagnation, and system that brings results.
- Primary CTA: "Zakažite konsultacije"
- Secondary CTA: "Pogledajte usluge"

Service cards:

- Google i Meta Ads
- SEO optimizacija
- Razvoj društvenih mreža
- Email marketing
- Web Development
- Izrada marketing strategije
- Meta Profit Sistem

Process timeline:

1. Analiza
2. Strategija
3. Implementacija
4. Optimizacija
5. Skaliranje

Proof section:

- Client logos from About page.
- Existing testimonials if they are usable; otherwise use "rezultati/sistemi" metrics instead of fake quotes.

Contact:

- Email: `office@evolveup-consulting.com`
- Phone/WhatsApp: `+387 65 354 582`
- Existing LeadConnector contact form can stay as embed, or we build a native form later.

## Bilingual Structure

Use route-based locales:

- `/bs` or `/` for Bosnian/Serbian content
- `/en` for English content

Simple implementation:

- `app/[locale]/page.tsx`
- `app/[locale]/services/[slug]/page.tsx`
- `content/site.ts` containing `bs` and `en` dictionaries
- language switcher keeps same slug when available

This is enough. No i18n library needed unless the site grows into complex routing.

## Build Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- lucide-react
- next/image
- Static content dictionaries generated from `evolveup_site_scrape.json`

## Lazy Scope

First shippable version should be:

- bilingual homepage
- service detail pages
- about/contact/privacy
- blog index + blog detail from scraped content
- responsive nav and language switch
- one contact CTA path

Skipped for v1:

- CMS
- admin editor
- pricing engine
- custom animation framework
- downloading every old image

Add those only when someone will actually maintain them.
