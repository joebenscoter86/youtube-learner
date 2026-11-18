# Proving an After Effects recipe with the Comp Room plugin

Use this instead of kind 1 in `prompts/prove.md` when the recipe's area is After Effects and the Comp Room plugin's tools are available. Everything else in `prove.md` still holds: you get the recipe and nothing from the video.

## What you are given

- The recipe(s), `PROOF` (one folder per technique) and this folder, `ADDON` (`addons/after-effects/` in the plugin): `prelude.jsx` (helpers: `P.freshComp`, `P.solid`, `P.text`, `P.shape`, `P.ellipse`, `P.path`, `P.stroke`, `P.dashes`, `P.effect`, `P.tf`) and `example-dotted-ring.jsx`, a script that has run.
- The Comp Room tools. Load them with ToolSearch: `select:mcp__plugin_comp-room_comp-room__ae_do,mcp__plugin_comp-room_comp-room__ae_render_frame,mcp__plugin_comp-room_comp-room__ae_catalog,mcp__plugin_comp-room_comp-room__ae_layer_info,mcp__plugin_comp-room_comp-room__ae_comp_info,mcp__plugin_comp-room_comp-room__ae_project_info,mcp__plugin_comp-room_comp-room__ae_save_project`. If they are not there, fall back to `prove.md` kind 2 (a try-it card).

## Rules for After Effects

- Check the open project with `ae_project_info` before your first write. If it holds anyone's work, stop and ask the person to open a new empty project; never touch comps you did not make, except to read them. Never open, close or create a project yourself.
- **One call at a time.** Never send a call while another is pending. After an error, read it before the next call. If a call times out or reports a dialog, call `ae_do` `instance.dialogs` once and report the dialog's text; do not dismiss it.
- No undo or redo. Render only through `ae_render_frame` and `ae_do` `render.preview`. Leave project settings alone. Menu commands that open a dialog are off limits.
- One comp per technique, named `<n> <short name>`, 1920 by 1080, 24 frames a second unless the recipe says otherwise, 3 to 6 seconds, your own stand-in content.
- Prefer a dedicated plugin operation (`ae_catalog`); otherwise write ExtendScript in `PROOF/<n>/build.jsx` and run it with `ae_do` `eval.run` `{ file, args: { prelude: "<ADDON>/prelude.jsx" } }`. Scripts must be re-runnable (`P.freshComp` removes the earlier comp). ExtendScript is ES3: `var` only, no arrow functions, template strings or `let`. After `addProperty`, fetch properties again by name or index.
- When the technique is a finish or a fix (a glow, a shadow, a sharper edge), put its effects or layers under names starting with `TECH ` and also render `PROOF/<n>/before.png` with them switched off, then switch them back on.
- Save with `ae_save_project` (no path) after each technique.

## What earlier builds learned

- Address comps and layers by name or id in every call, never "active" or "selected".
- On a comp-sized layer an effect's point control reads comp pixels; on a smaller precomp layer it reads the layer's own space. Test with a fixed value before trusting an expression.
- Place cameras explicitly. Match names that cost a round: `ADBE Rotate Z` (not `ADBE Rotation`), `ADBE FOG_3D`, `ADBE Easy Levels`. Use an effect's English display name with `P.effect(layer, "<name>")` unless you are sure of the match name.
- A font found by name may be a substitute: check `isSubstitute`, fall back to an installed face, and say so.
- Drop Shadow's Opacity reads 0 to 255 by script, not percent: convert (x 2.55) and read the value back. Effect parameter names on the layer can differ from the recipe's words: look them up before setting.
- `render.preview` with `span: "comp"` on a 23.976 fps comp can write one extra blank frame; give an explicit span and check the frame count with ffprobe.
- Values tied to the tutorial's scene (fog depths, apertures, blur centres) do not carry over: aim for the effect the recipe measures, and record the values that reached it.

## Output

`PROOF/<n>/build.png` (`ae_render_frame`), `build.mov` for an animated technique (`render.preview`, as the last thing for that technique), `before.png` for a finish, the script, and `PROOF/<n>/build-notes.md` as `prove.md` asks, plus every step that had no plugin operation and needed raw scripting.
