# Phase 2: Direction

A $50k site is not "more effects". It is one strong idea, executed with restraint, where every detail agrees
with every other detail, and it does not look like the studio's last job. Write the design DNA and the brief
before touching code; the jury checks the build against both.

## 1. Find the big idea in the brand itself

Start from what the company already is: its name, its logo, its product's physical nature, its customers'
world. Turn that into one visual metaphor that can carry the whole page. The idea decides the signature
moment; it does not have to be 3D, and it does not have to be in the first screen.

| Brand | Metaphor | A signature moment it could lead to |
|---|---|---|
| An AI platform for enterprises | Chaos organised into structure | Scattered rows of a real workflow snap into an ordered table as the reader scrolls |
| A private bank | The ledger: weight, privacy, precision | A single ruled page that fills line by line, set in engraved numerals |
| A coffee roaster | The pour | A full-bleed film of one pour, scrubbed by scroll, with the menu written over it |
| A logistics platform | Flow through a network | A live route map as the page's background, with sections attached to stops |
| A sourdough bakery | Selling out | A counter of loaves left today, larger than the headline |

## 2. The design DNA (`juried/dna.json`)

The DNA is what makes this build structurally different from the last one. It is nine decisions and a
section plan. `node tools/dna.mjs init` creates the file, lists the axes with examples, and prints what the
most recent builds decided.

| Axis | The question |
|---|---|
| `layout` | What is the grid and how is content placed on it? |
| `hero` | What is the first screen made of? |
| `nav` | Where does navigation live and how does it behave? |
| `type` | What is the typographic voice? |
| `color` | What is the colour strategy? (The hues themselves come from the brand.) |
| `rhythm` | How does the page pace itself from top to bottom? |
| `motion` | What is the motion signature? |
| `signature` | What is the one moment a visitor remembers? |
| `imagery` | What are the pictures? |

Each axis is written as:

```json
"layout": {
  "value": "sidebar-index",
  "from": "ref:gamma-studio.com",
  "detail": "A pinned 240px left rail holds a numbered index; all content sits in one column to its right. The reference's rail is 220px and pinned; ours adds the opening hours at its foot."
}
```

- `value`: your own short kebab-case name for the decision. The examples the tool prints show the grain,
  they are not a menu. A new idea gets a new name.
- `from`: `ref:<host>` for a site studied with `tools/reference.mjs`, `shot:<id>` for a design shot from the
  scout, or `brand` / `content` when the decision comes from the subject itself.
- `detail`: what will actually be built, with the numbers you measured on the reference (sizes, column
  counts, proportions) and how you are changing it.

The **section plan** lists the page's sections in order. Each has a `name` for what it does on this site
(`TodaysBake`, `RouteMap`, `PriceLadder`; never `Hero`, `Features`, `Cta`), its `job`, its layout `pattern`
and its `from`. Sections must not all share one shape.

`notLike` is one or two sentences on how this structure differs from the recent builds the tool listed.

### How to borrow (the rules `node tools/dna.mjs check` enforces)

- **Cross-pollinate.** Take a different part of the design from each reference: the navigation from one,
  the first screen from another, the grid from a third, the type from a fourth. At least three references
  contribute, and no single reference supplies more than three axes (five if the person named that site).
  This is what makes the result inspired and still no one's copy.
- **Learn, do not default.** At least five of the nine axes come from this build's references. `brand` and
  `content` are for what truly belongs to the subject: usually colour, signature and imagery.
- **Fresh sources.** Every cited site was found by this build's scout (or registered with `--add`) and
  studied with `tools/reference.mjs`. A site an earlier build borrowed from cannot be used again.
- **Do not repeat yourself.** At most three axes may have the same value as any earlier build, and the
  layout, hero and signature must all differ from the most recent build. The fixed page Juried shipped up
  to version 1.7 counts as an earlier build: top bar with mega menu, 3D logo beside a left headline,
  alternating dark and light chapters, scroll film, pinned gallery, orbit hub.
- **Transform what you take.** Change scale, proportion, order or material so the borrowed quality serves
  this content. A quality that conflicts with the content or with accessibility is adapted, and the brief
  says so.
- **Never take identity.** No reference's logo, copy, photographs, illustrations, icons or code. Colours
  and typefaces come from the subject's brand unless the person asks otherwise.

The check is necessary, not sufficient: names are easy to change. The jury also measures the rendered page
(where the navigation is, how the first screen is composed, the sequence of sections) against every earlier
build and every reference, and shows the juror this build beside the earlier ones.

## 3. Craft floor

These hold on every build. They are standards, not a style: they say how well, never what it looks like.
Everything a visitor would call the look (which typefaces, what weight and tracking, how many columns, where
the headline sits, dark or light, how things move) is a DNA decision and is different every time.

- **Palette:** from the brand, named as CSS custom properties. One strategy, applied consistently.
  Text passes WCAG AA on every background.
- **Type:** at most two families, self-hosted (`@fontsource-variable/*` or the brand's own files), never a
  render-blocking font link and never a system fallback as the visible face. Sizes with `clamp()`, body
  16–19px with a measure of 65 characters or fewer, tabular numerals for statistics.
- **Grid:** one system, stated in the DNA, with deliberate exceptions. Spacing from a scale.
- **Motion:** it never delays reading. Text is visible without waiting for an animation. One orchestrated
  idea per section at most. A complete `prefers-reduced-motion` path.
- **Imagery:** one shoot, not stock: the same light, lens and palette across every picture. No legible text
  in generated images, no faces for concept work.
- **Completeness:** navigation and footer as complete as the original site's, so it reads as a real company.

## 4. Anti-template checklist (every item must be "no")

1. A centred headline over a purple/blue gradient with two pill buttons.
2. A row of three cards with icons and two-line blurbs as the main content device.
3. Glassmorphism panels, glowing blobs, floating abstract 3D shapes unrelated to the brand.
4. Copy using "unlock", "empower", "revolutionise", "seamless", "supercharge", "in today's fast-paced world",
   or any sentence the company did not say or could not stand behind.
5. Testimonial carousels with stock avatars; logos of clients not shown on the company's site.
6. Every section the same height, centred, with the same fade-up.
7. Default Inter/Poppins at default tracking, or more than two families.
8. AI imagery with text artefacts, warped hands, plastic skin, or a different lighting style per image.
9. Accent colours that are not in the brand.
10. Low-contrast grey body text on dark backgrounds (must pass WCAG AA).
11. Motion that delays reading (text hidden until an animation finishes, long preloaders).
12. Placeholder anything.
13. **The page you would have made anyway.** Sections named Hero, Features, Testimonials, FAQ and CTA in
    that order; a top bar with a logo left and a button right because that is where they go; a 3D object
    in the hero because the last build had one. If a decision has no source in the DNA, it is a habit.
14. **A section from an earlier build**, pasted in and re-worded.

## 5. `juried/brief.md` template

```markdown
# Brief: <Subject>
Media: <own files in … | Higgsfield | none>
**Big idea:** <one sentence>
**Signature moment:** <what happens, where on the page, and why it belongs to this brand>
**Inspired by:**
- <site A> (found on <gallery>): <the quality borrowed, measured> → <how it is changed here>
- <site B> …
- <site C> …
**What stays ours:** logo, colours, typefaces, content, imagery
**Not like the last builds because:** <from dna.json notLike>
**Audience and promise:** <who, and what they should believe after 10 seconds>
**Palette:** <tokens>
**Type:** display <family, weights, tracking>, text <family>
**Grid:** <the system, in numbers>
**Motion principles:** <3 bullets>
**Imagery:** <one line shoot description reused in every prompt, or what replaces pictures>
**Section map:** original section → new section (from the DNA's section plan) → pattern → media
**Keep:** navigation, CTAs, forms, embeds (list), legal links
**Concept notice:** yes/no
```
