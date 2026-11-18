#!/usr/bin/env node
// Collects one video's checked recipes into <study>/LEARNED.md, with the video and its
// creator credited at the top.
//
//   node scripts/assemble.mjs <study dir>
//
// Refuses unless every recipe in recipes/ has checks/<n>.md saying "verdict: pass", naming
// this recipe when it names one, and no older than the recipe (a recipe edited after its
// check must be checked again). "status: proven" counts only with an acceptance and a
// date written beside it ("status: proven (accepted by the owner 2026-11-17: ...)"):
// only the person who asked for the recipe proves it.
import fs from 'node:fs';
import path from 'node:path';

const readIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const mtime = (p) => fs.statSync(p).mtimeMs;
const recipeFiles = (study) => {
  const dir = path.join(study, 'recipes');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
};

export function statusOf(text) {
  const line = (text.match(/^status:\s*(.+)$/m) || [, 'unproven'])[1];
  return { proven: /^proven\b/.test(line), accepted: /\baccepted\b.*\d{4}-\d{2}-\d{2}/.test(line) };
}

/** Recipes that may not be assembled, each with its reason, in file order. */
export function recipeProblems(study) {
  const out = [];
  for (const f of recipeFiles(study)) {
    const n = f.slice(0, 2);
    const recipePath = path.join(study, 'recipes', f);
    const checkPath = path.join(study, 'checks', `${n}.md`);
    const check = readIf(checkPath);
    const named = check?.match(/^recipe:\s*(\S+)/m)?.[1].replace(/\.md$/, '');
    let reason = null;
    if (!check || !/^verdict:\s*pass/m.test(check)) reason = 'no passing check';
    else if (named && named !== f.replace(/\.md$/, '')) reason = 'check names another recipe';
    else if (mtime(checkPath) < mtime(recipePath)) reason = 'edited after its check';
    if (!reason) {
      const status = statusOf(fs.readFileSync(recipePath, 'utf8'));
      if (status.proven && !status.accepted) reason = 'proven without a recorded acceptance';
    }
    if (reason) out.push({ recipe: f, reason });
  }
  return out;
}

// The proof's verdict, when a proof was tried (prompts/prove.md writes proofs/<n>/review.md).
function proofOf(study, n) {
  const review = readIf(path.join(study, 'proofs', n, 'review.md'));
  if (!review) return 'not tried';
  return (review.match(/^verdict:\s*(.+)$/m) || [, 'tried'])[1].trim();
}

export function creditBlock(info) {
  const video = info.webpage_url ?? (info.id ? `https://www.youtube.com/watch?v=${info.id}` : '');
  const channel = info.channel ?? info.uploader ?? 'the creator';
  const channelUrl = info.channel_url ?? info.uploader_url;
  return [
    `**Learned from:** [${info.title ?? video}](${video})`,
    `**Taught by:** ${channelUrl ? `[${channel}](${channelUrl})` : channel}. All credit for the teaching goes to them; go watch the video and support the channel.`,
    '',
    'These recipes are notes in our own words, for personal study. They are not the creator\'s wording, and they leave out their files, art and names.',
  ].join('\n');
}

export function assemble(study) {
  const info = JSON.parse(fs.readFileSync(path.join(study, 'source.info.json'), 'utf8'));
  const problems = recipeProblems(study);
  if (problems.length) throw new Error(`refused: ${problems.map((p) => `${p.recipe} (${p.reason})`).join('; ')}`);
  const files = recipeFiles(study);
  if (!files.length) throw new Error('refused: no recipes in recipes/');
  const rows = [];
  const bodies = [];
  for (const f of files) {
    const n = f.slice(0, 2);
    const text = fs.readFileSync(path.join(study, 'recipes', f), 'utf8').trim();
    const check = fs.readFileSync(path.join(study, 'checks', `${n}.md`), 'utf8');
    const round = (check.match(/^round:\s*(\d)/m) || [, '1'])[1];
    const name = (text.match(/^## (.+)$/m) || [, f])[1];
    const status = statusOf(text).proven ? 'proven' : 'unproven';
    rows.push(`| ${n} | ${name} | ${round} | ${proofOf(study, n)} | ${status} |`);
    bodies.push(text);
  }
  const held = readIf(path.join(study, 'drafts-held.md'));
  const head = [
    `# What this video teaches (${files.length} recipe${files.length === 1 ? '' : 's'})`, '',
    creditBlock(info), '',
    '## How to read this', '',
    'Each recipe was written from the narration and the screen together, then checked against the video by a second reader who did not write it. Every step is marked `said` (narrated), `shown` (on screen; `fNNNNNN` names a saved frame in this folder) or `inferred` (our reading, not the video\'s).', '',
    '"Proof" is what happened when a builder who never saw the video tried to do it from the recipe alone and the result was set beside the video\'s own. `proven` means you tried it yourself and accepted it.', '',
    '| # | Recipe | Check passed in round | Proof | Status |', '|---|---|---|---|---|', ...rows, '',
    ...(held ? ['Recipes that failed their check three times are held back, with the reasons, in `drafts-held.md`.', ''] : []),
  ];
  const outPath = path.join(study, 'LEARNED.md');
  fs.writeFileSync(outPath, `${head.join('\n')}\n${bodies.join('\n\n')}\n`);
  return { id: info.id, recipes: files.length, file: outPath };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const study = process.argv[2];
  if (!study) { console.error('usage: assemble.mjs <study dir>'); process.exit(2); }
  try { console.log(JSON.stringify(assemble(path.resolve(study)))); }
  catch (e) { console.error(e.message); process.exit(1); }
}
