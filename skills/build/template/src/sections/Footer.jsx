// Footer: link columns, community, legal, concept notice.
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top"><a aria-label="{{aria-label}}" className="foot__logo" href="{{url}}"><span aria-hidden="true" className="brandmark"></span></a> <a className="btn btn--accent" href="{{url}}">{"{{btn}}"}</a></div>
        <div className="foot__cols">
          <nav aria-label="{{aria-label}}">
            <h3>{"{{foot__cols.nav.h3}}"}</h3>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
          </nav>
          <nav aria-label="{{aria-label}}">
            <h3>{"{{foot__cols.nav.h3}}"}</h3>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
          </nav>
          <nav aria-label="{{aria-label}}">
            <h3>{"{{foot__cols.nav.h3}}"}</h3>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
            <a href="{{url}}">{"{{foot__cols.nav.a}}"}</a>
          </nav>
        </div>
        <div className="foot__community">
          <p>{"{{foot__community.p}}"}</p>
          <a className="btn btn--line" href="{{url}}">{"{{btn}}"}</a>
        </div>
        <div className="foot__base">
          <p>{"{{foot__base.p}}"}</p>
          <p><a href="{{url}}">{"{{foot__base.p.a}}"}</a> <a href="{{url}}">{"{{foot__base.p.a}}"}</a> <a href="{{url}}">{"{{foot__base.p.a}}"}</a></p>
          <ul aria-label="{{aria-label}}" className="foot__social">
            <li><a aria-label="{{aria-label}}" href="{{url}}">{"{{foot__social.li.a}}"}</a></li>
            <li><a aria-label="{{aria-label}}" href="{{url}}">{"{{foot__social.li.a}}"}</a></li>
            <li><a aria-label="{{aria-label}}" href="{{url}}">{"{{foot__social.li.a}}"}</a></li>
          </ul>
        </div>
        <p className="foot__concept">{"{{foot__concept}}"} <a href="{{url}}">{"{{foot__concept.a}}"}</a>.</p>
      </div>
    </footer>
  );
}
