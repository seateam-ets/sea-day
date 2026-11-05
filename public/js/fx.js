// Motion design commun à toutes les slides : titres mot par mot, compteurs, confettis.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Découpe le texte d'un élément en <span class="w"> (mots) ou <span class="ch"> (lettres),
// sans toucher aux balises internes (<br>, <b>…).
function split(el, unit = "w") {
  let n = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const parts = unit === "ch" ? [...child.textContent] : child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const p of parts) {
          if (!p) continue;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); continue; }
          const s = document.createElement("span");
          s.className = unit; s.style.setProperty("--w", n++); s.textContent = p;
          frag.appendChild(s);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !child.matches("input, textarea, code")) walk(child);
    }
  };
  walk(el);
}

// Compte de 0 à la valeur affichée (garde le suffixe : « 535 € », « 24 »…)
function countUp(el, delay = 500, dur = 1300) {
  const m = el.textContent.match(/^(\D*)(\d[\d.,]*)(.*)$/s);
  if (!m) return;
  const target = parseFloat(m[2].replace(/,/g, ""));
  if (!isFinite(target)) return;
  const pad = m[2].trim().length;
  const fmt = (v) => `${m[1]}${String(Math.round(v)).padStart(target < 10 && pad === 2 ? 2 : 1, "0")}${m[3]}`;
  el.textContent = fmt(0);
  const t0 = performance.now() + delay;
  const tick = (t) => {
    const k = Math.min(1, Math.max(0, (t - t0) / dur));
    el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function confetti(root) {
  const c = document.createElement("canvas");
  c.className = "confetti"; c.width = 1920; c.height = 1080; root.appendChild(c);
  const g = c.getContext("2d");
  const colors = ["#5b2ce8", "#bdb3ff", "#f9f5ec", "#14b8a6", "#f59e0b", "#3b82f6"];
  const P = Array.from({ length: 220 }, () => ({
    x: 960 + (Math.random() - .5) * 300, y: 1100, vx: (Math.random() - .5) * 22, vy: -18 - Math.random() * 20,
    r: Math.random() * Math.PI, vr: (Math.random() - .5) * .4, s: 8 + Math.random() * 12, c: colors[(Math.random() * colors.length) | 0],
  }));
  let raf, t = 0;
  const step = () => {
    g.clearRect(0, 0, 1920, 1080); t++;
    for (const p of P) {
      p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore();
    }
    if (t < 260) raf = requestAnimationFrame(step); else c.remove();
  };
  raf = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(raf); c.remove(); };
}

export function fx(el) {
  // titres : mot par mot
  el.querySelectorAll(".section h1, h2:not(.no-split), .quiz-intro .mega").forEach((h) => split(h, "w"));
  // SEA DAY : lettre par lettre
  el.querySelectorAll(".giga span").forEach((h) => split(h, "ch"));
  if (reduce) return null;
  // compteurs
  el.querySelectorAll("[data-count], .tile-n, .stat b, .price b, .section-num").forEach((n, i) => countUp(n, 450 + i * 90));
  if (el.dataset.id === "fin") { const t = setTimeout(() => (stop = confetti(el)), 700); let stop; return () => { clearTimeout(t); stop?.(); }; }
  return null;
}
