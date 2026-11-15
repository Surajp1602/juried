#!/usr/bin/env node
// UserPromptSubmit hook: when someone asks for a website, make sure the Juried build skill runs,
// so the build starts with the media question, searches the design galleries live, and is a React app
// designed for this request from the blank starter: never a hand-written HTML/CSS page and never an
// earlier build re-skinned. Anything printed here is added to Claude's context for that prompt.
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(input).prompt || ''; } catch { prompt = input; }
  const p = prompt.toLowerCase();
  const wantsSite = /\b(web ?site|web ?page|landing ?page|home ?page|microsite|site for|redesign)\b/.test(p)
    && /\b(build|make|create|design|redesign|generate|do|need|want|upgrade|revamp|improve|refresh|modernis?e)\b/.test(p);
  if (!wantsSite || p.startsWith('/juried:')) return;
  process.stdout.write([
    'Juried plugin: this is a website request. Invoke the juried:build skill now, before any other work, and follow it.',
    'Mandatory: (1) first ask the media question from the skill (own folder / adding soon / Higgsfield / none) with AskUserQuestion and wait for the answer;',
    '(2) the site must be the React 19 + Vite app scaffolded from the skill\'s blank starter (components in src/sections/*.jsx). Never write a standalone HTML/CSS/JS page;',
    '(3) run the live inspiration search (node tools/scout.mjs) on this build, even if you built a site before, and write juried/dna.json from the references it finds;',
    '(4) there is no page template: never reuse the sections, layout or stylesheet of an earlier build. The jury fails a build whose structure matches an earlier one.',
  ].join(' '));
});
