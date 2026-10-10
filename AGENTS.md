# AGENTS.md — notes for AI working on this repo

Project: single-page site for musician **Aaron Goos** (not "Gross"). Ad for
live performances. GitHub Pages serving `docs/` as root. Vanilla HTML/CSS/JS
only — no build step, no frameworks (decision made).

## Design rules (user-set, do not break)
- Palette: only what the B&W photo gives — white, black, grey + **one** brown
  accent (`--accent` in style.css). Nothing else.
- Dark mode: **same photo, un-inverted**, hairline border + glow on black.
  Inverting the image was tried and rejected.
- Hero: restrained parallax is the showpiece — no gimmicks. Image already
  reads as "AG"; do not overlay giant AG/initials.
- Copy tone: dry wit. Current: h1 "PRETTY GOOD BACKGROUND MUSIC." (ironic —
  user likes it; earlier "NOT BACKGROUND MUSIC" rejected as too aggressive).
  Concept: voice, guitar, sometimes piano, sometimes with friends —
  "not truly solo." Section names: Listen / Book / Fan club.
- Don't add extra features/content beyond what's asked ("do not do too much").
- Type: Archivo (expanded, brutalist display) + Newsreader italic (Google
  Fonts). Light theme is default for first-time visitors.

## Structure
- `docs/index.html` — hero (260vh, pinned `.hero-inner`), 7 placeholder
  SoundCloud rows inside the pin, `.push` full-screen Book & Fan-club panels.
- `docs/more/` — fan-club door page (auth deferred, undecided: 3rd-party
  magic-link vs own).
- `docs/app.js` — §2 scroll engine: damped rAF, headline fade `(p-.04)*3.4`,
  listen rise `0.12/0.33`, drift constants. §4: email/phone assembled from
  scrambled base64 **at click only** — never in DOM. Phone is vanity
  `(250) 908-GOOS`. Keep contacts obfuscated: public repo, user dislikes
  raw address online.
- Assets: `AG_guitar.jpg` hero (3024×4032, ~689KB — compress before deploy);
  logo PNGs have baked-in mattes → blend-mode swap per theme;
  `ag-mark.png` = generated transparent-white logo for topbar (difference
  blend makes it legible anywhere). Script to regenerate: decode PNG, alpha =
  darkness of strokes, re-encode (stdlib-only Python; PIL not installed).

## Technical gotchas (learned the hard way)
- CSS `animation fill-mode: forwards` overrides later JS inline styles →
  intro animations go on children, parent gets JS transforms.
- `mix-blend-mode: multiply` for seamless light-mode print; **normal** for
  framed dark-mode (multiply on black = invisible).
- `position: sticky` needs a tall grid track/parent; hero-inner is the single
  sticky element, sections after it are normal flow (creates the push effect).
- JS sets ghost opacity inline → must read theme base (0.55 light / 0.35 dark).
- Mobile ≤820px and reduced-motion: all parallax disabled, static stack.
  Test both.

## State / TODO
- Placeholders marked `data-placeholder`: track titles/URLs, email (real one
  → base64 fragments, see README), SoundCloud profile link, fan-club page.
- Nothing committed since the rebuild; commit as checkpoint when asked.
- Another agent edits the same files concurrently — re-read files before
  editing; conflicts happened (edits silently reverted). Verify served state,
  not just intent.
- Demo servers: run `cd docs && python3 -m http.server 8777 --bind 0.0.0.0`.
  LAN IP 10.6.10.111 (user tests on other devices). Close it when told.
