// Liquid mark — a real-time raymarched "molten metal" rendering of a brand glyph.
// The glyph comes from a signed-distance-field texture produced by tools/brand.mjs, so
// this works for any logo. Raw WebGL2, no dependencies (~4 KB gzipped).
//
// const mark = createLiquidMark(canvas, { sdf: '/brand/mark-sdf.png', glyphRect, aspect, sdfSize, rangeTexels });
// mark.form(1)      // 0 = molten droplets, 1 = the glyph (animate it)
// mark.melt(0..1)   // scroll-driven: glyph dissolves + camera dives into the metal
// mark.dispose()

const VERT = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 outColor;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uMouseOn;
uniform float uForm; uniform float uMelt; uniform vec2 uOffset; uniform float uScale;
uniform sampler2D uSdf; uniform vec4 uGlyphRect; uniform vec2 uGlyphSize; uniform float uTexelWorld;
uniform vec3 uGold; uniform float uExposure; uniform vec2 uRot; uniform vec4 uHomes[7]; uniform float uRipple;
uniform float uAA; uniform float uAAThreshold;

bool gHQ = false;
vec4 cubicW(float v){ vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v; vec4 s = n * n * n; float x = s.x; float y = s.y - 4.0 * s.x; float z = s.z - 4.0 * s.y + 6.0 * s.x; return vec4(x, y, z, 6.0 - x - y - z) * (1.0 / 6.0); }
// B-spline bicubic filtering in 4 bilinear taps: continuous gradients, so faces shade without texel seams
float sdfBicubic(vec2 uv){
  vec2 ts = vec2(textureSize(uSdf, 0)); vec2 inv = 1.0 / ts;
  vec2 tc = uv * ts - 0.5; vec2 f = fract(tc); tc -= f;
  vec4 xc = cubicW(f.x), yc = cubicW(f.y);
  vec4 c = tc.xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 sm = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
  vec4 off = (c + vec4(xc.yw, yc.yw) / sm) * inv.xxyy;
  float s0 = texture(uSdf, off.xz).r, s1 = texture(uSdf, off.yz).r, s2 = texture(uSdf, off.xw).r, s3 = texture(uSdf, off.yw).r;
  float sx = sm.x / (sm.x + sm.y), sy = sm.z / (sm.z + sm.w);
  return mix(mix(s3, s2, sx), mix(s1, s0, sx), sy);
}

float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0-h); }

float glyph2D(vec2 q){
  // q: glyph-local world coords, origin at glyph centre, y up
  vec2 n = q / uGlyphSize + 0.5;                       // 0..1 across the glyph box
  vec2 uv = vec2(mix(uGlyphRect.x, uGlyphRect.z, n.x), mix(uGlyphRect.w, uGlyphRect.y, n.y));
  vec2 cuv = clamp(uv, vec2(0.002), vec2(0.998));
  float d = (gHQ ? sdfBicubic(cuv) : texture(uSdf, cuv).r) * uTexelWorld; // signed distance in texels
  vec2 outside = (uv - cuv) / vec2(uGlyphRect.z - uGlyphRect.x, uGlyphRect.w - uGlyphRect.y) * uGlyphSize;
  return d + length(outside);
}

float glyph3D(vec3 p){
  float r = 0.05;
  float d2 = glyph2D(p.xy) + r;
  vec2 w = vec2(d2, abs(p.z) - 0.2);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - r;
}

vec3 blobPos(float i, float t, float form, vec3 home){
  float a = i * 2.39996 + t * (0.21 + 0.03 * i);
  vec3 wander = vec3(cos(a) * (1.25 - 0.1 * i), sin(a * 1.31 + i) * 0.85, sin(a * 0.7) * 0.45);
  return mix(wander, home, smoothstep(0.0, 0.8, form));
}

float scene(vec3 p){
  p.xy -= uOffset;
  p /= uScale;
  float cy = cos(uRot.x), sy = sin(uRot.x), cx = cos(uRot.y), sx = sin(uRot.y);
  p.xz = mat2(cy, -sy, sy, cy) * p.xz;
  p.yz = mat2(cx, -sx, sx, cx) * p.yz;
  float t = uTime;
  float form = uForm * (1.0 - uMelt);
  float dg = glyph3D(p) + (1.0 - smoothstep(0.25, 1.0, form)) * 0.9 + uMelt * 0.35;
  float db = 1e5;
  for (int k = 0; k < 7; k++){
    float i = float(k);
    vec3 c = blobPos(i, t, form, uHomes[k].xyz);
    c.y -= uMelt * (1.2 + 0.4 * i);
    float r = (0.52 - 0.035 * i) * (1.0 - smoothstep(0.55, 1.0, form)) * (1.0 + uMelt * 0.3) - 0.03 * smoothstep(0.9, 1.0, form);
    db = smin(db, length(p - c) - r, 0.42);
  }
  float d = smin(dg, db, mix(0.5, 0.12, form));
  if (uMouseOn > 0.001){
    vec3 m = vec3((uMouse - uOffset) / uScale, 0.3);
    float near = smoothstep(2.4, 0.8, length(m.xy));
    float dm = length(p - m) - 0.17 * near * uMouseOn;
    d = smin(d, dm, 0.5 * near + 0.001);
  }
  float amp = mix(0.03, 0.0022, form) * uRipple;   // molten while forming, nearly still once it is the mark
  d += amp * sin(p.x * 7.0 + t * 1.3) * sin(p.y * 6.0 - t * 0.9) * sin(p.z * 8.0 + t * 0.7);
  return d * uScale;
}

vec3 calcNormal(vec3 p){
  // sample the gradient over a few SDF texels, so flat faces don't show the texel staircase as ribbing
  vec2 e = vec2(1.0, -1.0) * max(0.004, 2.5 * uTexelWorld * uScale);
  return normalize(e.xyy * scene(p + e.xyy) + e.yyx * scene(p + e.yyx) + e.yxy * scene(p + e.yxy) + e.xxx * scene(p + e.xxx));
}

// Procedural photo-studio environment: large softboxes + warm rim + dark floor.
vec3 env(vec3 d){
  float t = uTime * 0.04;
  float ca = cos(t), sa = sin(t);
  d.xz = mat2(ca, -sa, sa, ca) * d.xz;
  vec3 col = vec3(0.010, 0.008, 0.006);
  col += vec3(1.0, 0.92, 0.80) * 1.25 * smoothstep(0.15, 0.95, d.z) * smoothstep(-0.7, 0.7, d.y);          // big frontal softbox
  col += vec3(1.0, 0.95, 0.85) * 2.4 * exp(-pow((d.y - 0.34) / 0.045, 2.0)) * smoothstep(-0.2, 0.7, d.z);  // horizontal strip light
  col += vec3(1.0, 0.93, 0.82) * 2.8 * smoothstep(0.6, 0.95, d.y) * smoothstep(1.0, 0.25, abs(d.x));       // top softbox
  col += vec3(1.0, 0.86, 0.66) * 2.2 * exp(-pow((d.x + 0.8) / 0.11, 2.0)) * smoothstep(-0.3, 0.4, d.y);   // key strip
  col += vec3(1.0, 0.80, 0.52) * 1.8 * exp(-pow((d.x - 0.86) / 0.07, 2.0)) * smoothstep(-0.4, 0.6, d.y);  // rim strip
  col += vec3(0.05, 0.035, 0.02) * smoothstep(0.0, -0.8, d.y);                                           // floor bounce
  return col;
}

vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

vec4 render(vec2 frag){
  gHQ = false;
  float fov = 0.52;
  float dolly = uMelt * uMelt * 4.2;
  vec3 ro = vec3(0.0, 0.0, 7.0 - dolly);
  vec3 rd = normalize(vec3(frag * fov * 2.0, -1.0));
  float t = 0.0, d = 1.0, minD = 1e5, tMin = 0.0;
  bool hit = false, exhausted = true;
  for (int i = 0; i < 128; i++){
    vec3 p = ro + rd * t;
    d = scene(p);
    if (d < minD){ minD = d; tMin = t; }
    if (d < 0.00025 * t){ hit = true; exhausted = false; break; }
    t += d * (d < 0.05 ? 0.6 : 0.9);
    if (t > 14.0){ exhausted = false; break; }
  }
  // rays that run out of steps while skimming a face are grazing hits, not misses
  if (!hit && exhausted && minD < 0.02){ hit = true; t = tMin; }
  float pix = 1.6 / uRes.y * fov * 2.0;                  // world size of a pixel at unit distance
  if (!hit){
    float a = 1.0 - smoothstep(0.0, pix * tMin * 1.5, minD); // soft anti-aliased silhouette
    if (a <= 0.0) return vec4(0.0);
    t = tMin;
  }
  gHQ = true;
  // refine the hit so normals are evaluated on the surface, not a few thousandths above it
  if (hit){ for (int i = 0; i < 3; i++){ t += scene(ro + rd * t); } }
  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  vec3 v = -rd;
  vec3 r = reflect(rd, n);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec3 F = uGold + (1.0 - uGold) * pow(1.0 - ndv, 5.0);
  float ao = clamp(scene(p + n * 0.08) / 0.08, 0.35, 1.0) * clamp(0.5 + 0.5 * scene(p + n * 0.25) / 0.25, 0.4, 1.0);
  // small reflection cone: averages the sharp studio lights so grazing faces don't shimmer
  vec3 tA = normalize(cross(r, vec3(0.0, 1.0, 0.0)) + 1e-4), tB = cross(r, tA);
  float spread = mix(0.018, 0.06, pow(1.0 - ndv, 2.0));
  vec3 envc = (env(r) + env(normalize(r + tA * spread)) + env(normalize(r - tA * spread)) + env(normalize(r + tB * spread)) + env(normalize(r - tB * spread))) * 0.2;
  vec3 col = envc * F * ao;
  // tight specular glint from the key light
  vec3 L = normalize(vec3(-0.6, 0.7, 0.5));
  col += vec3(1.0, 0.9, 0.7) * pow(max(dot(r, L), 0.0), 90.0) * 1.4 * ao;
  col = aces(col * uExposure);
  col = pow(col, vec3(1.0 / 2.2));
  float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, pix * tMin * 1.5, minD);
  return vec4(col * alpha, alpha);
}

void main(){
  vec2 frag = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec4 c = render(frag);
  // Edge anti-aliasing: where colour or coverage jumps across the 2x2 pixel quad (silhouettes, creases),
  // add four rotated-grid subsamples. Only the few percent of pixels on edges pay for it. The derivative is
  // taken outside the loop and render() has just two call sites, so shader compilers never unroll it.
  float edge = dot(fwidth(c), vec4(0.3, 0.3, 0.3, 1.0));
  if (uAA > 0.5 && edge > uAAThreshold){
    float q = 1.0 / uRes.y;
    for (int s = 0; s < 4; s++){
      float a = 0.4636 + 1.5708 * float(s);                  // rotated grid: 26.6 degrees, radius ~0.4 px
      c += render(frag + vec2(cos(a), sin(a)) * 0.395 * q);
    }
    c *= 0.2;
    if (uAA > 1.5) c = vec4(1.0, 0.0, 0.0, 1.0); // debug: show which pixels were supersampled
  }
  outColor = c;
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export function createLiquidMark(canvas, opts) {
  const o = {
    gold: [1.0, 0.766, 0.336],
    exposure: 1.0,
    height: 2.0,             // glyph height in world units
    offset: [1.55, 0.05],    // where the glyph sits (world units) — right of the headline
    narrowOffset: [0, 0.9],  // portrait screens: centred, raised above the headline
    narrowScale: 1,
    maxDpr: 2,               // resolution ceiling (CSS px multiplier)
    supersample: 1,          // minimum render scale, even on 1x screens (extra anti-aliasing when the GPU allows)
    aa: 1,                   // edge anti-aliasing in the shader (0 off, 1 on, 2 debug overlay)
    aaThreshold: 0.08,
    yaw: -0.38,
    pitch: 0.1,
    ...opts,
  };
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  for (const n of ['uRes', 'uTime', 'uMouse', 'uMouseOn', 'uForm', 'uMelt', 'uOffset', 'uScale', 'uSdf', 'uGlyphRect', 'uGlyphSize', 'uTexelWorld', 'uGold', 'uExposure', 'uRot', 'uHomes', 'uRipple', 'uAA', 'uAAThreshold']) U[n] = gl.getUniformLocation(prog, n);

  const glyphH = o.height;
  const glyphW = glyphH * o.aspect;
  const texelWorld = glyphW / ((o.glyphRect[2] - o.glyphRect[0]) * o.sdfSize[0]);
  gl.uniform4f(U.uGlyphRect, ...o.glyphRect);
  gl.uniform2f(U.uGlyphSize, glyphW, glyphH);
  gl.uniform1f(U.uTexelWorld, texelWorld);
  gl.uniform3f(U.uGold, ...o.gold);
  gl.uniform1f(U.uExposure, o.exposure);
  gl.uniform1i(U.uSdf, 0);
  gl.uniform1f(U.uRipple, o.ripple ?? 1);
  // droplet "homes": spread along the glyph so the liquid pours into its strokes
  const homes = o.homes || [[-0.39, -0.4], [-0.28, -0.09], [-0.13, 0.35], [0.015, -0.09], [0.14, -0.4], [0.425, 0.28], [0.425, -0.32]]
    .map(([x, y]) => [x * glyphW, y * glyphH, 0, 0]);
  gl.uniform4fv(U.uHomes, new Float32Array(homes.flat()));

  const tex = gl.createTexture();
  let ready = false;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    // Decode the 16-bit distance (R = high byte, G = low byte) into floats; half-float textures filter smoothly.
    const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    const cx = cv.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
    cx.drawImage(img, 0, 0);
    const px = cx.getImageData(0, 0, cv.width, cv.height).data;
    const range = o.rangeTexels || 48;
    const f = new Float32Array(cv.width * cv.height);
    for (let i = 0; i < f.length; i++) f[i] = (((px[i * 4] << 8) | px[i * 4 + 1]) / 65535 - 0.5) * 2 * range;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, cv.width, cv.height, 0, gl.RED, gl.FLOAT, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    ready = true;
    canvas.dispatchEvent(new CustomEvent('liquid:ready'));
  };
  img.src = o.sdf;

  const state = { form: 0, melt: 0, mouse: [0, 0], mouseTarget: [0, 0], mouseOn: 0, mouseOnTarget: 0, offset: [...o.offset], scale: 1, quality: 1 };
  let raf = 0, visible = true, t0 = performance.now(), last = t0, slowFrames = 0;

  function resize() {
    // Supersample: render above devicePixelRatio when the GPU allows; compositing downsamples it, which
    // anti-aliases the metal's edges. Adaptive quality below lowers it on slower GPUs.
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, o.supersample), o.maxDpr) * state.quality;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    // keep the glyph framed on narrow screens
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    if (aspect < 1.1) { state.offset = [...(o.narrowOffset || [0, 0.9])]; state.scale = Math.min(1, aspect * 0.95) * (o.narrowScale || 1); }
    else { state.offset = [...o.offset]; state.scale = aspect < 1.5 ? 0.85 : 1; }
  }

  function toWorld(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.height;
    const y = -(e.clientY - rect.top - rect.height / 2) / rect.height;
    const k = 7.0 * 0.52 * 2.0; // camera distance * fov scale
    return [x * k, y * k];
  }
  const onMove = (e) => { state.mouseTarget = toWorld(e); state.mouseOnTarget = 1; };
  const onLeave = () => { state.mouseOnTarget = 0; };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) loop(); });
  io.observe(canvas);

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    // adaptive quality: if frames are slow, render fewer pixels
    // below ~45 fps for 20 frames: render fewer pixels (down to half resolution)
    if (dt > 0.022) { if (++slowFrames > 20 && state.quality > 0.5) { state.quality = Math.max(0.5, state.quality - 0.15); slowFrames = 0; resize(); } }
    else slowFrames = Math.max(0, slowFrames - 1);
    const k = 1 - Math.pow(0.001, dt);   // frame-rate independent smoothing (spring-ish lag)
    state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * k * 0.35;
    state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * k * 0.35;
    state.mouseOn += (state.mouseOnTarget - state.mouseOn) * k * 0.2;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform2f(U.uMouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(U.uMouseOn, state.mouseOn);
    gl.uniform1f(U.uForm, state.form);
    gl.uniform1f(U.uMelt, state.melt);
    gl.uniform2f(U.uOffset, state.offset[0], state.offset[1]);
    gl.uniform1f(U.uScale, state.scale);
    gl.uniform1f(U.uAA, o.aa);
    gl.uniform1f(U.uAAThreshold, o.aaThreshold);
    const time = (now - t0) / 1000;
    gl.uniform2f(U.uRot, o.yaw + state.mouse[0] * 0.05 * state.mouseOn + Math.sin(time * 0.31) * 0.06, o.pitch - state.mouse[1] * 0.04 * state.mouseOn + Math.sin(time * 0.23) * 0.03);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (ready) gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop() {
    raf = 0;
    if (!visible || document.hidden) return;
    frame(performance.now());
    raf = requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !raf) loop(); });
  resize();
  if (o.autoplay !== false) loop();

  return {
    get state() { return state; },
    form(v) { state.form = v; },
    melt(v) { state.melt = v; },
    renderOnce(time = 2) { resize(); t0 = performance.now() - time * 1000; last = performance.now(); frame(performance.now()); },
    get ready() { return ready; },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); gl.getExtension('WEBGL_lose_context')?.loseContext(); },
  };
}
