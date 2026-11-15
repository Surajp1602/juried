# Phase 1: Research

Goal: know the subject better than a junior at the company does, and capture everything the current site
does so the redesign loses nothing. Time box: 15 minutes of tool calls.

## Sources, in order

1. **The company's own site.** Home page first, then the pages linked from the main navigation that carry
   positioning (product, solutions, industries, about, pricing, customers). Use whichever reader works:
   a Firecrawl scrape (`formats: markdown, links, branding` when offered), WebFetch, or the browser.
   Keep the raw HTML of the home page too: it holds colours, fonts, the logo file, scripts and embeds.
2. **Structured data.** JSON-LD blocks (`Organization`, `FAQPage`, `Product`) give clean facts and FAQs.
3. **The outside view.** Web search for recent news, funding, notable customers, reviews, and the
   category's language ("agentic AI platform", "neobank", "boutique hotel").
Reference sites are no longer part of this list: they are found live, every build, by the scout below.

If a page cannot be fetched (blocked, login wall), say so in the dossier and move on; never invent content
to fill the gap.

## What to extract

- **Positioning:** their own one-line description; the problem they solve; who buys; why them.
- **Offer:** products/services, industries, use cases, pricing model if public.
- **Proof:** every number with its source page (e.g. "80% queries resolved autonomously": home page),
  client logos shown on their site (with image URLs), certifications, awards, press.
- **Voice:** 5 phrases they actually use; formal or casual; words to avoid.
- **Brand:** colours (from CSS custom properties and computed styles of buttons, headings, backgrounds),
  fonts (from `@font-face` / Google Fonts links / `font-family`), logo (prefer SVG from the header; note if
  there is a separable symbol), imagery style.
- **Inventory:** the full section order of the home page with headings and body copy; the navigation tree;
  every CTA with its target; forms (what they post to); embeds and third-party scripts (chat widgets,
  schedulers, analytics tags the company relies on); video links.
- **mustKeepLinks:** every unique absolute URL linked from the home page (navigation, CTAs, footer,
  legal, social), normalised without trailing slash. The jury fails the build if one is missing.

## Fresh inspiration, found live (every build)

The design must be inspired by work published recently, and by different work each time. So references
are never chosen from memory and never carried over from an earlier build.

1. **Scout.** `node tools/scout.mjs --tags "<industry and mood, 3-5 words>"`. It opens four galleries in a
   real browser, each at a randomly chosen listing page (plus tag pages matching your words):
   Awwwards (Sites of the Day and nominees), Site of Sites, recent.design and Dribbble. It collects their
   entries, removes every site an earlier Juried build on this computer borrowed from, puts sites that were
   shown to an earlier build last, and samples a shortlist at random. Output, in `juried/inspiration/`:
   - `candidates.json`: live sites (`kind: "site"`, with the URL to study) and design shots
     (`kind: "shot"`, with a saved image) and which gallery each came from;
   - one screenshot of each gallery listing, so you can see thumbnails of everything on offer.
   The galleries are listed in `tools/scout.sources.json`; add another by adding an entry there.
2. **When a gallery cannot be read.** Some galleries block automated browsers on some networks; the tool
   names the ones that returned nothing. Do not skip them. Read that gallery another way (WebFetch on its
   listing page, a Firecrawl scrape with `formats: ["links"]`, the browser, or `node tools/scout.mjs --headed`),
   pick entries from the current listing, and register each one:
   `node tools/scout.mjs --add <site-url> --found awwwards|siteofsites|recent|dribbble`.
   A web search for this month's winners in the subject's field is a fair extra source: register finds
   with `--found search`. A site the person named is registered with `--found person` and recorded in
   `research.json` with `"source": "person"`.
3. **Choose 5–6 sites to study.** Look at the listing screenshots and the shots first. Choose sites that
   are excellent and unlike one another: different navigation, different first screen, different grid.
   Use at least two galleries. Choose for structure and craft, not for industry: a sourdough bakery can
   take its grid from an architecture studio and its type from a record label. Avoid picking five dark
   WebGL agency sites; that is how every build ends up the same.
4. **Study them.** `node tools/reference.mjs <url> <url> …` renders each at desktop and mobile, writes
   contact sheets and `facts.json` to `juried/references/<site>/`, and prints for each one: type, palette,
   content width, motion and 3D stack, where the navigation sits, how the first screen is composed, and
   every section in order with its size, tone, column count, heading alignment and media weight. Read both
   sheets of every site. For design shots, read the saved image: shots are judged by eye and cited as
   `shot:<id>`.
5. **Write down what each one teaches**, in `research.json` `references` and the dossier: one specific,
   checkable quality per site ("pinned left rail with a numbered index", "one 12vw serif line and nothing
   else on the first screen", "ruled table rows instead of cards"). Phase 2 turns these into the design DNA.

Never copy a reference's logo, copy, photographs, illustrations, icons or code, and never rebuild one site
section by section. The jury measures the build against every studied reference and fails a clone.

## `juried/research.json` schema

```json
{
  "subject": { "name": "Acme", "url": "https://acme.com", "kind": "company | product | event | person", "relationship": "concept | owner" },
  "positioning": { "oneLiner": "…", "problem": "…", "audience": ["…"], "differentiators": ["…"] },
  "offer": [{ "name": "…", "summary": "…", "url": "…" }],
  "proof": [{ "claim": "80% of queries resolved autonomously", "source": "https://acme.com/" }],
  "clients": [{ "name": "…", "logo": "https://…/logo.png" }],
  "voice": { "phrases": ["…"], "tone": "…", "avoid": ["…"] },
  "brand": {
    "colors": { "primary": "#…", "ink": "#…", "paper": "#…", "accent": "#…" },
    "fonts": { "display": "…", "text": "…", "source": "google | self-hosted | system" },
    "logo": { "file": "https://…/logo.svg", "symbolCrop": null }
  },
  "sections": [{ "id": "hero", "heading": "…", "body": "…", "ctas": [{ "label": "…", "href": "…" }] }],
  "embeds": [{ "kind": "chat-widget", "html": "<script src=… data-…></script>", "keep": true }],
  "faq": [{ "q": "…", "a": "…" }],
  "references": [{ "url": "…", "source": "person | awwwards | siteofsites | recent | dribbble | search", "borrow": "one specific, checkable quality" }],
  "mustKeepLinks": ["https://acme.com/contact", "…"]
}
```

`relationship` is `concept` unless the person says they own or work for the subject; `concept` switches on
the noindex tag and footer disclaimer.

## `juried/dossier.md`

One page a designer would want before a kickoff: who they are, who they sell to, what they say, what they
can prove, what their current site does well and badly, what each reference found for this build teaches,
open questions.
