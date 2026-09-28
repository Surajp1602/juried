// Section: 1 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero" data-hero="">
      <canvas aria-hidden="true" className="hero__canvas" data-liquid=""></canvas>
      <div aria-hidden="true" className="hero__glow"></div>
      <div className="hero__inner">
        <p className="hero__kicker" data-reveal="">{"{{hero__kicker}}"}</p>
        <h1 className="hero__title" data-split="" id="hero-title">{"{{hero__title}}"}</h1>
        <div className="hero__copy" data-reveal="">
          <p>{"{{hero__copy.p}}"}</p>
          <p className="hero__proof">{"{{hero__proof}}"}</p>
        </div>
        <div className="hero__ctas" data-reveal=""><a className="btn btn--accent" data-magnetic="" href="{{url}}">{"{{btn}}"}</a> <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a></div>
      </div>
      <ul aria-label="{{aria-label}}" className="hero__rail">
        <li><strong>{"{{hero__rail.li.strong}}"}</strong> {"{{hero__rail.li}}"}</li>
        <li><strong>{"{{hero__rail.li.strong}}"}</strong> {"{{hero__rail.li}}"}</li>
        <li><strong>{"{{hero__rail.li.strong}}"}</strong> {"{{hero__rail.li}}"}</li>
      </ul>
      <p aria-hidden="true" className="hero__scroll"><span></span>Scroll</p>
    </section>
  );
}
