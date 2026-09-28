// The cinematic layer: smooth scroll, navigation behaviour, WebGL, scroll-scrubbed film, pinned gallery,
// tabs, counters. Framework-free, so it runs the same under React; App.jsx starts it once after render.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { createLiquidMark } from './recipes/liquid-mark.js';
import { scrollFilm } from './recipes/scroll-film.js';
import { tabs, marquee, countUp, magnetic, accordion, reducedMotion, patchEmbedAlts } from './recipes/ui.js';
import { demos } from './recipes/demos.js';
import { loadMediaManifest, livingMedia } from './recipes/media.js';

export async function initPage() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const RM = reducedMotion();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Smooth scroll (Lenis drives ScrollTrigger) ----------
  let lenis = null;
  if (!RM) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---------- Navigation: mega menus, burger, hide on scroll, light/dark by section ----------
  const nav = $('[data-nav]');
  const triggers = $$('[data-mega]', nav);
  const closeMegas = () => triggers.forEach((b) => { b.setAttribute('aria-expanded', 'false'); $('#' + b.dataset.mega).hidden = true; });
  triggers.forEach((b) => {
    const panel = $('#' + b.dataset.mega);
    const open = () => { closeMegas(); b.setAttribute('aria-expanded', 'true'); panel.hidden = false; nav.classList.add('is-scrolled'); };
    b.addEventListener('click', () => (b.getAttribute('aria-expanded') === 'true' ? closeMegas() : open()));
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open(); });
  });
  nav.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') closeMegas(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMegas(); });
  const burger = $('[data-burger]');
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  const darkSections = $$('.hero, .film, .found, .integ, .cta, .foot');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (!nav.classList.contains('is-open') && triggers.every((b) => b.getAttribute('aria-expanded') !== 'true')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 600);
    }
    // A floating widget (chat launcher) can step aside while the reader scrolls down, and return on pause or scroll-up.
    if (y > lastY + 2) { document.body.classList.add('is-scrolling-down'); clearTimeout(onScroll.t); onScroll.t = setTimeout(() => document.body.classList.remove('is-scrolling-down'), 1200); }
    else if (y < lastY - 2) document.body.classList.remove('is-scrolling-down');
    lastY = y;
    document.body.classList.toggle('is-past-hero', y > window.innerHeight * 0.85); // e.g. to delay a chat widget's teaser
    const probe = nav.getBoundingClientRect().bottom + 2;
    const onDark = darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    nav.classList.toggle('is-light', !onDark);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Headline line reveals (one orchestrated motion per heading) ----------
  function splitLines(el) {
    const split = SplitText.create(el, { type: 'lines', linesClass: 'line', autoSplit: true, onSplit(self) {
      self.lines.forEach((l) => { const inner = document.createElement('span'); inner.innerHTML = l.innerHTML; l.innerHTML = ''; l.appendChild(inner); });
    } });
    return split;
  }
  // ---------- Hero: molten metal becomes the brand mark ----------
  const brand = await fetch('/juried-brand.json').then((r) => r.json()).catch(() => null);
  // tools/brand.mjs writes public/juried-brand.json; `mark` is the default name (set another with <body data-mark="…">).
  const mark = brand?.marks?.[document.body.dataset.mark || 'mark'];
  if (brand?.marks?.wordmark) document.documentElement.style.setProperty('--wordmark-aspect', brand.marks.wordmark.aspect);
  let liquid = null;
  const heroCanvas = $('[data-liquid]');
  if (mark && heroCanvas) {
    liquid = createLiquidMark(heroCanvas, { sdf: mark.sdf, glyphRect: mark.glyphRect, aspect: mark.aspect, sdfSize: mark.sdfSize, rangeTexels: mark.sdfRangeTexels, height: 2.9, yaw: -0.45, pitch: 0.08, offset: [2.7, 0.55], narrowOffset: [0, 1.75], narrowScale: 0.9 });
  }

  // Runs after the brand fetch above, so the liquid mark exists before the intro timeline references it.
  document.fonts.ready.then(() => {
    $$('[data-split]').forEach((el) => {
      if (RM) return;
      splitLines(el);
      const inner = $$('.line > span', el);
      if (el.classList.contains('hero__title')) return; // hero has its own intro timeline
      gsap.set(inner, { yPercent: 110 });
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => gsap.to(inner, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' }) });
    });
    heroIntro();
  });

  function heroIntro() {
    const lines = $$('.hero__title .line > span');
    const reveals = $$('.hero [data-reveal]');
    const rail = $$('.hero__rail li');
    document.body.classList.remove('is-loading');
    if (RM) { liquid?.form(1); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.set(lines, { yPercent: 110 })
      .set(reveals, { opacity: 0, y: 18 })
      .set(rail, { opacity: 0, y: 12 });
    if (liquid) {
      const f = { v: 0 };
      tl.to(f, { v: 1, duration: 3.2, ease: 'power2.inOut', onUpdate: () => liquid.form(f.v) }, 0.2);
    }
    tl.to(lines, { yPercent: 0, duration: 1.3, stagger: 0.09 }, 0.9)
      .to(reveals, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 1.35)
      .to(rail, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 1.7);
  }

  // Scrolling out of the hero melts the mark, handing off to the film chapter.
  if (liquid && !RM) {
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => liquid.melt(s.progress) });
    gsap.to('.hero__inner', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---------- Proof marquee ----------
  $$('[data-marquee]').forEach(marquee);

  // ---------- Film chapter ----------
  const film = $('[data-film]');
  if (film) scrollFilm(film, { reduced: RM });

  // ---------- Tabs, counters, demos ----------
  $$('[data-tabs]').forEach((t) => tabs(t));
  $$('[data-count]').forEach(countUp);
  $$('[data-flows]').forEach(demos);
  $$('[data-accordion]').forEach(accordion);
  $$('[data-magnetic]').forEach((el) => magnetic(el));

  // ---------- Use cases: pinned horizontal gallery with living photographs ----------
  const manifest = await loadMediaManifest();
  $$('[data-media]').forEach((el) => livingMedia(el, manifest));
  const cases = $('[data-cases]');
  if (cases && !RM && window.innerWidth > 820) {
    const track = $('[data-cases-track]', cases);
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      // Transform pinning never registers as layout shift; touch-only devices keep fixed pinning (native momentum scroll).
      scrollTrigger: { trigger: cases, start: 'top top', end: () => '+=' + distance(), pin: '.cases__pin', pinType: ScrollTrigger.isTouch === 1 ? 'fixed' : 'transform', scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
    });
  } else if (cases) {
    $('[data-cases-track]', cases).style.cssText = 'overflow-x:auto;scroll-snap-type:x mandatory;width:auto;padding-bottom:1rem';
  }

  // Heavy 3D below the fold initialises when the page is idle after the intro, or as soon as it comes near,
  // whichever is first, so shader compilation never lands in the middle of a scroll.
  function soon(el, fn, rootMargin = '600px') {
    let done = false;
    const run = () => { if (done) return; done = true; io.disconnect(); fn(); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) run(); }, { rootMargin });
    io.observe(el);
    const idle = () => setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(run, { timeout: 3000 }) : run()), 4500);
    if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true });
  }

  // ---------- Integrations: 3D hub, loaded only when near the viewport ----------
  const integ = $('[data-integ]');
  if (integ) {
    soon(integ, async () => {
      const { createOrbitHub, shapesFromSvg } = await import('./recipes/orbit-hub.js');
      const items = $$('[data-integ-list] li', integ);
      // The brand mark, extruded in polished metal (falls back to a sphere if the SVG is missing).
      const shapes = mark ? await shapesFromSvg(mark.svg).catch(() => []) : [];
      const hub = createOrbitHub($('[data-orbit]', integ), {
        nodes: items.map((li) => ({ label: li.querySelector('b').textContent })),
        markShapes: shapes,
        onHover: (i) => items.forEach((li, k2) => li.classList.toggle('is-hot', k2 === i)),
      });
      items.forEach((li, i) => {
        li.addEventListener('pointerenter', () => { hub.highlight(i); li.classList.add('is-hot'); });
        li.addEventListener('pointerleave', () => { hub.highlight(-1); li.classList.remove('is-hot'); });
      });
      window.__orbit = hub;
    });
  }

  // ---------- Closing CTA: droplets of metal drift behind the headline ----------
  const ctaCanvas = $('[data-liquid-cta]');
  if (mark && ctaCanvas && !RM) {
    soon(ctaCanvas, () => {
      // The droplets gather beneath the call to action, never behind the words.
      const cta = createLiquidMark(ctaCanvas, { sdf: mark.sdf, glyphRect: mark.glyphRect, aspect: mark.aspect, sdfSize: mark.sdfSize, rangeTexels: mark.sdfRangeTexels, offset: [0, -2.05], narrowOffset: [0, -2.5], height: 1.55, exposure: 1.3, maxDpr: 1.5, supersample: 1, yaw: -0.2 });
      cta?.form(0);
      // As the section scrolls through, the droplets begin to gather into the mark.
      ScrollTrigger.create({ trigger: '.cta', start: 'top 75%', end: 'bottom bottom', scrub: true, onUpdate: (s) => cta?.form(s.progress) });
    });
  }

  // Third-party embeds sometimes inject images without alt text; give them an accessible name.
  patchEmbedAlts();

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__ready = true;
}
