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
4. **Reference sites.** Sites the person named as inspiration come first: study each with
   `node tools/reference.mjs <url>` and record it with `"source": "person"`. Then, or when they named none,
   find 3–5 sites that are genuinely excellent (Awwwards Site of the Day, FWA, Godly,
   Land-book, Lapa Ninja, or known studios) either in the same industry or using the technique the brief is
   leaning toward (liquid metal, scroll-scrubbed film, product configurators). For each, write what to borrow:
   a technique, a pacing decision, a typographic move. Never copy a layout or look wholesale.

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
  "references": [{ "url": "…", "source": "person | studio", "borrow": "…" }],
  "mustKeepLinks": ["https://acme.com/contact", "…"]
}
```

`relationship` is `concept` unless the person says they own or work for the subject; `concept` switches on
the noindex tag and footer disclaimer.

## `juried/dossier.md`

One page a designer would want before a kickoff: who they are, who they sell to, what they say, what they
can prove, what their current site does well and badly, what the references teach, open questions.
