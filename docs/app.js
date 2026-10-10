/* ============================================================
   AARON GROSS — interaction layer
   1. theme (light default, persisted; <head> script avoids the flash)
   2. hero scroll engine: pinned stage, layered drift, velocity skew
   3. SoundCloud rows: one player open at a time, lazy-loaded
   ============================================================ */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- 1. theme ---------------- */
  const current = root.getAttribute('data-theme') || 'light';
  root.setAttribute('data-theme', current);   // logo swap is pure CSS on this attribute

  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ag-theme', next); } catch (e) { /* private mode */ }
  });

  /* ---------------- 2. hero scroll engine ----------------
     The stage (photo + headline + rising listen rows) holds pinned
     for one long stretch. Against the hold: ghost lags, solid drifts
     slow, headline lifts away fast, track list rises into its place.
     When the pin releases, the Book/More panels push the whole stage
     out like pages sliding up. */
  const hero   = document.querySelector('.hero');
  const ghost  = document.querySelector('[data-depth="ghost"]');
  const solid  = document.querySelector('[data-depth="solid"]');
  const type   = document.querySelector('.hero-type');
  const listen = document.querySelector('.hero-listen');
  const cue    = document.querySelector('.scroll-cue');

  let target = window.scrollY, currentY = window.scrollY, raf = null;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function frame() {
    currentY += (target - currentY) * 0.1;               // damped scroll
    if (Math.abs(target - currentY) < 0.5) currentY = target;

    const stretch = Math.max(1, hero.offsetHeight - window.innerHeight);
    const p = clamp(currentY / stretch, 0, 1);           // 0..1 across the pin
    const v = target - currentY;                         // signed velocity
    const skew = clamp(v * 0.012, -0.35, 0.35);          // ≤ 0.35°, felt not seen

    ghost.style.transform =
      `translate(-50%, calc(-50% - ${p * 8}%)) skewX(${skew * 0.6}deg) scale(${1.14 - p * 0.07})`;
    const gBase = root.getAttribute('data-theme') === 'dark' ? 0.35 : 0.55;
    ghost.style.opacity = gBase * (1 - p * 0.55);

    solid.style.transform =
      `translate(-50%, calc(-50% - ${p * 2.6}%)) skewX(${skew}deg) scale(${1.045 - p * 0.03})`;

    // headline: lifts away and fades fast (snappier than before)
    const tOut = clamp(1 - (p - 0.04) * 3.4, 0, 1);
    type.style.opacity = tOut;
    type.style.transform = `translateY(${-(1 - tOut) * 2.5}rem)`;

    // listen rows rise into the headline's space
    if (listen) {
      const e = clamp((p - 0.12) / 0.33, 0, 1);
      const eo = 1 - Math.pow(1 - e, 3);                 // ease-out
      listen.style.transform = `translateY(${(1 - eo) * 26}vh)`;
      listen.style.opacity = eo;
    }

    if (cue) cue.style.opacity = clamp(1 - p * 6, 0, 1);

    raf = currentY !== target ? requestAnimationFrame(frame) : null;
  }

  function onScroll() {
    target = window.scrollY;
    const off = reduced.matches || window.innerWidth <= 820 || !hero;
    if (off) {                                           // static composition
      ghost.style.transform = solid.style.transform = type.style.transform = '';
      type.style.opacity = ghost.style.opacity = cue ? cue.style.opacity = '' : '';
      if (listen) listen.style.transform = listen.style.opacity = '';
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ---------------- 3. SoundCloud rows ---------------- */
  const tracks = [...document.querySelectorAll('.track')];

  function close(track) {
    track.classList.remove('open');
    const fr = track.querySelector('.player iframe');
    track.querySelector('.track-row').setAttribute('aria-expanded', 'false');
    if (fr.src) fr.src = '';                             // unloading kills audio
  }

  tracks.forEach(track => {
    track.querySelector('.track-row').addEventListener('click', () => {
      const wasOpen = track.classList.contains('open');
      tracks.forEach(close);                             // single voice
      if (!wasOpen) {
        const fr = track.querySelector('.player iframe');
        fr.src = fr.dataset.src;                         // lazy; auto_play is in the URL
        track.classList.add('open');
        track.querySelector('.track-row').setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- 4. contacts (anti-robot) ----------------
     Nothing readable ever sits in the DOM. Email fragments (scrambled
     base64) and the phone's vanity letters are assembled only at the
     moment of click, then handed straight to the mail/dial app. */
  const PHONE_KEY = { A: '2', B: '2', C: '2', D: '3', E: '3', F: '3',
                      G: '4', H: '4', I: '4', J: '5', K: '5', L: '5',
                      M: '6', N: '6', O: '6', P: '7', Q: '7', R: '7',
                      S: '7', T: '8', U: '8', V: '8', W: '9', X: '9',
                      Y: '9', Z: '9' };

  document.querySelectorAll('[data-contact]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const d = el.dataset, x = n => atob(d['x' + n]);
      let href;
      if (d.contact === 'email') {
        href = 'mailto:' + x(3) + '@' + x(1) + '.' + x(2);   // local@domain.tld
      } else {
        href = 'tel:' + d.vanity.toUpperCase().split('').map(c => {
          if (PHONE_KEY[c]) return PHONE_KEY[c];
          return /\d/.test(c) ? c : '';
        }).join('');
      }
      window.location.href = href;
    });
  });
})();
