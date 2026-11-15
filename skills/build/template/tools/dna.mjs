#!/usr/bin/env node
// Design DNA: what makes this build structurally its own.
//
//   node tools/dna.mjs priors   -> what the most recent builds decided, so this one decides differently
//   node tools/dna.mjs init     -> writes a blank juried/dna.json and prints the nine axes
//   node tools/dna.mjs check    -> verifies the DNA is complete, sourced from this build's fresh references,
//                                  not a copy of one of them, and not a repeat of an earlier build
import fs from 'node:fs';
import path from 'node:path';
import { AXES, AXIS_NAMES, blankDna, checkDna } from './lib/dna.mjs';
import { projectId, priorBuilds, HOME } from './lib/home.mjs';

const cmd = process.argv[2] || 'check';
const FILE = path.resolve('juried/dna.json');
const project = projectId();

function showPriors() {
  const priors = priorBuilds({ exclude: project }).filter((b) => b.dna).slice(0, 6);
  console.log(`Earlier builds (history: ${HOME}). This build must differ from each on at least six of the nine axes,\nand must not repeat the most recent build's layout, hero or signature:\n`);
  for (const b of priors) {
    console.log(`• ${b.subject}${b.baseline ? '  (the fixed template Juried used up to 1.7)' : `  (${String(b.at).slice(0, 10)})`}`);
    for (const a of AXIS_NAMES) console.log(`    ${a.padEnd(10)} ${b.dna[a] || '-'}`);
    if (b.references?.length) console.log(`    borrowed from: ${b.references.map((r) => r.host || r.url).filter(Boolean).join(', ')}`);
    console.log('');
  }
}

if (cmd === 'priors') { showPriors(); }
else if (cmd === 'init') {
  if (!fs.existsSync(FILE)) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(blankDna(process.argv[3] || ''), null, 2)); console.log(`Created ${path.relative(process.cwd(), FILE)}\n`); }
  else console.log(`${path.relative(process.cwd(), FILE)} already exists; left as it is.\n`);
  console.log('The nine axes. Each needs a value (your own kebab-case name; the examples only show the grain),\na "from" (ref:<host> | shot:<id> | brand | content) and a concrete "detail":\n');
  for (const [a, x] of Object.entries(AXES)) console.log(`  ${a.padEnd(10)} ${x.asks}${x.examples.length ? `\n${' '.repeat(13)}e.g. ${x.examples.join(', ')}` : ''}`);
  console.log('');
  showPriors();
}
else if (cmd === 'check') {
  const r = checkDna(process.cwd(), { project });
  for (const e of r.errors) console.log(`✖ ${e}`);
  for (const w of r.warnings) console.log(`! ${w}`);
  if (r.ok) {
    console.log('✔ Design DNA is complete, sourced and new.');
    for (const ref of r.references) console.log(`    ${(ref.host || `shot:${ref.shot}`).padEnd(34)} ${String(ref.found).padEnd(12)} ${ref.axes.join(', ') || 'sections only'}`);
  }
  process.exitCode = r.ok ? 0 : 6;
}
else { console.log('Usage: node tools/dna.mjs priors | init [subject] | check'); process.exitCode = 1; }
