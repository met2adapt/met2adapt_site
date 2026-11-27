// MetaFun page: (1) wave in a mass-spring chain with optional local resonators,
// (2) rotatable 3D lattice unit cells, (3) quiz. No external libraries.
(function () {
  'use strict';
  const css = getComputedStyle(document.documentElement);
  const C = {
    primary: (css.getPropertyValue('--primary') || '#003A70').trim(),
    dark: (css.getPropertyValue('--primary-dark') || '#00264D').trim(),
    accent: '#C69214', accent2: '#E0A91C', line: '#c9d3df', muted: '#7a8796'
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fitCanvas(cv) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight || parseInt(cv.getAttribute('height'), 10);
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  /* ------------------------------------------------------------------ */
  /* 1. Wave in a chain of masses, with optional local resonators        */
  /* Steady-state harmonic response, solved exactly for each frequency.  */
  /* ------------------------------------------------------------------ */
  (function wave() {
    const cv = document.getElementById('wave-canvas'); if (!cv) return;
    const spec = document.getElementById('wave-spectrum');
    const metaBox = document.getElementById('wave-meta');
    const freq = document.getElementById('wave-freq');
    const freqOut = document.getElementById('wave-freq-out');
    const playBtn = document.getElementById('wave-play');
    const transOut = document.getElementById('wave-trans');

    const N = 20;                 // masses
    const m = 1, k = 1, c = 0.002;            // chain (normalised: sqrt(k/m) = 1)
    const mr = 0.6, wr = 0.8, kr = mr * wr * wr, cr = 2 * 0.02 * Math.sqrt(kr * mr); // resonators
    const R0 = 6, R1 = 15;                    // masses carrying resonators: the meta-material section
    const isRes = (j) => j >= R0 && j <= R1;
    // complex helpers: [re, im]
    const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
    const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
    const abs = (a) => Math.hypot(a[0], a[1]);

    // resonator transfer: V = U * (kr + i w cr) / (kr + i w cr - mr w^2)
    function resTransfer(w) { const num = [kr, w * cr]; return div(num, [kr - mr * w * w, w * cr]); }

    // Solve the tridiagonal system for U_1..U_N with U_0 = 1 (driver).
    // The far end is perfectly absorbing (an infinite plain chain continues to the right),
    // so without resonators the wave passes at 100 % at every frequency.
    function solve(w, meta) {
      const mres = mul([mr, 0], resTransfer(w));
      const diag = (j) => {
        let meff = [m, 0]; if (meta && isRes(j)) meff = add(meff, mres);
        return sub([2 * k, w * c], mul([w * w, 0], meff));
      };
      const cq = 1 - m * w * w / (2 * k), q = Math.acos(Math.max(-1, Math.min(1, cq)));
      const absorb = [k * Math.cos(q), -k * Math.sin(q)];          // k e^{-iq}
      const a = -k, cc = -k;
      const cp = new Array(N), dp = new Array(N);
      let b = diag(0); if (N === 1) b = sub(b, absorb);
      cp[0] = div([cc, 0], b); dp[0] = div([k, 0], b);
      for (let i = 1; i < N; i++) {
        b = diag(i); if (i === N - 1) b = sub(b, absorb);
        const den = sub(b, mul([a, 0], cp[i - 1]));
        cp[i] = i < N - 1 ? div([cc, 0], den) : [0, 0];
        dp[i] = div(sub([0, 0], mul([a, 0], dp[i - 1])), den);
      }
      const U = new Array(N); U[N - 1] = dp[N - 1];
      for (let i = N - 2; i >= 0; i--) U[i] = sub(dp[i], mul(cp[i], U[i + 1]));
      const V = meta ? U.map((u, j) => isRes(j) ? mul(u, resTransfer(w)) : null) : null;
      return { U, V, T: abs(U[N - 1]) };
    }

    // spectrum (precomputed)
    const W0 = parseFloat(freq.min), W1 = parseFloat(freq.max), NS = 260;
    const ws = [], tPlain = [], tMeta = [];
    for (let i = 0; i < NS; i++) {
      const w = W0 + (W1 - W0) * i / (NS - 1); ws.push(w);
      tPlain.push(solve(w, false).T); tMeta.push(solve(w, true).T);
    }
    // band gap: frequencies where the meta-material transmits < 10 % while the plain chain does not
    const gap = []; let inGap = false, g0 = 0;
    for (let i = 0; i < NS; i++) {
      const g = tMeta[i] < 0.1;
      if (g && !inGap) { inGap = true; g0 = ws[i]; }
      if (!g && inGap) { inGap = false; gap.push([g0, ws[i]]); }
    }
    if (inGap) gap.push([g0, W1]);

    let state = null;
    function update() {
      const w = parseFloat(freq.value);
      freqOut.textContent = w.toFixed(2);
      state = solve(w, metaBox.checked);
      transOut.textContent = Math.round(Math.min(state.T, 1) * 100) + '%';
      transOut.classList.toggle('is-low', state.T < 0.15);
      drawSpectrum();
    }

    function drawSpectrum() {
      const { ctx, w: W, h: H } = fitCanvas(spec);
      const L = 40, R = 10, T = 10, B = 26, pw = W - L - R, ph = H - T - B;
      const X = (w) => L + (w - W0) / (W1 - W0) * pw;
      const Y = (t) => T + ph - Math.min(t, 1.2) / 1.2 * ph;
      ctx.clearRect(0, 0, W, H);
      gap.forEach(([a, b]) => { ctx.fillStyle = 'rgba(198,146,20,0.15)'; ctx.fillRect(X(a), T, X(b) - X(a), ph); });
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, T + ph); ctx.lineTo(L + pw, T + ph); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.font = '11px "Open Sans", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('frequency', L + pw / 2, H - 6);
      ctx.save(); ctx.translate(12, T + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('wave passing', 0, 0); ctx.restore();
      function curve(arr, col, wid) { ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.beginPath(); arr.forEach((t, i) => { const x = X(ws[i]), y = Y(t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
      curve(tPlain, '#9aa9bb', 2); curve(tMeta, C.accent, 2.5);
      const xw = X(parseFloat(freq.value));
      ctx.strokeStyle = C.dark; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(xw, T); ctx.lineTo(xw, T + ph); ctx.stroke(); ctx.setLineDash([]);
    }

    function zigzag(ctx, x1, y1, x2, y2, n, amp) {
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, px = -uy, py = ux;
      ctx.beginPath(); ctx.moveTo(x1, y1);
      const lead = Math.min(6, len * 0.15);
      ctx.lineTo(x1 + ux * lead, y1 + uy * lead);
      for (let i = 1; i <= n; i++) {
        const t = lead + (len - 2 * lead) * (i - 0.5) / n, s = (i % 2 ? 1 : -1) * amp;
        ctx.lineTo(x1 + ux * t + px * s, y1 + uy * t + py * s);
      }
      ctx.lineTo(x2 - ux * lead, y2 - uy * lead); ctx.lineTo(x2, y2); ctx.stroke();
    }
    function hex(ctx, x, y, r) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 90); const px = x + r * Math.cos(a), py = y + r * Math.sin(a); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }

    let t0 = performance.now(), phase = 0, playing = !reduceMotion, last = t0;
    if (!playing) { playBtn.textContent = 'Play'; playBtn.setAttribute('aria-pressed', 'false'); }
    function draw(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const w = parseFloat(freq.value);
      if (playing) phase += dt * w * 2 * Math.PI * 0.55;
      const { ctx, w: W, h: H } = fitCanvas(cv);
      ctx.clearRect(0, 0, W, H);
      const left = 46, right = W - 26, yMid = H * 0.6, gapX = (right - left) / N, amp = Math.min(46, H * 0.18);
      const e = [Math.cos(phase), Math.sin(phase)];
      const disp = (u) => (u[0] * e[0] - u[1] * e[1]);   // Re(U e^{i phase})
      // meta-material section
      if (metaBox.checked) {
        const xa = left + gapX * R0, xb = left + gapX * (R1 + 1);
        ctx.fillStyle = 'rgba(198,146,20,0.10)'; ctx.fillRect(xa, 8, xb - xa, H - 34);
        ctx.fillStyle = '#8a6408'; ctx.font = '600 12px Montserrat, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('meta-material section', (xa + xb) / 2, 22);
      }
      // baseline
      ctx.strokeStyle = '#e3e8ef'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(left - 30, yMid); ctx.lineTo(right + 10, yMid); ctx.stroke();
      // driver
      const yd = yMid - amp * Math.cos(phase);
      ctx.fillStyle = C.accent; ctx.fillRect(left - 40, yd - 16, 14, 32);
      // chain
      let px = left - 26, py = yd;
      ctx.lineWidth = 1.6;
      for (let j = 0; j < N; j++) {
        const x = left + gapX * (j + 0.5), y = Math.max(14, Math.min(H - 20, yMid - amp * disp(state.U[j])));
        ctx.strokeStyle = '#7d8ea3'; zigzag(ctx, px, py, x, y, 6, 4);
        px = x; py = y;
      }
      // the chain continues beyond the far end (absorbing boundary)
      ctx.strokeStyle = '#c3ccd8'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(right + 14, yMid); ctx.stroke(); ctx.setLineDash([]);
      for (let j = 0; j < N; j++) {
        const x = left + gapX * (j + 0.5), y = Math.max(14, Math.min(H - 20, yMid - amp * disp(state.U[j])));
        if (state.V && state.V[j]) {
          const yr = Math.max(14, Math.min(H - 20, yMid - 40 - amp * disp(state.V[j])));
          ctx.strokeStyle = 'rgba(198,146,20,0.75)'; ctx.lineWidth = 1.2; zigzag(ctx, x, y - 9, x, yr + 7, 4, 3);
          ctx.fillStyle = C.accent2; hex(ctx, x, yr, 7.5); ctx.fill();
        }
        ctx.fillStyle = C.primary; ctx.beginPath(); ctx.arc(x, y, Math.max(6, Math.min(9, gapX * 0.28)), 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = C.muted; ctx.font = '12px "Open Sans", sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('driver', left - 44, H - 10); ctx.textAlign = 'right'; ctx.fillText('far end', right + 10, H - 10);
      requestAnimationFrame(draw);
    }

    metaBox.addEventListener('change', update);
    freq.addEventListener('input', update);
    playBtn.addEventListener('click', () => { playing = !playing; playBtn.textContent = playing ? 'Pause' : 'Play'; playBtn.setAttribute('aria-pressed', String(playing)); });
    window.addEventListener('resize', drawSpectrum);
    update(); requestAnimationFrame(draw);
  })();

  /* ------------------------------------------------------------------ */
  /* 2. Rotatable 3D lattice unit cells                                  */
  /* ------------------------------------------------------------------ */
  (function lattice() {
    const cv = document.getElementById('lattice-canvas'); if (!cv) return;
    const tileBox = document.getElementById('lattice-tile');
    const segBtns = Array.from(document.querySelectorAll('.mf-seg [data-cell]'));
    let type = 'hex', yaw = 0.6, pitch = -0.45, auto = !reduceMotion, dragging = false, lx = 0, ly = 0, idle = 0;

    function cell(t) {
      const E = []; const P = (x, y, z) => [x, y, z];
      const corners = []; for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push(P(x, y, z));
      const cubeEdges = () => { for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const a = corners[i], b = corners[j]; const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); if (d === 1) E.push([a, b]); } };
      if (t === 'cubic') cubeEdges();
      if (t === 'bcc') { cubeEdges(); const c = P(.5, .5, .5); corners.forEach(k => E.push([k, c])); }
      if (t === 'octet') {
        const f = [P(.5, .5, 0), P(.5, .5, 1), P(.5, 0, .5), P(.5, 1, .5), P(0, .5, .5), P(1, .5, .5)];
        f.forEach(fc => corners.forEach(k => { const d = Math.hypot(fc[0] - k[0], fc[1] - k[1], fc[2] - k[2]); if (Math.abs(d - Math.SQRT1_2) < 1e-6) E.push([fc, k]); }));
        for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const d = Math.hypot(f[i][0] - f[j][0], f[i][1] - f[j][1], f[i][2] - f[j][2]); if (Math.abs(d - Math.SQRT1_2) < 1e-6) E.push([f[i], f[j]]); }
      }
      if (t === 'hex') {   // extruded hexagonal (honeycomb) cell
        const r = 0.5, hx = [];
        for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; hx.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a) * 0.98]); }
        for (const z of [0, 1]) for (let i = 0; i < 6; i++) E.push([P(hx[i][0], hx[i][1], z), P(hx[(i + 1) % 6][0], hx[(i + 1) % 6][1], z)]);
        for (let i = 0; i < 6; i++) E.push([P(hx[i][0], hx[i][1], 0), P(hx[i][0], hx[i][1], 1)]);
      }
      return E;
    }
    function build() {
      const base = cell(type), n = tileBox.checked ? 2 : 1, seen = new Set(), E = [];
      const sx = type === 'hex' ? 0.75 : 1, sy = type === 'hex' ? 0.866 * 0.98 : 1;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let l = 0; l < n; l++) {
        const oy = type === 'hex' && i % 2 ? sy / 2 : 0;
        base.forEach(([a, b]) => {
          const A = [a[0] + i * sx * 1, a[1] + j * sy * 1 + oy, a[2] + l], B = [b[0] + i * sx * 1, b[1] + j * sy * 1 + oy, b[2] + l];
          const key = [A, B].map(p => p.map(v => v.toFixed(3)).join(',')).sort().join('|');
          if (!seen.has(key)) { seen.add(key); E.push([A, B]); }
        });
      }
      // centre
      let cx = 0, cy = 0, cz = 0, cnt = 0; E.forEach(([a, b]) => { cx += a[0] + b[0]; cy += a[1] + b[1]; cz += a[2] + b[2]; cnt += 2; });
      cx /= cnt; cy /= cnt; cz /= cnt;
      let rmax = 0; E.forEach(([a, b]) => [a, b].forEach(p => { rmax = Math.max(rmax, Math.hypot(p[0] - cx, p[1] - cy, p[2] - cz)); }));
      return E.map(([a, b]) => [a, b].map(p => [(p[0] - cx) / rmax, (p[1] - cy) / rmax, (p[2] - cz) / rmax]));
    }
    let edges = build();
    function project(p, W, H) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      let x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
      const y2 = y * cp - z * sp, z2 = y * sp + z * cp;
      const s = Math.min(W, H) * 0.42, f = 3.2 / (3.2 + z2);
      return [W / 2 + x * s * f, H / 2 + y2 * s * f, z2];
    }
    function draw(now) {
      if (auto && !dragging) { yaw += 0.006; }
      if (!dragging && !auto && idle && now - idle > 4000 && !reduceMotion) auto = true;
      const { ctx, w: W, h: H } = fitCanvas(cv);
      ctx.clearRect(0, 0, W, H);
      const segs = edges.map(([a, b]) => { const A = project(a, W, H), B = project(b, W, H); return [A, B, (A[2] + B[2]) / 2]; });
      segs.sort((s1, s2) => s2[2] - s1[2]);   // far first
      const zs = segs.map(s => s[2]), zmin = Math.min(...zs), zmax = Math.max(...zs) || 1;
      segs.forEach(([A, B, z]) => {
        const t = (z - zmin) / (zmax - zmin || 1);        // 0 near, 1 far
        ctx.strokeStyle = t < 0.5 ? C.accent : C.primary; ctx.globalAlpha = 1 - 0.55 * t;
        ctx.lineWidth = 3.2 - 1.6 * t; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      const nodes = new Map(); segs.forEach(([A, B]) => [A, B].forEach(p => nodes.set(p[0].toFixed(1) + ',' + p[1].toFixed(1), p)));
      nodes.forEach(p => { ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, Math.PI * 2); ctx.fill(); });
      requestAnimationFrame(draw);
    }
    cv.addEventListener('pointerdown', (e) => { dragging = true; auto = false; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', (e) => { if (!dragging) return; yaw += (e.clientX - lx) * 0.01; pitch = Math.max(-1.4, Math.min(1.4, pitch + (e.clientY - ly) * 0.01)); lx = e.clientX; ly = e.clientY; });
    const end = () => { dragging = false; idle = performance.now(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    segBtns.forEach(b => b.addEventListener('click', () => { type = b.dataset.cell; segBtns.forEach(x => x.classList.toggle('is-on', x === b)); edges = build(); }));
    tileBox.addEventListener('change', () => { edges = build(); });
    requestAnimationFrame(draw);
  })();

  /* ------------------------------------------------------------------ */
  /* 3. Quiz                                                             */
  /* ------------------------------------------------------------------ */
  (function quiz() {
    const box = document.getElementById('quiz-list'); if (!box) return;
    const Q = [
      { q: 'Where do meta-materials get their unusual properties from?',
        a: ['Rare chemical elements', 'Their engineered internal structure', 'Extremely high temperatures during production', 'Magnetic coatings'], c: 1,
        e: 'Meta-materials owe their behaviour to the designed geometry and arrangement of their building blocks, not to an exotic chemical composition.' },
      { q: 'In a meta-material, what is a "band gap"?',
        a: ['A crack between two unit cells', 'A range of frequencies in which waves cannot travel through it', 'The gap between wind turbine blades', 'A manufacturing tolerance'], c: 1,
        e: 'Inside the band gap, waves are strongly attenuated. You can see this in the "Stop the wave" demo above.' },
      { q: 'If the wind speed doubles, roughly how much more power is available to a wind turbine?',
        a: ['2 times', '4 times', '8 times', '16 times'], c: 2,
        e: 'Wind power scales with the cube of wind speed: 2 × 2 × 2 = 8. In practice turbines are limited by their rated power and cut-out speed.' },
      { q: 'Why do engineers keep a wind turbine tower\'s natural frequency away from the rotor\'s rotation frequency?',
        a: ['To reduce noise for nearby residents', 'To avoid resonance, which would amplify the vibrations', 'To make the tower easier to transport', 'To increase electricity prices'], c: 1,
        e: 'If the excitation frequency matches a natural frequency, vibrations build up (resonance), increasing stresses and fatigue damage.' },
      { q: 'What causes fatigue damage in a structure?',
        a: ['A single very large load', 'Many repeated load cycles, even well below the static strength', 'Painting it too often', 'Exposure to cold alone'], c: 1,
        e: 'Fatigue is progressive damage under cyclic loading. Over a 25-year life, an offshore structure experiences more than a hundred million wave and wind load cycles.' },
      { q: 'What is the main purpose of Structural Health Monitoring (SHM)?',
        a: ['To decorate structures with sensors', 'To detect damage early from sensor data and support maintenance', 'To replace all inspections with drones', 'To measure electricity production'], c: 1,
        e: 'SHM combines sensors and data analysis to track a structure\'s condition, so damage is detected early and maintenance can be planned.' }
    ];
    let score = 0, answered = 0;
    const scoreEl = document.getElementById('quiz-score'), totalEl = document.getElementById('quiz-total');
    const end = document.getElementById('quiz-end'), verdict = document.getElementById('quiz-verdict');
    totalEl.textContent = Q.length;
    function render() {
      score = 0; answered = 0; scoreEl.textContent = '0'; end.hidden = true;
      box.innerHTML = '';
      Q.forEach((item, qi) => {
        const card = document.createElement('div'); card.className = 'mf-q';
        card.innerHTML = '<p class="mf-q__n">Question ' + (qi + 1) + '</p><h3 class="mf-q__t"></h3><div class="mf-q__opts" role="group"></div><p class="mf-q__fb" aria-live="polite" hidden></p>';
        card.querySelector('.mf-q__t').textContent = item.q;
        const opts = card.querySelector('.mf-q__opts'), fb = card.querySelector('.mf-q__fb');
        opts.setAttribute('aria-label', 'Answers for question ' + (qi + 1));
        item.a.forEach((txt, ai) => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'mf-opt'; b.textContent = txt;
          b.addEventListener('click', () => {
            if (card.dataset.done) return; card.dataset.done = '1'; answered++;
            const ok = ai === item.c; if (ok) score++;
            opts.querySelectorAll('.mf-opt').forEach((x, xi) => { x.disabled = true; if (xi === item.c) x.classList.add('is-right'); });
            if (!ok) b.classList.add('is-wrong');
            fb.hidden = false; fb.className = 'mf-q__fb ' + (ok ? 'ok' : 'no');
            fb.innerHTML = '<strong>' + (ok ? 'Correct.' : 'Not quite.') + '</strong> ';
            fb.appendChild(document.createTextNode(item.e));
            scoreEl.textContent = score;
            if (answered === Q.length) {
              end.hidden = false;
              verdict.textContent = score === Q.length ? 'Perfect score! You could join a Met2Adapt training week.' :
                score >= 4 ? 'Great result: ' + score + ' out of ' + Q.length + '.' : 'You got ' + score + ' out of ' + Q.length + '. Explore the glossary below and try again.';
            }
          });
          opts.appendChild(b);
        });
        box.appendChild(card);
      });
    }
    document.getElementById('quiz-retry').addEventListener('click', () => { render(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    render();
  })();
})();
