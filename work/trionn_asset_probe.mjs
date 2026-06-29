import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "work/trionn-live-2026-06-27.html");
const assetDir = path.join(root, "work/trionn-live-assets-2026-06-27");
const manifestPath = path.join(root, "outputs/trionn_live_asset_manifest.json");
const probePath = path.join(root, "outputs/trionn_live_animation_probe.json");
const origin = "https://trionn.com";

const patterns = [
  "ScrollTrigger.create",
  "useGSAP",
  "Lenis",
  "BlurTextReveal",
  "FadeOnScroll",
  "WordShiftButton",
  "TransitionLink",
  "main-banner",
  "home-about",
  "vision-section",
  "keyfacts-section",
  "js-work-card",
  "js-card-line",
  "trionn-services",
  "data-line",
  "drawSVG",
  "scaleY",
  "scaleX",
  "rotateX",
  "xPercent",
  "force3D",
  "quickTo",
  "requestAnimationFrame",
  "ResizeObserver",
  "IntersectionObserver",
  "mix-blend-difference",
  "imgs:Array(371)",
  "videoIdx",
  "particleContainer",
  "pairCenterTimes",
  "soundEnabled",
];

const html = await readFile(htmlPath, "utf8");
await mkdir(assetDir, { recursive: true });

const refs = new Set();
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (url.startsWith("/_next/static/") || url.includes("/_next/static/")) {
    refs.add(url.startsWith("http") ? url : `${origin}${url}`);
  }
}

const manifest = [];
for (const url of [...refs].sort()) {
  const file = path.join(assetDir, url.replace(origin, "").replace(/^\/+/, "").replaceAll("/", "_"));
  const res = await fetch(url);
  const body = new Uint8Array(await res.arrayBuffer());
  await writeFile(file, body);
  manifest.push({ url, file: path.relative(root, file), bytes: body.length, status: res.status });
}

const sectionClasses = [...html.matchAll(/class="([^"]*(?:main-banner|home-about|vision-section|keyfacts-section|trionn-services)[^"]*)"/g)].map(
  (match) => match[1],
);
const textSignals = [
  "Designed to",
  "mean something",
  "hold to",
  "Dare",
  "Focused vision",
  "Measured execution",
  "Inspire",
  "Selected work",
  "A.I.",
  "Development",
  "Branding",
];

const assets = [];
for (const item of manifest) {
  if (!item.file.endsWith(".js") && !item.file.endsWith(".css")) continue;
  const content = await readFile(path.join(root, item.file), "utf8");
  const hits = [];
  for (const pattern of patterns) {
    let index = content.indexOf(pattern);
    let count = 0;
    const snippets = [];
    while (index !== -1) {
      count += 1;
      if (snippets.length < 3) {
        const start = Math.max(0, index - 220);
        const end = Math.min(content.length, index + pattern.length + 420);
        snippets.push(content.slice(start, end).replace(/\s+/g, " "));
      }
      index = content.indexOf(pattern, index + pattern.length);
    }
    if (count) hits.push({ pattern, count, snippets });
  }
  if (hits.length) assets.push({ file: item.file, bytes: item.bytes, hits });
}

const htmlSignals = textSignals.map((signal) => ({
  signal,
  present: html.includes(signal),
}));

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(
  probePath,
  `${JSON.stringify({ source: origin, fetchedHtml: path.relative(root, htmlPath), refs: manifest.length, sectionClasses, htmlSignals, assets }, null, 2)}\n`,
);

console.log(JSON.stringify({ refs: manifest.length, assetsWithHits: assets.length, probePath, manifestPath }, null, 2));
