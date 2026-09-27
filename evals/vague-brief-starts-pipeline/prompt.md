---
name: vague-brief-starts-pipeline
description: A one-sentence request from a non-developer starts the Juried pipeline instead of producing a single generic page.
tags: [trigger, onboarding]
runs: 3
max_turns: 14
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebFetch, WebSearch]
---

make a website for my bakery "Crumb & Co" in Pune. i don't code, just make it look expensive
