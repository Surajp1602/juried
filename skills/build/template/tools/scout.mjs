#!/usr/bin/env node
// Scout: fetch fresh design inspiration for THIS build, live, from the galleries in tools/scout.sources.json
// (Awwwards, Site of Sites, recent.design, Dribbble).
//
//   node tools/scout.mjs [--tags "food,typography,3d"] [--per 6] [--only awwwards,dribbble] [--headed]
//        -> opens each gallery in a real browser, at a randomly chosen listing page, collects its entries,
//           drops every site an earlier Juried build already borrowed from, puts sites already shown to an
//           earlier build last, and samples a fresh shortlist at random.
//           Writes juried/inspiration/candidates.json, one screenshot of each listing, and the images of
//           sampled design shots. Never reuses a previous run's result: run it at the start of every build.
//   node tools/scout.mjs --add <url> [--found awwwards|siteofsites|recent|dribbble|search|person] [--title "…"]
//        -> registers a site found another way (web search, the person's own suggestion, a gallery this
//           tool could not open) so it gets the same freshness check and appears in candidates.json.
//
// What it returns are leads, not designs to copy: study the picks with tools/reference.mjs, then record
// what each one contributes in juried/dna.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostOf, projectId, usedReferenceHosts, scoutedHosts, rememberScouted } from './lib/home.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i === -1 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const OUT = path.resolve(opt('out', 'juried/inspiration'));
const FILE = path.join(OUT, 'candidates.json');
const PER = Math.max(2, parseInt(opt('per', '6'), 10) || 6);
const CONFIG = JSON.parse(fs.readFileSync(opt('sources') && opt('sources') !== true ? path.resolve(opt('sources')) : fileURLToPath(new URL('./scout.sources.json', import.meta.url)), 'utf8'));
const TAGS = String(opt('tags', '') === true ? '' : opt('tags', '')).split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
const ONLY = String(opt('only', '') === true ? '' : opt('only', '')).split(',').map((t) => t.trim()).filter(Boolean);
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const readCandidates = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return null; } };

const PROJECT = projectId();
const USED = usedReferenceHosts({ exclude: PROJECT });
const SHOWN = scoutedHosts();
const shownElsewhere = (host) => SHOWN[host] && SHOWN[host].project !== PROJECT;

// ---- --add: register a lead found another way ----
if (opt('add')) {
  const url = String(opt('add'));
  const full = /^https?:\/\//.test(url) ? url : `https://${url}`;
  const host = hostOf(full);
  if (USED.has(host)) { console.log(`✖ ${host} was already used as a reference for "${USED.get(host)}". Pick a different site.`); process.exit(2); }
  const cur = readCandidates() || { at: new Date().toISOString(), tags: TAGS, pages: [], candidates: [] };
  if (!cur.candidates.some((c) => hostOf(c.url || c.detail) === host)) {
    const found = opt('found', 'search') === true ? 'search' : opt('found', 'search');
    cur.candidates.push({ id: `${found}:${slug(host)}`, source: found, kind: 'site', title: opt('title', host) === true ? host : opt('title', host), url: full, detail: null, image: null, fresh: !shownElsewhere(host), added: true });
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(cur, null, 1));
    rememberScouted([host], PROJECT);
  }
  console.log(`✔ ${host} added to ${path.relative(process.cwd(), FILE)}${shownElsewhere(host) ? ' (shown to an earlier build, but never used)' : ''}`);
  process.exit(0);
}

// Runs inside a gallery listing page: every entry with its title, live site (when the card links to it) and image.
const EXTRACT = ({ entryRe, ownHost, ignore }) => {
  const re = new RegExp(entryRe);
  const clean = (a) => a.href.split('#')[0];
  const isEntry = (h) => re.test(h) || re.test(h.replace(/\/$/, ''));
  const external = (href) => {
    try {
      const u = new URL(href), h = u.hostname.replace(/^www\./, '');
      if (!/^https?:$/.test(u.protocol) || h === ownHost || h.endsWith('.' + ownHost)) return false;
      if (ignore.some((i) => h === i || h.endsWith('.' + i))) return false;
      return !/utm_medium=banner|utm_campaign=|[?&]ref=sponsor/i.test(u.search); // ad slots, not entries
    } catch { return false; }
  };
  const anchors = [...document.querySelectorAll('a[href]')];
  const entries = new Map();
  let current = null;
  for (const a of anchors) {
    const href = clean(a);
    if (isEntry(href)) {
      const key = href.replace(/\/$/, '');
      let e = entries.get(key);
      if (!e) { e = { detail: href, title: '', live: null, image: null }; entries.set(key, e); }
      current = e;
      // The entry's card: the highest ancestor that holds no other entry.
      let card = a;
      for (let n = a.parentElement; n && n !== document.body; n = n.parentElement) {
        const keys = new Set([...n.querySelectorAll('a[href]')].map((x) => clean(x)).filter(isEntry).map((h) => h.replace(/\/$/, '')));
        if (keys.size > 1) break;
        card = n;
      }
      if (!e.live) e.live = [...card.querySelectorAll('a[href]')].map(clean).find(external) || null;
      const img = card.querySelector('img, video[poster]');
      if (img && !e.image) e.image = img.currentSrc || img.src || img.poster || img.getAttribute('data-src') || null;
      const title = (card.querySelector('h1, h2, h3, h4, figcaption')?.textContent || a.getAttribute('aria-label') || a.title || img?.alt || a.textContent || '').replace(/\s+/g, ' ').trim();
      if (title && !e.title) e.title = title.slice(0, 90);
    } else if (current && !current.live && external(href)) {
      current.live = href; // the first outbound link after an entry link and before the next entry
    }
  }
  return [...entries.values()];
};

// Runs inside an entry's own page (galleries whose cards do not link out): the live site, if it names one.
const RESOLVE = ({ ownHost, ignore }) => {
  const outbound = [];
  for (const a of document.querySelectorAll('a[href]')) {
    let u; try { u = new URL(a.href); } catch { continue; }
    const h = u.hostname.replace(/^www\./, '');
    const text = (a.textContent + ' ' + (a.getAttribute('aria-label') || '') + ' ' + (a.title || '')).toLowerCase();
    const own = h === ownHost || h.endsWith('.' + ownHost);
    const hint = /visit|view site|live|launch|open|website|go to/.test(text);
    if (own) { if (/\/(go|out|visit|redirect|link)\//.test(u.pathname) && !/sponsor|jobs|header|widget/.test(u.search)) outbound.push({ href: a.href, redirect: true, score: hint ? 3 : 1 }); continue; }
    if (ignore.some((i) => h === i || h.endsWith('.' + i))) continue;
    if (a.closest('header, footer, nav')) continue;
    outbound.push({ href: a.href, redirect: false, score: (hint ? 3 : 0) + (a.closest('main, article') ? 1 : 0) + 1 });
  }
  outbound.sort((a, b) => b.score - a.score);
  return { best: outbound[0] || null, image: document.querySelector('meta[property="og:image"]')?.content || null, title: document.querySelector('meta[property="og:title"]')?.content || document.title };
};

const expand = (tpl) => tpl
  .replace(/\{page:(\d+)-(\d+)\}/g, (_, a, b) => String(+a + Math.floor(Math.random() * (+b - +a + 1))))
  .replace(/\{pick:([^}]+)\}/g, (_, list) => { const xs = list.split('|'); return xs[Math.floor(Math.random() * xs.length)]; });

function pagesFor(src) {
  const pages = src.pages.map(expand);
  if (TAGS.length && src.tagPage && src.tags) {
    const hits = shuffle(src.tags.filter((t) => TAGS.some((k) => t.includes(k) || k.includes(t.replace(/-/g, ' ')) || k.split(/\s+/).some((w) => w.length > 3 && t.includes(w))))).slice(0, 2);
    for (const t of hits) pages.push(src.tagPage.replace('{tag}', t));
  }
  if (TAGS.length && src.searchPage) pages.push(src.searchPage.replace('{query}', encodeURIComponent(TAGS.slice(0, 3).join(' ') + ' website').replace(/%20/g, '-')));
  return pages;
}

(async () => {
  const { chromium } = await import('playwright');
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  const args = ['--disable-blink-features=AutomationControlled', ...(process.env.JURIED_CHROME_ARGS || '').split(' ').filter(Boolean)];
  const headless = !opt('headed', false);
  let browser;
  if (!process.env.JURIED_CHROME) { try { browser = await chromium.launch({ channel: 'chrome', headless, args }); } catch {} }
  if (!browser) browser = await chromium.launch({ executablePath: process.env.JURIED_CHROME || undefined, headless, args });
  const major = browser.version().split('.')[0];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2000 }, locale: 'en-US',
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`,
  });
  const page = await context.newPage();
  const sources = CONFIG.sources.filter((s) => !ONLY.length || ONLY.includes(s.id));
  const log = [], picked = [];
  let droppedUsed = 0;

  for (const src of sources) {
    const ownHost = hostOf(src.pages[0]);
    const found = new Map();
    for (const url of pagesFor(src)) {
      const entry = { source: src.id, url, found: 0, status: 'ok' };
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
        for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 2400); await page.waitForTimeout(500); } // wake lazy lists
        await page.evaluate(() => window.scrollTo(0, 0));
        const items = await page.evaluate(EXTRACT, { entryRe: src.entry, ownHost, ignore: CONFIG.ignoreHosts });
        entry.found = items.length;
        if (!items.length) entry.status = res && res.status() >= 400 ? `HTTP ${res.status()}` : 'no entries (blocked, or the gallery changed its page)';
        for (const it of items) if (!found.has(it.detail)) found.set(it.detail, it);
        if (items.length && !fs.existsSync(path.join(OUT, `${src.id}.jpg`))) await page.screenshot({ path: path.join(OUT, `${src.id}.jpg`), type: 'jpeg', quality: 70 }).catch(() => {});
        else if (items.length) await page.screenshot({ path: path.join(OUT, `${src.id}-${slug(new URL(url).pathname + new URL(url).search).slice(-24)}.jpg`), type: 'jpeg', quality: 70 }).catch(() => {});
      } catch (err) { entry.status = String(err.message || err).split('\n')[0].slice(0, 140); }
      log.push(entry);
    }

    // Freshness: nothing an earlier build borrowed from; things an earlier build was merely shown go last.
    const pool = [...found.values()].map((it) => ({ ...it, host: it.live ? hostOf(it.live) : null }));
    const usable = pool.filter((it) => { if (it.host && USED.has(it.host)) { droppedUsed++; return false; } return true; });
    const fresh = shuffle(usable.filter((it) => !(it.host && shownElsewhere(it.host))));
    const seen = shuffle(usable.filter((it) => it.host && shownElsewhere(it.host)));
    const queue = [...fresh, ...seen];
    const seenHosts = new Set(picked.map((p) => p.host).filter(Boolean));
    let taken = 0;
    for (const it of queue) {
      if (taken >= PER) break;
      const cand = { id: `${src.id}:${slug(new URL(it.detail).pathname.split('/').filter(Boolean).pop())}`, source: src.id, kind: src.kind === 'shots' ? 'shot' : 'site', title: it.title, url: it.live, detail: it.detail, image: it.image, host: it.host, fresh: !(it.host && shownElsewhere(it.host)) };
      // Galleries whose cards do not link out: open the entry and look for its live site.
      if (!cand.url && src.resolve) {
        try {
          await page.goto(it.detail, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(800);
          const r = await page.evaluate(RESOLVE, { ownHost, ignore: CONFIG.ignoreHosts });
          cand.title = cand.title || r.title; cand.image = cand.image || r.image;
          if (r.best && !r.best.redirect) cand.url = r.best.href;
          else if (r.best) { // the gallery's own redirect link: follow it and keep where it lands
            const p2 = await context.newPage();
            try { await p2.goto(r.best.href, { waitUntil: 'domcontentloaded', timeout: 30000 }); if (hostOf(p2.url()) !== ownHost) cand.url = p2.url().split('?')[0]; } catch {} finally { await p2.close(); }
          }
          cand.host = cand.url ? hostOf(cand.url) : null;
          if (cand.host && USED.has(cand.host)) { droppedUsed++; continue; }
          if (!cand.url) cand.kind = 'shot'; // an image-only entry: look at it, there is no site to measure
        } catch { cand.kind = 'shot'; }
      }
      if (cand.kind === 'site' && !cand.url) continue;
      if (cand.host && seenHosts.has(cand.host)) continue; // the same site listed by two galleries
      if (cand.host) seenHosts.add(cand.host);
      if (!cand.title) cand.title = cand.host || cand.id;
      // Design shots are judged by eye: save the image so it can be looked at.
      if (cand.kind === 'shot' && cand.image) {
        try {
          const r = await context.request.get(cand.image, { timeout: 20000 });
          const kind = r.headers()['content-type'] || '';
          if (r.ok() && kind.startsWith('image/')) {
            const ext = ['png', 'webp', 'gif', 'avif', 'svg'].find((x) => kind.includes(x)) || 'jpg';
            const f = path.join(OUT, 'shots', `${slug(cand.id)}.${ext}`);
            fs.writeFileSync(f, await r.body());
            cand.file = path.relative(process.cwd(), f);
          }
        } catch {}
      }
      picked.push(cand); taken++;
    }
  }
  await browser.close();

  const kept = (readCandidates()?.candidates || []).filter((c) => c.added && !picked.some((p) => p.host && p.host === hostOf(c.url)));
  const result = { at: new Date().toISOString(), project: PROJECT, tags: TAGS, pages: log, excludedAsAlreadyUsed: droppedUsed, candidates: [...picked.map(({ host, ...c }) => c), ...kept] };
  fs.writeFileSync(FILE, JSON.stringify(result, null, 1));
  rememberScouted(picked.map((p) => p.host).filter(Boolean), PROJECT);

  console.log(`\nScout → ${path.relative(process.cwd(), FILE)}`);
  for (const l of log) console.log(`${l.found ? '✔' : '✖'} ${l.source.padEnd(12)} ${String(l.found).padStart(3)} entries  ${l.url}${l.found ? '' : `  (${l.status})`}`);
  const sites = result.candidates.filter((c) => c.kind === 'site'), shots = result.candidates.filter((c) => c.kind === 'shot');
  console.log(`\n${sites.length} live sites to study:`);
  for (const c of sites) console.log(`  [${c.source}] ${c.title.slice(0, 44).padEnd(44)} ${c.url}${c.fresh ? '' : '  (shown before, never used)'}`);
  console.log(`\n${shots.length} design shots to look at:`);
  for (const c of shots) console.log(`  [${c.source}] ${c.title.slice(0, 44).padEnd(44)} ${c.file || c.detail}`);
  if (droppedUsed) console.log(`\n${droppedUsed} entries left out because an earlier build already borrowed from them.`);
  const failed = sources.filter((s) => !log.some((l) => l.source === s.id && l.found));
  if (failed.length) {
    console.log(`\nCould not read: ${failed.map((s) => s.name).join(', ')}. These galleries sometimes block automated browsers.`);
    console.log('Do not skip them. Open each one another way (WebFetch, a Firecrawl scrape with formats ["links"], the browser, or re-run with --headed),');
    console.log('choose entries published recently, and register each with:  node tools/scout.mjs --add <site-url> --found <gallery>');
  }
  console.log('\nNext: look at the listing screenshots and the shots in juried/inspiration/, then study 5–6 of the sites:');
  console.log('  node tools/reference.mjs <url> <url> …\n');
  process.exitCode = result.candidates.length ? 0 : 5;
})().catch((err) => { console.error(`✖ ${err.message}`); process.exit(1); });
