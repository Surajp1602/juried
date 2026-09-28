// Section: 12 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function News() {
  return (
    <section aria-labelledby="news-title" className="news">
      <div className="wrap">
        <div className="news__head">
          <h2 id="news-title">{"{{news__head.h2}}"}</h2>
          <a className="link-arrow" href="{{url}}">{"{{link-arrow}}"}</a>
        </div>
        <div className="news__grid"><a className="post" data-reveal="" href="{{url}}"><span className="post__img"><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></span> <span className="post__meta"><time dateTime="{{yyyy-mm-dd}}">{"{{post__meta.time}}"}</time> <span>{"{{post__meta.span}}"}</span></span> <span className="post__title">{"{{post__title}}"}</span></a> <a className="post" data-reveal="" href="{{url}}"><span className="post__img"><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></span> <span className="post__meta"><time dateTime="{{yyyy-mm-dd}}">{"{{post__meta.time}}"}</time> <span>{"{{post__meta.span}}"}</span></span> <span className="post__title">{"{{post__title}}"}</span></a> <a className="post" data-reveal="" href="{{url}}"><span className="post__img"><img alt="" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></span> <span className="post__meta"><time dateTime="{{yyyy-mm-dd}}">{"{{post__meta.time}}"}</time> <span>{"{{post__meta.span}}"}</span></span> <span className="post__title">{"{{post__title}}"}</span></a></div>
      </div>
    </section>
  );
}
