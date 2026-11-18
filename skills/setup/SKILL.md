---
name: setup
description: Set up the YouTube learner on this Mac. Checks for and installs what it needs (Homebrew, Node, yt-dlp, ffmpeg, whisper.cpp and its speech model, Apple's Command Line Tools) and builds its screen text reader. Use when the person asks to set up, install or repair the YouTube learner, or when the learn skill finds something missing.
---

# Set up the YouTube learner

The person you are helping may never have used a terminal. You do every step for them. Never ask them to type a command; when something needs them (a password, a confirmation window), tell them exactly what they will see and what to click.

The plugin's files are at `${CLAUDE_PLUGIN_ROOT}` (if that is not filled in, it is two folders above this skill's own folder). Below, `ROOT` means that path.

## 1. Say what will happen

In two or three plain sentences: you are going to check this Mac for a few free tools the learner needs (a video downloader, a video toolkit, a speech-to-text engine and its model, Apple's text reader), install whatever is missing, and test it. It takes about 10 to 20 minutes, mostly downloading, and needs about 3 GB of space. Nothing is paid and nothing signs in to any account.

## 2. Check this is a Mac

Run `uname -s`. If it is not `Darwin`, stop and explain kindly:

> The YouTube learner only runs on a Mac for now. It reads the text on the screen of each video with Apple's built-in text recognition, which only exists on macOS. A Windows version would need a different text reader (Windows has one built in, or the free Tesseract), plus Windows builds of the same downloader, video toolkit and speech engine, which all exist. It is not built yet.

## 3. See what is already there

Run `node "ROOT/scripts/doctor.mjs" --json`. If `node` itself is missing, the check cannot run: go to Homebrew and Node first (below), then run it again. Read the `checks` list: each one is `ok`, or has a `fix`.

## 4. Install what is missing, in this order

Only install what the check says is missing. After each step, run the check again.

1. **Homebrew** (the Mac's free app installer). If missing, tell the person: "Homebrew needs your Mac password once. I'll open the installer; when it asks for your password in the Terminal window, type it (nothing shows while you type, that is normal) and press Return." Your own shell cannot take a password, so start the official installer in a Terminal window for them:
   `osascript -e 'tell application "Terminal" to activate' -e 'tell application "Terminal" to do script "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""'`
   Tell them: a Terminal window opened; it will ask for their Mac password (type it, nothing shows, press Return) and then to press Return once more to continue; it takes a few minutes; tell you when it says "Installation successful". Then make Homebrew findable: run `eval "$(/opt/homebrew/bin/brew shellenv)"` before each later `brew` command, and add that line to `~/.zprofile` if it is not there yet (on an Intel Mac the path is `/usr/local/bin/brew`).
2. **Node.js** if missing or older than 20: `brew install node`.
3. **yt-dlp, ffmpeg, whisper.cpp**: `brew install yt-dlp ffmpeg whisper-cpp` (only the ones missing). ffmpeg can take several minutes.
4. **The speech model** (about 1.5 GB): run the `fix` command the check gives (a `curl` download into `~/.youtube-learner/models/`). Run it in the background and tell the person it is downloading.
5. **Apple's Command Line Tools** (needed once, to build the text reader): if the text reader's fix starts with `xcode-select --install`, run `xcode-select --install` and tell the person: "A window will pop up asking to install the command line developer tools. Click Install, then Agree. It takes 5 to 15 minutes. Tell me when it says it is done." Wait for them.
6. **The text reader**: run `sh "ROOT/scripts/ocr/build.sh"`.

If a step fails, read the error, fix what you can, and explain anything you cannot in plain words. Never use `sudo` unless the person agrees after you have said why.

## 5. Test it

1. `node "ROOT/scripts/doctor.mjs"` must end in `Ready.`
2. Run the tool's own tests: `node --test "ROOT"/tests/*.test.mjs` (they use no internet and no video). All must pass.
3. Do not download a video as a test; the first real use is the test.

## 6. Tell the person they are ready

In plain words: it is set up; to use it, they paste a YouTube tutorial link and say "learn this". Mention the honest limits: about 20 to 60 minutes per video depending on its length; English-language videos for now; a few videos a night at most, because YouTube may ask to confirm you are not a robot if you download many, and the learner stops politely when it does; each video needs a few GB while it is studied, which can be freed afterwards.
