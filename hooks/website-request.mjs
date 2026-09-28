#!/usr/bin/env node
// UserPromptSubmit hook: when someone asks for a website, make sure the Juried build skill runs,
// so the build starts with the media question and is the React app from the template, never a
// hand-written HTML/CSS page. Anything printed here is added to Claude's context for that prompt.
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(input).prompt || ''; } catch { prompt = input; }
  const p = prompt.toLowerCase();
  const wantsSite = /\b(web ?site|web ?page|landing ?page|home ?page|microsite|site for|redesign)\b/.test(p)
    && /\b(build|make|create|design|redesign|generate|do|need|want)\b/.test(p);
  if (!wantsSite || p.startsWith('/juried:')) return;
  process.stdout.write([
    'Juried plugin: this is a website request. Invoke the juried:build skill now, before any other work, and follow it.',
    'Mandatory: (1) first ask the media question from the skill (own folder / adding soon / Higgsfield / none) with AskUserQuestion and wait for the answer;',
    '(2) the site must be the React 19 + Vite app copied from the skill template (components in src/sections/*.jsx). Never write a standalone HTML/CSS/JS page.',
  ].join(' '));
});
