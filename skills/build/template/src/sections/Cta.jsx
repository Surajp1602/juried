// Section: 11 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Cta() {
  return (
    <section aria-labelledby="cta-title" className="cta">
      <canvas aria-hidden="true" className="cta__canvas" data-liquid-cta=""></canvas>
      <div className="wrap cta__inner">
        <h2 data-split="" id="cta-title">{"{{wrap.h2}}"}</h2>
        <p>{"{{wrap.p}}"}</p>
        <a className="btn btn--accent btn--lg" data-magnetic="" href="{{url}}">{"{{btn}}"}</a>
      </div>
    </section>
  );
}
