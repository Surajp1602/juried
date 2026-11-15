// Design DNA: the nine structural decisions that make one build different from another, each traced to a
// reference studied for this build. tools/dna.mjs and the jury both use this check.
import fs from 'node:fs';
import path from 'node:path';
import { hostOf, priorBuilds, usedReferenceHosts } from './home.mjs';

export const AXES = {
  layout: { asks: 'the grid and how content is placed on it', examples: ['bento-grid', 'split-screen', 'broken-grid-overlap', 'single-column-longform', 'sidebar-index', 'full-bleed-stack', 'horizontal-chapters', 'modular-tiles', 'canvas-first', 'table-and-list', 'poster-stack', 'editorial-columns'] },
  hero: { asks: 'what the first screen is made of', examples: ['type-only-oversized', 'full-bleed-media', 'split-media-text', 'product-ui-forward', 'collage', 'kinetic-marquee-type', 'interactive-canvas', 'index-list', 'single-object-3d', 'video-backdrop', 'question-and-input', 'data-readout'] },
  nav: { asks: 'where navigation lives and how it behaves', examples: ['top-bar', 'floating-pill', 'side-rail', 'bottom-dock', 'corner-anchors', 'overlay-menu', 'inline-index', 'sticky-section-tabs', 'command-menu'] },
  type: { asks: 'the typographic voice', examples: ['serif-display-sans-text', 'condensed-poster', 'mono-technical', 'grotesk-tight', 'humanist-soft', 'variable-expressive', 'slab-editorial', 'all-caps-wide', 'mixed-italic-accent', 'rounded-friendly'] },
  color: { asks: 'the colour strategy (the hues come from the brand)', examples: ['paper-and-ink', 'dark-monochrome', 'saturated-field', 'duotone', 'brand-flood-sections', 'neutral-plus-one', 'pastel-blocks', 'high-contrast-inversion', 'photographic-colour-only'] },
  rhythm: { asks: 'how the page paces itself from top to bottom', examples: ['long-chapters', 'dense-index', 'alternating-bands', 'pinned-scenes', 'continuous-canvas', 'short-stacked-cards', 'one-screen-per-idea', 'accordion-depth', 'magazine-spreads'] },
  motion: { asks: 'the motion signature', examples: ['scroll-scrubbed', 'load-choreography', 'hover-driven', 'cursor-reactive', 'kinetic-type', 'view-transitions', 'parallax-layers', 'physics-drag', 'still-with-one-moment', 'masked-reveals'] },
  signature: { asks: 'the one moment a visitor remembers, rooted in this brand', examples: [] },
  imagery: { asks: 'what the pictures are', examples: ['editorial-photography', 'product-ui', '3d-render', 'illustration', 'type-as-image', 'generative-canvas', 'film', 'diagram-and-data', 'cut-out-collage', 'none'] },
};
export const AXIS_NAMES = Object.keys(AXES);
const GENERIC_SECTIONS = /^(hero|features?|cta|faq|testimonials?|clients?|logos?|pricing|about|contact|footer|header|section\d*|content|caps|cases|found|integ|flows|news|film)$/i;
const refSlug = (host) => hostOf(host).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

export const blankDna = (subject = '') => ({
  subject,
  axes: Object.fromEntries(AXIS_NAMES.map((a) => [a, { value: '', from: '', detail: '' }])),
  sections: [{ name: '', job: '', pattern: '', from: '' }],
  notLike: '',
});

// from: "ref:<host>" (a site studied with tools/reference.mjs), "shot:<candidate id>" (a design shot from the
// scout), "brand" or "content" (it comes from the subject itself).
const parseFrom = (from) => {
  const s = String(from || '').trim();
  if (/^ref:/i.test(s)) return { kind: 'ref', key: hostOf(s.slice(4).trim()) };
  if (/^shot:/i.test(s)) return { kind: 'shot', key: s.slice(5).trim() };
  if (/^(brand|content)$/i.test(s)) return { kind: 'own', key: s.toLowerCase() };
  return { kind: 'bad', key: s };
};

export function checkDna(cwd = process.cwd(), { project } = {}) {
  const errors = [], warnings = [];
  const file = path.join(cwd, 'juried', 'dna.json');
  const dna = readJson(file, null);
  if (!dna) return { ok: false, errors: ['juried/dna.json is missing or is not valid JSON. Run: node tools/dna.mjs init'], warnings, references: [], dna: null };
  const scout = readJson(path.join(cwd, 'juried', 'inspiration', 'candidates.json'), null);
  if (!scout) errors.push('No live inspiration search was run for this build (juried/inspiration/candidates.json is missing). Run: node tools/scout.mjs');
  const candidates = scout?.candidates || [];
  const candByHost = new Map(candidates.filter((c) => c.url).map((c) => [hostOf(c.url), c]));
  const candById = new Map(candidates.map((c) => [c.id, c]));
  const research = readJson(path.join(cwd, 'juried', 'research.json'), {});
  const personHosts = new Set((research.references || []).filter((r) => r.source === 'person').map((r) => hostOf(r.url)));
  const used = usedReferenceHosts({ exclude: project });

  const refs = new Map(); // key -> { key, kind, url, found, axes: [], sections: n }
  const note = (src, where) => {
    const id = `${src.kind}:${src.key}`;
    const r = refs.get(id) || { key: src.key, kind: src.kind, axes: [], sections: 0 };
    if (where.axis) r.axes.push(where.axis); else r.sections++;
    refs.set(id, r);
    return r;
  };

  let own = 0;
  for (const axis of AXIS_NAMES) {
    const a = dna.axes?.[axis] || {};
    if (!a.value || !/^[a-z0-9][a-z0-9-]{2,}$/.test(a.value)) { errors.push(`axes.${axis}.value: name the decision in a short kebab-case phrase (${AXES[axis].asks}).`); continue; }
    if (!a.detail || a.detail.trim().length < 40) errors.push(`axes.${axis}.detail: say concretely what is built, with the measurements you took from the reference (at least a full sentence).`);
    const src = parseFrom(a.from);
    if (src.kind === 'bad') { errors.push(`axes.${axis}.from: use "ref:<host>" for a site studied with tools/reference.mjs, "shot:<id>" for a design shot from the scout, or "brand" / "content".`); continue; }
    if (src.kind === 'own') { own++; continue; }
    note(src, { axis });
  }
  const sections = Array.isArray(dna.sections) ? dna.sections.filter((s) => s && s.name) : [];
  if (sections.length < 4) errors.push('sections: plan at least four sections, each with name, job, pattern and from.');
  for (const [i, s] of sections.entries()) {
    if (!s.job || !s.pattern) errors.push(`sections[${i}] (${s.name}): give its job on this page and its layout pattern.`);
    if (GENERIC_SECTIONS.test(s.name.trim())) warnings.push(`sections[${i}] is named "${s.name}", a generic slot. Name it for what it does on this site.`);
    const src = parseFrom(s.from);
    if (src.kind === 'bad') errors.push(`sections[${i}] (${s.name}).from: use "ref:<host>", "shot:<id>", "brand" or "content".`);
    else if (src.kind !== 'own') note(src, {});
  }
  const patterns = new Set(sections.map((s) => String(s.pattern || '').trim().toLowerCase()).filter(Boolean));
  if (sections.length >= 4 && patterns.size < Math.ceil(sections.length * 0.6)) errors.push(`sections: only ${patterns.size} different layout patterns across ${sections.length} sections. A page whose sections all share one shape reads as a template.`);
  if (!dna.notLike || dna.notLike.trim().length < 40) errors.push('notLike: one or two sentences on how this structure differs from the recent builds listed by `node tools/dna.mjs priors`.');

  // References must be real, studied, found by this build's own search, and not borrowed from before.
  for (const r of refs.values()) {
    if (r.kind === 'ref') {
      const facts = readJson(path.join(cwd, 'juried', 'references', refSlug(r.key), 'facts.json'), null);
      if (!facts) errors.push(`${r.key} is cited but was never studied. Run: node tools/reference.mjs https://${r.key}`);
      r.url = facts?.url || `https://${r.key}`;
      const cand = candByHost.get(r.key);
      r.found = personHosts.has(r.key) ? 'person' : cand?.source || null;
      if (!r.found) errors.push(`${r.key} did not come from this build's inspiration search. Register it with: node tools/scout.mjs --add https://${r.key} --found <gallery|search|person>`);
      if (used.has(r.key) && r.found !== 'person') errors.push(`${r.key} was already a reference for "${used.get(r.key)}". Every build borrows from sites no earlier build used.`);
    } else {
      const cand = candById.get(r.key);
      if (!cand) errors.push(`shot:${r.key} is not in juried/inspiration/candidates.json.`);
      r.url = cand?.detail || cand?.url || null; r.found = cand?.source || null;
    }
  }
  const list = [...refs.values()];
  if (own > 4) errors.push(`${own} of 9 axes come from "brand" or "content". At least five must be learned from this build's references: that is what makes the design inspired rather than habitual.`);
  if (list.length < 3) errors.push(`Only ${list.length} reference(s) contribute. Draw on at least three, each for a different part of the design, so the result is no one's copy.`);
  for (const r of list) {
    const cap = r.found === 'person' ? 5 : 3;
    if (r.axes.length > cap) errors.push(`${r.key} supplies ${r.axes.length} axes (${r.axes.join(', ')}). At most ${cap} may come from one reference: beyond that it is a copy of that site.`);
  }
  const galleries = new Set(list.map((r) => r.found).filter((f) => f && f !== 'person' && f !== 'search'));
  if (list.length >= 3 && galleries.size < 2) warnings.push('All references come from one gallery. Mix at least two (Awwwards, Site of Sites, recent.design, Dribbble) unless the others could not be reached.');

  // Against earlier builds: the same decisions again is the same site again.
  const values = Object.fromEntries(AXIS_NAMES.map((a) => [a, dna.axes?.[a]?.value || '']));
  const priors = priorBuilds({ exclude: project }).filter((b) => b.dna);
  for (const [i, b] of priors.slice(0, 8).entries()) {
    const sameAxes = AXIS_NAMES.filter((a) => values[a] && values[a] === b.dna[a]);
    if (sameAxes.length > 3) errors.push(`Too close to "${b.subject}": ${sameAxes.length} of 9 decisions are identical (${sameAxes.join(', ')}). At most three may repeat.`);
    if (i === 0 || b.baseline) for (const a of ['layout', 'hero', 'signature']) if (values[a] && values[a] === b.dna[a]) errors.push(`axes.${a} ("${values[a]}") repeats ${b.baseline ? 'the old fixed template' : `the previous build ("${b.subject}")`}. Choose a different ${a}.`);
  }
  return { ok: errors.length === 0, errors: [...new Set(errors)], warnings, references: list.map((r) => ({ url: r.url, host: r.kind === 'ref' ? r.key : null, shot: r.kind === 'shot' ? r.key : null, found: r.found, axes: r.axes })), values, dna };
}
