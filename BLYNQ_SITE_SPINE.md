# Blynq glasses, site spine

Single product page for the Blynq glasses, under BlynqLabs. `blynqlabs.com`.

v2, 2026-09-18. Author: Amogh Shastry. Status: **built and verified, not deployed.**

Model: Apple and Nothing product pages. Capability led, not problem led. One product.
Primary user named clearly, market visibly larger than the primary user.

---

## Build state, 2026-09-18

**Read this first if you are picking the project up.** The page below is not a proposal
any more. It exists, it runs, and it has been verified.

| Where | What |
|---|---|
| `index.html` | The whole page. Single file, no build step, no framework. |
| `tokens.css` | Design tokens, with the contrast reasoning in comments. |
| `frames/` | 101 JPEG frames, 3.2 MB, the scroll-scrub sequence. |
| `poster.jpg` | Hero plate and the reduced-motion state. |
| `wordmark.svg` | Vector lockup, true glyph outlines, `currentColor`. |
| `_shots/` | Verification screenshots. |

This repo is the site and nothing else. Serve the root on any static server; see `README.md`.
`?reduced=1` and `?reduced=0` force either motion path without touching OS settings.

**Design read, settled.** Off-white canvas, warm near-black ink, **no accent colour at all**.
Grounded in the ElevenLabs `DESIGN.md` from the `design-md-library` skill, structured with
Nothing's three-claim discipline. Where ElevenLabs spends its voltage on pastel gradient orbs,
we spend ours on the gap device in section 1. Type is Inter Tight 200/300 display, Inter body,
JetBrains Mono labels.

**Built and verified:** all sections in the DOM order of section 8; the gap device; the canvas
scroll-scrub with its designed reduced-motion state; the vector wordmark; zero WCAG AA contrast
failures measured against real computed backgrounds; one `h1`, no heading skips, every image
alt'd, every section named, skip link present.

**Not built:** section 3.5 (audio), any proof point, deployment.

**Do not re-litigate these.** Signup was dropped deliberately, see 2.7. The `Who it is for`
heading must not name blindness, see 2.6. The reduced-motion state is the CSS default and
motion layers on via `[data-motion="on"]`, not the reverse.

### Copy corrected against the build, 2026-09-18

The page claimed three capabilities the app does not have. Corrected, and the old wording
must not come back:

| Was | Now | Why |
|---|---|---|
| `Nothing is recorded.` / "No transcript is stored" | `The room is heard, not kept.` | False as built. `GlassesConversationMemory` persists every exchange to Room on purpose, so a blind user can read back what was said to them. |
| `KNOWS WHO IS SPEAKING` (claim 1 of 3) | `TELLS YOU WHAT IS IN THE ROOM` | Naming a speaker needs diarisation plus person re-identification. Neither exists. "What is in the room" covers people without promising identity. |
| h1 `It knows who is speaking, and when not to say so.` | `It sees the room, and knows when not to mention it.` | Same reason. The turn in the second clause is the point of the line and is kept. |
| Tier 1 example `"Sarah."` | `"Someone on your left."` | A name is the one cue the product cannot produce, and it is the first thing a reader would test. Same tier, same length, true. **This overrides the `"Sarah."` reference in §1 and §2.3.** |

**The privacy section is three paragraphs, and stays three.** The first correction pass
replaced one false-but-confident claim with four paragraphs of true-but-anxious ones: three
of them negations, on a page where every other section is one or two sentences. Length is
tone here. An investor reads four paragraphs of denial as "they know this is the weak point",
and reads the transcript explanation as a walk-back rather than a design decision.

The shape that works: one paragraph stating what the microphone is *for* (timing, not
identity) with the two hard negations compressed into a single closing clause; one paragraph
that frames the transcript as the wearer's only means of checking a device that speaks; one
paragraph on bystanders, which is the part that reads as conviction rather than defence and
should not be touched. Do not expand this section. A true claim can be short.

### Interaction vocabulary, 2026-09-18

Grounded in the same ElevenLabs reference as the rest of the design. That file is
almost silent on interaction - one shadow tier for hovered cards, one press state - and
the silence is the guidance. **Deliberate divergence: no shadows.** This page builds depth
from hairlines, background steps and ink, there is no shadow anywhere and no shadow token,
so adding one would introduce the page's only instance of a new material.

The whole vocabulary, and it should not grow:

| Element | Rest | Hover | Press |
|---|---|---|---|
| Nav link | muted | ink, plus a 1px rule growing left to right under it | body |
| Bento card | canvas | white surface, content steps 4px right, index number to full ink | step returns to 1px |
| Wordmark | — | a short stroke drops into the space below the `q` | — |
| Mailto | ink underline | white underline | muted-soft |

Every hover moves `transform` or colour only, never a layout property, so all of it
composites. All of it collapses under `prefers-reduced-motion`, which the scrub was already
rigorous about and the hovers were not.

The wordmark hover is the one decorative moment on the page, and it is the page's own motif
- the `q` descender dropping into the gap, the same gesture as the footer lockup - rather
than an effect borrowed from somewhere.

**No custom cursor.** A cursor graphic is a consumer-flashy device and it fights a product
whose entire argument is restraint. The real affordance gap was elsewhere: a sticky section
four screens tall gives no sign that scrolling drives it, and the progress meter only
confirms that after the reader has already moved. There is now a static `Scroll` label that
leaves the moment progress passes 2%. Static, not a looping bounce: a cue that animates
forever is motion the reader cannot turn off. It never renders on the reduced-motion path,
where there is nothing to scrub.

**Fixed while in there.** `onScroll` and the `window.__scrub.seek` test hook each carried
their own copy of the render, and the copies drifted the first time something new was drawn
- the scroll cue updated under real scrolling and not under `seek`. Both now call one
`render(p)`.

**Proof slot filled.** §3 said one measured latency figure would change the page from a
concept to a company. Three are now on the page, at the close of the tiers section, taken
off a CY-01: **868 ms** for a frame across the link, **8.9 s** press to spoken answer,
**1 ms** to route a spoken command on-device. Set in the mono face, tabular, hairline rules
rather than cards, no accent.

**Accessibility defects found and fixed.** The Design section carried
`aria-labelledby="h-design"` pointing at an id that exists nowhere, so the section was
unnamed; it now uses `aria-label`. The three scrub captions were `h3` inside a section with
no `h2`, putting a level skip between two `h2`s for `aria-hidden` decoration; they are now
paragraphs. Added: `theme-color`, `color-scheme: light`, `touch-action: manipulation`, a
deliberate `-webkit-tap-highlight-color`, and `fetchpriority="high"` on the poster, which is
the only image every reader gets. Re-measured after the edit: every new element passes AA
against its real computed background.

---

## 0. Standing rules for every section

These are the constraints that survived review. Break one and the page stops working.

1. **Never open on the deficit.** The assistive category leads with what is missing, which
   is a large part of why those products feel medical and get abandoned. State a
   capability, then demonstrate it. The problem is inferred, never narrated at the reader.
2. **No hardware vendor is named anywhere.** Not the SDK, not the unit, not the model
   number. The product is a Blynq glass.
3. **Do not imply a factory.** Apple and Nothing confidence reads as "we manufacture."
   Avoid "engineered by us" and "our hardware." Speak only about what the product does.
   No hedging either, just stay on capability.
4. **The DOM order is the narrative.** The bento is a visual arrangement placed on top of
   a linear document via grid placement. Sections never reorder in the DOM. See section 8.
5. **Three claims, never four.** The product card holds exactly three. Nothing's discipline
   is the most portable thing on their page.
6. **Structure from Nothing, not surface.** Their thesis is "look at the components."
   Ours is the opposite: nobody can tell you are wearing anything. Borrowing transparency,
   exposed hardware, or the lowercase parenthetical naming fights the product.

---

## 1. The owned visual device: the gap is drawn

Everything else on this page is a reference. This is the one thing that is ours, and it
comes straight from the product thesis rather than from a moodboard.

**The device.** A horizontal band representing a conversation as blocks of sound, with a
measured space between them. Blynq's output is rendered only in that negative space.
Never over a block. The reader sees restraint before they read a word about it.

**Rules for it:**

- It appears in exactly two places: the hero, and the tiers section. Nowhere else.
- The page holds silence elsewhere. Vertical rests between sections run longer than a
  normal marketing site. Whitespace is a rhythm instrument here, not padding.
- When a tier 1 word is shown, "Sarah.", it sits alone in an empty field and the page
  does not move for a beat.
- The wordmark's `q` descender drops into the gap. Once, in the wordmark, and never
  repeated as a motif.

Without this the site is a competent Nothing homage. With it, it is Blynq.

---

## 2. Section spine

Five content sections plus a close. `Hear it` is held open at slot 3.5 and `Buy` is
replaced by `Request access`, see 2.7.

### 2.1 Product, name, one claim

The object, the word Blynq, one line. No setup, no scene, no problem statement.

Hero is a bento of entry cards around the product, per Nothing. It lets an investor and a
user take different paths through the same page without forcing a scroll order.

**The product card, exactly three claims:**

```
KNOWS WHO IS SPEAKING
SPEAKS ONLY IN THE GAPS
OPEN EAR. NO DISPLAY.
```

Capability, restraint, form. This is doing the heaviest lifting on the page. A reader
comparing us to Meta Ray-Ban, Envision, OrCam or Be My Eyes resolves the comparison here
or not at all, so restraint has to be visible in claim two before they reach any prose.

### 2.2 What it is, one sentence

> Glasses that give you the social context you cannot see.

Blindness is the clearest case, not the only case. This sentence is what makes the market
larger than the primary user without demoting the primary user.

### 2.3 The three tiers (promoted, was "technology")

**This is the headline capability, not a spec appendix.** Scene description already exists
on commodity AI glasses. Timing and restraint do not. The tiers are the product.

| Tier | Latency | Behaviour |
|---|---|---|
| 0 | under 200ms | Non-verbal. Two rising notes means someone joined. Learned in ten minutes, then free forever. |
| 1 | in detected silence | One to four words. "Sarah." Never speaks while a human is speaking. |
| 2 | on request | A full spoken answer, button triggered, never unprompted. |

The gap device from section 1 renders here at full width.

**3.5, held open: Hear it.** Production audio is not ready, so the section is parked, but
the slot stays in the layout. It was the only section the primary user experiences as a
demonstration, and it is the single most convincing element available. Do not design a
layout that has nowhere to put it later.

### 2.4 Nothing is recorded

Its own beat, not a footnote in a privacy policy.

Camera and microphone glasses worn in public are the number one objection to this entire
category, and the reader forms it whether or not they say it out loud. Answering it before
it hardens is worth more than any feature. It is also genuinely true of the product, which
defaults to storing no transcripts.

### 2.5 Design: open ear, no display, reads as eyewear

The constraints stated as decisions, which is the Nothing move.

- Nothing to look at, so nothing takes you out of the room.
- The ear canal stays open, so the real conversation still gets through.
- It looks like eyewear. Conspicuousness is the top reason assistive wearables get
  abandoned, so this is a feature and should be said plainly once.

**The product video lives here.** See section 7 for how, and why it carries no content.

### 2.6 Who it is for

Heading is **"One channel. A lot of rooms."** It opens the range and names nobody.
An earlier draft read "Blindness is the clearest case. It is not the only one." and was
cut on 2026-09-18: the heading must not single out blindness, because an investor is
reading for scale and the list below already leads with the primary group. Do not
reintroduce it.

Primary first in the list, named and specific. Then expansion ordered by market size,
largest first, which is the ordering the first draft was missing.

1. **Primary. Blind and low vision adults.** Professionally active, screen reader fluent,
   listening at 300 to 500 words per minute. Named clearly and without deficit framing.
2. **Anyone in a room too loud, or in a second language.** The consumer scale vector.
   Conferences, venues, international teams. This is the one an investor sizes.
3. **Neurodivergent users** who want social signals made explicit rather than guessed.
   Real category, real willingness to pay.
4. **Deafblind users**, through a braille display instead of a speaker. Framed as
   architectural proof that the output layer is abstracted, not as a market.

Phrasing rule: expansion is the same capability in more rooms. Never "useful for everyone
else," which quietly implies the primary user was the abnormal case.

### 2.7 Get in touch

Purchase is parked and signup was dropped on 2026-09-18. There is no backend to take an
address, and a form that goes nowhere is worse than no form. One real address, set at
display size on the dark band, no qualifier next to it.

**Rule that came out of this, and it governs all copy on the page.** State what we are
doing, never what we are missing. No "we do not have X yet", no "for now", no explaining
an absence. Between the team and the agent, blunt disclosure of gaps is correct and wanted.
To an investor or a customer a caveat is not candour, it is evidence of incompetence. Two
audiences, two documents. The reasoning for an absence goes in an HTML comment, never on
the page. See the `external-copy-no-caveats` memory.

---

## 3. Proof

Currently absent, and an investor will notice. Cannot be fabricated, so the slot is
specified here and filled when there is something real.

What likely already qualifies at this stage:

- It runs on real hardware. There is a verified working build.
- The product video, once shot.

What would be worth more: one pilot, one institution, one named user, one measured latency
figure. Any single one of these changes the page from a concept to a company.

---

## 4. Motion, and its designed alternative

One motion library. GSAP ScrollTrigger or Motion, not both. Three scroll systems (pinned
bento, parallax, scroll scrub) is one too many, so pick the minimum that delivers section 7.

**Reduced motion is a designed state, built first, not a fallback bolted on:**

- Hero renders the deliberately chosen landing frame of the product video, static.
- Three claims visible immediately, no reveal.
- No scrub, no parallax, no pinning.
- Section transitions are opacity only, or nothing.
- The gap device renders as a static diagram rather than an animated beat.

Build this state first, then layer motion on top of it.

---

## 5. Copy voice

Written to the user, plainly. The investor reads over their shoulder. Writing about blind
people rather than to them is a credibility failure that this category's investors notice
immediately, and it also produces worse copy, because it substitutes market language for
specifics.

Declarative, short, no hedging, no "helps you to." Spec sheet register.

The 1.1 billion figure (IAPB Vision Atlas) is real but leading with it turns the page into
a TAM slide. One person, one room, first. The number lands later as scale.

---

## 6. Accessibility is the proof, not the compliance

An investor evaluating an assistive tech company judges, consciously or not, whether the
team understands disabled users. A site that is flawless under a keyboard and a screen
reader demonstrates that in thirty seconds more credibly than any slide.

The page is not describing the competence. It is the competence, on display.

Gate: run `web-design-guidelines` against the built pages before launch, not after.

---

## 7. The product video

**Shoot for reveals, not rotation.** A turntable is the default for every hardware startup
now and says only "these are glasses." The rotation has to reveal the three things that
make it a Blynq glass: **the open ear speaker, the microphone, and the button.** If it
does not land on those, it is decoration.

**Shooting spec**, driven by how it gets built:

- Locked camera, constant lighting, clean seamless background.
- Defined start and end pose, so the scrub has a deliberate first and last frame.
- Exported as a frame sequence, roughly 120 to 240 frames.

**Build note.** Scrubbing `video.currentTime` on scroll is simple and stutters on iOS
Safari. A frame sequence drawn to canvas is the reliable method, at roughly 30 to 50 KB
per frame, so 5 to 10 MB total, requiring preload, a poster, and a static fallback.

**Non-visual equivalent, solved by construction.** Rather than fighting to describe a
scrub animation in an `alt` attribute, the video is `aria-hidden` decoration and the three
reveals are carried in body copy in section 2.5 that every reader gets. The content is in
the text; the video is the flourish on top of it.

---

## 8. The page is designed twice

The two most distinctive interactions, the bento hero and the scroll reveal, are the two
things the primary user will never see.

That is workable, but only if it is decided now: **the page is authored linearly, then
arranged spatially.** The linear version is not a degraded copy, it is the source.

**Canonical DOM order:**

1. Product, name, claim
2. What it is
3. The three tiers
4. (3.5, held: Hear it)
5. Nothing is recorded
6. Design
7. Who it is for
8. Request access

CSS grid placement rearranges these visually. The DOM never reorders. Decided up front
this is cheap; discovered at QA it is a rebuild.

---

## 9. Open items

| Item | Owner | Blocking |
|---|---|---|
| Favicon. The only console error on the built page is a 404 for it. Needs a designed mark, not the lockup squashed to 16px; the `q` with the gap is the obvious one | Amogh | Nothing, but a blank tab icon on a product page is conspicuous |
| Four dead tokens: `--ink-2`, `--plate-bottom`, `--radius-pill`, `--surface-strong`. `--radius-pill` is commented "the one exception: the primary action" and there is no primary action any more, because signup was dropped | Amogh | Nothing, tidy-up |
| Better product video, shot to the spec in section 7 | Amogh | Nothing. Current sequence is a turntable, which §7 explicitly rules out as saying only "these are glasses". A 90 degree arc landing on button, speaker and mic would double its resolution |
| Audio for the held section 3.5 | Amogh | Nothing yet, slot reserved |
| One proof point, section 3 | Amogh | Nothing yet, weakens the page |
| Portrait 9:16 render for mobile | Amogh | Mobile plate is a band in dead space |
| Decide on the `PRIMARY` badge in 2.6 | Amogh | Internal product language on a public page |
| Point `blynqlabs.com` DNS at the host | Amogh, GoDaddy | Deploy only |
| Trademark search, US and India, before wordmark is final | Amogh | Brand spend, not the build |

**Name note.** `Blynq` in eyewear and assistive appears clear, and the previous BlynQ
(Hyderabad, digital displays) is deadpooled. But `Blynk.io` is an active IoT hardware
brand and `BLINQ` is a registered USPTO mark held by Optoro. The legal risk looks low;
the practical cost is that search results for the name belong to someone else for a while.
