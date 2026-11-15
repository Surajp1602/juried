# Phase 5: The jury

Two layers, because each catches what the other cannot:

1. **Deterministic gates** (`tools/jury/capture.mjs`): measurable facts from a real browser. They cannot be
   argued with and they do not get tired.
2. **Vision jury** (the `juror` agent): taste, judged from contact sheets against the brief, scored on the
   Awwwards weighting. It never sees your reasoning, only the pixels and the brief.

A build ships when every site-caused gate passes and the calibrated jury's weighted score is ≥ 7.0.

Both layers also judge **originality**, because a site can pass every other test and still be the last
site in new colours. The gates measure it; the juror is shown this build beside the earlier ones.

## Deterministic gates

`npm run jury` builds the site, serves it, and renders it at desktop (1440×900), mobile (390×844 @2x) and
desktop with reduced motion, in Google Chrome when installed (else Playwright's Chromium). Output goes to
`juried/jury/<timestamp>/`: screenshots at every scroll stop, `sheet-desktop.png`, `sheet-mobile.png`, and
`report.json`. Thresholds live in `tools/jury/gates.json`.

| Gate | Threshold | Usual cause when it fails |
|---|---|---|
| No console errors | 0 first-party errors | a runtime exception, a missing file, a bad import |
| No horizontal overflow | ≤ 1px | an element wider than the viewport, a negative inset, a grain overlay |
| Layout stable (CLS) | ≤ 0.1 | late fonts, counters changing width, fixed pinning, media without aspect ratio. `report.json` lists the top shifts with their source elements |
| LCP | ≤ 3.5s | a blocking script, a hero image without priority, a heavy shader on first frame |
| Smooth scrolling | ≥ 50 fps desktop, ≥ 30 mobile | shader cost, too many live canvases, huge layers |
| Accessibility | no serious/critical axe violations | contrast, missing labels, invalid ARIA. Targets and reasons are in the report |
| Every canvas/video painted | pixel std ≥ 3 | a WebGL context that failed, a missing media file, a video that never decoded |
| Original links retained | all `mustKeepLinks` | a CTA or footer link dropped in the redesign |
| No template leftovers | no `{{`, `TODO`, lorem ipsum in visible text | an unreplaced copy slot |
| Framework: React app | `react` + `react-dom` in package.json, page rendered by React into `#root` | a hand-written HTML page instead of the starter |
| Originality: design DNA | `juried/dna.json` complete; ≥ 3 references, ≤ 3 axes from one; every reference found by this build's scout, studied, and never used by an earlier build; ≤ 3 axes equal to any earlier build | no scout run, references from memory, one reference doing all the work, last build's decisions repeated |
| Originality: not a re-skin | structure ≤ 72% alike and overall ≤ 75% alike to every earlier build | the same navigation, first screen and section sequence as an earlier build, with new colours, fonts and copy |
| Originality: not a clone | ≤ 80% alike overall and ≤ 86% alike in structure to each studied reference | one reference rebuilt section by section |

### How originality is measured

The capture takes a **structural fingerprint** of the desktop render: where the navigation sits, how the
first screen is composed (headline position, size and alignment; the main visual's kind, area and position),
and each top-level section in order with its height, tone, column count, heading alignment, media weight,
and whether it pins or scrolls sideways. `tools/reference.mjs` takes the same fingerprint of every reference.

Two fingerprints are compared part by part. The **structure** score uses only the section sequence, first
screen, navigation and page rhythm, so it does not move when colours, typefaces, class names or words
change. `report.json` → `originality` lists the score against every earlier build and reference, part by
part, so you can see what is alike.

Earlier builds live in a history outside the project (`~/.juried`, or `JURIED_HOME`). Every jury run
records the current build there (`--no-record` to skip), so the next build, in any folder, is compared
with it. The fixed page Juried shipped up to 1.7 is always in the comparison, including on a computer with
no history.

**Fixing an originality failure.** These gates are never caused by the environment, and cosmetic changes do
not pass them. A re-skin failure names the build it matches and the parts most alike (for example
`sequence 100%, hero 100%, nav 100%`): return to Phase 2, change those DNA axes and the section plan, and
rebuild the navigation, first screen and section layouts. A clone failure means one reference contributed
too much: take the first screen or the grid from a different reference. Do not raise the thresholds in
`gates.json` to get a build through.

Environment-caused failures are reported, not hidden. A sandbox without a GPU renders WebGL in software:
fps and mobile LCP will fail there and must be re-checked on a real machine (`npm run jury` on the person's
computer). Third-party hosts that are blocked (hotlinked logos, a chat widget) appear as non-gating warnings.

## Calibration (once per project, before trusting scores)

`node tools/jury/mutate.mjs` renders the real build and six mutants, each attacking one quality:
generic typography, a template palette, the signature visuals removed, a generic layout (every section
flattened into the same centred stack), a cramped broken layout, and lorem ipsum content. They become blind
sheets `A.png`…`G.png`; the mapping stays in `key.json`.

Spawn the juror once per sheet, in separate subagents, each seeing one sheet only plus the brief, with the
calibration instruction from `juror.md`. Collect the scores into `juried/jury/calibration/scores.json`
(same shape as `scores.template.json`) and run `node tools/jury/mutate.mjs --score juried/jury/calibration/scores.json`.

The jury is calibrated when the real build beats every mutant by ≥ 0.5 overall and by ≥ 1.0 on the
dimension that mutant attacks. If not, say so plainly, make the juror prompt stricter (quote the failed
mutant to it), and rely on the gates until it passes.

## Vision jury rounds

For each round:

1. Spawn the juror with: `sheet-desktop.png`, `sheet-mobile.png`, `sheet-priors.png` if the capture wrote
   one (this build's strip above the strips of earlier builds), the `sheet-desktop.png` of each reference in
   `juried/references/`, `juried/brief.md` and `juried/dossier.md`. Nothing else. Do not describe the site
   or defend choices.
2. It returns JSON (schema in `juror.md`): four scores, the weighted score, an originality finding, template
   tells it spotted, and up to 7 ranked fixes, each tied to a screenshot.
3. Apply the fixes that are real (all of priority 1–3; the rest when cheap), rebuild, re-run the gates.
4. Append to `juried/jury/log.md`:

```markdown
## Round 2 (2026-09-26 11:40)
Gates: 25/26 (fps desktop fails in sandbox only)
Originality: closest earlier build "Acme" 41% alike in structure; closest reference 53% alike
Scores: design 7.6 · usability 7.2 · creativity 8.1 · content 7.0 → 7.5 (pass)
Fixed: hero headline overlapped the mark on mobile; cases counter jumped; tab contrast 3.8 → 5.2
Deferred: none
```

Stop after the round that passes, or after round 3 with the best build and an honest note of what is left.

## Rubric (Awwwards weighting)

| Dimension | Weight | 9–10 | 7–8 | 5–6 | 3–4 |
|---|---|---|---|---|---|
| Design | 40% | Distinct, cohesive art direction; typography and spacing at editorial level; every detail agrees | Strong direction, a few inconsistencies | Competent, generic | Template look, clashing details |
| Usability | 30% | Instantly clear, fast, accessible, great on mobile | Clear with minor friction | Works but slow or confusing in places | Hard to use, broken on mobile |
| Creativity | 20% | A memorable signature idea rooted in the brand | Fresh execution of known patterns | Familiar patterns | Stock effects |
| Content | 10% | Specific, credible, well edited, real proof | Mostly specific | Generic claims | Filler or placeholder |
