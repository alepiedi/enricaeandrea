/* ==========================================================================
   Enrica & Andrea — "Il nastro azzurro"
   ========================================================================== */
(() => {
  'use strict';

  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TZ = 'Europe/Rome';
  const DOGS = W.cani || [];
  const dogName = (i) => (DOGS[i] && DOGS[i].nome) || '';

  const hasTime = /^\d{1,2}:\d{2}$/.test(W.orario || '');
  // Ultimo scroll dell'utente: serve a capire quando è fermo e va "invitato" a scendere
  let lastScroll = 0;
  addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true });
  const idleFor = () => performance.now() - lastScroll;
  // posizione di scroll letta una sola volta per fotogramma, prima di qualsiasi modifica alla pagina
  let FY = 0;
  // risveglia il ciclo di animazione (che si ferma da solo quando non c'è niente da muovere)
  let wake = () => {};

  /* Scorrimento lento e morbido (anche su iPhone), interrotto appena l'utente tocca o scorre da sé */
  const Glide = (() => {
    let raf = 0, active = false;
    const root = document.documentElement;
    const stop = () => {
      if (!active) return;
      cancelAnimationFrame(raf);
      active = false;
      root.style.scrollBehavior = '';
    };
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, stop, { passive: true }));
    return {
      get active() { return active; },
      stop,
      to(y, dur = 1400) {
        stop();
        y = Math.max(0, Math.min(y, root.scrollHeight - innerHeight));
        if (reduced) return scrollTo(0, y);
        const y0 = scrollY, dy = y - y0, t0 = performance.now();
        active = true;
        root.style.scrollBehavior = 'auto'; // altrimenti "scroll-behavior: smooth" rallenta ogni passo
        const step = (now) => {
          if (!active) return;
          const p = Math.min(1, (now - t0) / dur);
          const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          scrollTo(0, y0 + dy * e);
          if (p < 1) raf = requestAnimationFrame(step); else stop();
        };
        raf = requestAnimationFrame(step);
      },
    };
  })();

  const weddingDate = new Date(`${W.data}T${hasTime ? W.orario.padStart(5, '0') : '00:00'}:00+02:00`);
  const fmt = (opts) => new Intl.DateTimeFormat('it-IT', { timeZone: TZ, ...opts }).format(weddingDate);

  /* ------------------------------------------------------------------
     Dati dalla configurazione
     ------------------------------------------------------------------ */
  function bindConfig() {
    const pad = (n) => String(n).padStart(2, '0');
    const giorno = fmt({ day: 'numeric' });
    const meseNum = pad(fmt({ month: 'numeric' }));
    const anno = fmt({ year: 'numeric' });

    const values = {
      lui: W.lui,
      lei: W.lei,
      anno,
      giorno,
      settimana: fmt({ weekday: 'long' }),
      mese: fmt({ month: 'long' }),
      dataLunga: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      dataPunti: `${pad(giorno)} · ${meseNum} · ${anno}`,
      ora: fmt({ hour: '2-digit', minute: '2-digit' }),
      luogoNome: W.luogo.nome,
      luogoBreve: W.luogo.breve || W.luogo.nome,
      luogoDesc: W.luogo.descrizione || '',
      citta: W.luogo.citta || W.luogo.indirizzo,
      indirizzo: W.luogo.indirizzo,
      cane0: dogName(0),
      cane1: dogName(1),
      entro: W.rsvp.entro
        ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(W.rsvp.entro + 'T12:00:00'))
        : null,
    };
    if (!hasTime) $('#winOra').remove();
    if (!W.rsvp.entro) $('#rsvpBy').textContent = 'Fatecelo sapere appena potete.';

    $$('[data-bind]').forEach((el) => {
      const v = values[el.dataset.bind];
      if (v != null) el.textContent = v;
    });
    $$('[data-bind-href="maps"]').forEach((a) => (a.href = W.luogo.maps));

    document.title = `${W.lei} & ${W.lui} · Save the Date`;
    $$('[data-mono]').forEach((el) => (el.textContent = `${W.lei[0]}&${W.lui[0]}`));
    $$('[data-mono-small]').forEach((el) => (el.textContent = `${W.lei[0]} · ${W.lui[0]}`));
  }

  /* ------------------------------------------------------------------
     I cani, disegnati con i colori della configurazione
     ------------------------------------------------------------------ */
  const INK = '#2a2622';
  const RIBBON = '#8ea8c3';
  const RIBBON_DEEP = '#5e7590';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const colorsOf = (c) => {
    const k = (c && c.colori) || {};
    const pelo = k.pelo || '#c99c6b';
    return { pelo, muso: k.muso || '#f4e7d3', orecchie: k.orecchie || pelo, macchia: k.macchia || '' };
  };

  // seduto, di fronte (per le schede, il finale e il messaggio segreto)
  function dogSit(c, cls = '') {
    const k = colorsOf(c);
    const up = c && c.orecchie === 'su';
    const pointy = up
      ? `<path d="M52 52 L42 10 L78 36 Z" fill="${k.orecchie}"/><path d="M108 52 L118 10 L82 36 Z" fill="${k.orecchie}"/>
         <path d="M54 44 L48 21 L68 36 Z" fill="#e8b4b4" opacity=".6"/><path d="M106 44 L112 21 L92 36 Z" fill="#e8b4b4" opacity=".6"/>`
      : '';
    const floppy = up
      ? ''
      : `<path class="dog__ear dog__ear--l" d="M56 42 C 34 34, 20 76, 34 100 C 43 112, 58 96, 60 72 Z" fill="${k.orecchie}"/>
         <path class="dog__ear dog__ear--r" d="M104 42 C 126 34, 140 76, 126 100 C 117 112, 102 96, 100 72 Z" fill="${k.orecchie}"/>`;
    return `
      <svg class="dog dog--sit ${cls}" viewBox="0 0 160 192" aria-hidden="true">
        <g class="dog__tail"><path d="M112 164 C 138 160, 150 136, 142 114" fill="none" stroke="${k.pelo}" stroke-width="12" stroke-linecap="round"/></g>
        <ellipse cx="46" cy="174" rx="17" ry="12" fill="${k.pelo}"/><ellipse cx="114" cy="174" rx="17" ry="12" fill="${k.pelo}"/>
        <ellipse cx="80" cy="150" rx="40" ry="37" fill="${k.pelo}"/>
        <ellipse cx="80" cy="142" rx="21" ry="30" fill="${k.muso}"/>
        <rect x="58" y="146" width="17" height="40" rx="8.5" fill="${k.pelo}"/><rect x="85" y="146" width="17" height="40" rx="8.5" fill="${k.pelo}"/>
        <ellipse cx="66" cy="185" rx="12" ry="6" fill="${k.muso}"/><ellipse cx="94" cy="185" rx="12" ry="6" fill="${k.muso}"/>
        <path d="M54 110 Q 80 126 106 110" fill="none" stroke="${RIBBON}" stroke-width="8" stroke-linecap="round"/>
        <ellipse class="dog__charm" cx="80" cy="131" rx="6" ry="5.5" fill="none" stroke="url(#ringGold)" stroke-width="2.6"/>
        <g transform="translate(80 120)"><path d="M0 0 C -8 -9 -17 -4 -15 2 C -13 8 -5 4 0 0 Z M0 0 C 8 -9 17 -4 15 2 C 13 8 5 4 0 0 Z" fill="${RIBBON_DEEP}"/><circle r="3.2" fill="${RIBBON_DEEP}"/></g>
        <g class="dog__head">
          ${pointy}
          <ellipse cx="80" cy="66" rx="34" ry="31" fill="${k.pelo}"/>
          ${k.macchia ? `<ellipse cx="94" cy="58" rx="13" ry="12" fill="${k.macchia}"/>` : ''}
          <ellipse cx="80" cy="84" rx="19" ry="14" fill="${k.muso}"/>
          <ellipse cx="62" cy="80" rx="6" ry="3.5" fill="#e9a1a8" opacity=".35"/><ellipse cx="98" cy="80" rx="6" ry="3.5" fill="#e9a1a8" opacity=".35"/>
          <g class="dog__eyes">
            <circle cx="67" cy="62" r="5.6" fill="${INK}"/><circle cx="93" cy="62" r="5.6" fill="${INK}"/>
            <circle cx="65.4" cy="60" r="1.9" fill="#fff"/><circle cx="91.4" cy="60" r="1.9" fill="#fff"/>
          </g>
          <path d="M60 52 q6 -4 12 -1 M88 51 q6 -3 12 1" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>
          <path class="dog__tongue" d="M75 89 Q 75 101 80 101 Q 85 101 85 89 Z" fill="#e8848f"/>
          <path d="M72 76 Q 80 71 88 76 Q 86 84 80 85 Q 74 84 72 76 Z" fill="${INK}"/>
          <ellipse cx="77" cy="76" rx="2.4" ry="1.2" fill="#fff" opacity=".5"/>
          <path d="M80 85 V 89 M80 89 Q 74 95 68 90 M80 89 Q 86 95 92 90" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          ${floppy}
        </g>
      </svg>`;
  }

  // di profilo, rivolto a destra (per il riporto e il postino)
  function dogRun(c) {
    const k = colorsOf(c);
    const up = c && c.orecchie === 'su';
    const leg = (cls, x, front) => `
      <g class="leg ${cls}"><rect x="${x}" y="70" width="13" height="46" rx="6.5" fill="${k.pelo}"/>
      ${front ? `<ellipse cx="${x + 8}" cy="115" rx="9" ry="4.5" fill="${k.muso}"/>` : ''}</g>`;
    return `
      <svg class="dog dog--run" viewBox="0 0 210 130" aria-hidden="true">
        <g class="dog__tail"><path d="M46 58 C 30 50, 24 34, 28 22" fill="none" stroke="${k.pelo}" stroke-width="10" stroke-linecap="round"/></g>
        <g class="dog__far">${leg('leg--b2', 52)}${leg('leg--f2', 130)}</g>
        <ellipse cx="92" cy="66" rx="52" ry="25" fill="${k.pelo}"/>
        <ellipse cx="100" cy="79" rx="34" ry="10" fill="${k.muso}"/>
        ${leg('leg--b1', 40, true)}${leg('leg--f1', 140, true)}
        <path d="M136 42 Q 140 62 152 70" fill="none" stroke="${RIBBON}" stroke-width="7" stroke-linecap="round"/>
        <g class="dog__head">
          ${up ? `<path d="M146 26 L142 -2 L166 20 Z" fill="${k.orecchie}"/>` : ''}
          <circle cx="158" cy="40" r="23" fill="${k.pelo}"/>
          ${k.macchia ? `<ellipse cx="164" cy="32" rx="10" ry="9" fill="${k.macchia}"/>` : ''}
          <ellipse cx="178" cy="50" rx="17" ry="11" fill="${k.muso}"/>
          <ellipse cx="193" cy="45" rx="5.2" ry="4.4" fill="${INK}"/>
          <circle cx="166" cy="34" r="3.8" fill="${INK}"/><circle cx="164.8" cy="32.8" r="1.3" fill="#fff"/>
          <path d="M178 58 q8 3 14 -2" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          ${up ? '' : `<path d="M150 22 C 134 22, 128 52, 138 62 C 146 68, 154 50, 156 34 Z" fill="${k.orecchie}"/>`}
          <g class="dog__carry" transform="translate(186 62)"></g>
        </g>
      </svg>`;
  }

  const BALL = '<g><circle r="10" fill="#e6d2b0"/><path d="M-8 -6 Q 0 0 -8 6 M8 -6 Q 0 0 8 6" stroke="#fff" stroke-width="1.6" fill="none"/></g>';
  const TAG = '<g><path d="M0 -14 V -6" stroke="#b49a6a" stroke-width="1.6"/><circle r="10" fill="url(#ringGold)" stroke="#a8844c" stroke-width="1"/><path d="M-3 -1 a1.6 1.6 0 1 1 0.01 0 M3 -1 a1.6 1.6 0 1 1 0.01 0 M0 4 a3 2.4 0 1 1 0.01 0" fill="#8a6a36"/></g>';
  const LETTER = '<g transform="rotate(-8)"><rect x="-14" y="-10" width="28" height="19" rx="2" fill="#fffaf0" stroke="#b9a27c" stroke-width="1"/><path d="M-14 -10 L0 1 L14 -10" fill="none" stroke="#b9a27c" stroke-width="1"/><circle cx="0" cy="1" r="3.2" fill="#5e7590"/></g>';

  /* ------------------------------------------------------------------
     Divide i nomi in lettere per l'animazione d'ingresso
     ------------------------------------------------------------------ */
  function splitLetters() {
    $$('[data-split]').forEach((el) => {
      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.innerHTML = [...text]
        .map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('');
    });
  }

  /* ------------------------------------------------------------------
     0. Le porte della scuderia: tieni premuto il fiocco per scioglierlo
     ------------------------------------------------------------------ */
  function intro(onOpen) {
    const introEl = $('#intro');
    const bow = $('#bow');
    const ring = $('#bowRing');
    const hint = $('#introHint');
    const DURATION = reduced ? 1 : 1300;
    let start = 0, progress = 0, holding = false, opened = false, raf = 0, tapTimer = 0;

    const render = () => {
      ring.style.strokeDashoffset = String(1 - progress);
      introEl.style.setProperty('--pull', progress.toFixed(3));
      const shake = holding ? progress * 2.5 : 0;
      bow.style.transform = `translate(${(Math.random() - .5) * shake}px, ${(Math.random() - .5) * shake}px)`;
    };

    const tick = (now) => {
      if (holding) {
        progress = clamp((now - start) / DURATION, 0, 1);
        if (progress >= 1) return open();
      } else {
        progress = Math.max(0, progress - 0.04);
      }
      render();
      if (holding || progress > 0) raf = requestAnimationFrame(tick);
    };

    const press = (e) => {
      if (opened || holding) return;
      e && e.preventDefault();
      holding = true;
      start = performance.now() - progress * DURATION;
      introEl.classList.add('is-holding');
      tapTimer = setTimeout(() => (tapTimer = 0), 250);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const release = () => {
      if (!holding || opened) return;
      holding = false;
      introEl.classList.remove('is-holding');
      if (tapTimer) { // è stato un tocco veloce: spiego cosa fare
        hint.textContent = 'Tieni premuto ancora un po’…';
        hint.classList.remove('is-nudge'); void hint.offsetWidth; hint.classList.add('is-nudge');
      }
      raf = requestAnimationFrame(tick);
    };

    function open() {
      opened = true; holding = false;
      cancelAnimationFrame(raf);
      bow.style.transform = '';
      introEl.style.setProperty('--pull', '1');
      navigator.vibrate && navigator.vibrate([18, 40, 30]);
      introEl.classList.remove('is-holding');
      introEl.classList.add('is-opening');
      setTimeout(() => {
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-open');
        window.scrollTo(0, 0);
        onOpen();
      }, 900);
      setTimeout(() => introEl.remove(), 2600);
    }

    bow.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    bow.addEventListener('contextmenu', (e) => e.preventDefault());
    bow.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) press(e); });
    bow.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') release(); });
    bow.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------
     Petali che scendono piano nell'hero
     ------------------------------------------------------------------ */
  const PETAL_COLORS = ['#ffffff', '#f6f1e8', '#c9d6e3', '#8ea8c3', '#e6d2b0'];
  const drawPetal = (ctx, s) => {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * .9, -s * .2, 0, s);
    ctx.quadraticCurveTo(-s * .9, -s * .2, 0, -s);
    ctx.fill();
  };

  function drift() {
    const cvs = $('#drift');
    const ctx = cvs.getContext('2d');
    const hero = $('.hero');
    let w, h, dpr, parts = [], inView = true, raf = 0, lastDraw = 0;
    const visible = () => inView && !document.hidden;

    const resize = () => {
      dpr = 1; // petali piccoli e sfumati: non serve la piena risoluzione
      w = hero.clientWidth; h = hero.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(clamp(w * h / 40000, 12, 34));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        s: Math.random() * 4 + 3,
        vy: Math.random() * .35 + .15, vx: (Math.random() - .5) * .2,
        rot: Math.random() * 6.28, vr: (Math.random() - .5) * .01,
        a: Math.random() * .45 + .25, p: Math.random() * 6.28,
        c: PETAL_COLORS[2 + Math.floor(Math.random() * 3)],
      }));
    };

    const loop = (t) => {
      raf = 0;
      if (!visible()) return; // fuori schermo il ciclo si ferma del tutto
      if (t - lastDraw < 30) { raf = requestAnimationFrame(loop); return; } // petali lenti: 30 fotogrammi al secondo bastano
      lastDraw = t;
      {
        ctx.clearRect(0, 0, w, h);
        for (const q of parts) {
          q.x += q.vx + Math.sin(t / 1800 + q.p) * .35;
          q.y += q.vy;
          q.rot += q.vr + Math.sin(t / 900 + q.p) * .004;
          if (q.y > h + 10) { q.y = -10; q.x = Math.random() * w; }
          ctx.save();
          ctx.globalAlpha = q.a;
          ctx.fillStyle = q.c;
          ctx.translate(q.x, q.y); ctx.rotate(q.rot);
          ctx.scale(1, .55 + .45 * Math.abs(Math.sin(t / 700 + q.p))); // si girano mentre cadono
          drawPetal(ctx, q.s);
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(loop); };

    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (visible()) start(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (visible()) start(); });
    addEventListener('resize', resize);
    resize();
    start();
  }

  /* ------------------------------------------------------------------
     2. I portafedi: le schede dei cani
     ------------------------------------------------------------------ */
  function pups() {
    const wrap = $('#pupCards');
    wrap.innerHTML = DOGS.map((c, i) => `
      <article class="pup pup--${i}" data-pup="${i}">
        <button class="pup__art" type="button" aria-label="Fai una carezza a ${esc(c.nome)}">
          ${c.ritratto
            ? `<img class="pup__portrait" src="${esc(c.ritratto)}" alt="${esc(c.nome)}" loading="lazy">`
            : c.foto ? '' : dogSit(c)}
          ${c.foto ? `<img class="pup__photo${c.ritratto ? ' pup__photo--peek' : ''}" src="${esc(c.foto)}" alt="${c.ritratto ? '' : esc(c.nome)}" loading="lazy">` : ''}
          <span class="pup__bubble" aria-hidden="true">Bau!</span>
        </button>
        <svg class="pup__rosette" viewBox="0 0 100 130" aria-hidden="true">
          <path d="M36 60 L22 126 L36 116 L46 128 L52 64 Z" fill="${RIBBON_DEEP}"/><path d="M64 60 L78 126 L64 116 L54 128 L48 64 Z" fill="${RIBBON}"/>
          <circle cx="50" cy="50" r="44" fill="none" stroke="${RIBBON}" stroke-width="9" stroke-dasharray="3.4 1.8"/>
          <circle cx="50" cy="50" r="38" fill="${RIBBON}"/><circle cx="50" cy="50" r="27" fill="#f6f1e8"/>
          <text x="50" y="58" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="26" font-style="italic" fill="${RIBBON_DEEP}">${i + 1}°</text>
        </svg>
        <div class="pup__body">
          <p class="pup__role">${c.razza ? `${esc(c.razza)} · ` : ''}Portafedi ufficiale</p>
          <h3 class="pup__name">${esc(c.nome)}</h3>
          <dl class="pup__facts">
            <div><dt>Porterà</dt><dd>${esc(c.porta || '')}</dd></div>
            <div><dt>Segni particolari</dt><dd>${esc(c.segni || '')}</dd></div>
            <div><dt>Talento</dt><dd>${esc(c.talento || '')}</dd></div>
          </dl>
        </div>
      </article>`).join('');

    // una carezza: abbaia, scodinzola, tira fuori la lingua
    $$('.pup', wrap).forEach((card) => {
      const art = $('.pup__art', card);
      art.addEventListener('click', () => {
        card.classList.remove('is-happy'); void card.offsetWidth; card.classList.add('is-happy');
        navigator.vibrate && navigator.vibrate(20);
        const r = art.getBoundingClientRect();
        Petals.hearts(r.left + r.width / 2, r.top + r.height * .3, 7);
        clearTimeout(card._t);
        card._t = setTimeout(() => card.classList.remove('is-happy'), card.querySelector('.pup__photo--peek') ? 2600 : 1600);
      });
    });
  }

  /* Gli occhi dei cani seguono il dito (o il mouse) */
  function eyesFollow() {
    let px = innerWidth / 2, py = innerHeight / 2, dirty = true;
    const set = (e) => { px = e.clientX; py = e.clientY; dirty = true; };
    addEventListener('pointermove', set, { passive: true });
    addEventListener('pointerdown', set, { passive: true });
    // si lavora solo sui cani che si vedono in quel momento
    const onScreen = new Set();
    let io = null;
    const watch = () => {
      io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { onScreen.add(e.target); dirty = true; } else onScreen.delete(e.target);
      }));
      $$('.dog--sit').forEach((svg) => io.observe(svg));
    };
    return () => {
      if (reduced) return;
      if (!io) watch(); // i cani esistono tutti quando parte il ciclo
      if (!dirty || !onScreen.size) return;
      dirty = false;
      onScreen.forEach((svg) => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * .33;
        const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 220);
        const eyes = $('.dog__eyes', svg);
        eyes.style.transform = `translate(${(dx / d * 2.6 * k).toFixed(2)}px, ${(dy / d * 2.2 * k).toFixed(2)}px)`;
        $('.dog__head', svg).style.rotate = `${clamp(dx / 60, -6, 6).toFixed(2)}deg`;
      });
    };
  }

  /* ------------------------------------------------------------------
     3. Le polaroid appese al nastro
     ------------------------------------------------------------------ */
  const boneButton = (id, cls) =>
    `<button class="bone ${cls}" type="button" data-bone="${id}" aria-label="Hai trovato un osso!">` +
    '<svg viewBox="0 0 120 60" aria-hidden="true"><use href="#boneSvg"/></svg>' +
    '<span class="bone__bubble" aria-hidden="true">Un osso!</span></button>';

  function gallery() {
    const line = $('#line');
    line.innerHTML = W.foto.map((f, i) => `
      <figure class="photo" style="--r:${((i * 37) % 7) - 3}">
        <div class="photo__hang">
          <div class="photo__sway">
            <span class="tie" aria-hidden="true"></span>
            <div class="photo__frame">
              <div class="photo__img"><img src="${esc(f.src)}" alt="${esc(f.didascalia || '')}" loading="lazy" decoding="async"></div>
              <figcaption>${esc(f.didascalia || '')}</figcaption>
            </div>
          </div>
        </div>
      </figure>`).join('');

    // un osso dietro la quarta foto (o l'ultima, se sono meno)
    const hideout = $$('.photo__sway', line)[Math.min(3, W.foto.length - 1)];
    if (hideout) hideout.insertAdjacentHTML('beforeend', boneButton('foto', 'bone--photo'));

    const photos = $$('.photo', line).map((el) => ({
      el,
      sway: $('.photo__sway', el),
      angle: ((Math.random() - .5) * 4),
      vel: 0,
      rest: (Math.random() - .5) * 3,
      visible: false,
    }));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const p = photos.find((q) => q.el === e.target);
        p.visible = e.isIntersecting;
        if (e.intersectionRatio > .45 && !p.el.classList.contains('is-developed')) {
          p.el.classList.add('is-developed');
          p.vel += (Math.random() - .5) * 2;
        }
      });
    }, { threshold: [0, .45] });
    photos.forEach((p) => {
      io.observe(p.el);
      p.el.addEventListener('pointerdown', () => (p.vel += (Math.random() > .5 ? 1 : -1) * (2 + Math.random() * 2)));
    });

    // fisica del dondolio: la velocità di scroll "spinge" le foto
    let lastY = scrollY, push = 0;
    return () => {
      if (reduced) return false;
      const dy = FY - lastY; lastY = FY;
      push += (clamp(dy, -60, 60) - push) * 0.2;
      let busy = Math.abs(push) > .05;
      for (const p of photos) {
        if (!p.visible) continue;
        const force = -push * 0.035 - (p.angle - p.rest) * 0.035;
        p.vel = (p.vel + force) * 0.94;
        p.angle = clamp(p.angle + p.vel, -28, 28);
        if (Math.abs(p.vel) < .004 && Math.abs(p.angle - p.rest) < .05) continue; // ferma: non la ritocco
        busy = true;
        p.sway.style.transform = `rotate(${p.angle.toFixed(2)}deg)`;
      }
      return busy;
    };
  }

  /* Punti del nastro lungo le file di foto (a zig-zag, con la curva del bucato) */
  function galleryPoints(line, mainRect) {
    const photos = $$('.photo', line);
    if (!photos.length) return [];
    const lr = line.getBoundingClientRect();
    const left = lr.left - mainRect.left + 4;
    const right = lr.right - mainRect.left - 4;

    // raggruppa per riga (offsetTop non risente delle trasformazioni)
    const rows = [];
    photos.forEach((ph) => {
      const top = ph.offsetTop;
      let row = rows.find((r) => Math.abs(r.top - top) < 10);
      if (!row) rows.push((row = { top, items: [] }));
      row.items.push(ph);
    });

    const lineTop = lr.top - mainRect.top;
    const pts = [];
    const sag = clamp((right - left) * 0.06, 24, 70);
    const bend = clamp((right - left) * 0.03, 14, 36); // raggio delle curve a fine riga
    rows.forEach((row, ri) => {
      const y = lineTop + row.top - 2;
      const fromRight = ri % 2 === 0; // la prima riga arriva da destra
      if (ri > 0) { // curva morbida verso la riga successiva
        const prevY = lineTop + rows[ri - 1].top - 2;
        const x = fromRight ? right + bend : left - bend;
        pts.push([x, prevY + (y - prevY) * 0.5]);
      }
      const n = Math.max(6, Math.round((right - left) / 50));
      for (let k = 0; k <= n; k++) {
        const t = fromRight ? 1 - k / n : k / n;
        pts.push([left + (right - left) * t, y + 4 * t * (1 - t) * sag]);
      }
      // abbassa ogni foto sulla curva
      row.items.forEach((ph) => {
        const cx = lr.left - mainRect.left + ph.offsetLeft + ph.offsetWidth / 2;
        const t = clamp((cx - left) / (right - left), 0, 1);
        ph.style.setProperty('--sag', `${(4 * t * (1 - t) * sag).toFixed(1)}px`);
      });
    });
    // uscita: scende lungo il lato dove finisce l'ultima riga
    const last = rows[rows.length - 1];
    const endsRight = (rows.length - 1) % 2 === 1;
    const lastBottom = lineTop + last.top + Math.max(...last.items.map((ph) => ph.offsetHeight));
    pts.push([endsRight ? right + bend : left - bend, lastBottom + 60]);
    return pts;
  }

  /* ------------------------------------------------------------------
     IL NASTRO AZZURRO, con la fede che ci scorre sopra
     ------------------------------------------------------------------ */
  function ribbon() {
    const main = $('#main');
    const svg = $('#ribbon');
    const paths = ['#ribbonShadow', '#ribbonEdge', '#ribbonBase', '#ribbonSheen'].map((s) => $(s));
    const rings = [$('#ringBack'), $('#ringFront')];
    let xs = [], ys = [], ls = [], maxY = [], total = 1, drawn = 0, target = 0, ready = false, tipPos = null, angle = 0, lastOff = '', lastTr = '', mainTop = 0, docH = 0;

    function collect() {
      const mr = main.getBoundingClientRect();
      const pts = [];
      $$('[data-thread], [data-thread-gallery]').forEach((el) => {
        if (el.hasAttribute('data-thread-gallery')) return pts.push(...galleryPoints(el, mr));
        const r = el.getBoundingClientRect();
        el.dataset.thread.split(';').forEach((p) => {
          const [fx, fy] = p.split(',').map(Number);
          pts.push([r.left - mr.left + fx * r.width, r.top - mr.top + fy * r.height]);
        });
      });
      return pts;
    }

    function build() {
      const pts = collect();
      if (pts.length < 2) return;
      const H = main.offsetHeight;
      // misure lette una volta sola qui (e a ogni ridimensionamento), non a ogni fotogramma
      mainTop = main.getBoundingClientRect().top + scrollY;
      docH = document.documentElement.scrollHeight;
      svg.setAttribute('height', H);
      svg.setAttribute('width', main.clientWidth);
      svg.style.height = H + 'px';

      // Catmull-Rom → Bézier, campionando la lunghezza
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      xs = [pts[0][0]]; ys = [pts[0][1]]; ls = [0];
      let len = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
        const steps = 14;
        for (let s = 1; s <= steps; s++) {
          const t = s / steps, u = 1 - t;
          const x = u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0];
          const y = u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1];
          len += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
          xs.push(x); ys.push(y); ls.push(len);
        }
      }
      total = len;
      maxY = [];
      ys.reduce((m, y, i) => (maxY[i] = Math.max(m, y)), -Infinity);

      // il nastro si "srotola" con un tratteggio lungo quanto tutto il percorso
      // (più leggero di una maschera: il telefono non deve ridipingere tutta la pagina)
      paths.forEach((p) => {
        p.setAttribute('d', d);
        p.setAttribute('pathLength', total.toFixed(1));
        p.style.strokeDasharray = `${total} ${total + 10}`;
      });
      lastOff = '';
      ready = true;
      update(true);
    }

    function targetFor() {
      if (FY + innerHeight >= docH - 4) return total;
      // la fede sta in basso nello schermo
      const tipY = FY + innerHeight * 0.74 - mainTop;
      // primo campione oltre la "linea di lettura"
      let lo = 0, hi = maxY.length - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (maxY[m] > tipY) hi = m; else lo = m + 1; }
      return ls[lo];
    }

    function indexAt(l) {
      let lo = 0, hi = ls.length - 1;
      while (lo < hi) { const m = (lo + hi) >> 1; if (ls[m] >= l) hi = m; else lo = m + 1; }
      return lo;
    }

    function update(snap) {
      if (!ready || !document.body.classList.contains('is-open')) return false;
      target = reduced ? total : targetFor();
      drawn = snap === true && reduced ? target : drawn + (target - drawn) * 0.16;
      if (Math.abs(target - drawn) < .5) drawn = target;
      const off = (total - drawn).toFixed(1);
      if (off === lastOff) return false; // fermo: niente da ridisegnare
      lastOff = off;
      paths.forEach((p) => (p.style.strokeDashoffset = off));
      const i = indexAt(drawn);
      const a = xs[Math.max(0, i - 2)], b = xs[Math.min(xs.length - 1, i + 2)];
      const c = ys[Math.max(0, i - 2)], e = ys[Math.min(ys.length - 1, i + 2)];
      // la fede si gira seguendo il nastro (con un po' di ritardo, così non trema)
      let goal = Math.atan2(e - c, b - a) * 180 / Math.PI;
      while (goal - angle > 180) goal -= 360;
      while (goal - angle < -180) goal += 360;
      angle += (goal - angle) * 0.2;
      const tr = `translate(${xs[i].toFixed(1)} ${ys[i].toFixed(1)}) rotate(${angle.toFixed(1)}) scale(1.35)`;
      if (tr !== lastTr) { lastTr = tr; rings.forEach((r) => r.setAttribute('transform', tr)); }
      tipPos = [xs[i], ys[i]];
      document.body.classList.toggle('is-threaded-end', drawn > total - 2);
      return true;
    }

    let t;
    const schedule = () => { clearTimeout(t); t = setTimeout(() => { build(); wake(); }, 120); };
    new ResizeObserver(schedule).observe(main);
    addEventListener('resize', schedule);
    document.fonts && document.fonts.ready.then(schedule);
    return { build, update, tip: () => tipPos, docH: () => docH || document.documentElement.scrollHeight };
  }

  /* ------------------------------------------------------------------
     Petali (al posto del riso) e cuoricini
     ------------------------------------------------------------------ */
  const Petals = (() => {
    const cvs = $('#petals');
    const ctx = cvs.getContext('2d');
    let parts = [], running = false, dpr = 1;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      cvs.width = innerWidth * dpr; cvs.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    addEventListener('resize', resize); resize();

    const heart = (s) => {
      ctx.beginPath();
      ctx.moveTo(0, s * .35);
      ctx.bezierCurveTo(-s * 1.1, -s * .4, -s * .45, -s * 1.1, 0, -s * .45);
      ctx.bezierCurveTo(s * .45, -s * 1.1, s * 1.1, -s * .4, 0, s * .35);
      ctx.fill();
    };

    const loop = (t) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.y < innerHeight + 30 && p.y > -200 && p.life-- > 0);
      for (const p of parts) {
        p.vy += p.g; p.vx *= 0.985; p.vy *= p.heart ? 0.97 : 0.985;
        p.x += p.vx + (p.heart ? 0 : Math.sin(t / 300 + p.ph) * .6); p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.shadowColor = 'rgba(61,79,102,.25)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
        if (p.heart) heart(p.s);
        else { ctx.scale(1, .5 + .5 * Math.abs(Math.sin(t / 220 + p.ph))); drawPetal(ctx, p.s); }
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); cvs.hidden = true; }
    };
    // a riposo il canvas resta nascosto, così il telefono non lo ricompone a ogni scroll
    const start = () => { if (!running) { running = true; cvs.hidden = false; requestAnimationFrame(loop); } };

    const burst = (x, y, n = 150, extra = {}) => {
      if (reduced) return;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - .5) * (extra.spread || 2.2);
        const sp = 6 + Math.random() * (extra.power || 12);
        parts.push({
          // rain: petali che cadono dall'alto su tutto lo schermo (lancio "scuotendo" il telefono)
          x: extra.rain ? Math.random() * innerWidth : x + (Math.random() - .5) * 30,
          y: extra.rain ? -10 - Math.random() * 80 : y + (Math.random() - .5) * 20,
          vx: extra.rain ? (Math.random() - .5) * 3 : Math.cos(a) * sp,
          vy: extra.rain ? 1 + Math.random() * 3 : Math.sin(a) * sp,
          g: .16, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .25, ph: Math.random() * 6.28,
          s: 4 + Math.random() * 4,
          c: Math.random() < .06 ? '#d4b27a' : PETAL_COLORS[i % PETAL_COLORS.length],
          life: 320,
        });
      }
      start();
    };
    burst.hearts = (x, y, n = 8) => {
      if (reduced) return;
      for (let i = 0; i < n; i++) {
        parts.push({
          x: x + (Math.random() - .5) * 40, y: y + (Math.random() - .5) * 10,
          vx: (Math.random() - .5) * 2.4, vy: -2 - Math.random() * 2.5,
          g: -.02, rot: (Math.random() - .5) * .5, vr: (Math.random() - .5) * .02, ph: 0,
          s: 7 + Math.random() * 6, heart: true,
          c: Math.random() < .5 ? RIBBON : '#e8a5b0',
          life: 70 + Math.random() * 30,
        });
      }
      start();
    };
    return burst;
  })();

  /* ------------------------------------------------------------------
     4. Il riporto: tre lanci, tre medagliette (giorno, mese, luogo)
     ------------------------------------------------------------------ */
  function fetchGame(onWin) {
    const section = $('#data');
    const paddock = $('#paddock');
    const ball = $('#ball');
    const hint = $('#paddockHint');
    const tags = $$('[data-tag]');
    const runners = [$('#runner0'), $('#runner1')];
    runners.forEach((r, i) => {
      if (DOGS[i]) r.innerHTML = dogRun(DOGS[i]);
      else r.remove();
    });
    const team = runners.filter((r) => r.isConnected);
    let throws = 0, busy = false, won = false;

    const flip = (i) => {
      const tag = tags[i];
      if (tag.classList.contains('is-flipped')) return;
      tag.classList.add('is-flipped');
      const r = tag.getBoundingClientRect();
      Petals(r.left + r.width / 2, r.top + r.height / 2, 26, { power: 6, spread: 3 });
      if (tags.every((t) => t.classList.contains('is-flipped'))) setTimeout(win, 650);
    };

    function win() {
      if (won) return;
      won = true;
      section.classList.add('is-won');
      paddock.classList.add('is-done');
      hint.textContent = 'Bravi tutti! Adesso sapete dove trovarci.';
      const r = $('#win').getBoundingClientRect();
      Petals(innerWidth * .2, Math.min(innerHeight * .8, r.top + 60), 120);
      Petals(innerWidth * .8, Math.min(innerHeight * .8, r.top + 60), 120);
      navigator.vibrate && navigator.vibrate([30, 60, 30, 60, 80]);
      $('#revealAll').hidden = true;
      team.forEach((r) => r.classList.add('is-happy'));
      onWin();
    }

    // la medaglietta vola dalla bocca del cane al suo posto
    async function deliver(runner, i) {
      const carry = $('.dog__carry', runner);
      const from = carry.getBoundingClientRect();
      carry.innerHTML = '';
      const to = tags[i].getBoundingClientRect();
      const fly = document.createElement('span');
      fly.className = 'flytag';
      document.body.appendChild(fly);
      const x0 = from.left + from.width / 2, y0 = from.top + from.height / 2;
      const x1 = to.left + to.width / 2, y1 = to.top + to.height / 2;
      await fly.animate([
        { transform: `translate(${x0}px, ${y0}px) scale(.5)` },
        { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 80}px) scale(1.4) rotate(200deg)`, offset: .55 },
        { transform: `translate(${x1}px, ${y1}px) scale(1) rotate(360deg)` },
      ], { duration: 850, easing: 'cubic-bezier(.4,0,.2,1)' }).finished;
      fly.remove();
      flip(i);
    }

    async function throwBall() {
      if (busy || won || throws >= tags.length) return;
      busy = true;
      paddock.classList.add('is-playing');
      const i = throws++;
      const dogs = i === 2 ? team : [team[i % team.length]]; // il terzo lancio: corrono insieme
      const pw = paddock.clientWidth;
      if (reduced) { flip(i); busy = false; return; }

      // la pallina vola via oltre il bordo
      const bx = ball.offsetLeft, by = ball.offsetTop;
      const far = pw - bx + 60, hgt = paddock.clientHeight * .55;
      const frames = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        return { transform: `translate(${(far * t).toFixed(1)}px, ${(-hgt * 4 * t * (1 - t)).toFixed(1)}px) rotate(${t * 720}deg)` };
      });
      ball.animate(frames, { duration: 900, easing: 'cubic-bezier(.25,.6,.5,1)', fill: 'forwards' });
      hint.textContent = i === 2 ? 'Tutti e due!' : `Vai ${dogName(i % team.length)}!`;

      await wait(140);
      // corsa d'andata
      await Promise.all(dogs.map((r, k) => {
        r.classList.add('is-running');
        const dist = pw - r.offsetLeft + 40;
        return r.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dist}px)` }],
          { duration: 1050 + k * 120, easing: 'cubic-bezier(.5,0,.8,.6)', fill: 'forwards' }).finished;
      }));
      await wait(380); // fuori campo: stanno cercando la pallina…

      // ritorno con la medaglietta in bocca (e la pallina, se sono in due)
      dogs.forEach((r, k) => {
        r.classList.add('is-back');
        $('.dog__carry', r).innerHTML = k === 0 ? TAG : BALL;
      });
      await Promise.all(dogs.map((r, k) => {
        const dist = pw - r.offsetLeft + 40;
        return r.animate([{ transform: `translateX(${dist}px)` }, { transform: 'translateX(0)' }],
          { duration: 1150 + k * 160, easing: 'cubic-bezier(.2,.5,.3,1)', fill: 'forwards' }).finished;
      }));
      dogs.forEach((r) => { r.classList.remove('is-running', 'is-back'); r.classList.add('is-happy'); });
      setTimeout(() => dogs.forEach((r) => !won && r.classList.remove('is-happy')), 1400);
      await deliver(dogs[0], i);
      dogs.forEach((r) => ($('.dog__carry', r).innerHTML = ''));

      // la pallina torna al suo posto per il prossimo lancio
      ball.getAnimations().forEach((a) => a.cancel());
      if (throws < tags.length) {
        ball.animate([{ opacity: 0, transform: 'translateY(-30px) scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        hint.textContent = throws === 1 ? 'Ancora! Manca il mese…' : 'L’ultimo lancio: dove?';
      }
      busy = false;
    }

    // trascina indietro la pallina come una fionda (o semplicemente toccala)
    let drag = null;
    ball.addEventListener('pointerdown', (e) => {
      if (busy || won) return;
      drag = { x: e.clientX, y: e.clientY };
      ball.setPointerCapture(e.pointerId);
    });
    ball.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = clamp(e.clientX - drag.x, -60, 20), dy = clamp(e.clientY - drag.y, -20, 40);
      ball.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    const releaseBall = () => {
      if (!drag) return;
      drag = null;
      ball.style.transform = '';
      throwBall();
    };
    ball.addEventListener('pointerup', releaseBall);
    ball.addEventListener('pointercancel', () => { drag = null; ball.style.transform = ''; });
    ball.addEventListener('click', (e) => { if (e.detail === 0) throwBall(); }); // tastiera

    $('#revealAll').addEventListener('click', () => {
      throws = tags.length;
      tags.forEach((_, i) => setTimeout(() => flip(i), i * 300));
    });
  }

  /* ------------------------------------------------------------------
     5. Countdown + calendario
     ------------------------------------------------------------------ */
  function countdown() {
    const els = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
    const dogLine = $('#cdDog');
    const names = DOGS.map((c) => c.nome).filter(Boolean);
    const who = names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : names[0];
    const tick = () => {
      let diff = Math.max(0, weddingDate - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      els.d.textContent = d;
      els.h.textContent = String(h).padStart(2, '0');
      els.m.textContent = String(m).padStart(2, '0');
      els.s.textContent = String(s).padStart(2, '0');
      // il tempo dei cani scorre sette volte più in fretta
      if (who && d > 0) dogLine.innerHTML = `Per ${esc(who)}, in tempo-cane, sono <strong>${(d * 7).toLocaleString('it-IT')}</strong> giorni di attesa.`;
    };
    tick(); setInterval(tick, 1000);
    if (weddingDate < Date.now()) { $('.countdown .kicker').textContent = 'Sposi!'; dogLine.textContent = ''; }
  }

  function calendar() {
    const start = weddingDate;
    const end = new Date(start.getTime() + (W.durataOre || 8) * 36e5);
    const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    // senza orario: evento di tutto il giorno
    const day = W.data.replace(/-/g, '');
    const [y, m, d] = W.data.split('-').map(Number);
    const nextDay = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '');
    const gDates = hasTime ? `${stamp(start)}/${stamp(end)}` : `${day}/${nextDay}`;
    const icsDates = hasTime ? [`DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`] : [`DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDay}`];
    const title = `Matrimonio di ${W.lei} & ${W.lui}`;
    const place = `${W.luogo.nome}, ${W.luogo.indirizzo}`;
    const details = `Save the date! Conferma la tua presenza su ${location.href.split('#')[0]}`;

    $('#gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(title)}&dates=${gDates}`
      + `&details=${encodeURIComponent(details)}&location=${encodeURIComponent(place)}`;

    $('#ics').addEventListener('click', () => {
      const e = (s) => s.replace(/([,;\\])/g, '\\$1');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Enrica e Andrea//Save the date//IT', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${stamp(start)}-matrimonio@enrica-andrea`,
        `DTSTAMP:${stamp(new Date())}`,
        ...icsDates,
        `SUMMARY:${e(title)}`, `LOCATION:${e(place)}`, `DESCRIPTION:${e(details)}`,
        'BEGIN:VALARM', 'TRIGGER:-P7D', 'ACTION:DISPLAY', `DESCRIPTION:${e(title)}`, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      a.download = `matrimonio-${W.lei}-${W.lui}.ics`.toLowerCase();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  }

  /* ------------------------------------------------------------------
     6. RSVP: la coccarda, poi passa il cane postino a ritirare la lettera
     ------------------------------------------------------------------ */
  function rsvp() {
    const form = $('#rsvpForm');
    const ifYes = $('#ifYes');
    const err = $('#rsvpError');
    const btn = $('#rsvpSend');
    const done = $('#rsvpDone');
    const courier = $('#courier');
    const KEY = 'ea-rsvp';
    if (DOGS[0]) courier.innerHTML = dogRun(DOGS[0]);

    try { if (localStorage.getItem(KEY)) $('#rsvpAlready').hidden = false; } catch (_) { /* niente storage */ }

    form.addEventListener('change', (e) => {
      if (e.target.name === 'partecipa') ifYes.classList.toggle('is-open', e.target.value === 'si');
      if (e.target.closest('.field')) e.target.closest('.field').classList.remove('is-invalid');
    });
    form.addEventListener('input', (e) => e.target.closest('.field') && e.target.closest('.field').classList.remove('is-invalid'));

    const showError = (msg) => { err.textContent = msg; err.hidden = false; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.hidden = true;
      const fd = new FormData(form);
      if (fd.get('_gotcha')) return;

      const answer = fd.get('partecipa');
      let ok = true;
      if (!answer) { showError('Prima di tutto: ci sarai o no? Scegli una delle due risposte.'); ok = false; }
      ['nome', 'contatto'].forEach((n) => {
        if (!String(fd.get(n) || '').trim()) { form.elements[n].closest('.field').classList.add('is-invalid'); ok = false; }
      });
      if (!ok) { if (err.hidden) showError('Mancano nome e contatto.'); return; }

      const payload = {
        partecipa: answer === 'si' ? 'Sì' : 'No',
        nome: fd.get('nome').trim(),
        contatto: fd.get('contatto').trim(),
        allergie: answer === 'si' ? fd.get('allergie') : '',
        messaggio: fd.get('messaggio'),
        inviato: new Date().toLocaleString('it-IT', { timeZone: TZ }),
      };

      btn.disabled = true;
      btn.textContent = 'Consegna in corso…';
      try {
        if (W.rsvp.endpoint) {
          const gas = /script\.google(usercontent)?\.com/.test(W.rsvp.endpoint);
          const res = await fetch(W.rsvp.endpoint, {
            method: 'POST',
            mode: gas ? 'no-cors' : 'cors',
            headers: gas ? undefined : { Accept: 'application/json' },
            body: new URLSearchParams(payload),
          });
          if (!gas && !res.ok) throw new Error('HTTP ' + res.status);
        } else if (W.rsvp.email) {
          const body = Object.entries(payload).map(([k, v]) => `${k}: ${v || '-'}`).join('\n');
          location.href = `mailto:${W.rsvp.email}?subject=${encodeURIComponent(`RSVP ${W.lei} & ${W.lui} — ${payload.nome}`)}&body=${encodeURIComponent(body)}`;
        } else {
          console.warn('[RSVP] Nessun endpoint configurato in assets/js/config.js — risposta non inviata:', payload);
        }
        try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch (_) { /* ok */ }
        sent(answer === 'si', payload.nome.split(' ')[0]);
      } catch (ex) {
        console.error(ex);
        showError('Ops, il postino si è distratto con una pallina. Riprova tra un attimo o scrivici direttamente.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Consegna la risposta';
      }
    });

    async function sent(yes, nome) {
      form.classList.add('is-sent');
      navigator.vibrate && navigator.vibrate(40);
      await wait(reduced ? 0 : 1300);

      if (!reduced && DOGS[0]) {
        // la lettera si piega, arriva il cane, la prende in bocca e scappa via
        const sec = $('#rsvp');
        const sw = sec.clientWidth;
        const cw = courier.offsetWidth;
        const stopX = (sw - cw) / 2 + cw * .12;
        courier.style.top = `${form.offsetTop + form.offsetHeight / 2 - courier.offsetHeight * .55}px`;
        courier.classList.add('is-on', 'is-running', 'is-back');
        form.classList.add('is-folding');
        await courier.animate([{ transform: `translateX(${sw + 20}px)` }, { transform: `translateX(${stopX}px)` }],
          { duration: 1000, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' }).finished;
        courier.classList.remove('is-running');
        $('.dog__carry', courier).innerHTML = LETTER;
        form.classList.add('is-taken');
        await wait(450);
        courier.classList.add('is-running');
        await courier.animate([{ transform: `translateX(${stopX}px)` }, { transform: `translateX(${-cw - 40}px)` }],
          { duration: 1100, easing: 'cubic-bezier(.5,0,.8,.5)', fill: 'forwards' }).finished;
        courier.getAnimations().forEach((a) => a.cancel());
        courier.classList.remove('is-on', 'is-running', 'is-back');
        $('.dog__carry', courier).innerHTML = '';
      }

      done.style.minHeight = form.offsetHeight + 'px'; // il nastro non cambia strada
      form.hidden = true;
      form.classList.remove('is-sent', 'is-folding', 'is-taken');
      $('#rsvpDoneBig').textContent = yes ? 'Evviva!' : 'Ci mancherai';
      const postino = dogName(0);
      $('#rsvpDoneText').textContent = yes
        ? `Grazie ${nome}! ${postino ? postino + ' ha consegnato la tua risposta: ' : ''}ci vediamo il ${fmt({ day: 'numeric', month: 'long' })}.`
        : `Grazie ${nome} per avercelo fatto sapere. Brinderemo anche alla tua salute!`;
      done.hidden = false;
      $('#rsvpShake').hidden = !yes;
      if (yes) {
        const r = done.getBoundingClientRect();
        Petals(innerWidth * .25, r.top + 40, 110);
        Petals(innerWidth * .75, r.top + 40, 110);
      }
    }

    $('#rsvpAgain').addEventListener('click', () => {
      done.hidden = true;
      form.hidden = false;
      $('#rsvpAlready').hidden = false;
      form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------------
     7. Finale: la fede arriva nella scatolina e il nastro raggiunge i cani
     ------------------------------------------------------------------ */
  function finale() {
    const scene = $('#finaleScene');
    [0, 1].forEach((i) => { if (DOGS[i]) $(`#finaleDog${i}`).innerHTML = dogSit(DOGS[i]); });
    let arrived = false;
    const arrive = () => {
      if (arrived) return;
      arrived = true;
      scene.classList.add('is-arrived');
      setTimeout(() => {
        const r = $('#ringBox').getBoundingClientRect();
        Petals.hearts(r.left + r.width / 2, r.top + r.height * .3, 12);
      }, 900);
    };
    // nel caso il fondo pagina sia troppo corto per far arrivare la fede, basta vederla
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting && reduced) { arrive(); obs.disconnect(); }
    }, { threshold: .9 }).observe(scene);
    return () => { if (!arrived && document.body.classList.contains('is-threaded-end')) arrive(); };
  }

  /* ------------------------------------------------------------------
     Guida a scendere: pulsante "Scorri" e prima discesa automatica
     ------------------------------------------------------------------ */
  function guide(R) {
    const btn = $('#guide');
    const stops = ['#cani', '#foto', '#data', '#countdown', '#rsvp', '#fine'].map((s) => $(s));
    const top = (el) => el.getBoundingClientRect().top + scrollY;

    btn.addEventListener('click', () => {
      const next = stops.find((el) => top(el) > scrollY + 40);
      if (!next) return;
      const dist = Math.abs(top(next) - scrollY);
      Glide.to(top(next) - 8, clamp(dist * 1.1, 900, 2200));
    });

    // mentre si gioca col riporto il pulsante coprirebbe il prato
    let playing = false;
    const paddock = $('#paddock');
    new IntersectionObserver(([e]) => (playing = e.isIntersecting)).observe(paddock);

    let typing = false;
    document.addEventListener('focusin', (e) => (typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)));
    document.addEventListener('focusout', () => (typing = false));

    const update = () => {
      const open = document.body.classList.contains('is-open');
      const idle = idleFor() > 1500 && !Glide.active;
      const nearEnd = FY + innerHeight > R.docH() - innerHeight * 0.5;
      btn.classList.toggle('is-visible', open && (idle || FY < 10) && !nearEnd && !typing && !(playing && !paddock.classList.contains('is-done')));
      document.body.classList.toggle('is-idle', open && idle && !nearEnd);
    };

    // La prima volta, se nessuno scorre, il sito scende da solo seguendo il nastro fino ai cani
    const autoStart = () => {
      setTimeout(() => {
        if (scrollY < 5 && !Glide.active) Glide.to(top(stops[0]) - 8, 2600);
      }, 3400);
    };
    return { update, autoStart };
  }

  /* ------------------------------------------------------------------
     Scuoti il telefono per lanciare i petali
     ------------------------------------------------------------------ */
  function shake() {
    const btns = $$('.js-shake');
    const touch = matchMedia('(pointer: coarse)').matches;
    const label = (t) => btns.forEach((b) => ($('.js-shake-label', b).textContent = t));
    if (!touch) label('Clicca qui per lanciare i petali');

    let listening = false, prev = null, last = 0;
    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a || a.x == null) return;
      if (prev) {
        const d = Math.abs(a.x - prev.x) + Math.abs(a.y - prev.y) + Math.abs(a.z - prev.z);
        const now = performance.now();
        if (d > 16 && now - last > 200) { last = now; Petals(0, 0, Math.min(200, 30 + d * 3), { rain: true }); }
      }
      prev = { x: a.x, y: a.y, z: a.z };
    };
    const listen = () => { if (!listening) { listening = true; addEventListener('devicemotion', onMotion); } };
    const needsPermission = typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function';
    if (touch && !needsPermission && 'DeviceMotionEvent' in window) listen(); // Android: niente permesso da chiedere

    btns.forEach((b) => b.addEventListener('click', async () => {
      Petals(0, 0, 150, { rain: true });
      if (!touch) return;
      try {
        if (needsPermission && (await DeviceMotionEvent.requestPermission()) === 'granted') listen();
      } catch (_) { /* permesso negato: resta il tocco */ }
      if (listening) label('Scuoti ancora!');
    }));
  }

  /* ------------------------------------------------------------------
     Caccia agli ossi: tre nascondigli, un messaggio segreto dai cani
     ------------------------------------------------------------------ */
  function bones() {
    const KEY = 'ea-ossi';
    const TOTAL = 3;
    const toast = $('#toast');
    const secret = $('#secret');
    let found = new Set();
    try { found = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (_) { /* ok */ }
    let toastTimer = 0;

    $('#secretDogs').innerHTML = DOGS.slice(0, 2).map((c) => dogSit(c)).join('');
    $('#secretText').textContent = (W.ossi && W.ossi.messaggio) || '';
    $('#secretPrize').textContent = (W.ossi && W.ossi.premio) || '';

    const showToast = (msg) => {
      toast.textContent = msg;
      toast.hidden = false;
      toast.classList.remove('is-in'); void toast.offsetWidth; toast.classList.add('is-in');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-in'), 2600);
    };
    const openSecret = () => {
      secret.hidden = false;
      requestAnimationFrame(() => secret.classList.add('is-open'));
      $('#secretClose').focus({ preventScroll: true });
      Petals(innerWidth / 2, innerHeight * .6, 160);
    };
    const closeSecret = () => {
      secret.classList.remove('is-open');
      setTimeout(() => (secret.hidden = true), 400);
    };
    $('#secretClose').addEventListener('click', closeSecret);
    secret.addEventListener('click', (e) => { if (e.target === secret) closeSecret(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !secret.hidden) closeSecret(); });

    $$('[data-bone]').forEach((bone) => {
      const id = bone.dataset.bone;
      if (found.has(id)) bone.classList.add('is-found');
      // non far partire la pallina né dondolare la foto
      bone.addEventListener('keydown', (e) => e.stopPropagation());
      bone.addEventListener('pointerdown', (e) => e.stopPropagation());
      bone.addEventListener('click', (e) => {
        e.stopPropagation();
        bone.classList.remove('is-pop'); void bone.offsetWidth; bone.classList.add('is-pop', 'is-found');
        const isNew = !found.has(id);
        found.add(id);
        try { localStorage.setItem(KEY, JSON.stringify([...found])); } catch (_) { /* ok */ }
        navigator.vibrate && navigator.vibrate(25);
        if (found.size >= TOTAL) {
          showToast(isNew ? 'Osso trovato: 3 di 3!' : 'Hai già trovato tutti gli ossi');
          setTimeout(openSecret, isNew ? 900 : 300);
        } else {
          showToast(isNew
            ? `Osso trovato: ${found.size} di ${TOTAL}. Dove saranno gli altri?`
            : `Questo l'hai già scovato: ${found.size} di ${TOTAL}`);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Comparse allo scroll
     ------------------------------------------------------------------ */
  /* Le animazioni continue (code che scodinzolano, pallina che rimbalza) si fermano fuori schermo */
  function pauseOffscreen() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting)));
    $$('.paddock, .finale__scene, .pups__cards, .courier').forEach((el) => io.observe(el));
  }

  function reveals() {
    const targets = [...$$('.section-head, .pup, .tags, .field-wrap, .letter, .cd, .finale__names')];
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     Avvio
     ------------------------------------------------------------------ */
  /* L'altezza della prima schermata si fissa una volta sola: sui telefoni la barra
     del browser compare e scompare scorrendo e farebbe sobbalzare tutta la pagina. */
  function lockHeroHeight() {
    const hero = $('.hero');
    let lastW = 0;
    const lock = () => {
      if (innerWidth === lastW) return; // cambia solo l'altezza: è la barra del browser
      lastW = innerWidth;
      hero.style.minHeight = innerHeight + 'px';
    };
    lock();
    addEventListener('resize', lock);
  }

  function init() {
    lockHeroHeight();
    bindConfig();
    splitLetters();
    pups();
    const eyes = eyesFollow();
    const swayUpdate = gallery();
    const R = ribbon();
    const G = guide(R);
    drift();
    fetchGame(() => $('#countdown').classList.remove('is-locked'));
    countdown();
    calendar();
    rsvp();
    const finaleUpdate = finale();
    reveals();
    pauseOffscreen();
    shake();
    bones();

    // prima le letture, poi le scritture: così il browser non ricalcola il layout a metà fotogramma
    // quando per un po' non si muove nulla il ciclo si ferma (la batteria ringrazia)
    // e riparte appena si scorre, si tocca o cambia la pagina
    let raf = 0, quiet = 0, prevY = -1, idleTimer = 0;
    const loop = () => {
      raf = 0;
      FY = scrollY;
      eyes();
      const ribbonBusy = R.update();
      G.update();
      finaleUpdate();
      const swayBusy = swayUpdate();
      quiet = ribbonBusy || swayBusy || FY !== prevY ? 0 : quiet + 1;
      prevY = FY;
      if (quiet < 20) raf = requestAnimationFrame(loop);
      else { clearTimeout(idleTimer); idleTimer = setTimeout(G.update, 1600); } // per far comparire "Scorri"
    };
    wake = () => { quiet = 0; if (!raf && document.body.classList.contains('is-open')) raf = requestAnimationFrame(loop); };
    ['scroll', 'pointermove', 'pointerdown', 'resize', 'keydown'].forEach((ev) => addEventListener(ev, wake, { passive: true }));

    intro(() => {
      R.build();
      wake();
      G.autoStart();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
