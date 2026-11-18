---
name: learn
description: Learn a skill from a YouTube tutorial. Downloads the video, listens to every word and reads every frame where the screen changes, lines them up, then has writer agents turn what it teaches into step-by-step recipes (each step marked said, shown or inferred), has a second agent check them against the video, and proves the best ones by building them from the recipe alone and comparing with the video's own result. Use when the person shares a YouTube tutorial link and asks to learn it, study it, turn it into steps or recipes, or "learn this".
---

# Learn a skill from a YouTube tutorial

You lead the work for one video. The scripts do the downloading and lining up; agents you start do the reading and writing; you organise, keep the person informed in plain words, and never skip a check. The person may not be technical: never ask them to type a command, and explain what is happening as it happens.

The plugin's files are at `${CLAUDE_PLUGIN_ROOT}` (if that is not filled in, it is two folders above this skill's own folder). Below, `ROOT` means that path, `STUDY` the video's study folder and `P` the prompts folder, `ROOT/prompts`.

## 0. Before anything

1. Run `node "ROOT/scripts/doctor.mjs"`. If it does not end in `Ready.`, follow the `setup` skill first, then come back.
2. One video at a time. If the person gives a playlist or channel, ask which video to start with, and say why: YouTube may ask to confirm you are not a robot if many videos are downloaded at once, and a few a night is the polite pace.
3. Tell the person what to expect, in two or three sentences: it downloads the video, transcribes it and reads the screen on this Mac (free, takes a while for a long video), then agents write and check the recipes, which uses their Claude plan; a 10 to 20 minute tutorial typically takes 30 to 60 minutes in all. They can leave it running.

## 1. Gather and align (scripts, no model)

Pick the folder: `~/YouTube Learner/<video id>` (the id is the `v=` part of the link, or the last part of a `youtu.be` link).

1. `node "ROOT/scripts/learn.mjs" gather "<url>" --out "STUDY"`. Run it in the background for a long video; it prints its steps. If the tutorial's interface text is very small (dense software panels), add `--max-height 2160` for a sharper download.
   - Exit 3 means YouTube asked to confirm we are not a bot. **Stop.** Do not retry, do not use browser cookies, do not sign in, do not look for a workaround. Tell the person plainly: YouTube paused downloads for now; try the same link again in a few hours; it picks up where it left off.
   - Exit 2 means the video has no usable words (no captions and no speech). Tell the person the learner needs a narrated tutorial.
2. `node "ROOT/scripts/learn.mjs" align "STUDY"`. This measures every frame, keeps the ones where the screen changes, reads their text and writes `STUDY/timeline.md`.
3. `node "ROOT/scripts/learn.mjs" status "STUDY"` shows where it stands. Both commands resume where they stopped if run again.
4. Glance at the top of `STUDY/timeline.md` and tell the person in one line how long the video is, how many sentences and frames were kept, and where the words came from.

## 2. List the techniques (you, text only)

Follow `P/techniques.md` yourself and write `STUDY/techniques.json`. Tell the person what the video teaches, as a short list in plain words.

## 3. Writers

Start one agent for each group of about three techniques, all at once (the Agent tool, in one message). Use your own model for them, not a cheaper one: cheaper readers miss small values. Tell each agent to read `P/write.md` and follow it exactly, and give it: `STUDY` as an absolute path, the video id, its frame rate and picture size (from `STUDY/state.json` and a frame), its technique numbers, any note from your list it needs (two techniques sharing a stretch, an advert to leave out, a technique that builds on another), and these standing notes: the timeline's words come from speech recognition, so trust the screen for names; the text reader misses lone single digits and sometimes a minus sign, so crop and read those; ignore junk "Changed" items; write only your own recipe files and your own `STUDY/scratch/<n>/` folder; no git.

If you cannot start agents, stop and tell the person: the learner needs Claude Code's agents to do the reading.

## 4. Checkers

For each writer's batch, start a fresh agent (never the writer) told to read `P/check.md` and follow it exactly, with the same facts and notes and its list of recipe files.

## 5. Fix rounds

- A recipe that fails goes back to its writer once (continue the same agent if you can; otherwise a new one with the recipe and the check file), with the check's points and the instruction to verify each on the frames before changing anything.
- The checker re-checks it and writes its verdict with a first line `round: 2`.
- A point first raised in round 2 gets one more fix and a final check of the changed lines only, first line `round: 3 (changed lines only)`.
- A recipe that still fails is held: move it to `STUDY/held/` and add a line to `STUDY/drafts-held.md` with the reason. Held recipes are not in the result. Say so to the person; do not hide them.
- Pass on the checker's evidence (frame numbers, times), not your summary of it. You read frames yourself only to settle a disagreement between a writer and a checker.

## 6. Prove it

A recipe that passes its check can still fail when someone follows it (`ROOT/LESSONS.md`, lesson 1). Proving is how you find out.

1. Choose up to three recipes to prove first: the ones the video spends longest on and that can be built on this computer. Tell the person which and why, and that more can be proved later on request.
2. Start one builder agent per recipe, told to read `P/prove.md` and follow it exactly, with the recipe's path and `PROOF` = `STUDY/proofs`. **Never** give a builder the video, frames, timeline or checks: the test is whether the recipe alone is enough.
3. When a builder finishes with a `build.png`, start a fresh reviewer told to read `P/prove-review.md` and follow it, with `STUDY`, the recipe and its proof folder.
4. When a builder writes `try-it.md` instead (the person has to do it: a physical skill, or software you cannot drive), show the person the card and tell them to send a photo or screenshot of their result whenever they try it; then run the reviewer on their picture.
5. A `partly` or `does not match` verdict whose `missing from the recipe` names something real goes back to the recipe's writer as a fix (then a fresh check of the changed lines), and the proof is built again once. Look at each side-by-side yourself before you report it as matching; say which ones you have not looked at.
6. A recipe is `proven` only when the person accepts it. When they do, set its `status:` line to `proven (accepted by the owner <date from the date command>: <their words>)`.

## 7. Assemble and report

1. `node "ROOT/scripts/assemble.mjs" "STUDY"` writes `STUDY/LEARNED.md`, with the video and its creator credited at the top. It refuses a recipe without a passing check, or one edited after its check: fix the cause and run it again, never work around it.
2. Open it for the person (`open "STUDY/LEARNED.md"`) and tell them, in at most eight plain lines: what the video teaches (the recipe names), how many passed the check in each round, any held back and why, what the proofs showed (with the side-by-side images: `open` them), and what they could try next.
3. Offer to free the disk space: `node "ROOT/scripts/learn.mjs" clean "STUDY"` removes the downloaded video, audio and full-size frames and keeps the recipes, checks, proofs and small frames. Run it only on their yes.

## Rules that hold throughout

- The tutorial's video, frames, audio and transcript stay on this Mac, in `STUDY`. Never upload, post or commit them.
- Recipes are in our own words. No creator's sentences, files or art; the credit at the top of `LEARNED.md` names the creator and links the video.
- Take every date and time from the `date` command, never from memory.
- Each agent keeps its scratch files in its own `STUDY/scratch/<name>/` folder.
- Do not report "done" until assemble has run, or you can name the recipe and the reason it cannot.
