---
name: setup
description: First-run check for Juried. Verifies this computer can build cinematic 3D sites (Node.js, a browser for the jury, ffmpeg) and whether Higgsfield image and video generation is ready, then walks a non-technical person through fixing anything missing, including safely storing their Higgsfield API key. Use when someone installs Juried, asks what they need before building a website, or reports that generation or the jury is not working.
---

# Juried setup

Run the machine check:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/build/template/tools/doctor.mjs" --machine
```

(Without the plugin variable, run `tools/doctor.mjs --machine` from the Juried build skill's `template` folder.)

Then explain the result in plain words and fix what you can:

- **Node.js too old or missing:** ask them to install the LTS version from https://nodejs.org, then open a
  new terminal and restart Claude Code.
- **No browser:** Google Chrome is enough. Otherwise, a project will run `npx playwright install chromium`.
- **Higgsfield key missing:** generation is optional. Builds can use their own photos and video, and
  otherwise get real-time 3D and typography.
  To enable AI photography and film, they create an API key in their Higgsfield account and store it
  themselves, never in chat:
  - Windows PowerShell: `setx HF_API_KEY_ID "<key id>"` then `setx HF_API_KEY_SECRET "<secret>"`
  - macOS/Linux: add `export HF_API_KEY_ID="<key id>"` and `export HF_API_KEY_SECRET="<secret>"` to `~/.zshrc`
  - Then open a new terminal and restart Claude Code so it can see them.
  If they paste a key into the chat anyway, tell them to delete it in Higgsfield and create a new one.
- **Key rejected:** the key or secret is wrong or revoked; create a new one.
- **Higgsfield unreachable:** a firewall or proxy blocks `api.higgsfield.ai`. Builds still work; the
  generation step (`npm run assets`) must run from a network that can reach it.

Finish with one line: what they can build now, and the sentence to start, for example:
"Build a landing page for acme.com".
