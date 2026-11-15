import { useEffect } from 'react';
import { startPage } from './kit/page.js';
import motion from './motion.js';

// There is no default page. The sections, their order and their shapes come from this build's
// juried/dna.json and juried/brief.md: write each one as a component in src/sections/ and compose them here.
export default function App() {
  useEffect(() => { startPage({ smooth: false, motion }); }, []);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <main id="main"></main>
    </>
  );
}
