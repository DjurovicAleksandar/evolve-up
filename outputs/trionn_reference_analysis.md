# Trionn Reference Analysis For Evolve Up

Source: https://trionn.com/
Date: 2026-06-27

## Snapshot Files

- `outputs/trionn-nocookie-hero.png`
- `outputs/trionn-nocookie-about.png`
- `outputs/trionn-nocookie-marquee.png`
- `outputs/trionn-nocookie-keyfacts.png`
- `outputs/trionn-nocookie-work-01.png`
- `outputs/trionn-nocookie-work-02.png`
- `outputs/trionn-nocookie-services-01.png`
- `outputs/trionn-nocookie-services-02.png`
- `outputs/trionn-nocookie-contact.png`

`outputs/trionn-iab-fullpage.png` exists, but it is not a good reference because the page uses pinned scroll scenes, so a full-page screenshot repeats the sticky hero state.

## Technical Findings

- Platform: Next.js. Response headers included `X-Powered-By: Next.js`, and assets are served from `/_next/static/...`.
- Motion stack: GSAP, `@gsap/react` style `useGSAP`, ScrollTrigger, DrawSVG, Lenis smooth scroll.
- Heavy visual layer: WebGL/canvas is present. The largest JS bundle has many WebGL/shader references (`WebGL`, `webgl`, `shader`, `glsl`, `canvas`, `getContext`, `uniform`, `attribute`).
- The hero is not just a normal animation. It is a long pinned scroll scene with a dark 3D/canvas object, line overlays, particle-like shards, word changes, and cursor/hold interaction.
- The site uses large editorial typography, tiny mono labels, sticky header controls, horizontal work cards, dramatic dark-to-light section changes, SVG line drawing, and animated service cards.
- Service data found in bundle: AI & Intelligent Automation, Web Development, Product Design, Website & Mobile Design, WordPress Development, Branding.

## What To Borrow

- Dark cinematic first viewport with one strong headline and a moving abstract brand object.
- Minimal header: logo left, language toggle / CTA / menu right.
- Hero copy should be short and direct, not a generic marketing paragraph.
- Use small mono labels for metadata: established year, services, market, process.
- Keep one strong CTA: "Zakazi konsultacije" / "Book a consultation".
- Add scroll-driven about statement with oversized text and progressive reveal.
- Use a horizontal selected-work or case-study strip, even if the first version only has service outcomes instead of full case studies.
- Use a services section with atmospheric background, animated icon lines, and 6 service cards.
- Use a sharp dark-to-light transition for credibility/results/facts.

## What Not To Copy In V1

- Do not reproduce the full WebGL system exactly. It is expensive and not needed to make Evolve Up feel premium.
- Do not build a 371-frame style image sequence or complex particle system for the first implementation.
- Do not overdo sound/cursor/hold interactions. Nice for awards sites, risky for a business conversion site.
- Do not use Trionn's exact copy, logo forms, images, or project assets.

## Recommended Build Direction

Use Next.js, Tailwind, Framer Motion, Lenis, and a small amount of GSAP only where Framer Motion is weak: pinned scroll scenes, SVG path drawing, and horizontal scroll.

For the Evolve Up homepage:

1. Hero: black background, huge headline, abstract 3D-feeling Evolve Up mark/object, orange/blue accent lighting.
2. Intro: "Digital transformation starts with the right strategy" with text reveal.
3. Services: SEO, Google/Meta Ads, social media development, marketing strategy, email marketing, web development, Meta Profit System.
4. Proof: facts, testimonials, outcomes, and process.
5. CTA: bilingual contact section with direct booking/contact form.

Palette should keep Evolve Up accents from the existing brand: orange `#ff6a04` / `#fc7800` and blue `#108aed` / `#0a74ff`, placed inside a mostly black, off-white, and graphite system.

## Verdict

This is a stronger reference than the earlier landing template for an agency homepage. It should guide the visual direction, but the implementation should be lighter: Framer Motion for regular UI motion, GSAP/ScrollTrigger for hero/about/services scroll choreography, and optional lightweight WebGL only if we want the hero object to feel truly 3D.
