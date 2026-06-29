# Trionn Animation Research 2026-06-29

Source: `https://trionn.com/`

Fresh files:

- `work/trionn-live-refresh-2026-06-29.html`
- `work/trionn-live-assets-2026-06-29/`

## Current Bundle Map

- `0hjupzaltypqn.js`
  - Hero, about, vision, key facts.
  - Uses GSAP, `useGSAP`, ScrollTrigger, SplitText, `BlurTextReveal`, `FadeInOnScroll`, `FadeOnScroll`, `WordShiftButton`.
  - Hero headline is char-split: `Designed to` plus rotating `mean something/depth/impact/purpose/intention`.
  - Hero CTA and microcopy reveal with blur and alpha.
  - About main statement is scroll-emphasized, not static text.
  - Vision is pinned with `start: top top`, `end: +=200%` desktop, `scrub: .6`, `anticipatePin: 1`.
  - Vision exit uses five vertical stripes, each animating `scaleY: 0 -> 1`.
  - Key facts cards start at `rotateX: -92`, `autoAlpha: 0`, and scrub to visible.

- `0sue_k2sp00no.js`
  - Work/services sequence.
  - `#work-section` has two layers:
    - z-2 work track.
    - z-1 embedded services stage.
  - Desktop work cards are `50%` width, vertical scroll is converted to horizontal `x`.
  - Work card inners start around `y: 550`, then rise as each panel enters.
  - Lines `.js-card-line` animate `scaleY`, mobile lines animate `scaleX`.
  - Services stage has:
    - `/video/homepage-services-video.mp4`
    - 371 frame image sequence `/images/stone/frame_0001.webp` onward.
    - DOM-range text particle burst from `[data-line]`.
    - Particle active progress around `.35` to `.53`.
    - Service cards in paired left/right viewport paths, not a static grid.
    - SVG icon paths drawn with DrawSVG when card pairs reach center timing.

- `0wf1gwg29cqjw.css`
  - Page overlay belts are ten full-width horizontal strips.
  - Flying plus markers move into/out of center.
  - Center logo box has four corner plus markers, border SVG, counter reels, and label text.

- `0.glyt1p4d3_o.js`
  - Header/menu/sound stack.
  - Header uses `mix-blend-difference`.
  - Menu opens through GSAP timeline with clip-path circle on desktop and x-slide on mobile.
  - Mobile menu uses `data-lenis-prevent`.

## Applied To EvolveUp In This Pass

- Services stage cards now move through the viewport in left/right paired paths instead of sitting as a bottom grid.
- Service words now expose `data-line` markers, matching the Trionn particle source convention.
- Particle burst now reads from `[data-line] [data-service-letter]`, sends selected hero characters toward viewport center, and scatters the rest with 3-axis rotation.
- Service card SVG icons now draw through Framer Motion `pathLength` during each card's scroll window, matching the DrawSVG timing idea without adding GSAP.
- Build passes in workspace and live repo.

## Still Missing

- Real 371-frame image sequence.
- Real video blend layer.
- Exact GSAP DrawSVG plugin parity.
- Full GSAP ScrollTrigger pinned sequencing.
- Fully reliable browser QA from the in-app tab; local server responds, but the tab stayed on its internal load error.
