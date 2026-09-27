---
name: jury
description: Puts any website in front of an independent, calibrated design jury. Renders it in a real browser at desktop and mobile, measures hard gates (layout shift, load speed, frame rate, accessibility, broken media, horizontal overflow, leftover placeholders), then has a juror score the screenshots on the Awwwards weighting and return ranked, screenshot-specific fixes. Use when someone asks to review, critique, grade, audit or "judge" a website or landing page, by URL or local project, or asks how to make a site look more premium.
argument-hint: "[URL or project folder]"
---

# Juried: the jury, on its own

Target: **$ARGUMENTS** (a URL, or the current project if empty).

The person may not be technical. Run everything yourself and report in plain language.

## 1. Get a runtime

- Inside a Juried project (it has `tools/jury/capture.mjs`): use it as is.
- Anywhere else: set up the jury runtime once and reuse it.

```bash
RT="${CLAUDE_PLUGIN_DATA:-$HOME/.juried}/jury-runtime"
if [ ! -d "$RT/node_modules/playwright" ]; then
  mkdir -p "$RT/tools" && cp -r "${CLAUDE_PLUGIN_ROOT}/skills/build/template/tools/jury" "$RT/tools/"
  printf '{ "type": "module", "private": true, "dependencies": { "playwright": "^1.63.0", "axe-core": "^4.13.0", "pngjs": "^7.0.0" } }\n' > "$RT/package.json"
  (cd "$RT" && npm install --no-audit --no-fund)
fi
```

(Without the plugin variables, copy `tools/jury` from the Juried build skill's `template` folder instead.)
If no browser starts, install Google Chrome or run `npx playwright install chromium` in `$RT`.

## 2. Capture and gate

- Local project: `npm run jury` (builds, serves and captures).
- URL: `node "$RT/tools/jury/capture.mjs" --url <url> --out ./jury-<host>`.

Read the printed gates and `report.json`. For every failed gate, find the cause (the report names the
elements behind layout shifts and the targets of accessibility violations). Separate site problems from
environment problems (no GPU in a sandbox, blocked third-party hosts).

## 3. Vision jury

Spawn the `juror` agent (in agents without it, a fresh subagent given the Juried build skill's
`references/juror.md` as instructions). Give it only `sheet-desktop.png`, `sheet-mobile.png` and, if one
exists, the brief. Never add your own opinion of the site. It returns JSON scores and ranked fixes.

For a high-stakes verdict, calibrate first: in a Juried project run `node tools/jury/mutate.mjs`, have
the juror score the blind sheets one per subagent, then `node tools/jury/mutate.mjs --score …`.

## 4. Report

Reply in this shape, so the person can act on it without opening any file:

```markdown
**Score: 6.4/10** (design 6.8 · usability 6.5 · creativity 5.9 · content 6.0) · verdict: revise
Gates: 18/21 passed. Failed: desktop smoothness 42 fps (hero shader), mobile contrast (tab labels).

Top fixes
1. desktop-00 · hero: the headline sits on a busy gradient and reads weakly → put it on a solid ink band or
   darken the gradient behind it to reach 4.5:1.
2. mobile-02 · feature cards: emoji icons read as a template → replace with …
3. …

What already works: …
```

Every fix names the screenshot and the element, what a visitor experiences, and the concrete change.
Offer to apply the fixes if it is their project.
