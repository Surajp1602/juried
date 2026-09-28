// Section: 9 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Flows() {
  return (
    <section aria-labelledby="flows-title" className="flows">
      <div className="wrap">
        <div className="flows__head">
          <h2 data-split="" id="flows-title">{"{{flows__head.h2}}"}</h2>
          <p>{"{{flows__head.p}}"}</p>
        </div>
        <div className="flows__body" data-flows="" data-tabs="">
          <div aria-label="{{aria-label}}" className="flows__tabs" role="tablist"><button aria-controls="wf-0" aria-selected="true" id="wf-t0" role="tab">{"{{flows__tabs.button}}"}</button> <button aria-controls="wf-1" aria-selected="false" id="wf-t1" role="tab" tabIndex="-1">{"{{flows__tabs.button}}"}</button> <button aria-controls="wf-2" aria-selected="false" id="wf-t2" role="tab" tabIndex="-1">{"{{flows__tabs.button}}"}</button></div>
          <div className="flows__panels">
            <article aria-labelledby="wf-t0" className="flow" id="wf-0" role="tabpanel">
              <div className="flow__demo" data-demo="chat">
                <p data-from="user">{"{{flow__demo.p}}"}</p>
                <p data-from="ai">{"{{flow__demo.p}}"}</p>
                <p data-from="user">{"{{flow__demo.p}}"}</p>
                <p data-from="ai">{"{{flow__demo.p}}"}</p>
                <p data-from="system">{"{{flow__demo.p}}"}</p>
                <p data-from="system">{"{{flow__demo.p}}"}</p>
              </div>
              <div className="flow__copy">
                <h3>{"{{flow__copy.h3}}"}</h3>
                <p>{"{{flow__copy.p}}"}</p>
                <ul>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                </ul>
                <p className="flow__watch">{"{{flow__watch}}"} <a href="{{url}}" rel="noopener" target="_blank">{"{{flow__watch.a}}"}</a> <a href="{{url}}" rel="noopener" target="_blank">{"{{flow__watch.a}}"}</a> <a href="{{url}}" rel="noopener" target="_blank">{"{{flow__watch.a}}"}</a> <a href="{{url}}" rel="noopener" target="_blank">{"{{flow__watch.a}}"}</a></p>
              </div>
            </article>
            <article aria-labelledby="wf-t1" className="flow" hidden id="wf-1" role="tabpanel">
              <ol className="flow__demo flow__demo--steps" data-demo="flow">
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
              </ol>
              <div className="flow__copy">
                <h3>{"{{flow__copy.h3}}"}</h3>
                <p>{"{{flow__copy.p}}"}</p>
                <ul>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                </ul>
                <p className="flow__watch">{"{{flow__watch}}"} <a href="{{url}}" rel="noopener" target="_blank">{"{{flow__watch.a}}"}</a></p>
              </div>
            </article>
            <article aria-labelledby="wf-t2" className="flow" hidden id="wf-2" role="tabpanel">
              <ol className="flow__demo flow__demo--steps" data-demo="flow">
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
                <li><b>{"{{flow__demo.li.b}}"}</b> {"{{flow__demo.li}}"}</li>
              </ol>
              <div className="flow__copy">
                <h3>{"{{flow__copy.h3}}"}</h3>
                <p>{"{{flow__copy.p}}"}</p>
                <ul>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                  <li>{"{{flow__copy.ul.li}}"}</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
