// Section: 5 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Cases() {
  return (
    <section aria-labelledby="cases-title" className="cases" data-cases="">
      <div className="cases__pin">
        <div className="wrap cases__head">
          <h2 data-split="" id="cases-title">{"{{wrap.h2}}"}</h2>
          <p>{"{{wrap.p}}"}</p>
        </div>
        <div className="cases__track" data-cases-track="">
          <article className="case" data-media="ind-banking">
            <div className="case__media">
              <img alt="" />
              <video loop muted playsInline preload="none"></video>
            </div>
            <div className="case__body">
              <p className="case__stat"><b>{"{{case__stat.b}}"}</b> {"{{case__stat}}"}</p>
              <h3>{"{{case__body.h3}}"}</h3>
              <p>{"{{case__body.p}}"}</p>
              <ul>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
              </ul>
              <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a>
            </div>
          </article>
          <article className="case" data-media="ind-insurance">
            <div className="case__media">
              <img alt="" />
              <video loop muted playsInline preload="none"></video>
            </div>
            <div className="case__body">
              <p className="case__stat"><b>{"{{case__stat.b}}"}</b> {"{{case__stat}}"}</p>
              <h3>{"{{case__body.h3}}"}</h3>
              <p>{"{{case__body.p}}"}</p>
              <ul>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
              </ul>
              <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a>
            </div>
          </article>
          <article className="case" data-media="ind-oilgas">
            <div className="case__media">
              <img alt="" />
              <video loop muted playsInline preload="none"></video>
            </div>
            <div className="case__body">
              <p className="case__stat"><b>{"{{case__stat.b}}"}</b> {"{{case__stat}}"}</p>
              <h3>{"{{case__body.h3}}"}</h3>
              <p>{"{{case__body.p}}"}</p>
              <ul>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
                <li>{"{{case__body.ul.li}}"}</li>
              </ul>
              <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
