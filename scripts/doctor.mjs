#!/usr/bin/env node
// Checks everything the learner needs on this computer and says what is missing.
//
//   node scripts/doctor.mjs          a readable list
//   node scripts/doctor.mjs --json   the same as data, for the setup skill
//
// It installs nothing. Exit code 0 when everything is ready, 1 when something is missing.

import { execFile } from 'node:child_process';
import { existsSync, statfsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { OCR_BINARY, MODEL_NAME, MODEL_URL, STUDIES_HOME, TOOLS_HOME, whisperModel } from './lib/paths.mjs';

const run = promisify(execFile);
const BUILD_OCR = `sh "${join(dirname(fileURLToPath(import.meta.url)), 'ocr', 'build.sh')}"`;

async function version(cmd, args = ['--version']) {
  try {
    const { stdout, stderr } = await run(cmd, args, { timeout: 20000 });
    return (stdout || stderr).trim().split('\n')[0] || 'found';
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    // Some tools print their version and exit non-zero; being runnable is what matters.
    const text = `${e.stdout ?? ''}${e.stderr ?? ''}`.trim().split('\n')[0];
    return text || 'found';
  }
}

function freeGb(path) {
  try {
    const s = statfsSync(existsSync(path) ? path : homedir());
    return Math.round((s.bavail * s.bsize) / 1e9);
  } catch { return null; }
}

export async function checks() {
  const list = [];
  const add = (name, ok, detail, fix) => list.push({ name, ok, detail, ...(ok ? {} : { fix }) });

  const mac = process.platform === 'darwin';
  add('macOS', mac, mac ? 'this is a Mac' : `this is ${process.platform}`,
    'The learner reads on-screen text with Apple\'s Vision framework, so it runs on macOS only today. See "Windows and Linux" in the README.');

  const major = Number(process.versions.node.split('.')[0]);
  add('Node.js 20 or newer', major >= 20, `Node ${process.versions.node}`, 'brew install node');

  const brew = await version('brew');
  add('Homebrew', !!brew, brew ?? 'not found',
    'Install Homebrew from https://brew.sh (the person types their Mac password once in Terminal).');

  const ytdlp = await version('yt-dlp');
  add('yt-dlp (downloads the video)', !!ytdlp, ytdlp ?? 'not found', 'brew install yt-dlp');

  const ffmpeg = await version('ffmpeg', ['-version']);
  add('ffmpeg (audio and frames)', !!ffmpeg, ffmpeg ?? 'not found', 'brew install ffmpeg');

  const whisper = await version('whisper-cli', ['--help']);
  add('whisper-cli (listens to every word)', !!whisper, whisper ? 'found' : 'not found', 'brew install whisper-cpp');

  const model = whisperModel();
  const haveModel = existsSync(model);
  add(`speech model ${MODEL_NAME} (about 1.5 GB)`, haveModel, haveModel ? model : 'not downloaded',
    `mkdir -p "${TOOLS_HOME}/models" && curl -L --fail -o "${TOOLS_HOME}/models/${MODEL_NAME}" ${MODEL_URL}`);

  // /usr/bin/swiftc exists on every Mac as a stub; the Command Line Tools are what make it work.
  let swiftc = null;
  if (mac) { try { await run('xcode-select', ['-p'], { timeout: 10000 }); swiftc = 'found'; } catch { swiftc = null; } }
  const haveOcr = existsSync(OCR_BINARY);
  add('screen text reader (built from scripts/ocr)', haveOcr, haveOcr ? OCR_BINARY : 'not built',
    swiftc ? BUILD_OCR : `xcode-select --install   (Apple's Command Line Tools; a window opens to confirm), then: ${BUILD_OCR}`);

  const gb = freeGb(STUDIES_HOME);
  add('free disk space (about 2 to 6 GB per video while it is studied)', gb == null || gb >= 10,
    gb == null ? 'unknown' : `${gb} GB free`, 'Free some space: each study folder can be deleted once its recipes are written.');

  return list;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const list = await checks();
  const ready = list.every((c) => c.ok);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ ready, toolsHome: TOOLS_HOME, studiesHome: STUDIES_HOME, checks: list }, null, 2));
  } else {
    for (const c of list) console.log(`${c.ok ? 'ok     ' : 'MISSING'}  ${c.name}: ${c.detail}${c.ok ? '' : `\n         fix: ${c.fix}`}`);
    console.log(ready ? '\nReady.' : '\nNot ready yet.');
  }
  process.exitCode = ready ? 0 : 1;
}
