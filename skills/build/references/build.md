# Phase 4: Build from a blank page

The starter is a React 19 app on Vite that renders an empty page. It gives you tooling, a reset, and a
kit of behaviours that have no look of their own. It does not give you a page: no sections, no layout,
no stylesheet, no navigation, no hero. Those are designed for this build from `juried/dna.json`.

Up to version 1.7 the starter was a finished 13-section page with copy slots, and every site came out as
that page in new colours. Do not rebuild it from memory. If you catch yourself writing a top bar with a
mega menu, a 3D logo beside a left-aligned headline, a logo marquee, a scroll film, capability tabs, a
pinned gallery, an orbit hub, an FAQ and a closing call to action, in that order, stop: that is the old
template, and the jury's re-skin gate compares every build with it.

## What is in the starter

- `index.html`: the head (title, description, Open Graph, noindex for concepts) and the place for the
  original site's third-party embeds, which stay plain `<script>` tags (React does not run scripts in JSX).
- `src/main.jsx`: mounts React, loads `kit/kit.css` then `site.css`.
- `src/App.jsx`: an empty `<main>`. Compose this build's sections here.
- `src/sections/`: empty. One component per entry in the DNA's section plan.
- `src/site.css`: empty. The whole look of this build: tokens, type, grid, every section.
- `src/motion.js`: empty. This build's motion signature, called once after React renders.
- `src/kit/`: opt-in behaviours (below). `kit.css` is a reset plus the few functional rules they need;
  it sets no colour, typeface, size, spacing or layout. Do not add design to it.
- `tools/`: scout, reference, dna, brand, media and the jury.

## Order of work

1. **Tokens and type** in `src/site.css` from the DNA's `color` and `type` axes: custom properties for the
   palette, the spacing scale and the type scale. Install this build's typefaces
   (`npm install @fontsource-variable/<family>`) and `@import` them at the top of `site.css`.
2. **The grid and the navigation** from `layout` and `nav`. Build the navigation the DNA describes (a rail,
   a dock, a floating pill, an overlay, an inline index), with every link of the original site reachable,
   keyboard access and a visible focus style. Design its small-screen form deliberately.
3. **Sections**, one component each, in the order of the section plan. Use the `pattern` the plan gives
   each one, built to the measurements recorded in the DNA's `detail` fields. Open the reference's contact
   sheet beside you while you build the part borrowed from it, then change scale, proportion or order so it
   serves this content. Use semantic elements (`section`, `article`, `table`, `ol`, `address`, `footer`).
4. **The signature moment**: write it for this brand, with whatever the idea needs (CSS, SVG, canvas 2D,
   GSAP, WebGL). Give it a still, readable state for reduced motion and for a failed WebGL context.
5. **Motion** in `src/motion.js` from the `motion` axis. It receives `{ gsap, ScrollTrigger, lenis, reduced }`.
   When `reduced` is true, leave everything visible and still.
6. **Responsive pass** at 390px: every section redesigned for a narrow screen, not merely stacked.
7. `npm run build`, then look at the page (`npm run preview`) before the jury does.

Different builds should differ in the files you would diff: the component list in `src/sections/`, the
grid rules in `site.css`, the markup of the first screen, where the navigation is. If two builds differ
only in tokens and strings, the second is a re-skin.

## The kit (use a part only where the DNA calls for the behaviour)

`startPage({ smooth, motion })` in `src/kit/page.js` is called from `App.jsx`. It wires the behaviours
below wherever their attribute appears in your markup, runs your motion function, and sets
`window.__ready = true` (the jury waits for it). `smooth: true` (or Lenis options) turns on smooth
scrolling; it is off by default because not every design wants it.

| Attribute | Behaviour | You design |
|---|---|---|
| `data-tabs` on a container with `[role=tablist]`, `[role=tab][aria-controls]`, `[role=tabpanel]` | Accessible tabs: arrow keys, Home/End, emits `tabs:change` | Everything visible |
| `data-count` on a number | Counts up once when first seen; the real value stays in the DOM; width locked so nothing shifts | The numeral |
| `data-marquee` with a child `data-marquee-track` | Endless marquee; speed and direction via `--marquee-duration`, `--marquee-direction` | The items |
| `data-accordion` around `<details>` elements | Animated open and close | The rows |
| `data-magnetic` on a button or link | Leans toward the cursor | The button |
| `data-media="<name>"` (optionally a child `data-media-box`, and `data-sizes`) | Loads the responsive still `<name>` from `public/media/media.json` and plays the loop of that name while in view | The frame, ratio and caption |
| `data-film` (see below) | A video whose playhead follows the scrollbar | The stage and the text over it |
| `data-demos` containing `data-demo="chat"` or `data-demo="flow"` | Plays a transcript message by message or ticks through steps when visible | The interface being shown |

Import a function directly when you want it without the attribute: `tabs`, `countUp`, `marquee`,
`accordion`, `magnetic`, `reducedMotion` from `./kit/ui.js`.

### Scroll-scrubbed film

Use it only when the DNA's motion or imagery is a film. Length via `--film-length` (default `400vh`).

```jsx
<section data-film>
  <div data-film-stage>
    <div data-film-fallback aria-hidden="true">
      <img alt="" data-film-still data-src="/media/film-start.jpg" />
      <img alt="" data-film-still data-src="/media/film-end.jpg" />
    </div>
    <video muted playsInline preload="auto" data-poster="/media/film-poster.jpg"
           data-src-desktop="/media/film-scrub.mp4" data-src-mobile="/media/film-scrub-m.mp4" />
    <div data-film-intro>…</div>
    <ol><li data-step>…</li><li data-step>…</li></ol>
    <span data-film-bar />
  </div>
</section>
```

It downloads after the page settles, holds the clip in memory for instant seeks, and falls back to a
crossfade between the first and last stills (also used for reduced motion).

### WebGL pieces (`src/kit/webgl/`)

Two finished pieces remain from earlier versions: `liquid-mark.js` (a raymarched molten-metal logo, driven
by the signed-distance field `tools/brand.mjs` writes) and `orbit-hub.js` (an extruded logo with a ring of
labelled nodes, three.js). Their options are documented at the top of each file. They were the signature
of every 1.x site, which is exactly why they are no longer wired in:

- Use one only when the DNA's `signature` is that idea for a reason found in this brand (a foundry, a
  jeweller, a network product), and `node tools/dna.mjs priors` shows no recent build used it.
- Otherwise read them for the standard of finish (adaptive resolution, pausing off-screen, a still
  fallback) and write this brand's own signature.

## Page conventions

- `window.__ready = true` is set by `startPage()`; do not remove the call.
- Typefaces via `@fontsource-variable/<family>` imports or the brand's own files; never a render-blocking
  Google Fonts link.
- Body copy is never hidden by animation. Anything revealed on scroll is visible without JavaScript and
  with reduced motion.
- Animate transforms and opacity. Pin with `position: sticky` or ScrollTrigger's transform pinning so
  nothing registers as layout shift. Give every image and video an aspect ratio.
- After `node tools/brand.mjs`, point the icon link in `index.html` at `/brand/mark.svg`.
- Keep third-party embeds from the original (chat widgets, schedulers) exactly as they were, including
  their `data-` attributes, at the end of `<body>`.
- No `{{`, `TODO` or lorem ipsum anywhere: the jury fails it.
