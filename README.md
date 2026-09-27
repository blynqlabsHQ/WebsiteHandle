# blynq-site

The product site for the Blynq glasses, under BlynqLabs. One product, seven pages.

Plain HTML, CSS and JS: no framework, no build step, no bundler. Open it on any
static server and it runs.

## Run it

```powershell
python -m http.server 4711
```

Then <http://localhost:4711/>. Any static server works; `file://` does not,
because the scroll-scrub fetches its frames over HTTP.

## The two motion paths

The page ships **static by default** and layers motion on via `[data-motion="on"]`,
set from `prefers-reduced-motion`. That direction is deliberate: the reduced state is
the designed state, not a stripped one, so it cannot rot unnoticed.

Force either path without touching OS settings:

| URL | Path |
|---|---|
| `?reduced=1` | Static. The 101 frames are never requested. |
| `?reduced=0` | Motion. Canvas scroll-scrub, sticky reveals, scroll cue. |

## Layout

| Where | What |
|---|---|
| `index.html` | Home. Hero, the gap device, measured figures, the scroll-scrub film. |
| `how-it-works.html` | The turn-taking window, the three tiers, the conversation simulator. |
| `design.html` | The object viewer (reader-driven turn), the parts, the decisions. |
| `privacy.html` | The three-paragraph statement and a ledger restating it. |
| `who.html` | The four groups, rooms, and sourced scale figures. |
| `accessibility.html` | The standard the site is held to, and how to report a problem. |
| `contact.html` | Early access: the address, a mailto composer (no backend), FAQ. |
| `404.html` | Not found. Root-relative paths, so it works at any URL. |
| `site.css` / `site.js` | Shared styles and behaviour: menu, motion flag, reveals, gap bars. |
| `scrub.js` / `simulator.js` / `viewer.js` | Page scripts for home, how-it-works, design. |
| `tokens.css` | Design tokens, with the contrast reasoning in comments. |
| `favicon.svg` | The q with its descender gap. |
| `frames/` | 101 JPEGs, 3.6 MB — the scroll-scrub sequence. |
| `poster.jpg` | Hero plate, and the film in the reduced-motion path. |
| `wordmark.svg` | Vector lockup. True glyph outlines, `currentColor`. |
| `source/` | The raw renders the frames were cut from. |
| `_shots/` | Verification screenshots from accessibility and layout passes. |
| `BLYNQ_SITE_SPINE.md` | The brief: copy decisions, section order, what is still open. |

**Read `BLYNQ_SITE_SPINE.md` before editing copy.** The wording on this page has been
argued over more than the code has, and the reasoning for each line lives there.

## Accessibility bar

Non-negotiable, and verified rather than assumed: zero WCAG AA contrast failures
measured against real computed backgrounds, one `h1` with no heading skips, every
image alt'd, every section named, skip link present, and a designed reduced-motion
state for every animation.

## Status

Built and verified. Not deployed. Open items are listed at the end of the spine.
