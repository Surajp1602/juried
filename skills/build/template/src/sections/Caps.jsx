// Section: 4 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Caps() {
  return (
    <section aria-labelledby="caps-title" className="caps">
      <div className="wrap caps__head">
        <h2 data-split="" id="caps-title">{"{{wrap.h2}}"}</h2>
        <p>{"{{wrap.p}}"}</p>
      </div>
      <div className="wrap caps__body" data-tabs="">
        <div aria-label="{{aria-label}}" className="caps__list" role="tablist"><button aria-controls="cap-0" aria-selected="true" id="cap-t0" role="tab">{"{{caps__list.button}}"}</button> <button aria-controls="cap-1" aria-selected="false" id="cap-t1" role="tab" tabIndex="-1">{"{{caps__list.button}}"}</button> <button aria-controls="cap-2" aria-selected="false" id="cap-t2" role="tab" tabIndex="-1">{"{{caps__list.button}}"}</button></div>
        <div className="caps__panels">
          <article aria-labelledby="cap-t0" id="cap-0" role="tabpanel">
            <h3>{"{{caps__panels.article.h3}}"}</h3>
            <p>{"{{caps__panels.article.p}}"}</p>
            <dl className="metrics">
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
            </dl>
            <ul className="chips chips--ink">
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
            </ul>
          </article>
          <article aria-labelledby="cap-t1" hidden id="cap-1" role="tabpanel">
            <h3>{"{{caps__panels.article.h3}}"}</h3>
            <p>{"{{caps__panels.article.p}}"}</p>
            <dl className="metrics">
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
            </dl>
            <ul className="chips chips--ink">
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
            </ul>
          </article>
          <article aria-labelledby="cap-t2" hidden id="cap-2" role="tabpanel">
            <h3>{"{{caps__panels.article.h3}}"}</h3>
            <p>{"{{caps__panels.article.p}}"}</p>
            <dl className="metrics">
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
              <div>
                <dt>{"{{metrics.div.dt}}"}</dt>
                <dd data-count="">{"{{metrics.div.dd}}"}</dd>
              </div>
            </dl>
            <ul className="chips chips--ink">
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
              <li>{"{{chips.li}}"}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
