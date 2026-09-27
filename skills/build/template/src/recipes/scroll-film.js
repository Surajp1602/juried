// Scroll-scrubbed film: a generated clip whose playhead follows the scrollbar.
// Works with the short-GOP MP4s from tools/film.mjs. The clip only starts downloading once the page has
// settled (so it never competes with the hero), is held in memory so every seek is instant, and falls back
// to a crossfade between its first and last stills when the clip is missing or motion is reduced.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200));

export function scrollFilm(section, { onProgress, reduced = false, introEnd = 0.16 } = {}) {
  const video = section.querySelector('video');
  const steps = [...section.querySelectorAll('[data-step]')];
  const intro = section.querySelector('[data-film-intro]');
  const bar = section.querySelector('[data-film-bar]');
  const stills = [...section.querySelectorAll('[data-film-still]')];
  const mobile = window.matchMedia('(max-width: 820px)').matches;
  const mp4 = video && (mobile ? video.dataset.srcMobile : video.dataset.srcDesktop);
  // H.264 everywhere it exists; the VP9 twin for browsers built without it.
  const src = mp4 && (video.canPlayType('video/mp4; codecs="avc1.640028"') ? mp4 : mp4.replace(/\.mp4$/, '.webm'));
  let duration = 0, progress = 0, raf = 0, requested = false;

  // Fallback: the first and last frames as responsive stills; the last one fades in as you scroll.
  const fail = () => {
    section.classList.add('no-video');
    if (video) video.style.display = 'none';
    stills.forEach((img) => {
      if (img.getAttribute('src')) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      if (img.dataset.src) img.src = img.dataset.src;
    });
  };

  const setStep = (p) => {
    const idx = p < introEnd ? -1 : Math.min(steps.length - 1, Math.floor((p - introEnd) / ((1 - introEnd) / steps.length)));
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    if (intro) intro.style.opacity = String(Math.max(0, 1 - Math.max(0, p - 0.08) * 8));
    if (bar) bar.style.transform = `scaleX(${p})`;
    section.style.setProperty('--film-p', p.toFixed(4));
  };

  if (reduced) { fail(); section.style.setProperty('--film-p', '1'); return; }
  if (!video || !src) fail();

  // Ease the playhead toward the scroll position instead of jumping on every scroll event.
  const tick = () => {
    raf = 0;
    if (!duration) return;
    const target = progress * Math.max(0, duration - 0.05);
    const cur = video.currentTime;
    if (Math.abs(target - cur) > 1 / 60) {
      if (!video.seeking) video.currentTime = cur + (target - cur) * 0.22;
      raf = requestAnimationFrame(tick);
    }
  };

  if (video && src) {
    const load = async () => {
      if (requested) return;
      requested = true;
      if (video.dataset.poster && !video.poster) video.poster = video.dataset.poster;
      let url = src;
      try {
        const r = await fetch(src);
        if (r.status === 404) return fail();
        if (r.ok) url = URL.createObjectURL(await r.blob()); // whole clip in memory: seeks never wait on the network
      } catch { /* network hiccup: stream it instead */ }
      video.src = url;
      video.load();
    };
    video.addEventListener('error', () => { if (!duration) fail(); });
    video.addEventListener('loadedmetadata', () => {
      duration = video.duration || 0;
      // iOS only allows seeking after a play() in a user-visible context; prime it silently.
      video.play().then(() => { video.pause(); tick(); }).catch(() => tick());
    });
    // Start downloading when the page is idle after load, or as soon as the film is two screens away.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '200% 0px' });
    io.observe(section);
    const onLoad = () => idle(load);
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
  }

  setStep(0);
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      progress = self.progress;
      if (!raf) raf = requestAnimationFrame(tick);
      setStep(progress);
      onProgress?.(progress);
    },
  });
}
