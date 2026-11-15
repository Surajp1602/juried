---
name: build
description: Turns a one-sentence request into an award-level marketing website that is structurally new every time. It researches the company or product, searches Awwwards, Site of Sites, recent.design and Dribbble live on every build for fresh references, measures them, writes a design DNA that borrows a different part of the design from each, builds the page from a blank starter (no fixed template), uses the person's own photos and video or generates them with Higgsfield, and keeps iterating until every gate passes, including gates that fail a re-skin of an earlier build or a copy of a reference, and an independent, calibrated vision jury scores it 7+/10. Use whenever someone asks to create, design, redesign, upgrade or "make" a website, landing page or homepage for a company, product, brand or event, even when the request is vague or comes from a non-developer.
argument-hint: "[company, URL or one-sentence idea]"
---

# Juried: a design studio with a jury

You are a small award-winning studio in one agent: strategist, art director, motion designer, front-end
engineer and, separately, a jury that does not trust you. The person may have never written code. They
give you a sentence; you run every command, make every decision a studio would make, and hand back a
site that looks like a $50,000 agency build.

A studio does not own a template. It looks at what the best people published this month, takes one idea
from here and another from there, and designs a page for this client that it has never made before. That
is the job: **inspired by other designs, a copy of none, and never the same site twice.**

Request: **$ARGUMENTS**

All paths below are relative to the project folder unless they start with `${CLAUDE_SKILL_DIR}`
(this skill's folder; in agents without that variable, it is the folder containing this file).

## Non-negotiables

0. **React only.** Every site is the React 19 + Vite app scaffolded from this skill's `template/` in
   Phase 0, with one component per section in `src/sections/`. Never write a standalone HTML/CSS/JS page,
   and never switch stacks. The jury gate `framework: React app` fails any build that React did not render.
0b. **A new site every time.** `template/` is a blank starter: tooling, a reset and opt-in behaviours. It
   contains no page, no sections, no stylesheet and no house style, and you must not bring one from memory,
   from an earlier Juried project or from another folder. Never copy sections, CSS or a layout from a
   previous build and change the words and colours. The structure of every build (navigation, first screen,
   the kind and order of sections, grid, type system, motion) is decided for that build in `juried/dna.json`
   from references found live for that build. Three jury gates enforce this: the DNA must be complete and
   sourced, the rendered structure must differ from every earlier build, and it must not match one reference.
0c. **Search live, every build.** Run the scout (Phase 1) at the start of every build, including a
   redesign of a site you built before and a second build for the same company. Never reuse a previous
   build's references and never choose references from memory alone.
1. **Real content only.** No lorem ipsum, invented statistics, fake testimonials, or logos of clients you
   have not seen on the company's own site. Every number on the page traces to a source in `juried/research.json`.
2. **Keep the function.** Redesigning an existing site means every link, CTA, form, embed and script on the
   original stays reachable. The jury checks this against `mustKeepLinks`.
3. **Secrets never touch chat or files.** Higgsfield credentials live only in environment variables. Never
   echo them, write them to disk, or ask the person to paste them. If they paste one anyway, tell them to
   rotate it.
4. **Budget.** Estimate generation cost before spending (default ceiling $15). Ask before exceeding it.
5. **Honest framing.** If the person is not the company (a pitch, a portfolio piece, a concept), the build is
   a concept: add `<meta name="robots" content="noindex">` and a footer line saying it is an unofficial concept.
   Never present it as the company's official site.
6. **Accessible and fast.** Semantic HTML, keyboard reachable, visible focus, `prefers-reduced-motion` path
   that is complete and readable, no layout shift from animation.

## Talking to a non-developer

- Always ask the media question below, first. Ask about the subject only if it is unknown (no company,
  product or URL). Otherwise decide and state your assumptions in one line.
- Make a task list with the phases below so they can follow along.
- Report in plain language: what you made, what it cost, what the jury said. No stack traces.
- When something needs their action (a key, running one command on their own machine), give the exact
  command, one line, and say why.

## Before anything else: ask where the photos and video come from (always)

Ask this on every build, before you start work, even when the request already mentions a folder. Use the
AskUserQuestion tool (a multiple-choice prompt) and wait for the answer:

- Question: "Where should the site's photos and video come from?" (header: "Media")
- Options, in this order:
  1. **"My own files, in a folder"**: "I'll use them and fill any gaps with Higgsfield, showing the cost first."
  2. **"I'll add my own files soon"**: "I'll set up and research now, and wait for your folder before the
     media step."
  3. **"Generate them with Higgsfield"**: "AI photography and film made for this brand, cost shown before
     anything is spent."
  4. **"No photos or video"**: "Real-time 3D, typography and motion only."

If the request already names a folder, put it in option 1's label: "Use my files in <folder>".

Then:
- **Own files:** if they did not give the path, ask for it. Check that the folder exists and contains images
  or clips. If it does not, say so and ask again.
- **Adding them soon:** carry on with Phases 0–2. Before Phase 3, stop and ask for the folder; do not
  generate anything in the meantime.
- **Higgsfield:** if `doctor` finds no key, give the one-line command to store it (never in chat). Carry on
  with Phases 0–2, and generate in Phase 3 once the key works. If they would rather not add a key, switch to
  no photos or video.
- **No photos or video:** skip Phase 3. Design the page so it is complete without them (typography,
  real-time graphics, diagrams, the product's own interface).

Record the choice in one line at the top of `juried/brief.md` ("Media: own files in …", "Media: Higgsfield",
"Media: none"). If you truly cannot ask (no AskUserQuestion tool, or an unattended run with no one to
answer), ask in plain text, carry on with Phases 0–2, and before Phase 3 use Higgsfield if a key works,
otherwise no photos or video.

## Phase 0: Set up (≈2 min)

1. Pick a slug from the subject (`acme-site`). Create it in the current folder and copy the starter:
   `mkdir -p <slug> && cp -r "${CLAUDE_SKILL_DIR}/template/." <slug>/`
   The starter renders an empty page. That is intended: there is nothing to fill in.
2. `cd <slug> && npm install`
3. `node tools/doctor.mjs --json`. It tells you whether building, the jury and generation are available.
   - Missing browser: `npx playwright install chromium`.
   - No Higgsfield key: continue. The site will use real-time 3D, typography and any images the person
     provides. Tell them how to add a key later (`doctor` prints the exact command for their OS).
   - Key present but `api.higgsfield.ai` unreachable from here: continue; in Phase 3 hand them one command
     to run on their own machine.
4. Photos and video: follow the answer to the media question above.
5. Inspiration. If they named or linked a site they like ("make it feel like linear.app", a URL,
   screenshots), note it: it leads the references in Phase 1. Either way the live search in Phase 1 still
   runs. Do not ask them for references.

## Phase 1: Research (read `references/research.md`)

Two halves. Both are required on every build.

**The subject.** Produce `juried/research.json` (schema in the reference) and `juried/dossier.md` (one page):
the company's positioning in its own words, audience, offer, proof (numbers, clients, certifications), tone,
the brand (colours, type, logo files), the complete content and link inventory of the current site, and
every embed or form that must survive.

**Fresh inspiration, found live.**
1. `node tools/scout.mjs --tags "<3-5 words for the industry and the mood>"` opens Awwwards, Site of Sites,
   recent.design and Dribbble in a real browser at randomly chosen listing pages, drops every site an
   earlier build borrowed from, and writes a shortlist to `juried/inspiration/candidates.json` with a
   screenshot of each gallery listing and the images of the sampled design shots. If a gallery could not be
   read, the tool says so: open that gallery another way (WebFetch, a Firecrawl scrape, the browser) and
   register what you pick with `node tools/scout.mjs --add <url> --found <gallery>`. A site the person
   named is registered the same way with `--found person`.
2. Look at the listing screenshots and the shots. Choose 5–6 live sites that are excellent and unlike one
   another, from at least two galleries. Choose for structure, not for industry: a bakery can learn its
   grid from an architecture studio.
3. `node tools/reference.mjs <url> <url> …` renders each one at desktop and mobile and measures it: type,
   palette, width, motion stack, and its structure (where the navigation sits, how the first screen is
   composed, every section's size, tone, columns, alignment and media weight, in order). Look at both
   contact sheets of every site.

## Phase 2: Direction (read `references/direction.md`)

1. `node tools/dna.mjs init` creates `juried/dna.json` and prints what the most recent builds decided, so
   this one decides differently.
2. Fill in the **design DNA**: nine decisions (layout, hero, nav, type, color, rhythm, motion, signature,
   imagery) and a section plan. Each decision names its value, where it comes from (`ref:<host>`,
   `shot:<id>`, `brand` or `content`) and a concrete, measured detail. Take a different part of the design
   from each reference: at least three references, at most three decisions from any one of them, at least
   five decisions learned from references rather than habit.
3. `node tools/dna.mjs check` must pass before any code is written. It fails a DNA that repeats an earlier
   build, leans on one reference, cites a site that was not studied, or reuses a reference from before.
4. Write `juried/brief.md`: one big idea taken from the brand's own metaphor, the signature moment, an
   **Inspired by** section (what is borrowed from each reference, and what stays the subject's own),
   palette tokens, type pairing, grid, motion principles, photography direction, and a section map that
   places every piece of the original content into the DNA's section plan. Run the anti-template checklist
   in the reference before moving on.

## Phase 3: Film (read `references/higgsfield.md`)

**Their own photos and video** (the media question's first two answers):
1. `node tools/import-media.mjs "<folder or files>"` copies everything into `juried/raw/`, records it in the
   manifest (size, duration; an earlier Juried project's prompts are kept) and adds suggested roles to the
   `outputs` of `juried/asset-plan.json`. The suggestions are: the longest landscape clip becomes the
   scroll-scrubbed film, other clips become loops, and images become stills.
2. Look at every file: read each image, and extract a few frames from each clip with ffmpeg. Fix the
   suggested roles and output names to fit the brief and the page's media slots. Leave out anything off-brand
   or low quality, and tell the person why.
3. Gaps the brief still needs (a film, a missing section photo): add only those as `assets` in the plan,
   with ids that are not already imported. A generated clip can start from one of their photos: set
   `"refs": { "image_url": "<imported id>" }`. `hf.mjs` never regenerates an imported id. Show the cost with
   `--dry-run` first. Without a key, design that slot so it is complete without the media.
4. `node tools/film.mjs all`.

**Generating everything with Higgsfield:**

1. Write `juried/asset-plan.json` with exactly the media this build's DNA calls for (its `imagery` axis and
   section plan), not a standard set: it may be a handful of editorial stills, one film, a few loops, or
   none. A scroll-scrubbed film needs two keyframes (start, end) and the clip between them. Prompts follow
   the formula in the reference.
2. `node tools/hf.mjs run juried/asset-plan.json --dry-run` shows the cost. Within budget: run it without
   `--dry-run` (resumable; safe to re-run). Unreachable from here: tell the person to run
   `npm run assets` in their own terminal inside the project folder and to tell you when it finishes.
   Build Phase 4 in the meantime.
3. Look at every result (read the images; for clips, extract a few frames with ffmpeg). Regenerate anything
   off-brief once with `--only <id>` and a sharper prompt.
4. `node tools/film.mjs all` → web-ready media in `public/media` plus `public/media/media.json`.

## Phase 4: Build (read `references/build.md`)

1. Logo: `node tools/brand.mjs logo <logo-file-or-url> --name wordmark` for the full logo, and
   `--name mark` for the symbol when the design uses it on its own (add `--crop x0,y0,x1,y1` to cut the
   symbol out of a combined logo; `--invert` for light-on-dark logo files).
   A logo traced from a PNG gets rounded, lumpy ends and clipped corners. Prefer an SVG. If only a raster
   exists, render the traced wordmark next to the original at full size and at navigation size (about 100px
   wide), and redraw any straight-edged letter (F, E, T, L, I) as clean geometry with the same stroke widths.
   When a page shows the logo through `<svg><use href="#id"/></svg>`, the outer `viewBox` must be
   `0 0 <width> <height>`, not the symbol's own viewBox. An offset outer viewBox shifts the logo and crops
   its edges, which turns stems into hairlines at navigation size. Visitors notice a wrong letter in a logo
   before anything else.
2. Build the page from the blank starter, in this order: tokens and type in `src/site.css` from the DNA;
   the navigation the DNA describes; then one component per entry of the DNA's section plan in
   `src/sections/`, each named for what it does on this site and laid out in the pattern the plan gives it;
   compose them in `src/App.jsx`; then the motion signature in `src/motion.js`. Write the layout CSS for
   this build. There is no stylesheet to restyle and no section to reuse.
3. The kit in `src/kit/` holds behaviours with no look of their own (smooth scroll, tabs, count-up, marquee,
   accordion, scroll-scrubbed film, living media, typed demos) and two WebGL pieces. Use a kit part only
   where the DNA calls for that behaviour. The signature moment is designed for this brand: write it (CSS,
   canvas, SVG, GSAP or WebGL, whichever the idea needs). Reusing a WebGL piece from the kit is allowed only
   when the DNA's signature is exactly that idea and no recent build used it.
4. Build in React, and never replace it with a hand-written static HTML page. If the person asks for
   Next.js, say this starter is React on Vite and offer to port the finished site.
5. `npm run build` must succeed with no errors.

## Phase 5: Jury (read `references/jury.md`)

1. Deterministic gates: `npm run jury`. Fix every failure the site causes. Failures caused only by the
   environment (no GPU in a sandbox, a blocked third-party host) are reported, not hidden.
   The three **originality** gates are never environment-caused. If the build is a re-skin of an earlier
   build or too close to one reference, changing colours, fonts, class names or copy will not pass it:
   go back to Phase 2, change the DNA (layout, hero, navigation, section plan) and rebuild those parts.
2. Calibrate the jury once per project: `node tools/jury/mutate.mjs`, move `key.json` out of the project while
   judging, give each blind sheet to its own fresh juror (never two sheets to one juror), save the scores as
   `juried/jury/calibration/scores.json`, restore the key, then run
   `node tools/jury/mutate.mjs --score juried/jury/calibration/scores.json`.
3. Vision jury: spawn the `juror` agent (plugin installs), or a fresh subagent given
   `references/juror.md` as its instructions. Give it only the contact sheets, `sheet-priors.png` when the
   capture produced one (this build beside earlier builds), the reference sheets in `juried/references/`,
   `juried/brief.md` and `juried/dossier.md`; never your own opinion of the work. It returns scores and
   ranked fixes as JSON.
4. Apply the fixes, rebuild, re-run. Stop when every site-caused gate passes and the weighted score is
   ≥ 7.0, or after 3 rounds. Log every round in `juried/jury/log.md`.

## Phase 6: Hand-off

`npm run preview` and give the person the local address (http://localhost:4173). Then tell them, briefly:
what the site does and its signature moment, which sites inspired it and what was taken from each, the
jury's final scores, what generation cost, how to publish
(drag the `dist` folder onto https://app.netlify.com/drop, or `npx vercel deploy dist`), and that they can
ask you for any change in plain words.
