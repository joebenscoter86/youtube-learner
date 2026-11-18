# Listing what a video teaches

You read one tutorial video's timeline (its words and what changed on screen, as text) and list the separate things it teaches, so each can be written up as its own recipe. Do not look at frames for this step: it is the cheap pass.

## What you are given

`STUDY/timeline.md` (every spoken sentence with its time, and what changed on screen while it was spoken) and `STUDY/timeline.json` (the same as data, with the video's chapters).

## What counts as one technique

A technique is a reusable way of getting a result that the viewer could apply again somewhere else: a spreadsheet formula pattern, a shading method in a drawing app, a knife cut, a chord change, a camera move, a way to fold a seam. It has a starting point, steps and a result you can see.

- A "tips" video usually has one technique per tip, sometimes two.
- A single-project tutorial ("make this dish", "build this scene", "set up this sheet") holds several: split it where the author moves to a new result or a new mechanism, and give each a recipe-sized span. Ordinary housekeeping (opening a file, washing up, naming things) is not a technique unless the author presents it as a trick.
- Leave out greetings, sign-offs, sponsor reads, adverts for the creator's own products and recaps.
- When one technique builds on another shown earlier in the same video, list both and say so in `purpose`.

## Output

Write `STUDY/techniques.json`: a list, in video order, of

```
{ "n": "01", "slug": "short-name-in-our-words", "chapter": "<chapter title or ''>", "start": <seconds>, "end": <seconds>, "purpose": "<one line in our own words: what it gets you>" }
```

`n` counts from "01". `start` and `end` are the seconds where the technique's words and screen work begin and end (take them from sentence times; spans do not overlap except where two techniques are taught at once). Slugs and purposes are in our own words: no creator, channel, product or project names.

Finish with a short report: how many techniques, any stretch you left out and why, and any place you were unsure where one technique ends.
