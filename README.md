# YouTube Learner

Give Claude a YouTube tutorial and it learns it the way a careful student would: it listens to every word, watches every moment the screen changes, and writes down what the video teaches as step-by-step recipes you can follow. Then it checks its own work against the video, and tries to build the result from its notes alone to prove they are good enough.

It works on any narrated tutorial: software (spreadsheets, 3D, design, editing, code), and hands-on skills too (cooking, music, crafts), where the "proof" is a short card for you to try yourself.

Made by [Joe Benscoter](https://joebenscoter.com). Free and open source.

## What you get

For each video, a folder in `YouTube Learner` (in your home folder) with a file called `LEARNED.md`:

- the video and its creator credited at the top, with a link back to the video;
- one recipe per technique the video teaches, in plain steps, with every step marked **said** (the narrator says it), **shown** (you can see it on screen, with the exact frame saved next to it) or **inferred** (Claude's reading, not the video's);
- the sizes, amounts and settings the result needs, measured on the video's own finished result, even when the narrator never says them;
- for the recipes Claude could build on your computer, a picture of its build next to the video's result, and a plain verdict on whether they match.

## How it works

1. **Listens.** It downloads the video and transcribes every word on your Mac with a free speech engine (whisper.cpp), and checks that transcript against YouTube's captions.
2. **Watches.** It measures every frame for change and keeps the ones where something happens on screen, then reads the text on each one with Apple's built-in text recognition (the same thing that lets you copy text out of a photo).
3. **Lines them up.** Each sentence is matched with what was on screen while it was said, and with the values that changed ("Roughness went from 0.5 to 0.2 at 4:12").
4. **Writes.** Claude splits the video into techniques and starts writer agents, a few techniques each, who turn the words and frames into recipes.
5. **Checks.** A second agent who did not write them checks every claim against the video, and sends failures back to be fixed, up to three rounds. A recipe that still fails is held back, with the reason, never quietly kept.
6. **Proves.** For the recipes the video spends longest on, a builder who has never seen the video makes the result from the recipe alone, and a reviewer sets it beside the video's own result. Where Claude cannot build it (a cooking method, an app it cannot control), you get a try-it card instead and can send a photo of your result for the same comparison.

Steps 1 to 3 run on your Mac and cost nothing. Steps 4 to 6 use your Claude plan.

## Set it up

You need a Mac and [Claude Code](https://claude.com/claude-code): the Code tab in the Claude desktop app, or Claude Code in a terminal. Open it and paste this as a message:

```
Read https://raw.githubusercontent.com/joebenscoter86/youtube-learner/main/INSTALL.md and follow it step by step. Do every step for me and tell me only when I need to click something or type my password.
```

Claude installs the plugin, checks your Mac, installs only what is missing, and tells you when it is ready.

Setup takes about 10 to 20 minutes, mostly downloading, and about 3 GB of space. Everything it installs is free. If your Mac does not have Homebrew (a free installer for tools like these), a Terminal window opens and asks for your Mac password once.

## Use it

Paste a tutorial link and say what you want, for example:

> Learn this for me: https://www.youtube.com/watch?v=...

Claude tells you what the video teaches, works through it, and opens `LEARNED.md` when it is done. You can leave it running.

## Honest limits

- **Mac only, for now.** The screen reading uses Apple's text recognition, which only exists on macOS. A Windows version would need another text reader (Windows has one built in, and the free Tesseract works anywhere) plus the Windows versions of the downloader, video toolkit and speech engine, which all exist. It is not built yet.
- **A few videos a night.** Download too many and YouTube asks to confirm you are not a robot. When that happens the learner stops, tells you, and picks up where it left off when you try again a few hours later. It never signs in, never uses your browser's cookies and never tries to get around the check.
- **English videos.** The speech model and the captions it asks for are English. Other languages would need the multilingual model.
- **Time.** On a recent Mac, a 13 minute tutorial took about a minute to download and transcribe and SEE_ALIGN to line up; the agents' reading, checking and proving took most of the time, SEE_AGENTS in all. Older Macs transcribe more slowly.
- **Disk.** About SEE_DISK per video while it is studied. When you are done, Claude can delete the downloaded video and full-size frames and keep the recipes, which leaves SEE_CLEAN.
- **Your Claude plan.** The reading uses agents, and reading frames is the expensive part. A long tutorial on a Pro plan can reach the plan's limit; the learner can be restarted and resumes where it stopped.
- **The recipes are only as good as the video.** When a tutorial skips a value, the recipe says so under `unknowns` rather than guessing. A recipe marked `unproven` has not been built yet; `proven` means you tried it and said it worked.

## Respect the creators

Tutorials take real work. The learner is for your own study of videos you could watch anyway:

- the video, its frames, audio and transcript stay on your Mac and are never uploaded or shared;
- recipes are written in Claude's own words, not the creator's, and leave out their files, artwork and names;
- every `LEARNED.md` credits the creator and links the video at the top. If a video helped you, go watch it, like it and subscribe.

YouTube's terms limit downloading videos. Use this for personal study, a few videos at a time, and only for videos you have the right to watch.

## After Effects add-on

For After Effects tutorials, if you also have the [Comp Room](https://github.com/joebenscoter86/after-effects-studio) plugin, the proof is built in After Effects itself. See `addons/after-effects/`.

## For the curious

- `scripts/learn.mjs`: the download, transcription, frame and text steps (no model, no usage). `scripts/doctor.mjs`: checks what is installed. `scripts/assemble.mjs`: builds `LEARNED.md`.
- `prompts/`: what each agent is told: listing techniques, writing, checking, proving, reviewing.
- `skills/`: the two skills Claude runs, `setup` and `learn`.
- `LESSONS.md`: every way the learner has been wrong so far, and the rule that now catches it.
- Tests: `npm test` (no internet, no video).

MIT licence.
