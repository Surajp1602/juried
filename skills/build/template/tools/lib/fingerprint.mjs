// Structural fingerprint of a rendered page, and a similarity score between two fingerprints.
//
// Why: two sites can have different copy, colours and fonts and still be the same site. The fingerprint
// records what a re-skin cannot hide: where the navigation sits, how the first screen is composed, and the
// sequence of sections with their height, tone, column count, alignment and media weight. The jury uses it
// to fail a build that repeats an earlier Juried build (a re-skin) or copies one reference (a clone), and
// tools/reference.mjs uses it to describe what a reference's structure actually is.

// Runs inside the page (pass to page.evaluate). Must stay self-contained: no imports, no closures.
export const FINGERPRINT = () => {
  const vw = innerWidth, vh = innerHeight;
  const round = (n, d = 2) => +(+n).toFixed(d);
  const visible = (el) => {
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05;
  };
  const rgb = (c) => {
    const m = c && c.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/);
    if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null;
    return [+m[1], +m[2], +m[3]];
  };
  const hsl = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0; const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: Math.round(((h * 60) + 360) % 360), s: round(s), l: round(l) };
  };
  // The background a visitor actually sees behind an element: its own, or the nearest painted ancestor's.
  const backdrop = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      const c = rgb(s.backgroundColor);
      if (c) return { c, image: false };
      if (s.backgroundImage && s.backgroundImage !== 'none') return { c: null, image: true };
    }
    return { c: [255, 255, 255], image: false };
  };
  const toneOf = (el) => {
    const b = backdrop(el);
    if (!b.c) return 'image';
    const { s, l } = hsl(b.c);
    if (s > 0.35 && l > 0.25 && l < 0.8) return 'color';
    return l < 0.4 ? 'dark' : 'light';
  };
  const family = (el) => getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  const pageY = (r) => r.top + scrollY;

  // ---- Navigation: where the primary navigation sits on the first screen ----
  const navEl = [...document.querySelectorAll('header, nav, [role="navigation"], [role="banner"]')]
    .filter(visible)
    .map((el) => ({ el, r: el.getBoundingClientRect(), pos: getComputedStyle(el).position }))
    .filter((x) => pageY(x.r) < vh)
    .sort((a, b) => (b.r.width * b.r.height) - (a.r.width * a.r.height))[0];
  let nav = { pos: 'none', pinned: false, links: 0 };
  if (navEl) {
    const r = navEl.r, top = pageY(r);
    const links = [...navEl.el.querySelectorAll('a, button')].filter(visible).length;
    let pos = 'top';
    if (r.height > vh * 0.55 && r.width < vw * 0.4) pos = r.left + r.width / 2 < vw / 2 ? 'left' : 'right';
    else if (top > vh * 0.6) pos = 'bottom';
    else if (r.width < vw * 0.6 && r.height < vh * 0.25) pos = Math.abs(r.left + r.width / 2 - vw / 2) < vw * 0.08 ? 'floating-centre' : (r.left + r.width / 2 < vw / 2 ? 'corner-left' : 'corner-right');
    nav = { pos, pinned: ['fixed', 'sticky'].includes(navEl.pos), links: links <= 2 ? 'menu-button' : links <= 6 ? 'few' : 'many' };
  }

  // ---- First screen: how the headline and the main visual are composed ----
  const firstScreen = (el) => { const r = el.getBoundingClientRect(); const t = pageY(r); return t < vh * 0.95 && t + r.height > 0 && visible(el); };
  const texty = [...document.querySelectorAll('h1, h2, h3, p, span, a, div')].filter((el) => firstScreen(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2));
  const headline = [...document.querySelectorAll('h1')].find(firstScreen) || texty.sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];
  let hero = { text: null, media: { kind: 'none', area: 0, x: 0.5 } };
  if (headline) {
    const r = headline.getBoundingClientRect(), s = getComputedStyle(headline), fs = parseFloat(s.fontSize);
    hero.text = {
      x: round((r.left + r.width / 2) / vw), y: round((pageY(r) + r.height / 2) / vh), w: round(r.width / vw),
      size: round(fs / vh, 3), align: s.textAlign === 'center' ? 'centre' : (s.textAlign === 'right' || s.textAlign === 'end') ? 'end' : 'start',
      lines: Math.max(1, Math.round(r.height / (parseFloat(s.lineHeight) || fs * 1.1))),
    };
  }
  const mediaEls = [...document.querySelectorAll('canvas, video, img, svg, picture')].filter(firstScreen).map((el) => {
    const r = el.getBoundingClientRect();
    const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)), h = Math.max(0, Math.min(pageY(r) + r.height, vh) - Math.max(pageY(r), 0));
    return { kind: el.tagName.toLowerCase() === 'picture' ? 'img' : el.tagName.toLowerCase(), area: (w * h) / (vw * vh), x: (r.left + r.width / 2) / vw };
  }).filter((m) => m.area > 0.04).sort((a, b) => b.area - a.area);
  if (mediaEls[0]) hero.media = { kind: mediaEls[0].kind, area: round(mediaEls[0].area), x: round(mediaEls[0].x) };

  // ---- Sections: the page's top-level blocks, in order ----
  let root = document.querySelector('main') || document.getElementById('root') || document.body;
  for (let i = 0; i < 6; i++) {
    const kids = [...root.children].filter((c) => visible(c) && c.getBoundingClientRect().height > 40 && !['SCRIPT', 'STYLE'].includes(c.tagName));
    if (kids.length === 1 && kids[0].children.length) root = kids[0]; else break;
  }
  const blocks = [...root.children].filter((c) => visible(c) && c.getBoundingClientRect().height > 40 && !['SCRIPT', 'STYLE', 'NAV', 'HEADER'].includes(c.tagName));
  const footer = [...document.querySelectorAll('footer')].filter(visible).pop();
  if (footer && !blocks.some((b) => b === footer || b.contains(footer))) blocks.push(footer);

  const section = (el) => {
    const r = el.getBoundingClientRect(), area = r.width * r.height;
    // Columns: the widest row of sizeable sibling boxes anywhere in the section.
    let cols = 1;
    const walk = (node, depth) => {
      if (depth > 7) return;
      const kids = [...node.children].filter((c) => { const b = c.getBoundingClientRect(); return b.width > vw * 0.09 && b.height > 48 && visible(c); });
      if (kids.length >= 2 && kids.length <= 40) {
        // Boxes that share a horizontal band and start at different left edges are columns of one row.
        const boxes = kids.map((k) => k.getBoundingClientRect());
        for (const a of boxes) {
          const lefts = new Set();
          for (const b of boxes) {
            const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (overlap >= Math.min(a.height, b.height) * 0.5) lefts.add(Math.round(b.left / (vw * 0.04)));
          }
          cols = Math.max(cols, lefts.size);
        }
      }
      for (const k of node.children) walk(k, depth + 1);
    };
    walk(el, 0);
    const head = [...el.querySelectorAll('h1, h2, h3')].find(visible);
    let align = 'none';
    if (head) {
      const hs = getComputedStyle(head), hr = head.getBoundingClientRect(), cx = (hr.left + hr.width / 2) / vw;
      align = hs.textAlign === 'center' || (Math.abs(cx - 0.5) < 0.04 && hr.width < vw * 0.7) ? 'centre' : cx > 0.62 ? 'end' : 'start';
    }
    let mediaArea = 0;
    for (const m of el.querySelectorAll('canvas, video, img, picture')) { if (!visible(m) || m.closest('picture') && m.tagName !== 'PICTURE') continue; const b = m.getBoundingClientRect(); mediaArea += b.width * b.height; }
    const media = Math.min(1, mediaArea / Math.max(1, area));
    const all = [el, ...el.querySelectorAll('*')].slice(0, 1500);
    const pin = all.some((n) => { const s = getComputedStyle(n); return s.position === 'sticky' && n.getBoundingClientRect().height > vh * 0.5; }) || !!el.closest('.pin-spacer') || !!el.querySelector('.pin-spacer');
    const hscroll = all.some((n) => n.scrollWidth > n.clientWidth * 1.3 && n.clientWidth > vw * 0.5 && n.scrollWidth > vw * 1.2);
    const flags = [pin && 'pin', hscroll && 'hscroll', el.querySelector('form') && 'form', el.querySelector('[role="tab"], details') && 'toggle'].filter(Boolean);
    const cls = typeof el.className === 'string' && el.className.trim() ? el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase();
    const hs = r.height / vh;
    return {
      name: cls.slice(0, 40), h: round(hs), size: hs < 0.6 ? 'S' : hs < 1.25 ? 'M' : hs < 2.6 ? 'L' : 'XL',
      tone: toneOf(el), cols: Math.min(cols, 6), align, media: media < 0.06 ? 'none' : media < 0.38 ? 'some' : 'heavy', flags,
    };
  };
  const sections = blocks.slice(0, 40).map(section);

  // ---- Type and colour: recorded, but weighted lightly (a re-skin changes exactly these) ----
  const bodyFam = new Map();
  for (const p of document.querySelectorAll('p, li')) { if (!visible(p)) continue; const f = family(p); bodyFam.set(f, (bodyFam.get(f) || 0) + p.textContent.trim().length); }
  const hs = headline ? getComputedStyle(headline) : null;
  const type = {
    display: headline ? family(headline) : '', text: [...bodyFam.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '',
    weight: hs ? +hs.fontWeight || 400 : 400,
    tracking: hs && hs.letterSpacing !== 'normal' ? round(parseFloat(hs.letterSpacing) / parseFloat(hs.fontSize), 3) : 0,
    upper: hs ? hs.textTransform === 'uppercase' : false,
  };
  const accents = new Map();
  for (const el of document.querySelectorAll('a, button, [role="button"]')) {
    if (!visible(el)) continue;
    const c = rgb(getComputedStyle(el).backgroundColor); if (!c) continue;
    const x = hsl(c); if (x.s < 0.3) continue;
    const key = Math.round(x.h / 30) * 30 % 360; accents.set(key, (accents.get(key) || 0) + 1);
  }
  const darkH = sections.filter((s) => s.tone === 'dark').reduce((a, s) => a + s.h, 0), allH = sections.reduce((a, s) => a + s.h, 0) || 1;
  const bodyBg = backdrop(document.body).c || [255, 255, 255];
  const color = { theme: darkH / allH > 0.6 ? 'dark' : darkH / allH < 0.25 ? 'light' : 'mixed', dark: round(darkH / allH), accentHue: [...accents.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null, bg: hsl(bodyBg) };

  return {
    v: 1, viewport: [vw, vh], screens: round(document.documentElement.scrollHeight / vh, 1),
    nav, hero, sections, type, color,
    classes: [...new Set(sections.map((s) => s.name))],
  };
};

// ---------------------------------------------------------------------------------------------------------
// Similarity (0 = nothing in common, 1 = the same site). Runs in Node.

const closeness = (a, b, span) => Math.max(0, 1 - Math.abs((a ?? 0) - (b ?? 0)) / span);
const same = (a, b) => (a === b ? 1 : 0);
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);

const SIZES = ['S', 'M', 'L', 'XL'];
// How different two sections are, 0..1, ignoring names and exact heights.
function sectionCost(a, b) {
  const flags = (x) => (x.flags || []).filter((f) => f === 'pin' || f === 'hscroll').sort().join('+');
  return mean([
    a.size === b.size ? 0 : Math.abs(SIZES.indexOf(a.size) - SIZES.indexOf(b.size)) === 1 ? 0.5 : 1,
    a.cols === b.cols ? 0 : Math.abs(a.cols - b.cols) === 1 && Math.min(a.cols, b.cols) > 1 ? 0.5 : 1,
    1 - same(a.align, b.align),
    1 - same(a.media, b.media),
    1 - same(flags(a), flags(b)),
    (1 - same(a.tone, b.tone)) * 0.5, // tone is half a re-skin decision, so it counts for half
  ]);
}

// Edit distance between two section sequences with soft substitution, normalised to 0..1 similarity.
function sequenceSimilarity(A, B) {
  if (!A.length && !B.length) return 1;
  if (!A.length || !B.length) return 0;
  const d = Array.from({ length: A.length + 1 }, (_, i) => [i, ...Array(B.length).fill(0)]);
  for (let j = 0; j <= B.length; j++) d[0][j] = j;
  for (let i = 1; i <= A.length; i++) for (let j = 1; j <= B.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + sectionCost(A[i - 1], B[j - 1]));
  }
  return 1 - d[A.length][B.length] / Math.max(A.length, B.length);
}

function heroSimilarity(a, b) {
  if (!a?.text || !b?.text) return a?.text === b?.text ? 1 : 0.3;
  return mean([
    closeness(a.text.x, b.text.x, 0.35), closeness(a.text.y, b.text.y, 0.4), closeness(a.text.w, b.text.w, 0.5),
    Math.max(0, 1 - Math.abs(Math.log((a.text.size || 0.01) / (b.text.size || 0.01))) / Math.log(2.2)),
    same(a.text.align, b.text.align),
    same(a.media.kind, b.media.kind), closeness(a.media.area, b.media.area, 0.6),
    a.media.kind === 'none' && b.media.kind === 'none' ? 1 : closeness(a.media.x, b.media.x, 0.4),
  ]);
}

function rhythmSimilarity(a, b) {
  const hist = (fp, key) => { const m = {}; for (const s of fp.sections) m[s[key]] = (m[s[key]] || 0) + 1 / fp.sections.length; return m; };
  const overlap = (x, y) => [...new Set([...Object.keys(x), ...Object.keys(y)])].reduce((t, k) => t + Math.min(x[k] || 0, y[k] || 0), 0);
  return mean([
    Math.max(0, 1 - Math.abs(Math.log((a.screens || 1) / (b.screens || 1))) / Math.log(2.5)),
    closeness(a.sections.length, b.sections.length, Math.max(4, Math.max(a.sections.length, b.sections.length) * 0.6)),
    closeness(a.color.dark, b.color.dark, 0.6),
    overlap(hist(a, 'cols'), hist(b, 'cols')), overlap(hist(a, 'size'), hist(b, 'size')), overlap(hist(a, 'media'), hist(b, 'media')),
  ]);
}

const jaccard = (x, y) => { const A = new Set(x), B = new Set(y); const i = [...A].filter((k) => B.has(k)).length; return A.size + B.size - i ? i / (A.size + B.size - i) : 0; };
const hueGap = (a, b) => (a == null || b == null ? (a === b ? 0 : 180) : Math.min(Math.abs(a - b), 360 - Math.abs(a - b)));

export const WEIGHTS = { sequence: 0.32, hero: 0.2, nav: 0.08, rhythm: 0.1, type: 0.14, color: 0.1, classes: 0.06 };

// Returns { overall, structure, parts }. `structure` ignores type and colour entirely: it is the number that
// answers "is this the same layout with a new coat of paint?".
export function similarity(a, b) {
  const parts = {
    sequence: sequenceSimilarity(a.sections, b.sections),
    hero: heroSimilarity(a.hero, b.hero),
    nav: mean([same(a.nav.pos, b.nav.pos), same(a.nav.pos, b.nav.pos) * same(a.nav.links, b.nav.links), same(a.nav.pinned, b.nav.pinned)]),
    rhythm: rhythmSimilarity(a, b),
    type: mean([same(a.type.display, b.type.display), same(a.type.display, b.type.display), same(a.type.text, b.type.text), closeness(a.type.weight, b.type.weight, 400), closeness(a.type.tracking, b.type.tracking, 0.06), same(a.type.upper, b.type.upper)]),
    color: mean([same(a.color.theme, b.color.theme), 1 - hueGap(a.color.accentHue, b.color.accentHue) / 180, closeness(a.color.bg.l, b.color.bg.l, 0.6)]),
    classes: jaccard(a.classes, b.classes),
  };
  const overall = Object.entries(WEIGHTS).reduce((t, [k, w]) => t + w * parts[k], 0);
  const sw = { sequence: WEIGHTS.sequence, hero: WEIGHTS.hero, nav: WEIGHTS.nav, rhythm: WEIGHTS.rhythm };
  const structure = Object.entries(sw).reduce((t, [k, w]) => t + w * parts[k], 0) / Object.values(sw).reduce((a, b) => a + b, 0);
  const r = (n) => +n.toFixed(3);
  return { overall: r(overall), structure: r(structure), parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, r(v)])) };
}

// One readable line per section, for facts.json summaries and reports.
export const outline = (fp) => fp.sections.map((s, i) => `${String(i + 1).padStart(2, '0')} ${s.name.padEnd(18).slice(0, 18)} ${s.size.padEnd(2)} ${s.tone.padEnd(5)} ${s.cols} col  ${s.align.padEnd(6)} media:${s.media}${s.flags.length ? '  ' + s.flags.join(',') : ''}`).join('\n');
