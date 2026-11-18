# What the learner's failures taught it

The learner was first built to study After Effects tutorials, five videos and about 90 recipes. Each entry below is a failure that got past it, why, and the rule that now catches it. The examples come from motion design; the rules hold for any skill. When a recipe, a check, a proof or a review turns out wrong, add the case here and change the prompt or the code in the same change: a lesson that lives only here changes nothing.

## Where each stage can say "pass" and still be wrong

| Stage | It can pass when | Caught by |
|---|---|---|
| Write (`prompts/write.md`) | the steps are faithful to the video but do not add up to the result | check 8, the proof |
| Check (`prompts/check.md`) | every claim is said or shown, yet the result holds traits no step produces | the proof, the look review |
| Prove (`prompts/prove.md`) | the build runs and the one named object carries the effect | the look review |
| Review (`prompts/prove-review.md`) | the mechanism measures right on one object | the person's own eye, so the review judges the look first |

On the first video all 25 recipes passed their check. Building them found three recipe errors and about twenty wordings the picture contradicted. Reviewing the builds on mechanism alone then passed one the owner rejected on sight.

## Lessons

### 1. A recipe can be faithful to every step and still not give the result
- **What happened.** A tip styled one white disc. The recipe recorded every setting correctly and passed its check. The build gave one tinted disc among flat circles; the tutorial's result is five styled discs stacked with soft shadows. The owner: "yours look like white circles with no effect, his look like 3D discs that stack."
- **Why.** The tutorial showed a step inside a finished scene. The writer scoped the recipe to the step and set the rest aside as "the next tip"; the checker checked claims, not sufficiency.
- **Rule.** The unit of a recipe is the result, not the demonstrated step. The writer accounts for every trait of the result (`write.md`; the `measurements` line). The checker asks "would the steps give this picture?" (check 8). The builder builds the whole picture. The reviewer judges the look first.
- **Confirmed.** With the recipe widened to the whole result and nothing else changed, a builder who never saw the video rebuilt it and the owner called it perfect. The steps were never the problem; the scope was.

### 2. A shown setting did not give the shown result
- A panel read 45 %; the result measured more than twice as strong; 78 % matched. Rule: measure the effect on the result and compare (`write.md`; check 9). A value found only by building is written beside the tutorial's value, never over it.

### 3. Values that only mean something in the tutorial's own setting
- Depths, apertures, curve points and pixel sizes copied into a new scene gave no effect or the wrong one. The same holds for a stove's heat number or a pan's size. Rule: keep the value and also state the effect in terms anyone can aim for.

### 4. Sizes wrong or missing
- A radius given as 0.61 that measured 0.48; letter heights missing. Rule: every size in the steps is checked against the result; disagreeing figures fail (check 9).

### 5. Direction and motion written from the words
- "Top to bottom" shading was diagonal; a "drift" was a hold and then a drop. Rule: for anything directional or moving, cut frames across the result and write direction, speed and what holds (`write.md`; check 10).

### 6. A result credited to the wrong object
- A bar's shadow was read as the letters' own. Rule: trace each shadow, glow or streak to where it starts.

### 7. A reviewer's wrong measurement sent a builder the wrong way
- A 16 degree roll read as 6, and the direction missed; it cost two rounds. Rule: angles, directions and speeds in a fix are measured two independent ways; reference and build are measured the same way at the same place; a fix is a target, not a setting.

### 8. A match reached by changing the stand-in
- Rule: the reviewer says when a match depends on the stand-in scene; such a match is weaker evidence.

### 9. Only the person proves a recipe
- `status: proven` counts only with the person's acceptance and its date on the status line; `scripts/assemble.mjs` refuses a bare "proven" (test in `tests/assemble.test.mjs`).

### 10. A proof built on art pulls the technique off its recipe
- Builders changed the technique to make it sit well on their stand-in: a shadow lightened, a blur shortened, a fan widened. Each looked better; each stopped proving the technique. Rule: the recipe's measured result is fixed; the stand-in bends to it (`prove.md`).

### 11. The lead's own slips
- Times written from guesses ran an hour fast: take every time from `date`.
- Verdicts relayed before anyone looked at the pair: look at each side-by-side yourself before reporting it, and say which you have not seen.
- Recipes edited after their check: `assemble.mjs` refuses them until a check is newer than the recipe.

### 12. A finished example played in place of the build
- A result line named a frame from the pre-made finished version shown at the start, darker and sharper than anything the steps make. It is the commonest first-round failure. Rule: point the result at the build when the steps make the build, and give the pre-made version as a labelled reference with its own measurements.

### 13. The tool did not make what its prompts read
- Every prompt read `frames-small/`, but `align` only wrote full-size frames. Rule: `align` writes both and fails if any is missing (test in `tests/learn.test.mjs`). A prompt and the code it relies on change together.

### 14. A percent typed into a 0 to 255 control
- A shadow set to 19 believing it took percent rendered at 7.5 %. Rule (for any software with scripting): read a value back after setting it.

### 15. A direction and an orientation that passed the check, built the wrong way
- A wipe said to run lower left to upper right ran upper left to lower right; "right side towards the camera" was built the wrong way round. Both had passed. Rule: a reveal names the side it reaches first, checked on a half-way frame; a turned object names its nearer edge from a measurement.

### 16. A figure measured mid-drag
- A camera value read while the author dragged was a value passed through, and the picture lagged the readout by several frames. Rule: measure only where the readout has held still; say when a move is never finished on screen.

### 17. Recipes written before the lessons, checked again
- 39 recipes that had passed an earlier check were checked again under these rules; 36 failed. New cases: a recording that played 3.3 to 3.7 times real time in one stretch (speed comes from settings or an on-screen clock, never the recording's seconds); results called "animated" that never move; a stale preview named as the result; sizes measured on a zoom percentage instead of the thing's own edges. All are now in `write.md` and `check.md`.

### 18. An unknown that turned the result inside out (first non-After Effects video, a Blender puddle shader, 2026-11-17)
- **What happened.** All six recipes passed their check, most in round 2 or 3. Proving them in Blender from the recipe alone found two things the check could not. Recipe 05 listed "which way the height map runs" under unknowns; with an ordinary map (blocks high) the build put water on the blocks and left the joints dry, the opposite of the video. Recipe 02 never said how glossy the stone's own roughness map was, and the build's sheen came out dappled where the video's is one soft wash.
- **Why.** Both were honest unknowns or silences, so no claim was false. Lesson 1 again: the check tests claims; only a build tests sufficiency.
- **Rule.** An unknown whose other answer would flip the result is settled from the frames or turned into a "try both ways" instruction (`write.md`; `check.md` check 11). The proofs still run, because they find what the rule misses.

## Still open
- Nothing yet tests the prompts themselves. A cheap test: keep a known-bad recipe (lesson 1's first version) as a fixture and confirm a fresh checker fails it on check 8.
- The learner has been run on After Effects tutorials far more than on any other kind. Expect new lessons from cooking, music and other software.
