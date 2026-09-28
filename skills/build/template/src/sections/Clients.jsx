// Section: 2 · {{section purpose}}
// Replace every {{placeholder}} with researched content. Keep class names and data- attributes:
// the motion recipes in src/page.js find elements by them.

export default function Clients() {
  return (
    <section aria-labelledby="clients-title" className="clients">
      <h2 className="clients__title" id="clients-title">{"{{clients__title}}"}</h2>
      <div className="marquee" data-marquee="">
        <ul className="marquee__track">
          <li><img alt="{{alt}}" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></li>
          <li><img alt="{{alt}}" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></li>
          <li><img alt="{{alt}}" loading="lazy" referrerPolicy="no-referrer" src="{{image-url}}" /></li>
        </ul>
      </div>
    </section>
  );
}
