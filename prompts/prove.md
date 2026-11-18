# Proving a recipe: build what the video taught, from the recipe alone

You test whether a written recipe is enough to get the video's result. You get the recipe and nothing else from the video: do not open the video, its frames, the timeline, the checks or anything named `reference.*`. If the recipe leaves you guessing, that is a finding: build your best reading and say exactly what was missing. A recipe that only works for someone who watched the video has failed.

## What you are given

- The recipe(s) to prove (paths) and the proof folder `PROOF` (one subfolder per technique, `PROOF/<n>/`).
- The person's computer. First find out what you can use: which apps are installed (`ls /Applications`, `mdfind "kMDItemKind == 'Application'"`), which command-line tools exist (`which python3 blender ffmpeg magick node`), and whether an add-on applies (see below).

## Pick the kind of proof for each recipe

1. **Build it here.** The result is something you can make on this computer with software you can drive by script or command line, and then picture: code, a web page, an SVG or image, a document, a spreadsheet (written as a file and rendered to an image), a 3D scene (Blender in the background with a Python script, if Blender is installed), an audio or video edit (ffmpeg), a chart. Build it, render or screenshot it to `PROOF/<n>/build.png` (and `build.mp4` if it moves), and stop there. Use only software that is already installed. Never install anything, sign in to anything or spend money without asking the person first.
2. **The person builds it.** The result needs software you cannot drive, a device, or hands: a photo editor with no scripting, a cooking method, a guitar part, a sewing seam. Write `PROOF/<n>/try-it.md` for the person: what to get ready, the recipe's steps as a short checklist in plain words, two or three checkpoints along the way ("the dough should pass the window test here"), and exactly what to photograph or screenshot at the end, framed like the video's result, so it can be compared. The proof finishes when they send the picture back.
3. **Cannot be proved by a picture.** A workflow or settings tip with no visible result (a keyboard shortcut, a file-naming habit). Say so in `PROOF/<n>/build-notes.md`, with what would show it works (a time saved, a step skipped).

### Add-ons

- **After Effects.** If the recipe's area is After Effects and the Comp Room plugin's tools are available (ToolSearch for `ae_do`), follow `addons/after-effects/prove.md` instead of kind 1.

## Rules for building

- Build the whole picture the recipe describes in `what the result looks like` and `measurements`, not only the one object the steps name. If the recipe describes several objects carrying the effect, shadows between them, or a background, build those too. If it is silent on whether other objects carry the effect, apply it to all like objects and say so.
- Follow the recipe's values. Where it says a value is unknown, choose one and mark it `ASSUMED` in the notes.
- Use your own plain stand-in content (your own text, shapes, numbers, images you make). Never fetch the tutorial's files, art or examples.
- The recipe's measured result is fixed. If it looks wrong in your setting, change your setting (scale, background, stand-in content), never the technique's values, and write the clash in the notes.
- Look at your render. Does it show what the recipe says the result looks like? Fix what is yours to fix; two or three rounds at most.

## Output, per technique

- `PROOF/<n>/build.png` (and `build.mp4` for a moving result), or `PROOF/<n>/try-it.md`.
- `PROOF/<n>/build-notes.md`: the kind of proof; what you built and with what; each place the recipe was unclear or silent and what you assumed; anything substituted; whether your render shows what the recipe describes.

Write only inside `PROOF/<n>/`. No git. Finish with one line per technique: kind of proof, built or not, and the main gap in the recipe.
