// Skip link, announcement bar and navigation (mega menus, burger).
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Header() {
  return (
    <>
    <a className="skip" href="#main">Skip to content</a>
    <div aria-label="Announcement" className="announce" role="region">
      <p><span className="announce__tag">{"{{announce__tag}}"}</span> {"{{announce.p}}"} <a href="{{url}}" rel="noopener" target="_blank">{"{{announce.p.a}}"}</a></p>
    </div>
    <header className="nav" data-nav="">
      <div className="nav__bar">
        <a aria-label="{{aria-label}}" className="nav__logo" href="{{url}}"><span aria-hidden="true" className="brandmark"></span></a>
        <nav aria-label="Primary" className="nav__menu"><a href="{{url}}">{"{{nav__menu.a}}"}</a> <button aria-controls="mm-solutions" aria-expanded="false" className="nav__trigger" data-mega="mm-solutions">{"{{nav__trigger}}"}</button> <button aria-controls="mm-platform" aria-expanded="false" className="nav__trigger" data-mega="mm-platform">{"{{nav__trigger}}"}</button> <button aria-controls="mm-resources" aria-expanded="false" className="nav__trigger" data-mega="mm-resources">{"{{nav__trigger}}"}</button> <a href="{{url}}">{"{{nav__menu.a}}"}</a> <a href="{{url}}">{"{{nav__menu.a}}"}</a></nav>
        <div className="nav__actions"><a className="nav__login" href="{{url}}">{"{{nav__login}}"}</a> <a className="btn btn--accent btn--sm" data-magnetic="" href="{{url}}">{"{{btn}}"}</a> <button aria-expanded="false" aria-label="Open menu" className="nav__burger" data-burger=""><span></span><span></span></button></div>
      </div>
      <div className="mega" hidden id="mm-solutions">
        <div className="mega__grid mega__grid--4">
          <div>
            <h3>{"{{mega__grid.div.h3}}"}</h3>
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
          </div>
          <div>
            <h3>{"{{mega__grid.div.h3}}"}</h3>
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
          </div>
          <div>
            <h3>{"{{mega__grid.div.h3}}"}</h3>
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
            {' '}
            <a href="{{url}}">{"{{mega__grid.div.a}}"}</a>
          </div>
        </div>
      </div>
      <div className="mega" hidden id="mm-platform">
        <div className="mega__grid mega__grid--2">
          <div><a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a></div>
          <div><a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a></div>
        </div>
      </div>
      <div className="mega" hidden id="mm-resources">
        <div className="mega__grid mega__grid--2">
          <div><a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a></div>
          <div><a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a> <a href="{{url}}">{"{{mega__grid.div.a}}"}</a></div>
        </div>
      </div>
    </header>
    </>
  );
}
