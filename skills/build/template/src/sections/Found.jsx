// Section: 6 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Found() {
  return (
    <section aria-labelledby="found-title" className="found">
      <div className="wrap">
        <div className="found__head">
          <h2 data-split="" id="found-title">{"{{found__head.h2}}"}</h2>
          <p>{"{{found__head.p}}"}</p>
        </div>
        <div className="found__grid">
          <article data-reveal="">
            <p className="found__label">{"{{found__label}}"}</p>
            <h3>{"{{found__grid.article.h3}}"}</h3>
            <p>{"{{found__grid.article.p}}"}</p>
          </article>
          <article data-reveal="">
            <p className="found__label">{"{{found__label}}"}</p>
            <h3>{"{{found__grid.article.h3}}"}</h3>
            <p>{"{{found__grid.article.p}}"}</p>
          </article>
          <article data-reveal="">
            <p className="found__label">{"{{found__label}}"}</p>
            <h3>{"{{found__grid.article.h3}}"}</h3>
            <p>{"{{found__grid.article.p}}"}</p>
          </article>
        </div>
        <div className="certs" data-reveal="">
          <p>{"{{certs.p}}"}</p>
          <ul>
            <li><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /><span>{"{{certs.ul.li.span}}"}</span></li>
            <li><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /><span>{"{{certs.ul.li.span}}"}</span></li>
            <li><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /><span>{"{{certs.ul.li.span}}"}</span></li>
          </ul>
          <a className="btn btn--accent" data-magnetic="" href="{{url}}">{"{{btn}}"}</a>
        </div>
      </div>
    </section>
  );
}
