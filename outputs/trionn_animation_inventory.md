# Trionn Animation Inventory

Source: `https://trionn.com/`
Date: 2026-06-27

## Evidence Files

- `work/trionn-live.html`
- `work/trionn-assets/_next_static_chunks_0hjupzaltypqn.js`
- `work/trionn-assets/_next_static_chunks_0sue_k2sp00no.js`
- `work/trionn-assets/_next_static_chunks_0.glyt1p4d3_o.js`
- `work/trionn-assets/_next_static_chunks_0hy4s_59bkbd5.js`
- `work/trionn-assets/_next_static_chunks_0sc3z3ff25230.css`
- `outputs/trionn-scroll-probe.json`

## Global Motion System

- Framework: Next.js app with client-heavy animated sections.
- Motion stack:
  - GSAP
  - `@gsap/react` / `useGSAP`
  - ScrollTrigger
  - DrawSVG
  - Lenis smooth scroll
  - WebGL / Three.js / shader canvas
  - `requestAnimationFrame`
  - `ResizeObserver`
  - `IntersectionObserver`
- Global scroll uses Lenis options with smooth wheel, custom easing, `duration: 1.05`, `lerp: .105`, wheel multipliers, and `data-lenis-prevent` for mobile menu.
- Header uses `mix-blend-difference`, so it visually inverts over dark/light sections instead of swapping explicit themes.

## Hero / Main Banner

Evidence: `_next_static_chunks_0hjupzaltypqn.js`

- Section class: `main-banner`.
- Parent wrapper uses `mix-blend-difference`.
- Headline:
  - `BlurTextReveal` on characters.
  - First line: `Designed to`.
  - Second line uses rotating words after `mean`: `something`, `depth`, `impact`, `purpose`, `intention`.
  - Stagger is around `.08` per character.
  - Delayed entrance around `1.2s`.
- CTA:
  - Starts hidden with blur.
  - Reveals with `autoAlpha` and `filter: blur(0px)`.
  - Uses `WordShiftButton`, not a static link.
- Microcopy:
  - `Hold to blast`.
  - `Dare to touch the lines.`
  - Revealed with word-level blur text.
- Hero visual:
  - WebGL/canvas is handled outside this chunk.
  - Page passes ids such as `nav`, `s1-headline`, `s1-sub`, `s1-scroll`, `s1-stats`, `s1-box`, `s1-cta` into a vibration/blast layer.

## About Section

Evidence: `_next_static_chunks_0hjupzaltypqn.js`

- Section class: `home-about`.
- Dark background continues the hero mood.
- The label `about` uses `BlurTextReveal`.
- Main statement uses `FadeOnScroll`, not plain static text.
- Decorative line/cross divider appears between text groups.
- The section keeps the same difference-blend text behavior from the hero wrapper.

## Vision Section

Evidence: `_next_static_chunks_0hjupzaltypqn.js`

- Section id: `vision-section`.
- ScrollTrigger:
  - Trigger: vision section.
  - Start: `top top`.
  - End: about `+=200%` desktop, `+=150%` touch.
  - `pin: true`
  - `scrub: .6`
  - `anticipatePin: 1`
  - `pinSpacing: true`
- Marquee:
  - Words: `INSPIRE + INNOVATE + IMPACT`.
  - Uses a marquee component with speed around `.8`.
- Transition into key facts:
  - 5 stripe elements animate `scaleY` from 0 to 1.
  - Stripe timings are staggered with a label named `stripes_start`.
  - `keyfacts-section` receives a negative top margin equal to the vision section height, refreshed through `refreshInit`, `requestAnimationFrame`, and `ResizeObserver`.

## Key Facts

Evidence: `_next_static_chunks_0hjupzaltypqn.js`

- Section id: `keyfacts-section`.
- Desktop cards:
  - Initial `rotateX: -92`.
  - Transform origin: `center top`.
  - Animate to `rotateX: 0`, `autoAlpha: 1`.
  - ScrollTrigger start: `top center`.
  - End: `top top`.
  - `scrub: 2`.
  - Stagger each card around `.6`.
- Mobile cards:
  - Section is pinned.
  - The card list translates horizontally while pinned.

## Selected Work / Horizontal X Scroll

Evidence: `_next_static_chunks_0sue_k2sp00no.js`

- Track classes:
  - `.js-work-card`
  - `.js-work-card-inner`
  - `.js-card-line`
  - `.js-card-line-horizontal`
- First panel:
  - `Selected work & explorations`.
  - Title uses `BlurTextReveal` with character animation and `.05` stagger.
- Desktop behavior:
  - Panels are 50% viewport/container width.
  - Vertical scroll is converted to horizontal travel using `scrollWidth - containerWidth`.
  - Track is pinned with ScrollTrigger.
  - Track updates use `force3D`.
- Mobile behavior:
  - It becomes vertical travel instead of desktop x-scroll.
  - Horizontal card separator lines animate with `scaleX`.
- Detail animations:
  - Card text starts hidden with `autoAlpha: 0`.
  - Each panel exposes a `playPanel(index)` imperative method.
  - Headline, subtitle, and CTA fade in on a short GSAP timeline.
  - Vertical separator lines animate with `scaleY`.
  - A plus marker rotates up to 360 degrees based on progress.
  - The plus fades out when the horizontal track is complete.

## Services Stage

Evidence: `_next_static_chunks_0sue_k2sp00no.js`

- Section id: `trionn-services`.
- Large words:
  - `A.I.`
  - `Design`
  - `Development`
  - `Branding`
- Visual stack:
  - Video: `homepage-services-video.mp4`.
  - Image sequence / canvas-like frame system with 371 image slots.
  - Scroll progress drives a smoothed `videoIdx`.
  - Active range for text-particle blast is approximately progress `.35` to `.53`.
- Particle blast:
  - Captures characters from `[data-line]` text using DOM ranges.
  - Creates fixed-position spans over the viewport.
  - Uses `mix-blend-mode: difference`.
  - Characters fly outward, rotate in 3 axes, scale, and fade.
  - A few hero characters grow much larger near the center.
- Cards:
  - Cards are split left/right in desktop pairs.
  - Mobile uses one-card sequence.
  - Card dimensions are recomputed on resize.
  - Cards animate along keyframed positions.
  - SVG paths use DrawSVG from `0%` to visible.
- Audio:
  - Optional sound state affects video/audio volume.
  - Audio pauses when the section leaves the viewport.

## Page Transition / Overlay

Evidence: `_next_static_chunks_0wf1gwg29cqjw.css`

- There is a fixed page-load / transition overlay.
- Overlay uses horizontal belts with `scaleY`.
- Flying plus elements move over a grey overlay.
- Center logo box has corner plus markers and SVG border paths.
- Counter uses slot-reel digits.
- Transition label fades and translates.

## EvolveUp Adjustments Made From This Inventory

- Kept the existing CSS 3D object, per request.
- Added measured sticky horizontal travel using the actual `scrollWidth - viewportWidth`.
- Added a lightweight page-load belt overlay inspired by Trionn's transition overlay.
- Added a click-triggered belt transition overlay for primary WordShift navigation.
- Added a slot-counter detail inside the overlay badge.
- Added an interactive hero cursor field with text-particle blast behavior.
- Added blur-in reveal motion to match Trionn's softer text entrance.
- Added 3D key-facts card rotation inspired by Trionn's `rotateX: -92` card reveal.
- Added progress rail and rotating plus marker to the horizontal section.
- Added blur/fade card reveal to horizontal service cards.
- Replaced the static dark services grid with a pinned services stage.
- Added scroll-driven services title/card movement.
- Added service cards with animated SVG draw-style paths.
- Added a lightweight services text-particle blast inspired by Trionn's `[data-line]` character explosion.
- Added Trionn-style word-shift hover behavior on primary CTAs and navigation actions.
- Kept implementation on Framer Motion and CSS only; no GSAP/Lenis dependency added yet.

## Still Not Implemented

- Full WebGL/shader canvas.
- Lenis-quality smooth scroll.
- Full DOM-range text-particle blast with per-character source positions.
- Video/image-sequence services layer.
- Full flying-plus page transition choreography.
- Sound interaction.

Those are larger subsystems. The next smallest high-impact addition would be the text-particle blast in the services stage, because it is visually distinctive and does not require cloning the full WebGL object.
