# Checking recipes against the video

You check recipes that someone else wrote from a tutorial video. You did not write them. Find what is wrong; do not rewrite them.

## What you are given

`STUDY` (the study folder), with `timeline.md`, `frames-small/`, `frames/`, `source.mp4` (see `write.md` beside this file for how to cut frames and crops), and the recipes in `STUDY/recipes/`. You are told which recipes are yours.

## For each recipe, check

1. **Every `said` claim** against the sentences in the timeline for that span. A said value the sentence does not contain fails.
2. **Every `shown` claim** against the frame it names (crop the full-size frame to read small values). A shown value the frame does not show fails.
3. **No hidden invention.** Any step or value stated as fact that is neither said nor shown and not marked `inferred` fails.
4. **No missing step.** Between the starting point and the result, is there a step the author does (in words or on screen) that the recipe leaves out? Name it.
5. **The author's emphasis.** Is what the author spends longest on in the recipe, and is `longest on` right?
6. **Our own words.** Eight or more words in a row copied from a timeline sentence fail. Any creator, channel, product or project name fails.
7. **The result line.** Cut the named frame's crop and confirm it shows the finished result and nothing else. For a result called moving, confirm it moves across the window. Confirm the picture had updated after the last change (compare with a frame from before it).
8. **Would the steps give this picture?** Look at the result crop and list what makes it look the way it does: every object that carries the result, each shadow or highlight and what casts it, overlaps, the background, texture, colour, how much of something there is, direction and speed of anything that moves. For each trait, point to the step that produces it or the `measurements` entry that names its source. A trait with neither fails: someone following the recipe would not get this picture. (A recipe that styled one object once passed while its result showed five styled objects stacked with shadows.)
9. **Settings against the picture.** Calibrate sizes on the thing's own visible edges, never on a zoom percentage or a guide line. Where a shown setting's effect can be measured on the result (a darkness, a length, a thickness, a colour), measure it. A setting that cannot plausibly give the measured result, or two figures in the recipe that describe the same thing at different sizes, fails unless the recipe says so itself.
10. **Who causes it, which way it goes.** Spot-check one attribution (which object a shadow, glow or smear starts at) and, for motion, the direction across two frames. For a wipe or reveal, cut a frame about half way and confirm which side it reaches first. For a turned object, confirm which edge is nearer by a measurement. Any speed must come from what is said, a setting or an on-screen clock, never from a sped-up or cut recording's own seconds. (A wipe once said to run from lower left to upper right ran from upper left to lower right, and had passed this check.)

Look at no more than 8 small frames per recipe, plus the result crop; crop for detail.

## Output

`STUDY/checks/<n>.md` per recipe:

```
recipe: <id>
verdict: pass | fail
failures:
- <which check, what is wrong, the evidence (sentence time or frame)>
suggestions:
- <optional, smaller points>
```

Write only inside `STUDY/checks/` and `STUDY/scratch/check-<n>/`. Do not edit the recipes. No git. Finish with one line per recipe: verdict and the main reason.
