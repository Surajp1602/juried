// Starts the page once React has rendered: wires whichever opt-in kit behaviours this build's markup asks
// for, then signals the jury that the page is ready. It has no layout, no styles and no motion style of its
// own. The page's structure lives in src/sections/, its look in src/site.css, and its motion signature in
// src/motion.js, all written for this build from juried/dna.json.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tabs, marquee, countUp, magnetic, accordion, reducedMotion, patchEmbedAlts } from './ui.js';

let started = false;

/**
 * @param {object}   [o]
 * @param {boolean|object} [o.smooth=false]  true or Lenis options for smooth scrolling (off by default)
 * @param {Function} [o.motion]              this build's motion signature: ({ gsap, ScrollTrigger, lenis, reduced }) => void
 * @param {boolean}  [o.embeds=true]         give images injected by third-party embeds an accessible name
 */
export async function startPage({ smooth = false, motion, embeds = true } = {}) {
  if (started) return; // once, even under React's development double-invoke
  started = true;
  gsap.registerPlugin(ScrollTrigger);
  const reduced = reducedMotion();
  const all = (s) => [...document.querySelectorAll(s)];

  let lenis = null;
  if (smooth && !reduced) {
    const { default: Lenis } = await import('lenis');
    lenis = new Lenis(typeof smooth === 'object' ? smooth : {});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis; // the jury scrolls through it
  }

  // Opt-in behaviours: each runs only where the markup carries its attribute.
  all('[data-tabs]').forEach((el) => tabs(el));
  all('[data-count]').forEach(countUp);
  all('[data-marquee]').forEach(marquee);
  all('[data-accordion]').forEach(accordion);
  all('[data-magnetic]').forEach((el) => magnetic(el));
  if (all('[data-media]').length) {
    const { loadMediaManifest, livingMedia } = await import('./media.js');
    const manifest = await loadMediaManifest();
    all('[data-media]').forEach((el) => livingMedia(el, manifest));
  }
  if (all('[data-film]').length) {
    const { scrollFilm } = await import('./scroll-film.js');
    all('[data-film]').forEach((el) => scrollFilm(el, { reduced }));
  }
  if (all('[data-demos]').length) {
    const { demos } = await import('./demos.js');
    all('[data-demos]').forEach(demos);
  }

  try { await motion?.({ gsap, ScrollTrigger, lenis, reduced }); }
  catch (err) { console.error(err); } // a motion bug must never leave the page unready or unreadable

  if (embeds) patchEmbedAlts();
  document.documentElement.classList.add('is-ready');
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__ready = true; // the jury waits for this
}
