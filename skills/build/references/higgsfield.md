# Phase 3: Film and photography with Higgsfield

The page's photography and film come from one coherent "shoot": the same light, lens and palette in every
frame. Stills are cheap; video is the expensive part, so plan it deliberately.

## Credentials (never in chat, never in files)

`tools/hf.mjs` reads any of: `HF_API_KEY_ID` + `HF_API_KEY_SECRET` (preferred), `HF_KEY="id:secret"`,
`HF_CREDENTIALS`, or `HF_API_KEY` + `HF_API_SECRET`. The person sets them once in their own terminal:

- Windows (PowerShell): `setx HF_API_KEY_ID "<id>"` and `setx HF_API_KEY_SECRET "<secret>"`, then open a
  new terminal (and restart Claude Code so it inherits them).
- macOS/Linux: add `export HF_API_KEY_ID=…` and `export HF_API_KEY_SECRET=…` to `~/.zshrc` or `~/.bashrc`.

API usage is billed to the Higgsfield API balance, separately from the web app's credits.
`node tools/hf.mjs check` confirms the variables exist (no spend); `node tools/hf.mjs smoke` makes one
~$0.01 image to prove the key end to end.

## The plan file: `juried/asset-plan.json`

```json
{
  "project": "Acme concept",
  "outDir": "juried/raw",
  "budgetUSD": 15,
  "assets": [
    { "id": "film-start", "kind": "image", "model": "marketing-studio/image",
      "input": { "prompt": "…", "resolution": "2k", "aspect_ratio": "16:9", "enhance_prompt": false, "quality": "high" },
      "fallbacks": [{ "model": "higgsfield-ai/soul/standard", "input": { "prompt": "…", "resolution": "2K", "aspect_ratio": "16:9", "num_images": 1 } }] },
    { "id": "film-end", "kind": "image", "model": "marketing-studio/image", "input": { "…": "…" } },
    { "id": "film", "kind": "video", "model": "bytedance/seedance-2.0/image-to-video",
      "input": { "prompt": "…camera move and transformation…", "duration": 8, "resolution": "1080p", "generate_audio": false },
      "refs": { "image_url": "film-start", "end_image_url": "film-end" },
      "fallbacks": [
        { "model": "kling-video/v3.0/pro/image-to-video", "input": { "prompt": "…", "duration": 8, "sound": "off", "cfg_scale": 0.5 }, "map": { "end_image_url": "last_image_url" } },
        { "model": "kling-video/v2.5-turbo/pro/image-to-video", "input": { "prompt": "…", "duration": 10, "cfg_scale": 0.5 }, "map": { "end_image_url": null } }
      ] },
    { "id": "ind-banking", "kind": "image", "model": "marketing-studio/image", "input": { "prompt": "…", "resolution": "2k", "aspect_ratio": "3:2", "enhance_prompt": false, "quality": "high" } },
    { "id": "loop-banking", "kind": "video", "model": "bytedance/seedance-2.0/image-to-video",
      "input": { "prompt": "Very slow dolly-in… only subtle ambient motion…", "duration": 5, "resolution": "720p", "generate_audio": false },
      "refs": { "image_url": "ind-banking" } }
  ],
  "outputs": [
    { "type": "scrub", "from": "film", "name": "film" },
    { "type": "still", "from": "film-start", "name": "film-start" },
    { "type": "still", "from": "film-end", "name": "film-end" },
    { "type": "still", "from": "ind-banking", "name": "ind-banking", "widths": [640, 1280, 1920] },
    { "type": "loop", "from": "loop-banking", "name": "ind-banking", "pingpong": true }
  ]
}
```

- `refs` feed one asset's output URL into another's input field (image-to-video from a generated still).
  The runner orders the work and uploads local files when a remote URL has expired.
- `fallbacks` run in order if a model fails; `map` renames input fields for that model (`null` deletes one).
- `outputs` tell `tools/film.mjs all` what to make for the web: `scrub` (scroll-scrubbed film: short-GOP
  H.264 plus a VP9 twin, desktop and mobile sizes, posters), `still` (responsive WebP + JPG),
  `loop` (silent, small, optional ping-pong for a seamless loop). The page reads `public/media/media.json`.
- Keep raw generations in `juried/raw` (never inside `public/`, or they ship with the site).

## Models (verified endpoints)

| Use | Model path | Key inputs |
|---|---|---|
| Hero/editorial stills | `marketing-studio/image` | `prompt`, `resolution` 1k/2k/4k, `aspect_ratio`, `enhance_prompt` (needs `preset_id` when true), `quality` |
| Still fallback | `higgsfield-ai/soul/standard` | `prompt`, `resolution` 2K/4K, `aspect_ratio`, `num_images` |
| Cheap test image | `higgsfield-ai/soul/v2/standard` | `prompt`, `resolution` 720p/1080p, `aspect_ratio`, `batch_size` |
| Film between two frames | `bytedance/seedance-2.0/image-to-video` | `image_url`, `end_image_url`, `duration` 4–15, `resolution` 480p–4k, `generate_audio` |
| Longer, lower-res | `bytedance/seedance-2.5/image-to-video` | `duration` 4–30, 480p/720p |
| Video fallback | `kling-video/v3.0/pro/image-to-video` | `image_url`, `last_image_url`, `duration` 3–15, `sound`, `cfg_scale` |
| First/last frame | `kling-video/o3/first-last-frame` | `first_frame_url`, `last_frame_url` |
| Budget video | `kling-video/v2.5-turbo/pro/image-to-video` | `image_url`, `duration` 5/10 |

Requests are asynchronous (submit, then poll `requests/{id}/status` until `completed`, `failed`, `nsfw` or
`canceled`); `hf.mjs` handles all of it, retries 429/5xx, and records everything in `juried/raw/manifest.json`.

## Prompt formula

Write one **shoot line** in the brief and append it to every still prompt so the set matches:

`<subject and action>, <setting>, <shoot line: light, time of day, palette, lens, depth of field>,
photorealistic, <medium: editorial photograph | luxury advertising still>, no text, no logos, no visible faces`

- Subject first and concrete ("the trading floor of a modern bank at night, rows of desks with softly
  glowing monitors"), then environment, then the shoot line.
- For film keyframes, describe the same camera, lens and light in both frames and change only the state
  (chaos → order). The video prompt describes the camera move and the transformation, "single continuous
  take, no cuts, no text".
- Loops: "very slow dolly-in with gentle parallax, only subtle ambient motion (lights shimmer, haze drifts),
  camera stays level, nobody enters the frame". Ping-pong them in `outputs`.
- Never ask for text, UI, charts with numbers, logos or brand names in generated images: models garble them.

## Budget guide

Stills ≈ $0.04 each; Seedance 2.0 ≈ $0.30 per second. A typical plan (2 keyframes, 1 × 8s film at 1080p,
9 stills, 4 × 5s loops at 720p) estimates ≈ $9. Always show the `--dry-run` estimate first.

## Quality control

After generation, look at every still and a few frames of every clip:
`ffmpeg -i juried/raw/film.mp4 -vf "select='not(mod(n,24))',scale=480:-1,tile=3x3" -frames:v 1 juried/raw/film-tiles.jpg`.
Regenerate (`--only id`) anything with artefacts, wrong palette, legible text, or faces. One retry each;
if it is still wrong, use the recipe's designed fallback instead of a weak asset.
