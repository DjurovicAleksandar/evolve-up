# Trionn Homepage Deep Research

Source: `https://trionn.com/`
Date: 2026-06-27

## Evidence Collected

- Live HTML refreshed into `work/trionn-live.html`.
- Static assets inspected from `work/trionn-assets/`.
- Runtime scroll probe saved to `outputs/trionn-scroll-probe.json`.
- Viewport screenshots saved as `outputs/trionn-probe-*.png`.

Key screenshots:

- `outputs/trionn-probe-00-hero.png`
- `outputs/trionn-probe-04.png`
- `outputs/trionn-probe-08.png`
- `outputs/trionn-probe-13.png`

## Framework And Motion Stack

- Next.js app, served through `/_next/static/...`.
- Main motion libraries and primitives found:
  - GSAP
  - `useGSAP`
  - ScrollTrigger
  - DrawSVG
  - Lenis smooth scroll
  - WebGL/canvas/shader bundle
  - `requestAnimationFrame`
  - `ResizeObserver`
  - `getBoundingClientRect`
  - CSS `mix-blend-difference`
  - `force3D` transforms

Important chunks:

- `_next_static_chunks_0hjupzaltypqn.js`
  - main hero, about, vision, keyfacts transition logic
  - `main-banner`, `home-about`, `vision-section`, `keyfacts-section`
  - `BlurTextReveal`, `FadeInOnScroll`, `WordShiftButton`
  - pinned ScrollTrigger timeline for `vision-section`
- `_next_static_chunks_0sue_k2sp00no.js`
  - selected work horizontal section
  - `js-work-card`, `js-card-line`, `js-card-line-horizontal`
  - service stage and service card data
  - pinned ScrollTrigger timeline that maps vertical scroll to horizontal x movement
- `_next_static_chunks_0hy4s_59bkbd5.js`
  - ScrollTrigger and DrawSVG plugin implementation
- `_next_static_chunks_0.glyt1p4d3_o.js`
  - Lenis setup
- `_next_static_chunks_15ky3h9upk1qm.js`
  - heavy WebGL/canvas/shader code

## Runtime Section Map

Live DOM sections from browser:

1. `main-banner`
   - `class="main-banner relative min-h-dvh pt-25 lg:pt-30 pb-14 flex w-full"`
   - Huge headline: `Designed to` + rotating `mean something/depth/impact/purpose/intention`.
   - CTA: `Start a Project`.
   - Stats card: `Est. 2012`, `14+ years shaping digital direction`.
   - Subtitle: `Websites, AI products, brands, and systems built for clarity, scale and impact.`
   - Center WebGL/canvas visual and diagonal/orbital lines.
   - Microcopy: `Hold to blast`, `Dare to touch the lines`.

2. `home-about`
   - Dark section, still in same visual language.
   - Oversized text: independent studio / strategy / design / technology.
   - Text uses dim base color and reveal/scroll emphasis.
   - Has horizontal line plus small cross icon between content blocks.

3. `vision-section`
   - Pinned dark section.
   - Large horizontal marquee: `INSPIRE + INNOVATE + IMPACT`.
   - Small label: `Focused vision. Measured execution.`
   - ScrollTrigger pins this section and reveals vertical stripes/transition into the light section.

4. `keyfacts-section`
   - Light grey/white gradient section.
   - Center title: `Key facts`.
   - Cards use perspective/3D transforms.
   - Partner row appears before selected work in the scroll sequence.

5. Selected work horizontal section
   - Not exposed as a simple `section`; it is a pinned horizontal track.
   - DOM classes: `.js-work-card`, `.js-work-card-inner`, `.js-card-line`, `.js-card-line-horizontal`.
   - First panel is title: `Selected work & explorations`.
   - Project cards are 50vw wide on desktop.
   - Vertical scroll is converted into horizontal x translation.
   - Includes final CTA panel: `Discover our complete collection...`.

6. `trionn-services`
   - Dark/atmospheric stage.
   - Uses video background and image sequence/canvas-like layer.
   - Large stacked words: `A.I.`, `DESIGN`, `DEVELOPMENT`, `BRANDING`.
   - Service cards overlay later with SVG line icons.

7. `testimonials`
   - Light section after services.

## Scroll Probe Summary

Probe positions:

- `00-hero`, y=0: hero visible.
- `01`, y=456: about starts while hero exits.
- `03-06`, y=1368-2736: `vision-section` pinned; marquee remains centered while scroll progresses.
- `07`, y=3192: light transition/key facts enters.
- `08`, y=3648: selected work horizontal track visible.
- `09-12`, y=4104-5472: horizontal selected work cards continue.
- `13-16`, y=5928-7296: services stage pinned; large service words and atmospheric background.

## What EvolveUp Homepage Must Adopt

Required changes from evidence:

- Keep current 3D/CSS object for now.
- Replace generic grid flow with Trionn-like sequence:
  1. Dark hero.
  2. Dark about statement.
  3. Pinned-feeling vision marquee.
  4. Light key facts transition.
  5. Horizontal selected-work/services track.
  6. Dark atmospheric services stage.
  7. CTA.
- Add real animation primitives:
  - word/char reveal
  - blur/fade entrance
  - horizontal scroll section
  - marquee
  - card reveal
  - line/cross motifs
- Keep the page visually dense and cinematic, not a normal SaaS landing page.

## What We Will Not Clone Yet

- Full WebGL/shader system.
- Full GSAP/ScrollTrigger pinned timelines.
- DrawSVG plugin implementation.
- Sound interaction.
- Exact Trionn copy, logo, project imagery, or service images.
