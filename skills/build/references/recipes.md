# Phase 4: Build with recipes

The template (`index.html`, `src/main.js`, `src/styles.css`) is a complete, jury-tested page skeleton:
announcement bar, navigation with mega menus, liquid-mark hero with a fact rail, logo marquee, a
scroll-scrubbed film chapter, capability tabs, a pinned gallery of living photographs, a foundation grid,
an orbit hub for integrations, deployment tabs with a diagram, product demos, FAQ, a closing CTA with
liquid droplets, and a full footer. Every copy slot is marked `{{…}}`; the jury fails any build that still
contains `{{`, `TODO` or lorem ipsum.

Adapt it to the brief: reorder, remove, or duplicate sections; rename tokens; replace the copy with the
researched content. Keep the data attributes, because `src/main.js` wires recipes by them. Recipes live in
`src/recipes/` and each one has a designed fallback, so the page is complete even with no generated media.

## Hero: liquid mark (`liquid-mark.js`)

Real-time raymarched molten metal that pours into the brand's logo and melts on scroll. The logo becomes a
signed-distance field with `node tools/brand.mjs logo <file|url> --name mark [--crop x0,y0,x1,y1] [--invert]`,
which writes `public/brand/mark-sdf.png` and `public/juried-brand.json`.

```html
<section class="hero"><canvas class="hero__canvas" data-liquid aria-hidden="true"></canvas> … </section>
```
```js
const liquid = createLiquidMark(canvas, { sdf, glyphRect, aspect, sdfSize, rangeTexels,   // from juried-brand.json
  height: 2.9, yaw: -0.45, pitch: 0.08, offset: [2.7, 0.55], gold: [1.0, 0.766, 0.336], exposure: 1, maxDpr: 1.5 });
liquid.form(0..1);   // 0 = molten droplets, 1 = the logo (animate in the intro timeline)
liquid.melt(0..1);   // scroll-out melt
```
- `gold` is the metal's base reflectance in linear RGB: gold `[1.0, 0.766, 0.336]`, silver `[0.97, 0.96, 0.91]`,
  copper `[0.95, 0.64, 0.54]`, rose gold `[0.98, 0.72, 0.62]`. Pick the metal from the brand palette.
- `offset` places the logo in world units (x right, y up) so it sits beside the headline; on narrow screens
  the recipe recentres it automatically. Pauses off-screen; adapts resolution when frames are slow.
- Best for logos with bold, simple shapes. For thin wordmarks, crop to the symbol or use the wordmark only
  at the end (CTA).

## Film chapter (`scroll-film.js`)

A 400vh section with a sticky stage whose video playhead follows the scrollbar. Text steps appear in turn.

```html
<section class="film" data-film>
  <div class="film__stage">
    <div class="film__media">
      <div class="film__fallback" aria-hidden="true">
        <img alt="" data-film-still data-src="/media/film-start.jpg" data-srcset="/media/film-start-1280.webp 1280w, /media/film-start-1920.webp 1920w" sizes="100vw">
        <img alt="" data-film-still data-src="/media/film-end.jpg" data-srcset="/media/film-end-1280.webp 1280w, /media/film-end-1920.webp 1920w" sizes="100vw">
      </div>
      <video muted playsinline preload="auto" data-poster="/media/film-poster.jpg" data-src-desktop="/media/film-scrub.mp4" data-src-mobile="/media/film-scrub-m.mp4"></video>
    </div>
    <div class="film__intro" data-film-intro>…</div>
    <ol class="film__steps"><li data-step>…</li><li data-step>…</li><li data-step>…</li></ol>
    <div class="film__progress"><span data-film-bar></span></div>
  </div>
</section>
```
```js
scrollFilm(section, { reduced: prefersReducedMotion, introEnd: 0.16, onProgress: (p) => {} });
```
Downloads after the page settles, holds the clip in memory for instant seeks, chooses H.264 or the VP9 twin,
and falls back to a scroll crossfade between the first and last stills (also used for reduced motion).

## Living media (`media.js`)

Any element with `data-media="<name>"` gets the responsive still `<name>` and, if `tools/film.mjs` made a
loop with that name, the loop plays while it is in view.

```html
<article class="case" data-media="ind-banking">
  <div class="case__media"><img alt=""><video muted loop playsinline preload="none"></video></div> …
</article>
```

## Pinned gallery (in `main.js`)

`[data-cases]` with a `[data-cases-track]` scrolls horizontally while pinned (desktop), and becomes a
swipeable, snap-scrolling row on mobile. Pin type is `transform`, so it never registers as layout shift.

## Orbit hub (`orbit-hub.js`, lazy-loaded three.js)

The logo extruded in polished metal at the centre of a ring of labelled nodes (integrations, systems,
channels, markets). Hovering a node highlights the matching list item and the reverse.

```js
const { createOrbitHub, shapesFromSvg } = await import('./recipes/orbit-hub.js');
const hub = createOrbitHub(canvas, { nodes: [{ label: 'SAP' }, …], markShapes: await shapesFromSvg('/brand/mark.svg'), onHover: (i) => {} });
hub.highlight(i);
```

## Interface proof (`demos.js`)

Chat transcripts that type out message by message (`data-demo="chat"`, messages as `<p data-from="user|ai|system">`)
and step flows that tick through (`data-demo="flow"`, steps as `<li>`). They play when visible and restart
when their tab is selected. Use the company's real flows (from research), never invented features.

## UI behaviours (`ui.js`)

- `tabs(root)`: accessible tabs from `[role=tablist]`, `[role=tab][aria-controls]`, `[role=tabpanel]`;
  arrow keys, Home/End; emits `tabs:change`.
- `countUp(el)`: `data-count` on a number counts up when first seen; real value stays in the DOM before and
  after; width is locked so nothing shifts.
- `marquee(root)`: `[data-marquee] .marquee__track` duplicates its items for an endless CSS marquee.
- `accordion(root)`: `[data-accordion]` of `<details>` with animated height.
- `magnetic(el)`: `data-magnetic` buttons lean toward the cursor.
- `reducedMotion()`: the single source of truth for motion preferences.

## Page conventions

- `window.__ready = true` at the end of `main.js` (the jury waits for it).
- Brand fonts via `@fontsource-variable/<family>` imports in `main.js`; never a render-blocking Google Fonts link.
- Headings use `data-split` for a single line-reveal on first view; body copy is never hidden by animation.
- Dark chapters get the film-grain overlay; light chapters stay clean.
- Keep third-party embeds from the original (chat widgets, schedulers) exactly as they were, including
  their `data-` attributes, at the end of `<body>`.
