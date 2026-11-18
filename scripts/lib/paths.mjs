// Where the learner keeps its tools and its studies.
//
// Tools (the text-reader and the speech model) live in a hidden folder that survives
// plugin updates: ~/.youtube-learner (override with YOUTUBE_LEARNER_HOME).
// Studies (one folder per video) live where a person can find them:
// ~/YouTube Learner (override with YOUTUBE_LEARNER_STUDIES).

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const TOOLS_HOME = process.env.YOUTUBE_LEARNER_HOME ?? join(homedir(), '.youtube-learner');
export const STUDIES_HOME = process.env.YOUTUBE_LEARNER_STUDIES ?? join(homedir(), 'YouTube Learner');
export const OCR_BINARY = join(TOOLS_HOME, 'bin', 'ocr');

export const MODEL_NAME = 'ggml-medium.en.bin';
export const MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}`;

// The speech model: an explicit path wins, then our own copy, then one a person already has.
export function whisperModel() {
  if (process.env.YOUTUBE_LEARNER_WHISPER_MODEL) return process.env.YOUTUBE_LEARNER_WHISPER_MODEL;
  const candidates = [join(TOOLS_HOME, 'models', MODEL_NAME), join(homedir(), '.whisper-cpp', MODEL_NAME)];
  return candidates.find((p) => existsSync(p)) ?? candidates[0];
}
