# Judging a proof against the video's own result

A builder made a technique from its written recipe without seeing the video (`prove.md`). You set that build beside the video's own finished picture and say whether the technique was recreated. You change neither the build nor the recipe.

## What you are given

`STUDY` (the study folder, with `frames/` and `source.mp4`), the recipe in `STUDY/recipes/`, and for each technique `PROOF/<n>/`: `build.png` (sometimes `build.mp4`) or a photo the person took, and `build-notes.md`.

## For each technique

1. **Cut the reference.** From the recipe's `result:` line, cut the crop out of the named frame: `ffmpeg -loglevel error -y -i STUDY/frames/fNNNNNN.png -vf crop=W:H:X:Y PROOF/<n>/reference.png`. For a moving result also cut `reference.mp4` from `source.mp4` over the result window (`-ss <start> -to <end>`, the same crop, `-an`).
2. **Make the pair:** `ffmpeg -loglevel error -y -i PROOF/<n>/reference.png -i PROOF/<n>/build.png -filter_complex "[0:v]scale=-2:540[a];[1:v]scale=-2:540[b];[a][b]hstack" PROOF/<n>/side-by-side.png`. Look at it. For a moving technique, also compare three or four matching moments of the two movies.
3. **Two judgements, in this order.**
   - **The look.** Before measuring anything, look at the pair the way the person who asked will: at arm's length, for two seconds. Does the build read as the same kind of thing as the reference? Write in plain words what the reference looks like and what the build looks like ("crisp golden edges" against "pale and soft"; "3D discs that stack" against "flat white circles"). Ignore the stand-in subject and colours; do not ignore anything that makes the result read: every object that should carry it, shadows, overlaps, depth, texture, the background.
   - **The mechanism.** Is what the recipe teaches visibly at work, with the same character (shape, count, spacing, direction, softness, order, timing) as in the reference? Measure.
   A build can have the mechanism right and still fail the look, because the recipe taught a step and left out what the result needs around it. That is the most useful thing you can find: say which traits of the reference no step of the recipe produces.
4. **Write `PROOF/<n>/review.md`:**

```
technique: <id>
verdict: matches | partly | does not match | cannot be judged
the look: <reference in a few plain words> / <build in a few plain words> / same | close | not the same
missing from the recipe: <traits of the reference that no step or measurement of the recipe produces; "nothing" if none>
what matches: <the visible traits that agree>
what differs in the technique: <traits of the mechanism itself that differ, with sizes or timings where you can measure them; "nothing" if none>
what differs only in the stand-in: <subject, colours, scene; one line>
why: <one or two sentences for the verdict>
to fix: <the smallest change to the recipe or the build that would close each difference, as a target the next render should measure; "nothing" if none>
```

`matches` means the look is the same or close, every visible trait of the mechanism agrees, and only the stand-in differs. A build whose mechanism measures right but whose look is not the same is `partly`.

## Measuring rules, from reviews that sent builders the wrong way

- An angle, a direction or a speed in `to fix` must be measured by two independent methods that agree.
- Trace a shadow, streak or glow to the object it starts at before saying who casts it.
- Measure the reference and the build the same way, at the same place.
- A fix you have not seen work is a target, not a setting to type.
- When a match was reached by changing the stand-in (a darker background, more objects), say so: it no longer shows the technique's strength on its own.
- A reference clip under a second long supports direction and rough speed, little else. Say what is firm.

Write only inside `PROOF/<n>/`. No git. Finish with one line per technique: verdict and the main reason.
