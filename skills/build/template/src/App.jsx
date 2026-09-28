import { useEffect } from 'react';
import Header from './sections/Header.jsx';
import Hero from './sections/Hero.jsx';
import Clients from './sections/Clients.jsx';
import Film from './sections/Film.jsx';
import Caps from './sections/Caps.jsx';
import Cases from './sections/Cases.jsx';
import Found from './sections/Found.jsx';
import Integ from './sections/Integ.jsx';
import Flows from './sections/Flows.jsx';
import Faq from './sections/Faq.jsx';
import Cta from './sections/Cta.jsx';
import News from './sections/News.jsx';
import Footer from './sections/Footer.jsx';
import { initPage } from './page.js';

// The page is React components; the cinematic layer (smooth scroll, WebGL, scroll-scrubbed film, pinned
// gallery) is framework-free code in src/page.js and src/recipes/, started once after React has rendered.
let started = false;

export default function App() {
  useEffect(() => {
    if (started) return; // run once, even under React's development double-invoke
    started = true;
    initPage();
  }, []);
  return (
    <>
      <Header />
      <main id="main">
        {/* 1 · {{section purpose}} */}
        <Hero />
        {/* 2 · {{section purpose}} */}
        <Clients />
        {/* 3 · {{section purpose}} */}
        <Film />
        {/* 4 · {{section purpose}} */}
        <Caps />
        {/* 5 · {{section purpose}} */}
        <Cases />
        {/* 6 · {{section purpose}} */}
        <Found />
        {/* 7 · {{section purpose}} */}
        <Integ />
        {/* 9 · {{section purpose}} */}
        <Flows />
        {/* 10 · {{section purpose}} */}
        <Faq />
        {/* 11 · {{section purpose}} */}
        <Cta />
        {/* 12 · {{section purpose}} */}
        <News />
      </main>
      <Footer />
    </>
  );
}
