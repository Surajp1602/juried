#!/usr/bin/env node
// Self-test for the originality measurement. Renders three small pages in a real browser:
//   A   a dark bento page with a bottom dock and a split first screen
//   A'  the same page re-skinned: new colours, typeface, copy and class names, identical structure
//   B   a light page with a left rail, a media-led first screen, split rows and a horizontal scroller
// and checks that the jury would fail A' as a re-skin of A, and pass B.   Run: node tools/jury/selftest.mjs
import fs from 'node:fs';
import { chromium } from 'playwright';
import { FINGERPRINT, similarity } from '../lib/fingerprint.mjs';

const GATES = JSON.parse(fs.readFileSync(new URL('./gates.json', import.meta.url), 'utf8'));
const pageA = ({ bg, fg, accent, font, k, head, word }) => `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:${bg};color:${fg};font-family:${font}}nav{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:${accent};border-radius:99px;padding:10px 20px;display:flex;gap:18px}
.${k}a{display:grid;grid-template-columns:1fr 1fr;height:100vh}.${k}a h1{font-size:8vw;margin:auto 40px}.${k}a canvas{width:100%;height:100%}
.${k}b{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:240px;gap:12px;padding:12px}.${k}b div{border:1px solid ${fg};padding:20px}.${k}b .w{grid-column:span 2}
.${k}c{padding:120px 40px;text-align:center}.${k}c h2{font-size:6vw;margin:0}footer{padding:60px 40px;display:grid;grid-template-columns:repeat(4,1fr)}</style>
<nav><a href="#">${word} one</a><a href="#">${word} two</a><a href="#">${word} three</a></nav>
<main><section class="${k}a"><h1>${head}</h1><canvas width="400" height="400"></canvas></section>
<section class="${k}b"><div class="w"><h2>${word}</h2><p>one</p></div><div><h3>two</h3></div><div><h3>three</h3></div><div class="w"><h3>four</h3></div><div><h3>five</h3></div><div><h3>six</h3></div></section>
<section class="${k}c"><h2>${word} hello</h2></section></main><footer><div>a</div><div>b</div><div>c</div><div>d</div></footer>`;
const pageB = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#fff;color:#111;font-family:'Courier New',monospace}nav{position:fixed;left:0;top:0;bottom:0;width:220px;border-right:1px solid #111;padding:30px;display:flex;flex-direction:column;gap:14px}
main{margin-left:220px}.top{height:100vh;display:grid;grid-template-columns:2fr 1fr}.top video{width:100%;height:100%;background:#e33}.top div{padding:40px;display:flex;flex-direction:column;justify-content:flex-end}.top h1{font-size:3.2vw;margin:0}
.rows section{display:grid;grid-template-columns:1fr 1fr;min-height:80vh;border-top:1px solid #111}.rows div{padding:60px}.rows i{display:block;background:#356}
.scroller{display:flex;gap:20px;overflow-x:auto;padding:40px}.scroller div{flex:none;width:520px;height:380px;background:#eee}</style>
<nav><b>B</b><a href="#">Index</a><a href="#">Projects</a><a href="#">Method</a><a href="#">Notes</a><a href="#">Press</a><a href="#">Team</a><a href="#">Contact</a></nav>
<main><section class="top"><video></video><div><h1>Architecture for cold places</h1><p>Oslo</p></div></section>
<div class="rows"><section><div><h2>Cabin</h2><p>text</p></div><i></i></section><section><i></i><div><h2>Bath</h2><p>text</p></div></section></div>
<section class="scroller"><div><h3>01</h3></div><div><h3>02</h3></div><div><h3>03</h3></div><div><h3>04</h3></div><div><h3>05</h3></div></section></main>`;

let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch({ executablePath: process.env.JURIED_CHROME || undefined }); }
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const shoot = async (html) => { await page.setContent(html, { waitUntil: 'load' }); return page.evaluate(FINGERPRINT); };
const A = await shoot(pageA({ bg: '#0b0b0f', fg: '#eee', accent: '#333', font: 'Helvetica, Arial, sans-serif', k: 'x', head: 'We build loud things', word: 'Work' }));
const A2 = await shoot(pageA({ bg: '#f4efe4', fg: '#1d1a15', accent: '#c9a020', font: 'Georgia, serif', k: 'zz', head: 'Slow bread, sold out by noon', word: 'Loaf' }));
const B = await shoot(pageB);
await browser.close();

const reskin = similarity(A2, A), other = similarity(B, A);
const fails = (s) => s.structure >= GATES.maxStructureSimilarity || s.overall >= GATES.maxOverallSimilarity;
const pct = (n) => `${Math.round(n * 100)}%`;
console.log(`re-skin of A vs A:      structure ${pct(reskin.structure)}, overall ${pct(reskin.overall)}  → ${fails(reskin) ? 'fails the gate (correct)' : 'PASSES THE GATE (wrong)'}`);
console.log(`different site B vs A:  structure ${pct(other.structure)}, overall ${pct(other.overall)}  → ${fails(other) ? 'FAILS THE GATE (wrong)' : 'passes the gate (correct)'}`);
const ok = fails(reskin) && !fails(other);
console.log(ok ? '\n✔ The originality measurement tells a re-skin from a new design.' : '\n✖ The originality measurement is not separating these pages. Check tools/jury/gates.json.');
process.exitCode = ok ? 0 : 1;
