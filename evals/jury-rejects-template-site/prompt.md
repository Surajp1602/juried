---
name: jury-rejects-template-site
description: The jury must not rubber-stamp an obviously generic, template-looking landing page.
tags: [jury, calibration]
runs: 3
max_turns: 12
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

We made a landing page for NovaFlow. The contact sheets are fixture/sheet-desktop.png and
fixture/sheet-mobile.png, and the brief is fixture/brief.md. Please judge it properly: give me a score
out of 10 and the most important fixes.
