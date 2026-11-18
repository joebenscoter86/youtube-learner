# Writing recipes from a video's timeline

You turn part of one tutorial video into recipes. A recipe must let someone who never saw the video get the same result: rebuild it in the same software, or do it with their hands.

## What you are given

- `STUDY`: the video's study folder.
- `STUDY/techniques.json`: the techniques in the video (`n`, `slug`, `start`, `end` in seconds, `purpose`). You are told which `n` values are yours.
- `STUDY/timeline.md`: every spoken sentence with its time, then what changed on screen while it was spoken ("Changed", "New values", "Named on screen") and the frames kept in that stretch. `STUDY/timeline.json` has the same as data.
- `STUDY/frames-small/f<frame>.jpg`: each kept frame at up to 1920 wide, for looking. The frame number divided by the video's frame rate is its time.
- `STUDY/frames/f<frame>.png`: the same frames at full size. To read small text or detail, cut a piece out with `ffmpeg -loglevel error -y -i STUDY/frames/fNNNNNN.png -vf crop=W:H:X:Y STUDY/scratch/<n>/<name>.png` and look at that.
- Need a moment that was not kept? Cut it from `STUDY/source.mp4` with `ffmpeg -loglevel error -y -ss <seconds> -i STUDY/source.mp4 -frames:v 1 STUDY/scratch/<n>/<name>.png`.

## Rules

1. **Words and screen together.** Read the sentences for your technique first, then look at the frames those sentences point to. A recipe written from only one of the two is not accepted. (The timeline's words come from speech recognition: it mishears names. The screen wins: say so when they disagree.)
2. **Mark every step and every setting** as `said` (the narrator says it), `shown` (it is visible; give the frame) or `inferred` (your reading).
3. **Never state what the video does not give.** A value that is neither said nor shown goes under `unknowns`, not into a step.
4. **Our own words.** Never reuse the narrator's sentences (eight words in a row is too many). Do not name the creator, the channel, their products, their files or their example's own names; describe the example generically ("a sales table with twelve rows", "a white logo on a pale background").
5. **Look sparingly.** At most 10 small frames per technique; choose them from the timeline (frames where values changed, and the last frames, where the result shows). Crop instead of opening more frames.
6. **Time what the author dwells on.** Name the step the author spends longest on or stresses, timed from the frame numbers, not guessed.
7. **Find the result.** Record when the finished result is visible and where it sits in the full-size frame (the result only, without the surrounding interface or kitchen counter), so a proof can be compared with it.
8. Write only inside `STUDY/recipes/` and `STUDY/scratch/<n>/` (your own subfolder, never a shared one). No git.

## What went wrong before (avoid these)

These come from recipes that passed a check and then failed when someone built them. `LESSONS.md` at the plugin's root has each case.

- **The recipe rebuilt the step, not the result.** A tip styled one object; the result frame showed five styled objects stacked with shadows between them. The build followed the steps and looked nothing like the result. Before you finish, go over the result frame and list every visible trait that makes it look the way it does (every object that carries the effect, each shadow, overlap, the background, texture, how full the pan is, how the sauce coats the spoon). Each trait must come from a step, or be named in `measurements` with where it comes from (another technique in this video, given with the figures needed so this recipe stands alone, or the finished example alone).
- **One object or all of them?** If the author treats one item while the result shows several treated alike, say which, from the frame.
- **A cited frame that does not show it.** Before you write `shown fNNNNNN`, look at that frame and confirm it shows exactly that value or state. A value still being dragged, a menu still open, a pan not yet on the heat: cite the frame where it has landed.
- **A shown setting that does not give the shown result.** A panel read 45 %; the result measured more than twice that. When a result can be measured (a darkness, a length, a colour, a thickness, a count), measure it and put it in `measurements`. If the shown setting cannot plausibly give it, say so.
- **Values that only mean something in the tutorial's own scene.** Sizes in pixels, depths, a pan's heat number, a font size: keep the shown value and also give the effect in terms anyone can aim for in their own setting ("letters about 3 % of the picture height", "the onion just turning gold at the edges").
- **Direction and motion written from the words.** "Top to bottom" was diagonal; a "drift" was a hold and then a drop. For anything that moves, cut three or four frames across the result and write the direction, the speed, and what holds still and when. For a reveal or wipe, name the side it reaches first and check it on a half-way frame. For anything turned in depth, say which edge is nearer from a measurement, never "its right side towards the camera".
- **A result credited to the wrong object.** A shadow beside a word came from a bar next to it. Trace each shadow, glow, smear or streak to where it starts.
- **The finished example is a different take.** The clip at the end is often a pre-made finished version, not the build you just watched: more layers, other values, a garnish, a grade. Say which the result shows, and give both when both are on screen.
- **A recording that plays fast or skips.** Screen recordings and cooking videos speed up, cut and jump. Never time anything against the video's own seconds where the video is sped up or cut: take durations from what is said, from an on-screen clock or timer, or from settings.
- **A stale picture.** Software previews often lag the panels. Before you call a frame the result, confirm the picture has updated after the last change (compare with a frame from before it).
- **Steps done without a word.** Watch for a switch turned off and on, an item dragged up or down a list, a setting changed in a dialog, the hand moving to a different grip. If the result depends on it, it is a step.
- **A menu path or shortcut tagged `said`.** If the narrator only names the action ("duplicate it") and the menu is not on screen, the path is `inferred`.
- **Sizes on the wrong ruler.** Calibrate each frame on the thing's own visible edges (the document's border, the cutting board, the guitar's frets), never on a zoom percentage or a guide line the recording itself moves.
- **An unknown that decides the result.** A Blender recipe left "which way the height map runs" as an unknown; a builder with an ordinary map got wet blocks and dry joints, the exact opposite of the result. Before you put something under `unknowns`, ask: would the other answer flip or ruin the result? If so, settle it from the frames (the map's own image, a preview, a later picture), and if the video truly cannot settle it, say in `how to prove it` to try both ways.
- **Measured mid-move.** A value read while the author drags or stirs is a value passed through. Measure only where it has held still for a moment, and say when a move is never finished on screen.

## Output

One file per technique: `STUDY/recipes/<n>-<slug>.md`, exactly in this form.

```
## <Name, in our own words>
id: <n>-<slug>
status: unproven
source: <video id> <start> to <end> s
area: <the tool or craft, e.g. a spreadsheet app, a 3D app, bread baking, fingerstyle guitar>
what it gets you: <one or two sentences: when someone would reach for this>
what the result looks like: <one to three sentences on the finished result in the tutorial's own example, described generically>
you need:
- <tool, feature, ingredient or material> (<free | paid | built in | common>; menu path if said or shown)
starting point: <what has to be in place before step 1>
steps:
1. <what to do> (said | shown fNNNNNN | inferred)
   - <setting or amount>: <value> (said | shown fNNNNNN | inferred)
measurements: <sizes, amounts, positions, colours and times measured on the result frame, each marked `measured` with what it was measured against; then every other trait the result shows that makes it look right, with its source>
timing: <durations, holds, speeds; or "none given">
variations: <what the author says can be changed; or "none given">
pitfalls: <warnings the author gives; or "none given">
longest on: <what the author spends longest on or stresses, with seconds>
how to prove it: <what a builder could make or do from this recipe alone to test it, and what to compare with the result>
result: start=<s> end=<s> <still | moving> crop=<x,y,w,h> frame=fNNNNNN
before: <frame showing the starting state, if any>
unknowns: <values or steps the video does not give>
```

Finish with a short report: for each technique, one line on how sure you are and what you could not read.
