# ag-dot-com

Dot Com version of AG dot CA — a single-page site for Aaron Goos: one
high-key B&W photograph, oversized type, restrained parallax, and a door
to the fan club.

## Run it locally

No build step, no dependencies. Any static file server works:

```sh
cd docs
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

(Or `npx serve docs`, or just drag `docs/index.html` into a browser —
serving over http is better because SoundCloud embeds won't load from
`file://`.)

## Layout

```
docs/               ← GitHub Pages root for this repo
├── index.html      ← the page
├── style.css       ← palette, typography, the whole look
├── app.js          ← theme, scroll engine, SoundCloud rows
├── AG_guitar.jpg   ← the hero photograph
├── AG-music Logo-2017*.png   ← footer logos (one per theme)
└── more/           ← placeholder for the members page
```

## Editing

- **Palette** — all colors are CSS custom properties at the top of
  `style.css`. The rule: the photograph gives white, black, grey; one
  brown accent (`--accent`) and nothing else. Change the accent by
  editing its two lines (light + dark).
- **Placeholders** — search the HTML for `data-placeholder`: track
  titles/durations/SoundCloud URLs, and the contact block all need real
  values.
- **Contacts** — the email is never written anywhere in the HTML or DOM:
  `index.html` carries scrambled base64 fragments and `app.js` §4
  assembles the `mailto:` only at click. To install a real address:
  `node -e "b=s=>Buffer.from(s).toString('base64');console.log(b('DOMAIN'),b('TLD-or-TAIL'),b('LOCALPART'))"`
  → paste as `data-x1/x2/x3` and match the order in `app.js` §4. The
  phone is a vanity display — `(250) 908-GOOS` — and dialing digits are
  generated from the letters at click. Stronger option if the
  fragments-in-repo bother you: a no-email form (Formspree free tier,
  with a honeypot field) or Cloudflare in front of Pages with its
  email-protection on.
- **Dark mode** — the hero photo is shown as its own photographic
  negative (`filter: invert`) over black, so the print's white matte
  keeps blending seamlessly into the page in both themes.
- **Motion** — the scroll engine lives in `app.js` §2. Ghost/solid/type
  drift rates are the three numbers in `frame()`. Everything collapses
  to a static composition under `prefers-reduced-motion` and on phones.

## Deploy

GitHub Pages serves the `docs/` folder as the site root
(branch → settings → Pages → source: `docs`). The `CNAME` file in
`docs/` sets the custom domain when one is configured.
