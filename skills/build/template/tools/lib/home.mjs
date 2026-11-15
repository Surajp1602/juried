// Juried's memory on this computer: which sites it has already borrowed from and what every earlier build
// looked like. It lives outside any project (default ~/.juried, override with JURIED_HOME) so that a new
// build can be checked against all the earlier ones, whichever folder they were made in.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const HOME = path.resolve(process.env.JURIED_HOME || path.join(os.homedir(), '.juried'));
const BUILDS = path.join(HOME, 'builds');
const SCOUTED = path.join(HOME, 'scouted.json');
const BASELINE = fileURLToPath(new URL('../jury/baseline.json', import.meta.url));

const readJson = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return fallback; } };
const writeJson = (f, data) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(data, null, 1)); };

export const hostOf = (u) => { try { return new URL(/^https?:/.test(u) ? u : `https://${u}`).hostname.replace(/^www\./, '').toLowerCase(); } catch { return String(u || '').toLowerCase(); } };

// A stable id for the project in the current folder (created on first use, kept in juried/project.json).
export function projectId(cwd = process.cwd()) {
  const f = path.join(cwd, 'juried', 'project.json');
  const cur = readJson(f, null);
  if (cur?.id) return cur.id;
  const id = crypto.randomUUID();
  writeJson(f, { id, createdAt: new Date().toISOString() });
  return id;
}

// Earlier builds, newest first, never including the current project. The shipped baseline (the fixed
// skeleton Juried used up to 1.7) is always last, so even a first build cannot reproduce it unnoticed.
export function priorBuilds({ exclude } = {}) {
  let own = [];
  try {
    own = fs.readdirSync(BUILDS).map((d) => readJson(path.join(BUILDS, d, 'build.json'), null)).filter((b) => b && b.id !== exclude);
  } catch { /* no history yet */ }
  own.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const base = (readJson(BASELINE, { builds: [] }).builds || []).map((b) => ({ ...b, baseline: true }));
  return [...own, ...base];
}

export const buildDir = (id) => path.join(BUILDS, id);

// Insert or update this project's entry. Called by the jury on every run, so the record is never forgotten.
export function recordBuild(entry) {
  const dir = buildDir(entry.id);
  const prev = readJson(path.join(dir, 'build.json'), {});
  writeJson(path.join(dir, 'build.json'), { ...prev, ...entry, at: new Date().toISOString(), firstAt: prev.firstAt || new Date().toISOString() });
  return dir;
}

// Reference hosts that earlier builds borrowed from: a new build must find others.
export function usedReferenceHosts({ exclude } = {}) {
  const used = new Map();
  for (const b of priorBuilds({ exclude })) for (const r of b.references || []) used.set(hostOf(r.url || r), b.subject || b.id);
  return used;
}

// Hosts the scout has already put in front of an earlier build (picked or not): shown again only last.
export const scoutedHosts = () => readJson(SCOUTED, {});
export function rememberScouted(hosts, project) {
  const cur = scoutedHosts(), now = new Date().toISOString();
  for (const h of hosts) if (!cur[h] || cur[h].project === project) cur[h] = { at: now, project };
  writeJson(SCOUTED, cur);
}
