# Trionn Motion Spec For EvolveUp

Source: https://trionn.com/
Fresh scrape date: 2026-06-27

## Evidence Files

- `work/trionn-live-2026-06-27.html`
- `work/trionn-live-assets-2026-06-27/`
- `outputs/trionn_live_asset_manifest.json`
- `outputs/trionn_live_animation_probe.json`
- `outputs/trionn_runtime_desktop_probe_2026-06-27.json`
- `outputs/trionn_runtime_scroll_probe_2026-06-27.json`
- `outputs/trionn_runtime_detailed_probe_2026-06-27.json`
- `outputs/trionn-desktop-runtime-00.png`
- `outputs/trionn-desktop-runtime-03.png`
- `outputs/trionn-desktop-runtime-05.png`
- `outputs/trionn-desktop-runtime-06.png`
- `outputs/trionn-desktop-runtime-08.png`
- `outputs/trionn-desktop-runtime-09.png`

## Live Asset Map

The current Trionn homepage references 26 `_next/static` assets. Motion signals were found in 15 JS/CSS assets.

Core files:

- `_next_static_chunks_0hjupzaltypqn.js`
  - Hero, about, vision, key facts.
  - Hits: `ScrollTrigger.create`, `useGSAP`, `BlurTextReveal`, `FadeOnScroll`, `main-banner`, `home-about`, `vision-section`, `keyfacts-section`, `rotateX`, `scaleY`, `mix-blend-difference`.
- `_next_static_chunks_0sue_k2sp00no.js`
  - Horizontal work section and services stage.
  - Hits: `ScrollTrigger.create`, `js-work-card`, `js-card-line`, `trionn-services`, `data-line`, `drawSVG`, `imgs:Array(371)`, `videoIdx`, `particleContainer`, `pairCenterTimes`.
- `_next_static_chunks_02yhtxn3klj8l.js`
  - `BlurTextReveal`, `FadeOnScroll`, `WordShiftButton`, SplitText, hover underline/arrow choreography.
- `_next_static_chunks_02m2onmcd.l.g.js` and `_next_static_chunks_0wf1gwg29cqjw.css`
  - Page loader/transition overlay with 10 belts, flying plus icons, center logo frame, border draw, counter.
- `_next_static_chunks_0yhyjmpxntzgh.js`
  - Lenis smooth scroll implementation.

## Runtime Layout

Desktop probe: 1440 x 900, total scroll height 6573px.

Section order:

1. Hero / `.main-banner`
   - height 900px.
   - dark canvas area, mix-blend wrapper, huge split headline.
2. About / `.home-about`
   - height 900px.
   - dark, text-led, scroll-emphasis copy.
3. Vision / `#vision-section`
   - height 900px but pinned for roughly 200% scroll.
   - marquee `Inspire + innovate + Impact`.
   - 5 stripe elements wipe to grey/light section.
4. Key facts / `#keyfacts-section`
   - light gradient, negative-margin connection from vision.
   - cards rotate from `rotateX(-92deg)` toward flat.
5. Work / `.js-work-card`
   - desktop cards are 720px wide at 1440px viewport, exactly 50vw.
   - vertical scroll turns into horizontal card travel.
   - live runtime shows `#work-section` becomes `position: fixed` during the pinned run.
   - at the same scroll top, `#trionn-services` is already under the same viewport instead of starting as a separate later block.
6. Services / `#trionn-services`
   - dark pinned stage starting under the work track.
   - large `[data-line]` words: `A.I.`, `Design`, `Development`, `Branding`.
   - video/image sequence layer and service cards occupy the same pinned viewport.

## Animation Systems To Mirror

### Hero

- Split headline enters by character, starting blurred and hidden.
- Rotating word is also split; old chars blur out, new chars blur in from random order.
- CTA is not a normal link; it is a `WordShiftButton` with staggered letters, underline wipe, and arrow swap.
- Header uses `mix-blend-difference`.
- Hero microcopy is explicit: hold/touch interaction belongs to the visual.

EvolveUp direction:

- Keep existing CSS 3D object.
- Make surrounding text/CTA/header behave more like Trionn.
- Do not add WebGL yet.

### About

- About is not a card grid.
- It is a dark typography section with label, oversized statement, and scroll-tinted text.
- Decorative cross/line divider separates blocks.

EvolveUp direction:

- Replace any SaaS-like about block with one large editorial statement.
- Add text that brightens progressively on scroll.

### Vision

- ScrollTrigger pins the section.
- A marquee keeps moving while the page is pinned.
- At the end, 5 horizontal grey belts scale from `scaleY(0)` to `scaleY(1)` with stagger.
- Key facts receives a negative top margin so the grey wipe feels like one continuous transition.

EvolveUp direction:

- Add stripe wipe at the end of the vision section.
- Keep marquee large, flat, and typographic.

### Key Facts

- Cards use perspective.
- Desktop card animation starts from `rotateX(-92deg)`.
- Mobile switches to a pinned horizontal card list.

EvolveUp direction:

- Current rotateX cards are correct enough for v1.

### Horizontal Work

- Track cards are `50vw`.
- `#work-section` and `#trionn-services` share the same runtime top during the pinned flow; work slides away while services is already staged underneath.
- Work cards expose an imperative `playPanel(index)` animation.
- Vertical separator lines animate `scaleY`.
- Mobile lines animate `scaleX`.
- A plus marker rotates with progress and fades at the end.

EvolveUp direction:

- Current horizontal section should keep 50vw panels.
- The transition into services should feel like one continuous pinned viewport, not a hard section cut.
- Add stronger separators, title split reveal, and richer card visual surfaces.

### Services

- Trionn services is the most complex section:
  - 371 image slots.
  - desktop and mobile videos.
  - scroll-smoothed `videoIdx`.
  - particle blast active from progress `.35` to `.53`.
  - particles are generated from real DOM character positions via `Range.getBoundingClientRect()`.
  - service cards animate in paired left/right paths.
  - SVG paths draw when cards reach center.
  - audio is optional and pauses when section leaves viewport.

EvolveUp direction:

- Do not build 371 frames yet.
- Add a lightweight frame/scan layer and card motion so the section no longer feels static.
- Keep DOM text-particle idea but improve it gradually.

### Page Transition

- Overlay uses 10 grey belts.
- There are 4 flying plus icons.
- Center logo/card frame has corner pluses, border draw, page label, and slot counter.

EvolveUp direction:

- Upgrade current overlay from 5 plain belts to 10 belts plus flying pluses.

## Next Implementation Priorities

1. Upgrade transition overlay to 10 belts + flying plus icons.
2. Replace raw vision marquee with reusable pinned vision section with stripe wipe.
3. Add scroll-emphasis text section for about.
4. Add services frame/scan layer and stronger service card motion.
5. Later: Lenis, true DOM-range particles, real video/image sequence.

## EvolveUp Progress Notes

- Services stage now uses split service headline letters as the particle source instead of a detached random overlay. This is not the full Trionn `Range.getBoundingClientRect()` clone system yet, but the visible letters now burst from their actual rendered word positions.
- Horizontal showcase now fades in a dark service-preview layer at the end of the same sticky x-scroll viewport, matching the newly verified Trionn overlap pattern without adding GSAP/Lenis.
- Hero headline now uses client-triggered split-letter blur/stagger reveal, so the animation starts after the loader instead of completing behind it.
- Header now uses a transparent fixed `mix-blend-difference` frame like Trionn, instead of a dark backdrop that manually works only on dark sections.
- Live continuation probe confirmed the work/services composition again: `#work-section` and `#trionn-services` share the same document top, while the work layer becomes fixed and its cards translate horizontally above the already-staged services layer.
- The Trionn work cards are not text boxes. They are 50vw poster/image panels with title and CTA below, vertical separators, and delayed content reveal. EvolveUp horizontal showcase now mirrors that composition with poster-like service surfaces instead of bordered SaaS cards.
- Key facts detail extracted from the live JS bundle: desktop cards use `data-kf-card`, start at `rotateX:-92` with `transformOrigin:"center top"`, and animate with ScrollTrigger `start:"top center"`, `end:"top top"`, `scrub:2`, staggered by card. EvolveUp key facts now uses Framer `useScroll` for the same scroll-linked card opening instead of one-shot `whileInView`.
- Hero rotating word detail extracted from the live JS bundle: Trionn splits the active word into chars, blurs chars out with stagger, swaps the word, then blurs chars back in. EvolveUp hero now rotates the changing word at character level instead of sliding whole words.
- Header/menu detail: Trionn's header menu is an actual floating menu panel, not a link to a section. EvolveUp now opens a client-side overlay menu from the header `Menu` control while keeping the existing route transition links.
- Services particle detail: Trionn measures `[data-line]` text character positions with `Range.getBoundingClientRect()`, then creates a fixed particle container. EvolveUp now has a lightweight version that measures the existing split service letters and emits a fixed character burst when scroll enters the particle zone; the burst is triggered from both DOM scroll checks and Framer `scrollYProgress` so it stays reliable without GSAP/ScrollTrigger in v1.
- Selected work detail from the local Trionn bundle: the title panel uses character-level `BlurTextReveal` with `.05` stagger, project panels expose `.js-work-card-inner`, separator lines draw with `scaleY` / `scaleX`, and card content rises from a large hidden Y offset as each panel enters. EvolveUp horizontal showcase now mirrors those class hooks and uses Framer scroll progress for split title reveal, panel rise, blur fade, and separator draw.
- Services cards correction: the experimental overlapping 3D stack was removed because card opacity/masking let the background show through. EvolveUp now uses an opaque 2-row Trionn-like service grid with scroll-driven position/scale only, so cards stay readable over the scan/frame layer.
- About detail from the local Trionn bundle: `.home-about` combines `BlurTextReveal` for the section label/title with `FadeOnScroll` for the oversized statement. EvolveUp now splits the about title into word-level blur/slide reveal and gives the body words scroll-linked color, y, and blur transforms instead of plain color tint only.
