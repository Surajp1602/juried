---
type: llm
focus: trace
weight: 1
arm: with-only
---

PASS if, before designing or writing any page section, the assistant runs the live inspiration search
(`tools/scout.mjs`), searches the design galleries (Awwwards, Site of Sites, recent.design, Dribbble) another
way, or states plainly that it will find fresh references for this build before designing. FAIL if it
chooses reference sites from memory, says it will use or fill in a page template, or starts writing page
sections without any reference search.
