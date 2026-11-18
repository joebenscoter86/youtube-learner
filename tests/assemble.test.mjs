import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { assemble, recipeProblems, creditBlock } from '../scripts/assemble.mjs';

const recipe = (name, status = 'unproven') => `## ${name}\nid: 01-x\nstatus: ${status}\nsteps:\n1. Do it (said)\n`;

function study({ recipes = { '01-x.md': recipe('First') }, checks = { '01.md': 'recipe: 01-x\nverdict: pass\n' }, checkFirst = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'youtube-learner-assemble-'));
  fs.mkdirSync(path.join(dir, 'recipes'));
  fs.mkdirSync(path.join(dir, 'checks'));
  fs.writeFileSync(path.join(dir, 'source.info.json'), JSON.stringify({
    id: 'vid1', title: 'How to do it', webpage_url: 'https://www.youtube.com/watch?v=vid1',
    channel: 'Teacher', channel_url: 'https://www.youtube.com/@teacher',
  }));
  const writeRecipes = () => { for (const [f, t] of Object.entries(recipes)) fs.writeFileSync(path.join(dir, 'recipes', f), t); };
  const writeChecks = () => { for (const [f, t] of Object.entries(checks)) fs.writeFileSync(path.join(dir, 'checks', f), t); };
  if (checkFirst) { writeChecks(); writeRecipes(); } else { writeRecipes(); writeChecks(); }
  if (checkFirst) {
    const later = new Date(Date.now() + 5000);
    for (const f of Object.keys(recipes)) fs.utimesSync(path.join(dir, 'recipes', f), later, later);
  }
  return dir;
}

test('assemble writes LEARNED.md with the video and its creator credited at the top', () => {
  const dir = study();
  try {
    const r = assemble(dir);
    assert.equal(r.recipes, 1);
    const text = fs.readFileSync(path.join(dir, 'LEARNED.md'), 'utf8');
    assert.match(text, /\*\*Learned from:\*\* \[How to do it\]\(https:\/\/www\.youtube\.com\/watch\?v=vid1\)/);
    assert.match(text, /\*\*Taught by:\*\* \[Teacher\]\(https:\/\/www\.youtube\.com\/@teacher\)/);
    assert.ok(text.indexOf('Taught by') < text.indexOf('## First'), 'credit comes before the recipes');
    assert.match(text, /\| 01 \| First \| 1 \| not tried \| unproven \|/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('assemble refuses a recipe without a passing check', () => {
  const dir = study({ checks: { '01.md': 'recipe: 01-x\nverdict: fail\n' } });
  try {
    assert.deepEqual(recipeProblems(dir), [{ recipe: '01-x.md', reason: 'no passing check' }]);
    assert.throws(() => assemble(dir), /refused: 01-x\.md \(no passing check\)/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('assemble refuses a recipe edited after its check', () => {
  const dir = study({ checkFirst: true });
  try {
    assert.deepEqual(recipeProblems(dir), [{ recipe: '01-x.md', reason: 'edited after its check' }]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('assemble refuses "proven" without a dated acceptance', () => {
  const dir = study({ recipes: { '01-x.md': recipe('First', 'proven') } });
  try {
    assert.deepEqual(recipeProblems(dir), [{ recipe: '01-x.md', reason: 'proven without a recorded acceptance' }]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('assemble accepts "proven" with a dated acceptance and reads the proof verdict', () => {
  const dir = study({ recipes: { '01-x.md': recipe('First', 'proven (accepted by the owner 2026-11-17: looks right)') } });
  try {
    fs.mkdirSync(path.join(dir, 'proofs', '01'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'proofs', '01', 'review.md'), 'technique: 01-x\nverdict: matches\n');
    assemble(dir);
    assert.match(fs.readFileSync(path.join(dir, 'LEARNED.md'), 'utf8'), /\| 01 \| First \| 1 \| matches \| proven \|/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('creditBlock falls back to the uploader when there is no channel', () => {
  assert.match(creditBlock({ id: 'v', title: 'T', uploader: 'Someone' }), /\*\*Taught by:\*\* Someone\./);
});
