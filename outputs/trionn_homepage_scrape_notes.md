# Trionn Homepage Scrape Notes

Source: https://trionn.com/

## Framework And Assets

- Next.js app served from `/_next/static/...`.
- Header response showed `X-Powered-By: Next.js`.
- Fonts detected in preload/static assets:
  - Familjen Grotesk
  - Martian Mono
  - Neue Haas Display
  - PP Editorial New
- Logo asset: `/images/logo.svg`.

## Animation Stack Found In Bundles

- GSAP
- `@gsap/react` style `useGSAP`
- ScrollTrigger
- DrawSVG plugin
- Lenis smooth scroll
- WebGL/canvas/shader code in the largest JS chunk

Important bundle evidence:

- `_next_static_chunks_0hjupzaltypqn.js`
  - Main hero/banner component.
  - Contains `main-banner`, `Designed to`, rotating words, `Start a Project`, stats block, `Hold to blast`, and `Dare to touch the lines`.
  - Uses `ScrollTrigger.create`, pinned scroll, scrubbed timelines.
- `_next_static_chunks_0sue_k2sp00no.js`
  - Selected work horizontal/pinned section.
  - Contains `Selected work & explorations`, `js-work-card`, project cards, horizontal scroll logic.
  - Contains service card data and SVG draw paths.
- `_next_static_chunks_0hy4s_59bkbd5.js`
  - Includes ScrollTrigger and DrawSVG implementation code.
- `_next_static_chunks_15ky3h9upk1qm.js`
  - Heavy WebGL/canvas/shader bundle.

## Homepage Structure

1. Fixed header:
   - Logo left.
   - Small circular sound/action control.
   - Pill CTA.
   - Pill menu button.
2. Dark first viewport:
   - Huge editorial headline.
   - Split hero phrase with animated rotating word.
   - CTA below headline.
   - Central 3D/WebGL/canvas object.
   - Thin orbital/diagonal lines.
   - Small stats box on the right.
   - Microcopy: `Hold to blast` / `Dare to touch the lines`.
3. Dark about transition:
   - Oversized text over the same cinematic visual language.
4. Horizontal selected-work section:
   - Pinned/horizontal cards.
   - Large typography on a light background.
5. Key facts:
   - Light section after dark cinematic blocks.
6. Services:
   - Atmospheric dark background.
   - Large stacked service words.
   - Animated cards and SVG line drawing.

## EvolveUp Homepage Adaptation

Implemented in V1:

- Trionn-style fixed header.
- Shorter hero rhythm: `Digitalna transformacija počinje sa strategijom.`
- Rotating strategy/system/growth/sales word set.
- Dark cinematic hero with CSS 3D object, orbital lines, light rays, shards, orange/blue brand lighting.
- Stats box and microcopy in the hero.
- Dark about section with oversized text.
- Large service marquee.
- Light key facts section.
- Atmospheric services block.

Skipped for now:

- Full WebGL/Three clone.
- GSAP pinned scroll timeline.
- Sound/cursor/hold interaction.

Add those only after the homepage direction is approved.
