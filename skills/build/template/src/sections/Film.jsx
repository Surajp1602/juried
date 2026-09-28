// Section: 3 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Film() {
  return (
    <section aria-labelledby="film-title" className="film" data-film="">
      <div className="film__stage">
        <div className="film__media" data-film-media="">
          <div aria-hidden="true" className="film__fallback"><img alt="" data-film-still="" data-src="/media/film-start.jpg" data-srcset="/media/film-start-1280.webp 1280w, /media/film-start-1920.webp 1920w, /media/film-start-2560.webp 2560w" sizes="100vw" /> <img alt="" data-film-still="" data-src="/media/film-end.jpg" data-srcset="/media/film-end-1280.webp 1280w, /media/film-end-1920.webp 1920w, /media/film-end-2560.webp 2560w" sizes="100vw" /></div>
          <video data-poster="/media/film-poster.jpg" data-src-desktop="/media/film-scrub.mp4" data-src-mobile="/media/film-scrub-m.mp4" muted playsInline preload="auto"></video>
        </div>
        <div aria-hidden="true" className="film__shade"></div>
        <div className="film__intro" data-film-intro="">
          <h2 id="film-title">{"{{film__intro.h2}}"}</h2>
          <p>{"{{film__intro.p}}"}</p>
        </div>
        <ol className="film__steps" data-film-steps="">
          <li data-step="">
            <span className="film__num">{"{{film__num}}"}</span>
            <h3>{"{{film__steps.li.h3}}"}</h3>
            <p>{"{{film__steps.li.p}}"}</p>
            <ul className="chips">
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
            </ul>
          </li>
          <li data-step="">
            <span className="film__num">{"{{film__num}}"}</span>
            <h3>{"{{film__steps.li.h3}}"}</h3>
            <p>{"{{film__steps.li.p}}"}</p>
            <ul className="chips">
              <li>{"{{chips.li}}"}</li>
            </ul>
          </li>
          <li data-step="">
            <span className="film__num">{"{{film__num}}"}</span>
            <h3>{"{{film__steps.li.h3}}"}</h3>
            <p>{"{{film__steps.li.p}}"}</p>
            <ul className="chips">
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
            </ul>
          </li>
        </ol>
        <div aria-hidden="true" className="film__progress"><span data-film-bar=""></span></div>
      </div>
    </section>
  );
}
