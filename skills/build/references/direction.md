# Phase 2: Direction

A $50k site is not "more effects". It is one strong idea, executed with restraint, where every detail agrees
with every other detail. Write the brief before touching code; the jury scores the build against it.

## 1. Find the big idea in the brand itself

Start from what the company already is: its name, its logo, its product's physical nature, its customers'
world. Turn that into one visual metaphor that can carry the whole page.

| Brand | Metaphor | Signature moment |
|---|---|---|
| Fluid AI (agentic AI for enterprises) | Fluid becomes form: chaos organised into precise structure | Molten gold pours into the ΛI mark and melts as you scroll into a macro film where gold settles into a lattice |
| A private bank | The vault: weight, privacy, light on metal | A brushed-steel door mark that opens on scroll into the ledger |
| A coffee roaster | The pour | A real-time pour of dark liquid that fills the logo; stills of origin farms at dawn |
| A logistics platform | Flow through a network | Particles routing along a 3D map toward the logo |

The signature moment happens once, at the top, and echoes once at the end (the closing CTA). Everything in
between is calm, editorial and fast to read.

## 1b. When the person gave an inspiration site

Their site leads, but it is inspiration, not a template. In `juried/brief.md`, add an **Inspired by <site>**
section with two lists.

**What we borrow:** 3–6 qualities, each specific enough to check in a screenshot and measured where
possible from `juried/references/<site>/facts.json`. Examples:
- "oversized display type, about 84px at weight 340 with tight tracking";
- "long dark chapters broken by one light chapter";
- "a single pinned horizontal gallery";
- "a 1,350px content width with hairline rules";
- "one WebGL hero, everything else still".

**What stays ours:** the subject's own logo, colours, typefaces, content and imagery. The big idea still
comes from the subject's brand (section 1), expressed with the reference's qualities.

Rules:
- Never reuse the reference's logo, copy, photographs, illustrations, icons or code, and never rebuild its
  pages section by section. The result must never be mistakable for that site.
- Colours and type come from the subject's brand. Use the reference's palette or typefaces only when the
  person asks for them explicitly, and even then keep the subject's logo.
- If a borrowed quality conflicts with the subject's content or with accessibility, say so in the brief and
  adapt it.

## 2. Art direction tokens

- **Palette:** take the brand colours from research. Build 60/30/10: a dominant neutral (ink or paper), a
  secondary neutral for alternating chapters, one accent used sparingly (CTAs, numbers, rules). Name them
  as CSS custom properties. Warm neutrals with warm accents, cool with cool.
- **Type:** one display face and one text face at most, preferably the brand's (self-host via
  `@fontsource-variable/*` when it exists, otherwise the closest high-quality variable face). Display:
  weight 300–450, tracking −0.03 to −0.045em, line-height 1.0–1.08, sizes with `clamp()`. Text: 16–18px,
  line-height 1.5–1.6, measure ≤ 65ch. Tabular numerals for statistics.
- **Grid:** 12 columns, generous margins (`max(1.5rem, (100% - 1400px)/2)`), asymmetric compositions:
  headline left in 7 columns, supporting copy offset in 4. Vary section rhythm: dark cinematic chapters
  between light paper chapters.
- **Motion:** one orchestrated motion per section (a line reveal of the heading, a pinned sequence, a
  count-up), never a fade-up on every element. `expo.out` / `power3.out`, 0.8–1.4s, 60–90ms staggers,
  no bounce. Scroll-linked motion only where the content is a sequence (film, gallery).
- **Photography:** one shoot, not stock. Same light, lens, time of day and palette across every still
  (for example "blue hour, warm practical lights against deep shadow, charcoal/ivory/gold, 35mm,
  shallow depth of field"). No legible text in images, no faces for concept work.
- **Texture:** a whisper of film grain on dark chapters (opacity ≤ 0.08) so gradients do not band and CG
  reads as photographed.

## 3. Anti-template checklist (every item must be "no")

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

## 4. Premium signals to include

- The real logo as a 3D object (via `tools/brand.mjs`), not a generic shape.
- An intro sequence under 3.5s that never blocks reading.
- Micro-typography: small labels in 0.8rem at 600 weight, section numbering (01, 02, 03), editorial captions.
- Buttons with considered hover states (magnetic pull or a sliding arrow), focus rings that match the brand.
- Real product proof shown as interface (demo conversations, workflow steps) rather than described.
- A mega-menu and a footer as complete as the original's, so it reads as a real company site.

## 5. `juried/brief.md` template

```markdown
# Brief: <Subject>
**Big idea:** <one sentence>
**Signature moment:** <what happens in 3D in the hero, and how it echoes at the end>
**Film:** first frame <…> → last frame <…>; the film plays as the reader scrolls through <chapter>.
**Audience and promise:** <who, and what they should believe after 10 seconds>
**Palette:** --ink #…, --paper #…, --accent #…, (--accent-hi, --accent-deep)
**Type:** display <family, weights, tracking>, text <family>
**Motion principles:** <3 bullets>
**Photography:** <one line shoot description reused in every still prompt>
**Section map:** original section → new section → recipe → media
**Keep:** navigation, CTAs, forms, embeds (list), legal links
**Concept notice:** yes/no
```
