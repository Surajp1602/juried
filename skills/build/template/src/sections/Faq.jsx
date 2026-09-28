// Section: 10 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Faq() {
  return (
    <section aria-labelledby="faq-title" className="faq">
      <div className="wrap faq__grid">
        <div className="faq__head">
          <h2 data-split="" id="faq-title">{"{{faq__head.h2}}"}</h2>
          <p>{"{{faq__head.p}}"}</p>
          <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a>
        </div>
        <div className="faq__list" data-accordion="">
          <details>
            <summary>{"{{faq__list.details.summary}}"}</summary>
            <p>{"{{faq__list.details.p}}"}</p>
          </details>
          <details>
            <summary>{"{{faq__list.details.summary}}"}</summary>
            <p>{"{{faq__list.details.p}}"}</p>
          </details>
          <details>
            <summary>{"{{faq__list.details.summary}}"}</summary>
            <p>{"{{faq__list.details.p}}"}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
