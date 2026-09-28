// Section: 7 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Integ() {
  return (
    <section aria-labelledby="integ-title" className="integ" data-integ="">
      <div className="wrap integ__grid">
        <div className="integ__copy">
          <h2 data-split="" id="integ-title">{"{{integ__copy.h2}}"}</h2>
          <p>{"{{integ__copy.p}}"}</p>
          <ul className="integ__list" data-integ-list="">
            <li data-node="0"><b>{"{{integ__list.li.b}}"}</b> {"{{integ__list.li}}"}</li>
            <li data-node="1"><b>{"{{integ__list.li.b}}"}</b> {"{{integ__list.li}}"}</li>
            <li data-node="2"><b>{"{{integ__list.li.b}}"}</b> {"{{integ__list.li}}"}</li>
          </ul>
          <p className="integ__more"><span data-count="">{"{{integ__more.span}}"}</span> {"{{integ__more}}"} <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a></p>
        </div>
        <div className="integ__stage">
          <canvas aria-label="{{aria-label}}" data-orbit="" role="img"></canvas>
        </div>
      </div>
    </section>
  );
}
