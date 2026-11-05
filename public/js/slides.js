import { store, esc } from "./store.js";
import * as C from "./content.js";

// Chaque slide : { id, agenda, kind, render() → html, mount?(root) → cleanup, key?(ev) → bool }
let QUIZ = [];
export const loadQuiz = async () => { QUIZ = await (await fetch("/data/quiz.json")).json(); return QUIZ; };

const a = (i) => `data-a style="--i:${i}"`; // élément animé à l'entrée, i = ordre
const tag = (t) => `<span class="tag">${esc(t)}</span>`;
const fmt = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

const section = (id, agenda, num, title, who, sub = "") => ({
  id, agenda, kind: "section",
  render: () => `
    <div class="section">
      <div class="section-num" ${a(0)}>${num}</div>
      <div>
        ${who ? `<div class="kicker" ${a(1)}>${esc(who)}</div>` : ""}
        <h1 class="mega" ${a(2)}>${title}</h1>
        ${sub ? `<p class="lead" ${a(3)}>${sub}</p>` : ""}
      </div>
    </div>`,
});

// ── Écran de pause (timer partagé) ───────────────────────────
const pause = (id, agenda, title, sub, minutes) => ({
  id, agenda, kind: "pause",
  render: () => `
    <div class="pause">
      <div class="kicker" ${a(0)}>${esc(sub)}</div>
      <h1 class="mega" ${a(1)}>${title}</h1>
      <div class="timer big" ${a(2)} data-timer>—</div>
      <div class="pause-ctrl" ${a(3)}>
        ${[5, 10, 15, 30, 60].map((m) => `<button data-min="${m}">${m} min</button>`).join("")}
        <button data-min="0">Stop</button>
      </div>
      <div class="fact" ${a(4)}><span class="fact-k">Le saviez-vous ?</span><p data-fact></p></div>
    </div>`,
  mount(root) {
    const t = root.querySelector("[data-timer]");
    const f = root.querySelector("[data-fact]");
    root.querySelectorAll("[data-min]").forEach((b) => b.onclick = () => {
      const m = +b.dataset.min;
      store.set({ [`timer:${id}`]: m ? Date.now() + m * 60000 : null });
    });
    if (!store.get(`timer:${id}`) && minutes) store.set({ [`timer:${id}`]: Date.now() + minutes * 60000 });
    const facts = QUIZ.filter((q) => q.clear).map((q) => q.clear);
    let fi = Math.floor(Math.random() * facts.length);
    const showFact = () => { f.classList.remove("in"); setTimeout(() => { f.textContent = facts[fi++ % facts.length] || ""; f.classList.add("in"); }, 300); };
    showFact();
    const fiv = setInterval(showFact, 12000);
    const tiv = setInterval(() => {
      const end = store.get(`timer:${id}`);
      t.textContent = end ? (end - Date.now() > 0 ? fmt(end - Date.now()) : "On reprend !") : new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
      t.classList.toggle("done", !!end && end - Date.now() <= 0);
    }, 250);
    return () => { clearInterval(fiv); clearInterval(tiv); };
  },
});

// ── Tour de table ────────────────────────────────────────────
const tour = {
  id: "tour", agenda: "tour", kind: "interactive",
  render: () => `
    <div class="tour">
      <header class="row-head">
        <div><div class="kicker" ${a(0)}>Tour de table · Mh</div>
        <h2 ${a(1)} data-q-title></h2></div>
        <div class="qr" ${a(2)}><img src="/assets/qr-repondre.svg" alt="QR code vers ${C.ACCESS.url}"><span>Scannez pour répondre<em>Code : <code>${C.ACCESS.code}</code></em></span></div>
      </header>
      <nav class="qtabs" ${a(2)}>${C.TOUR_QUESTIONS.map((q, i) => `<button data-q="${q.id}">${i + 1}. ${esc(q.short)}</button>`).join("")}</nav>
      <div class="people">${C.PEOPLE.map((p, i) => `
        <article class="person" ${a(3 + i)} data-p="${p.id}">
          <div class="avatar">${esc(p.name[0])}</div>
          <div class="pmeta"><b>${esc(p.name)}</b><small>${esc(p.role)}</small></div>
          <p class="answer" data-ans></p>
        </article>`).join("")}</div>
    </div>`,
  mount(root) {
    const draw = () => {
      const qid = store.get("tour:q", "q1");
      const q = C.TOUR_QUESTIONS.find((x) => x.id === qid);
      root.querySelector("[data-q-title]").textContent = q.text;
      root.querySelectorAll("[data-q]").forEach((b) => b.classList.toggle("on", b.dataset.q === qid));
      root.querySelectorAll("[data-p]").forEach((card) => {
        const v = store.get(`tour:${card.dataset.p}:${qid}`, "");
        const el = card.querySelector("[data-ans]");
        if (document.activeElement !== el) el.textContent = v || "…";
        card.classList.toggle("filled", !!v);
      });
    };
    root.querySelectorAll("[data-q]").forEach((b) => b.onclick = () => store.set({ "tour:q": b.dataset.q }));
    root.querySelectorAll("[data-p]").forEach((card) => {
      const el = card.querySelector("[data-ans]");
      card.onclick = () => { if (el.isContentEditable) return; el.contentEditable = "true"; if (el.textContent === "…") el.textContent = ""; el.focus(); };
      el.onblur = () => { el.contentEditable = "false"; store.set({ [`tour:${card.dataset.p}:${store.get("tour:q", "q1")}`]: el.innerText.trim() || null }); draw(); };
    });
    return store.subscribe(draw);
  },
};

// ── Petits jeux ──────────────────────────────────────────────
const jeux = {
  id: "jeux", agenda: "jeux", kind: "interactive",
  render: () => `
    <div class="games">
      <div class="kicker" ${a(0)}>Bonus · petits jeux SEA</div>
      <nav class="gtabs" ${a(1)}>${C.GAMES.map((g) => `<button data-g="${g.id}">${esc(g.name)}</button>`).join("")}</nav>
      <div class="game-stage" ${a(2)}>
        <p class="rule" data-rule></p>
        <div class="card-flip" data-card><div class="face back">✦<small>Carte cachée<br>(visible sur la télécommande)</small></div><div class="face front" data-front></div></div>
        <div class="timer" data-gt>—</div>
        <div class="game-ctrl">
          <button data-act="draw">Tirer une carte</button>
          <button data-act="reveal">Révéler</button>
          <button data-act="start">Chrono</button>
        </div>
        <small class="muted" data-left></small>
      </div>
    </div>`,
  mount(root) {
    const g = () => C.GAMES.find((x) => x.id === store.get("game:id", C.GAMES[0].id));
    const draw = () => {
      const game = g();
      root.querySelectorAll("[data-g]").forEach((b) => b.classList.toggle("on", b.dataset.g === game.id));
      root.querySelector("[data-rule]").textContent = game.rule;
      const idx = store.get("game:card", null);
      const card = idx != null ? game.cards[idx] : null;
      const [main, ban] = (card || "").split("|");
      root.querySelector("[data-front]").innerHTML = card ? `<b>${esc(main.trim())}</b>${ban ? `<small>Interdit : ${esc(ban.trim())}</small>` : ""}` : "";
      root.querySelector("[data-card]").classList.toggle("flipped", !!card && store.get("game:revealed", false));
      root.querySelector("[data-card]").classList.toggle("empty", !card);
      const used = store.get("game:used", []);
      root.querySelector("[data-left]").textContent = `${game.cards.length - used.length} cartes restantes`;
    };
    root.querySelectorAll("[data-g]").forEach((b) => b.onclick = () => store.set({ "game:id": b.dataset.g, "game:card": null, "game:used": [], "game:end": null, "game:revealed": false }));
    root.querySelectorAll("[data-act]").forEach((b) => b.onclick = () => gameAction(b.dataset.act));
    const iv = setInterval(() => {
      const end = store.get("game:end");
      const el = root.querySelector("[data-gt]");
      el.textContent = end ? fmt(end - Date.now()) : fmt(g().time * 1000);
      el.classList.toggle("done", !!end && end <= Date.now());
    }, 200);
    const un = store.subscribe(draw);
    return () => { clearInterval(iv); un(); };
  },
  key(ev) {
    if (ev.key === "d") return gameAction("draw"), true;
    if (ev.key === " ") return gameAction("reveal"), true;
    if (ev.key === "t") return gameAction("start"), true;
  },
};
export function gameAction(act) {
  const game = C.GAMES.find((x) => x.id === store.get("game:id", C.GAMES[0].id));
  if (act === "draw") {
    let used = store.get("game:used", []);
    if (used.length >= game.cards.length) used = [];
    const left = game.cards.map((_, i) => i).filter((i) => !used.includes(i));
    const pick = left[Math.floor(Math.random() * left.length)];
    store.set({ "game:card": pick, "game:used": [...used, pick], "game:revealed": false, "game:end": null });
  }
  if (act === "reveal") store.set({ "game:revealed": !store.get("game:revealed", false) });
  if (act === "start") store.set({ "game:end": Date.now() + game.time * 1000 });
}

// ── Process : du bordel à l'ordre ────────────────────────────
// positions « en vrac » déterministes : la slide 1 et le départ de la slide 2 sont identiques
const rnd = (seed) => { let t = seed + 0x6d2b79f5; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const SLOTS = [6, 2, 8, 0, 4, 7, 1, 5, 3];
const chaosOf = (i, n = 9) => {
  const colW = 1660 / n, baseX = i * colW;
  const x = SLOTS[i] * colW + (rnd(i * 3 + 1) - .5) * 90;
  const y = (i % 2 ? 170 : -150) + (rnd(i * 3 + 2) - .5) * 160;
  return { tx: x - baseX, ty: y, r: -24 + rnd(i * 3 + 3) * 48 };
};
const flowHtml = (cls = "") => `<div class="flow ${cls}">${C.PROCESS_STEPS.map((s, i) => {
  const c = chaosOf(i);
  return `<div class="step" style="--tx:${c.tx}px;--ty:${c.ty}px;--r:${c.r}deg;--d:${i}"><span class="st-n">${i + 1}</span><b>${esc(s.t)}</b><small>${esc(s.s)}</small><i class="heat" data-heat="${i}"></i></div>`;
}).join("")}</div>`;
const TOOLS = ["Claude", "Claude Code", "ChatGPT", "GitHub", "Replit"];

const processChaos = {
  id: "process_chaos", agenda: "process", kind: "content",
  render: () => `
    <div class="pchaos">
      <div class="kicker" ${a(0)}>Le parcours d'une campagne · aujourd'hui</div>
      <h2 ${a(1)}>Chacun fait à sa façon.</h2>
      ${flowHtml("chaos")}
      <div class="mess">${C.PROCESS_MESS.map((m, i) => `<span class="sticky" style="--x:${60 + (i % 4) * 400 + rnd(i * 7 + 11) * 180}px;--y:${200 + Math.floor(i / 4) * 230 + rnd(i * 7 + 12) * 90}px;--r:${-14 + rnd(i * 7 + 13) * 28}deg;--d:${i}">${esc(m)}</span>`).join("")}</div>
      <div class="tools chaos-tools">${TOOLS.map((t, i) => `<span class="tool" style="--x:${rnd(i * 5 + 40) * 900 - 450}px;--y:${rnd(i * 5 + 41) * 160 - 80}px;--r:${-20 + rnd(i * 5 + 42) * 40}deg;--d:${i}">${t}</span>`).join("")}</div>
    </div>`,
};

const processFlow = {
  id: "process_flow", agenda: "process", kind: "content",
  render: () => `
    <div class="pflow">
      <div class="kicker" ${a(0)}>Le parcours d'une campagne · demain</div>
      <h2 ${a(1)}>De la signature au point client</h2>
      ${flowHtml("ordering")}
      <div class="tools" ${a(14)}>
        ${TOOLS.map((t) => `<span class="tool">${t}</span>`).join("")}
        <span class="muted">Objectif : <b class="accent">une seule façon de faire</b>, chaque outil à sa place.</span>
      </div>
    </div>`,
  mount(root) {
    // part de la position « en vrac », puis se range carte par carte
    const flow = root.querySelector(".flow");
    const t = setTimeout(() => flow.classList.add("ordered"), 450);
    return () => clearTimeout(t);
  },
};

const processCoince = {
  id: "process_coince", agenda: "process", kind: "interactive",
  render: () => `
    <div class="pcoince">
      <div class="kicker" ${a(0)}>Se remettre en question</div>
      <div class="qline" ${a(1)}>${C.PROCESS_QUESTIONS.map((q) => `<h2>${esc(q)}</h2>`).join("")}</div>
      ${flowHtml("static votes")}
      <p class="muted hint-line" ${a(3)}>Touchez une étape pour dire « ça coince ici » (+1). Clic droit pour retirer.</p>
      <div class="coince-wall" ${a(4)}>
        <form data-add-coince><input maxlength="90" placeholder="Ce qui coince / ce qu'on peut améliorer… (Entrée)"></form>
        <div class="notes" data-notes></div>
      </div>
    </div>`,
  mount(root) {
    const steps = [...root.querySelectorAll(".step")];
    steps.forEach((el, i) => {
      el.onclick = () => store.set({ [`heat:${i}`]: store.get(`heat:${i}`, 0) + 1 });
      el.oncontextmenu = (e) => { e.preventDefault(); store.set({ [`heat:${i}`]: Math.max(0, store.get(`heat:${i}`, 0) - 1) || null }); };
    });
    root.querySelector("[data-add-coince]").onsubmit = (ev) => {
      ev.preventDefault(); const inp = ev.target.querySelector("input"); const t = inp.value.trim(); if (!t) return;
      store.set({ [`coince:${Date.now().toString(36)}`]: t }); inp.value = "";
    };
    let last = "";
    const draw = () => {
      const heat = steps.map((_, i) => store.get(`heat:${i}`, 0));
      const notes = Object.entries(store.prefix("coince:")).sort();
      const sig = JSON.stringify([heat, notes]); if (sig === last) return; last = sig;
      const max = Math.max(1, ...heat);
      steps.forEach((el, i) => {
        el.style.setProperty("--h", heat[i] / max);
        el.classList.toggle("hot", heat[i] > 0);
        el.querySelector(".heat").textContent = heat[i] ? `🔥 ${heat[i]}` : "";
      });
      root.querySelector("[data-notes]").innerHTML = notes.map(([k, v], i) => `<span class="sticky in" style="--r:${-4 + rnd(i + 99) * 8}deg">${esc(v)}<button data-del="${k}" aria-label="Supprimer">×</button></span>`).join("");
      root.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => store.set({ [b.dataset.del]: null }));
    };
    return store.subscribe(draw);
  },
};

// ── Décisions process : une slide par question ───────────────
const decisionSlide = (d, n) => ({
  id: `dec_${d.id}`, agenda: "process", kind: "interactive",
  render: () => `
    <div class="dec1">
      <div class="dec-top" ${a(0)}>
        <span class="kicker">Question à trancher ${n + 1}/${C.DECISIONS.length} · ${esc(d.theme)}</span>
        <span class="dots">${C.DECISIONS.map((x, k) => `<i data-dot="${x.id}" class="${k === n ? "cur" : ""}"></i>`).join("")}</span>
      </div>
      <h2 ${a(1)}>${esc(d.q)}</h2>
      <p class="hint" ${a(2)}>${esc(d.hint)}</p>
      <div class="dec-fields" ${a(3)}>
        <label><span class="kicker">Décision</span><textarea data-val placeholder="On note la décision ici…"></textarea></label>
        <label><span class="kicker">Responsable</span><input data-owner placeholder="Qui ?"><small class="muted saved" data-saved></small></label>
      </div>
    </div>`,
  mount(root) {
    const ta = root.querySelector("[data-val]"), ow = root.querySelector("[data-owner]"), sv = root.querySelector("[data-saved]");
    let tmo = null;
    const flush = () => {
      clearTimeout(tmo); tmo = null;
      const v = ta.value.trim(), o = ow.value.trim();
      if (v !== store.get(`dec:${d.id}`, "") || o !== store.get(`dec:${d.id}:owner`, "")) {
        store.set({ [`dec:${d.id}`]: v || null, [`dec:${d.id}:owner`]: o || null });
        sv.textContent = "Enregistré ✓";
      }
    };
    const save = () => { sv.textContent = "…"; clearTimeout(tmo); tmo = setTimeout(flush, 300); };
    ta.oninput = save; ow.oninput = save; ta.onblur = flush; ow.onblur = flush;
    const draw = () => {
      if (document.activeElement !== ta && !tmo) ta.value = store.get(`dec:${d.id}`, "");
      if (document.activeElement !== ow && !tmo) ow.value = store.get(`dec:${d.id}:owner`, "");
      root.querySelectorAll("[data-dot]").forEach((el) => el.classList.toggle("done", !!(store.get(`dec:${el.dataset.dot}`) || store.get(`dec:${el.dataset.dot}:owner`))));
    };
    const un = store.subscribe(draw);
    return () => { flush(); un(); }; // rien ne se perd si on change de slide en tapant
  },
});
const decisionSlides = C.DECISIONS.map(decisionSlide);

// ── Conclusion ───────────────────────────────────────────────
const conclusion = {
  id: "conclusion", agenda: "conclusion", kind: "interactive",
  render: () => `
    <div class="concl">
      <div class="concl-left">
        <div class="kicker" ${a(0)}>Conclusion du matin</div>
        <h2 ${a(1)}>La direction qu'on prend</h2>
        <textarea ${a(2)} data-dir placeholder="En une phrase : demain, le pôle SEA…"></textarea>
        <div class="kicker" ${a(3)}>Décisions prises</div>
        <ul class="recap" ${a(4)} data-recap></ul>
      </div>
      <div class="concl-right" ${a(3)}>
        <div class="kicker">Mon engagement pour le mois prochain</div>
        ${C.PEOPLE.map((p) => `<label class="eng"><b>${esc(p.name)}</b><input data-eng="${p.id}" placeholder="Je m'engage à…"></label>`).join("")}
      </div>
    </div>`,
  mount(root) {
    const dir = root.querySelector("[data-dir]");
    const draw = () => {
      if (document.activeElement !== dir) dir.value = store.get("concl:dir", "");
      root.querySelectorAll("[data-eng]").forEach((i) => { if (document.activeElement !== i) i.value = store.get(`eng:${i.dataset.eng}`, ""); });
      const items = C.DECISIONS.filter((d) => store.get(`dec:${d.id}`) || store.get(`dec:${d.id}:owner`));
      root.querySelector("[data-recap]").innerHTML = items.length
        ? items.map((d) => `<li><span class="tag">${esc(d.theme)}</span> ${esc(store.get(`dec:${d.id}`) || d.q)}${store.get(`dec:${d.id}:owner`) ? ` <em>→ ${esc(store.get(`dec:${d.id}:owner`))}</em>` : ""}</li>`).join("")
        : `<li class="muted">Les décisions des questions à trancher s'affichent ici.</li>`;
    };
    let tmo;
    const deb = (obj) => { clearTimeout(tmo); tmo = setTimeout(() => store.set(obj), 400); };
    dir.oninput = () => deb({ "concl:dir": dir.value.trim() || null });
    root.querySelectorAll("[data-eng]").forEach((i) => i.oninput = () => deb({ [`eng:${i.dataset.eng}`]: i.value.trim() || null }));
    return store.subscribe(draw);
  },
};

// ── Point d'attention : clean & reporting ────────────────────
const clean = {
  id: "clean", agenda: "cruz", kind: "interactive",
  render: () => `
    <div class="clean">
      <div class="kicker" ${a(0)}>⚠ Point d'attention · Quentin · chiffres AdPilot au 5 novembre 2026</div>
      <h2 ${a(1)}>On a toutes les données. On envoie encore des PowerPoint.</h2>
      <div class="stats">${C.ADPILOT_STATS.map((x, i) => `<div class="stat ${x.edit ? "edit" : ""}" ${a(2 + i)}>${x.edit ? `<input data-portfolio inputmode="numeric" placeholder="?">` : `<b data-stat="${x.id}">${x.n}</b>`}<span>${esc(x.t)}</span><small>${esc(x.s)}</small></div>`).join("")}</div>
      <div class="clean-grid">
        <ul class="checks" ${a(8)}>${C.CLEAN_ACTIONS.map((c) => `<li><i>→</i><div><b>${esc(c.t)}</b><small>${esc(c.s)}</small></div></li>`).join("")}</ul>
        <div class="ask" ${a(9)}>
          <div class="kicker">Demander à Claude, via AdPilot</div>
          ${C.ADPILOT_PROMPTS.map((p) => `<p class="prompt">« ${esc(p)} »</p>`).join("")}
          <label class="kicker day-l">Journée de mise en place</label>
          <input data-day placeholder="Date + qui (ex. jeudi 20/11, toute l'équipe)">
        </div>
      </div>
    </div>`,
  mount(root) {
    const inp = root.querySelector("[data-day]"); let t;
    const pf = root.querySelector("[data-portfolio]");
    const draw = () => {
      if (document.activeElement !== inp) inp.value = store.get("clean:day", "");
      const n = parseInt(store.get("clean:portfolio", ""), 10);
      if (document.activeElement !== pf) pf.value = Number.isFinite(n) ? n : "";
      // clients sans reporting dédié = portfolio − reportings dédiés (18 clients couverts)
      root.querySelector('[data-stat="sans"]').textContent = Number.isFinite(n) ? `${Math.max(0, n - 18)}` : "?";
    };
    pf.oninput = () => { clearTimeout(t); t = setTimeout(() => store.set({ "clean:portfolio": pf.value.replace(/\D/g, "") || null }), 400); };
    inp.oninput = () => { clearTimeout(t); t = setTimeout(() => store.set({ "clean:day": inp.value.trim() || null }), 400); };
    return store.subscribe(draw);
  },
};

// ── Le Hub : prioriser ───────────────────────────────────────
const hub = {
  id: "hub", agenda: "cruz", kind: "interactive",
  render: () => `
    <div class="offre hubw">
      <header class="row-head">
        <div><div class="kicker" ${a(0)}>Le Hub · Quentin</div>
        <h2 ${a(1)}>Faire évoluer le Hub : on priorise ce qu'on utilise vraiment</h2></div>
      </header>
      <div class="tracks four">${C.HUB_COLS.map((c, i) => `
        <section class="track ${c.c}" ${a(2 + i)}>
          <div class="track-h"><b>${esc(c.t)}</b><small>${esc(c.s)}</small></div>
          <div class="ideas" data-col="${c.id}"></div>
          <form class="idea-add" data-add="${c.id}"><input placeholder="+ Ajouter…" maxlength="80"></form>
        </section>`).join("")}</div>
    </div>`,
  mount(root) {
    let last = "";
    const items = () => Object.entries(store.prefix("hub:")).filter(([k]) => !k.endsWith(":v")).map(([k, v]) => ({ id: k.slice(4), ...v, votes: store.get(`${k}:v`, 0) }));
    const draw = () => {
      const all = items(); const sig = JSON.stringify(all); if (sig === last) return; last = sig;
      for (const c of C.HUB_COLS) {
        root.querySelector(`[data-col="${c.id}"]`).innerHTML = all.filter((x) => x.col === c.id).sort((x, y) => y.votes - x.votes).map((x) => `
          <article class="idea ${x.votes > 0 ? "hot" : ""}"><div><b>${esc(x.t)}</b></div>
          <div class="vote"><button data-v="${x.id}" data-d="1">+</button><span>${x.votes}</span><button data-v="${x.id}" data-d="-1">−</button></div></article>`).join("")
          || `<p class="muted empty-col">Rien pour l'instant</p>`;
      }
      root.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { const k = `hub:${b.dataset.v}:v`; store.set({ [k]: Math.max(0, store.get(k, 0) + +b.dataset.d) }); });
    };
    root.querySelectorAll("[data-add]").forEach((f) => f.onsubmit = (ev) => {
      ev.preventDefault(); const inp = f.querySelector("input"); const t = inp.value.trim(); if (!t) return;
      store.set({ [`hub:h${Date.now().toString(36)}`]: { col: f.dataset.add, t } }); inp.value = "";
    });
    return store.subscribe(draw);
  },
};
export const hubItems = () => Object.entries(store.prefix("hub:")).filter(([k]) => !k.endsWith(":v")).map(([k, v]) => ({ ...v, votes: store.get(`${k}:v`, 0) })).sort((x, y) => y.votes - x.votes);

// ── Atelier offre : produit / upsell / fédérer ───────────────
const offre = {
  id: "offre", agenda: "cruz", kind: "interactive",
  render: () => `
    <div class="offre">
      <header class="row-head">
        <div><div class="kicker" ${a(0)}>Produit à vendre & upsell · Quentin · Mh</div>
        <h2 ${a(1)}>Qu'est-ce qu'on vend demain ?</h2></div>
        <div class="offre-top" ${a(2)} data-top></div>
      </header>
      <div class="tracks">${C.OFFER_TRACKS.map((tr, i) => `
        <section class="track" ${a(3 + i)}>
          <div class="track-h"><b>${esc(tr.t)}</b><small>${esc(tr.s)}</small></div>
          <div class="ideas" data-track="${tr.id}"></div>
          <form class="idea-add" data-add="${tr.id}"><input placeholder="+ Une idée…" maxlength="80"></form>
        </section>`).join("")}</div>
    </div>`,
  mount(root) {
    const ideas = () => {
      const custom = Object.entries(store.prefix("idea:")).filter(([k]) => !k.includes(":v")).map(([k, v]) => ({ id: k.slice(5), ...v }));
      const seeds = C.OFFER_SEEDS.filter((x) => !store.get(`idea:${x.id}:hidden`));
      return [...seeds, ...custom].map((x) => ({ ...x, votes: store.get(`idea:${x.id}:v`, 0) }));
    };
    let last = "";
    const draw = () => {
      const all = ideas();
      const sig = JSON.stringify(all); if (sig === last) return; last = sig;
      for (const tr of C.OFFER_TRACKS) {
        const list = all.filter((x) => x.track === tr.id).sort((x, y) => y.votes - x.votes);
        root.querySelector(`[data-track="${tr.id}"]`).innerHTML = list.map((x) => `
          <article class="idea ${x.votes > 0 ? "hot" : ""}">
            <div><b>${esc(x.t)}</b>${x.s ? `<small>${esc(x.s)}</small>` : ""}</div>
            <div class="vote"><button data-v="${x.id}" data-d="1">+</button><span>${x.votes}</span><button data-v="${x.id}" data-d="-1">−</button></div>
          </article>`).join("");
      }
      const top = [...all].filter((x) => x.votes > 0).sort((x, y) => y.votes - x.votes).slice(0, 3);
      root.querySelector("[data-top]").innerHTML = top.length
        ? `<span class="kicker">Top 3</span>${top.map((x, i) => `<span class="top-i"><i>${i + 1}</i>${esc(x.t)}</span>`).join("")}`
        : `<span class="muted">Votez avec + pour faire émerger le top 3</span>`;
      root.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => {
        const k = `idea:${b.dataset.v}:v`;
        store.set({ [k]: Math.max(0, store.get(k, 0) + +b.dataset.d) });
      });
    };
    root.querySelectorAll("[data-add]").forEach((f) => f.onsubmit = (ev) => {
      ev.preventDefault();
      const inp = f.querySelector("input"); const t = inp.value.trim(); if (!t) return;
      store.set({ [`idea:c${Date.now().toString(36)}`]: { track: f.dataset.add, t } });
      inp.value = "";
    });
    return store.subscribe(draw);
  },
};
export const offerIdeas = () => {
  const custom = Object.entries(store.prefix("idea:")).filter(([k]) => !k.includes(":v") && !k.includes(":hidden")).map(([k, v]) => ({ id: k.slice(5), ...v }));
  return [...C.OFFER_SEEDS, ...custom].map((x) => ({ ...x, votes: store.get(`idea:${x.id}:v`, 0) })).sort((x, y) => y.votes - x.votes);
};

// ── Quiz ─────────────────────────────────────────────────────
export const QCM_TIME = 30000, OPEN_TIME = 60000;
// joueurs inscrits depuis le téléphone : qp:<personId> = { team }
export const quizPlayers = () => Object.entries(store.prefix("qp:")).map(([k, v]) => ({ id: k.slice(3), ...v }));
const DEFAULT_TEAMS = [{ name: "Équipe ROAS", score: 0 }, { name: "Équipe CTR", score: 0 }, { name: "Équipe PMax", score: 0 }];
const qz = () => store.get("quiz", { i: -1, revealed: false, board: false });
const teams = () => store.get("quiz:teams", DEFAULT_TEAMS);
export function quizAction(act, arg) {
  const s = { ...qz() };
  if (act === "next") {
    s.i = Math.min(QUIZ.length, s.i + 1); s.revealed = false; s.board = s.i >= QUIZ.length;
    const q = QUIZ[s.i];
    store.set({ quiz: s, "quiz:end": q ? Date.now() + (q.type === "open" ? OPEN_TIME : QCM_TIME) : null });
    return;
  }
  if (act === "prev") { s.i = Math.max(-1, s.i - 1); s.revealed = false; s.board = false; store.set({ quiz: s, "quiz:end": null }); return; }
  if (act === "reveal") {
    s.revealed = !s.revealed;
    const upd = { quiz: s, "quiz:end": null };
    const q = QUIZ[s.i];
    // score automatique (une seule fois par question) : QCM / vrai-faux répondus depuis les téléphones
    if (s.revealed && q && q.type !== "open" && !store.get(`qs:${s.i}`)) {
      const good = q.options.find((o) => o.correct)?.key;
      const t = teams().map((x, k) => ({ ...x, score: x.score + (store.get(`qa:${s.i}:${k}`)?.a === good ? q.points : 0) }));
      upd["quiz:teams"] = t; upd[`qs:${s.i}`] = true;
    }
    store.set(upd);
    return;
  }
  if (act === "board") { s.board = !s.board; store.set({ quiz: s }); return; }
  if (act === "point") {
    const t = teams().map((x) => ({ ...x }));
    if (!t[arg]) return;
    const q = QUIZ[s.i];
    t[arg].score += q ? q.points : 1;
    store.set({ "quiz:teams": t });
    return;
  }
  if (act === "minus") { const t = teams().map((x) => ({ ...x })); if (t[arg]) t[arg].score -= 1; store.set({ "quiz:teams": t }); return; }
  if (act === "reset") {
    const clear = Object.fromEntries(Object.keys(store.state).filter((k) => /^q[asp]:/.test(k)).map((k) => [k, null]));
    store.set({ ...clear, quiz: { i: -1, revealed: false, board: false }, "quiz:teams": teams().map((t) => ({ ...t, score: 0 })), "quiz:end": null });
  }
}
const quiz = {
  id: "quiz", agenda: "jeux", kind: "interactive",
  render: () => `<div class="quiz" data-quiz></div>`,
  mount(root) {
    const box = root.querySelector("[data-quiz]");
    let last = "";
    const draw = () => {
      const s = qz();
      const T = teams();
      const P = quizPlayers();
      const ans = T.map((_, k) => store.get(`qa:${s.i}:${k}`, null));
      const sig = JSON.stringify([s, T, P, ans]);
      if (sig === last) return; last = sig;
      const cur = QUIZ[s.i];
      const good = cur?.options.find((o) => o.correct)?.key;
      const scores = `<div class="scores">${T.map((t, i) => {
        const a1 = ans[i];
        const st = !a1 ? `<em class="st wait">en attente…</em>`
          : !s.revealed ? `<em class="st ok">✓ a répondu</em>`
          : cur?.type === "open" ? `<em class="st txt">« ${esc(a1.a)} »</em>`
          : `<em class="st ${a1.a === good ? "right" : "bad"}">${esc(a1.a)} ${a1.a === good ? "✓" : "✗"}</em>`;
        return `<button class="score" data-pt="${i}"><b>${esc(t.name)}</b>${s.i >= 0 && cur ? st : ""}<span>${t.score}</span><kbd>${i + 1}</kbd></button>`;
      }).join("")}</div>`;
      if (s.board || s.i >= QUIZ.length) {
        const sorted = T.map((t, i) => ({ ...t, i })).sort((x, y) => y.score - x.score);
        const max = Math.max(1, ...T.map((t) => t.score));
        box.innerHTML = `
          <div class="kicker" ${a(0)}>${s.i >= QUIZ.length ? "Et le budget gagnant est…" : "Classement"}</div>
          <div class="board">${sorted.map((t, r) => `<div class="bar ${r === 0 ? "first" : ""}" ${a(r + 1)}><span class="rank">${r + 1}</span><b>${esc(t.name)}</b><div class="fill" style="--w:${(t.score / max) * 100}%"></div><span class="pts">${t.score} pts</span></div>`).join("")}</div>`;
        return;
      }
      if (s.i < 0) {
        box.innerHTML = `
          <div class="quiz-intro">
            <div class="kicker" ${a(0)}>Question pour un Champion SEA</div>
            <h1 class="mega" ${a(1)}>${QUIZ.length} questions.<br>Qui suit vraiment l'actu ?</h1>
            <p class="lead" ${a(2)}>QCM et vrai/faux = 1 point · question ouverte = 2 points · 30 s par QCM</p>
            <div class="quiz-join" ${a(3)}>
              <div class="join-qr"><img src="/assets/qr-quiz.svg" alt="QR code du quiz"><div><span class="kicker">Scannez pour rejoindre le quiz</span><em>Code : <code>${C.ACCESS.code}</code></em></div></div>
              <div class="team-cols">${T.map((t, i) => `<div class="team-col"><input data-tn="${i}" value="${esc(t.name)}"><ul>${P.filter((p) => p.team === i).map((p) => `<li>${esc(C.PEOPLE.find((x) => x.id === p.id)?.name || p.id)}</li>`).join("") || `<li class="muted">personne</li>`}</ul></div>`).join("")}</div>
            </div>
            <div class="team-edit" ${a(4)}><button data-addteam>+ équipe</button><button data-rmteam>− équipe</button>
              <span class="muted">${P.length} joueur${P.length > 1 ? "s" : ""} connecté${P.length > 1 ? "s" : ""} · Espace : révéler · → suivante · 1-8 : point · C : classement</span></div>
          </div>`;
        box.querySelectorAll("[data-tn]").forEach((inp) => inp.onchange = () => { const t = teams().map((x) => ({ ...x })); t[+inp.dataset.tn].name = inp.value; store.set({ "quiz:teams": t }); });
        box.querySelector("[data-addteam]").onclick = () => teams().length < 8 && store.set({ "quiz:teams": [...teams(), { name: `Équipe ${teams().length + 1}`, score: 0 }] });
        box.querySelector("[data-rmteam]").onclick = () => teams().length > 1 && store.set({ "quiz:teams": teams().slice(0, -1) });
        return;
      }
      const q = QUIZ[s.i];
      const typeLabel = { qcm: "QCM", tf: "Vrai ou faux", open: "Question ouverte" }[q.type];
      const opts = q.options.length
        ? `<div class="opts ${q.type}">${q.options.map((o, k) => `<div class="opt ${s.revealed ? (o.correct ? "right" : "wrong") : ""}" ${a(3 + k)}><span>${o.key}</span>${esc(o.text)}${s.revealed && q.why[k] ? `<small>${esc(q.why[k])}</small>` : ""}</div>`).join("")}</div>`
        : `<div class="open-ans ${s.revealed ? "show" : ""}" ${a(3)}><b>${esc(q.answer)}</b>${s.revealed && q.why.length ? `<ul>${q.why.map((w) => { const [h, ...r] = w.split(","); return `<li><b>${esc(h)}</b>${r.length ? " : " + esc(r.join(",")) : ""}</li>`; }).join("")}</ul>` : ""}</div>`;
      box.innerHTML = `
        <header class="q-head" ${a(0)}><span class="tag">${esc(q.theme)}</span><span class="tag ghost">${typeLabel} · ${q.points} pt${q.points > 1 ? "s" : ""}</span><span class="q-n">${s.i + 1} / ${QUIZ.length}</span><span class="timer small" data-qt></span></header>
        <h2 class="q-text" ${a(1)}>${esc(q.text)}</h2>
        ${opts}
        ${s.revealed ? `<div class="explain" ${a(8)}><p><b>En clair :</b> ${esc(q.clear)}</p>${q.example ? `<p class="muted"><b>Exemple :</b> ${esc(q.example)}</p>` : ""}<small class="muted">Source : ${esc(q.source)}</small></div>` : ""}
        ${scores}`;
      box.querySelectorAll("[data-pt]").forEach((b) => { b.onclick = () => quizAction("point", +b.dataset.pt); b.oncontextmenu = (e) => { e.preventDefault(); quizAction("minus", +b.dataset.pt); }; });
    };
    const iv = setInterval(() => {
      const el = box.querySelector("[data-qt]"); if (!el) return;
      const end = store.get("quiz:end");
      el.textContent = end ? fmt(end - Date.now()) : "";
      el.classList.toggle("done", !!end && end <= Date.now());
    }, 200);
    const un = store.subscribe(draw);
    return () => { clearInterval(iv); un(); };
  },
  key(ev) {
    const s = qz();
    if (ev.key === " ") return quizAction("reveal"), true;
    if (ev.key === "ArrowRight" && s.i < QUIZ.length) return quizAction("next"), true;
    if (ev.key === "ArrowLeft" && s.i >= 0) return quizAction("prev"), true;
    if (/^[1-8]$/.test(ev.key)) return quizAction(ev.shiftKey ? "minus" : "point", +ev.key - 1), true;
    if (ev.key === "c") return quizAction("board"), true;
  },
};

// ── Clôture ──────────────────────────────────────────────────
const fin = {
  id: "fin", agenda: "fin", kind: "interactive",
  render: () => `
    <div class="fin">
      <div class="kicker" ${a(0)}>SEA Day 2026</div>
      <h1 class="mega" ${a(1)}>Merci l'équipe&nbsp;!</h1>
      <p class="lead" ${a(2)} data-dir></p>
      <div class="fin-grid" ${a(3)}>
        <div><div class="kicker">Décisions</div><b class="big-n" data-nd>0</b></div>
        <div><div class="kicker">Engagements</div><b class="big-n" data-ne>0</b></div>
        <div><div class="kicker">Offre n°1</div><b class="big-n champ" data-offer>—</b></div>
        <div><div class="kicker">Champion SEA</div><b class="big-n champ" data-champ>—</b></div>
      </div>
      <button class="ghost-btn" ${a(4)} data-export>Exporter le compte-rendu (.md)</button>
    </div>`,
  mount(root) {
    const draw = () => {
      root.querySelector("[data-dir]").textContent = store.get("concl:dir", "");
      root.querySelector("[data-nd]").textContent = C.DECISIONS.filter((d) => store.get(`dec:${d.id}`) || store.get(`dec:${d.id}:owner`)).length;
      root.querySelector("[data-ne]").textContent = C.PEOPLE.filter((p) => store.get(`eng:${p.id}`)).length;
      const T = teams(); const best = [...T].sort((x, y) => y.score - x.score)[0];
      root.querySelector("[data-champ]").textContent = best && best.score ? best.name : "—";
      const o = offerIdeas()[0]; root.querySelector("[data-offer]").textContent = o && o.votes ? o.t : "—";
    };
    root.querySelector("[data-export]").onclick = exportReport;
    return store.subscribe(draw);
  },
};

export function exportReport() {
  const g = (k) => store.get(k, "");
  let md = `# SEA Day 2026 : compte-rendu\n\n## Direction\n\n${g("concl:dir") || "_(non renseignée)_"}\n\n## Tour de table\n`;
  for (const q of C.TOUR_QUESTIONS) {
    md += `\n### ${q.text}\n\n`;
    for (const p of C.PEOPLE) md += `- **${p.name}** : ${g(`tour:${p.id}:${q.id}`) || "—"}\n`;
  }
  md += `\n## Où ça coince dans le process\n\n`;
  C.PROCESS_STEPS.forEach((st, i) => { const h = store.get(`heat:${i}`, 0); if (h) md += `- ${st.t} : ${h} vote${h > 1 ? "s" : ""}\n`; });
  for (const [, v] of Object.entries(store.prefix("coince:"))) md += `- « ${v} »\n`;
  md += `\n## Décisions process\n\n`;
  for (const d of C.DECISIONS) md += `- **${d.q}**\n  ${g(`dec:${d.id}`) || "—"}${g(`dec:${d.id}:owner`) ? ` (responsable : ${g(`dec:${d.id}:owner`)})` : ""}\n`;
  md += `\n## Engagements\n\n`;
  for (const p of C.PEOPLE) md += `- **${p.name}** : ${g(`eng:${p.id}`) || "—"}\n`;
  md += `\n## Clean du portfolio & reporting\n\nClients dans le portfolio : ${g("clean:portfolio") || "à compter"}\nJournée de mise en place : ${g("clean:day") || "à fixer"}\n`;
  md += `\n## Le Hub\n\n`;
  for (const c of C.HUB_COLS) {
    md += `### ${c.t}\n\n`;
    for (const x of hubItems().filter((x) => x.col === c.id)) md += `- ${x.t} (${x.votes} vote${x.votes > 1 ? "s" : ""})\n`;
    md += `\n`;
  }
  md += `\n## Produit à vendre, upsell, fédérer nos clients\n\n`;
  for (const tr of C.OFFER_TRACKS) {
    md += `### ${tr.t}\n\n`;
    for (const x of offerIdeas().filter((x) => x.track === tr.id)) md += `- ${x.t} (${x.votes} vote${x.votes > 1 ? "s" : ""})${x.s ? ` : ${x.s}` : ""}\n`;
    md += `\n`;
  }
  md += `\n## Quiz\n\n`;
  for (const t of [...teams()].sort((x, y) => y.score - x.score)) md += `- ${t.name} : ${t.score} pts\n`;
  const blob = new Blob([md], { type: "text/markdown" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "sea-day-2026-compte-rendu.md" });
  link.click();
}

// ── LA LISTE DES SLIDES ──────────────────────────────────────
export const SLIDES = [
  { id: "welcome", agenda: null, kind: "hero",
    render: () => `
      <div class="hero">
        <div ${a(0)}><img src="/assets/eteamsys-logo.png" class="hero-logo" alt="eTeamsys"></div>
        <h1 class="giga" ${a(1)}><span>SEA</span><span class="outline">DAY</span></h1>
        <p class="lead" ${a(2)}>Le pôle SEA se pose une journée pour regarder où va le métier.</p>
        <div class="hero-meta" ${a(3)}>${C.PEOPLE.map((p) => `<span>${esc(p.name)}</span>`).join("")}</div>
        <div class="join" ${a(4)}><img src="/assets/qr-repondre.svg" alt="QR code vers ${C.ACCESS.url}"><div><span class="kicker">Rejoindre le SEA Day</span><em>Code : <code>${C.ACCESS.code}</code></em></div></div>
      </div>` },
  { id: "purpose", agenda: null, kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Pourquoi on est là</div>
        <h2 ${a(1)}>Se retrouver et redéfinir, ensemble, le métier de demain</h2>
        <div class="grid3">${C.PURPOSE.map((p, i) => `<article class="tile purpose" ${a(2 + i)}><span class="tile-n">${p.n}</span><b>${esc(p.t)}</b><p>${esc(p.s)}</p></article>`).join("")}</div>
      </div>` },
  { id: "agenda", agenda: null, kind: "agenda",
    render: () => `
      <div class="agenda">
        <div class="kicker" ${a(0)}>Le programme</div>
        <h2 ${a(1)}>Une journée, deux temps</h2>
        <div class="agenda-cols">
          ${[C.AGENDA.slice(0, 6), C.AGENDA.slice(6)].map((col, ci) => `
            <ol class="agenda-list">
              <li class="agenda-h" ${a(2 + ci)}>${ci ? "Après-midi" : "Matinée"}</li>
              ${col.map((it, i) => `<li ${a(3 + i + ci * 6)} data-ag="${it.id}"><span class="ag-i">${it.icon}</span><b>${esc(it.title)}</b>${it.who ? `<em>${esc(it.who)}</em>` : ""}</li>`).join("")}
            </ol>`).join("")}
        </div>
      </div>` },

  section("s-tour", "tour", "01", "Tour de table", "Animé par Mh", "Métier, ressources, outils, frustrations… et ce qui va bien."),
  tour,

  section("s-demain", "demain", "02", "Le métier<br>de demain", "Quentin · Mh", "Le cas Cetronic : justifier notre métier aujourd'hui."),
  { id: "cetronic_mail", agenda: "demain", kind: "content",
    render: () => `
      <div class="mail">
        <div class="mail-head" ${a(0)}><span class="dot"></span><b>Cetronic</b><span class="muted">→ Quentin</span><span class="tag">Objet : gestion SEA</span></div>
        <div class="mail-body">${C.CETRONIC_MAIL.map((m, i) => `<blockquote ${a(1 + i)}><span class="tag">${esc(m.k)}</span>« ${esc(m.t)} »</blockquote>`).join("")}</div>
        <p class="mail-q" ${a(7)}>Qu'est-ce que vous auriez répondu ?</p>
      </div>` },
  { id: "cetronic_done", agenda: "demain", kind: "content",
    render: () => `
      <div class="two">
        <div>
          <div class="kicker" ${a(0)}>Ce qu'on avait fait, sans le montrer</div>
          <h2 ${a(1)}>« Nous ne sommes plus simplement des gestionnaires de campagnes. »</h2>
          <p class="lead" ${a(2)}>On a lissé les heures de gestion sur un spectre d'intervention plus large plutôt que de facturer chaque action séparément.</p>
          <div class="price" ${a(3)}><b>535 €</b><span>= 5 h de gestion mensuelle</span></div>
        </div>
        <ul class="checks">${C.CETRONIC_DONE.map((d, i) => `<li ${a(2 + i)}><i>✓</i><div><b>${esc(d.t)}</b><small>${esc(d.s)}</small></div></li>`).join("")}</ul>
      </div>` },
  { id: "metier_ajd", agenda: "demain", kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Justifier notre métier aujourd'hui · Quentin</div>
        <h2 ${a(1)}>Ce qu'on répond quand un client dit « l'IA peut le faire »</h2>
        <div class="grid4 compact">${C.METIER_AUJOURDHUI.map((m, i) => `<article class="tile" ${a(2 + i)}><span class="tile-n">0${i + 1}</span><b>${esc(m.t)}</b><p>${esc(m.s)}</p></article>`).join("")}</div>
        <blockquote class="quote" ${a(11)}>« L'IA fait évoluer notre métier, mais elle ne remplace pas la réflexion et l'accompagnement. »</blockquote>
      </div>` },
  { id: "cetronic_lessons", agenda: "demain", kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Ce que Cetronic nous apprend</div>
        <h2 ${a(1)}>Quatre leçons</h2>
        <div class="grid4">${C.CETRONIC_LESSONS.map((l, i) => `<article class="tile" ${a(2 + i)}><span class="tile-n">0${i + 1}</span><b>${esc(l.t)}</b><p>${esc(l.s)}</p></article>`).join("")}</div>
      </div>` },
  { id: "hier_demain", agenda: "demain", kind: "content",
    render: () => `
      <div class="vs">
        <div class="vs-head" ${a(0)}><span>Hier</span><span class="vs-x">vs</span><span class="accent">Demain</span></div>
        ${C.HIER_DEMAIN.map(([h, d], i) => `<div class="vs-row" ${a(1 + i)}><span class="old">${esc(h)}</span><span class="arrow">→</span><b>${esc(d)}</b></div>`).join("")}
      </div>` },
  { id: "metier", agenda: "demain", kind: "content",
    render: () => `
      <div class="metier">
        <div class="metier-title">
          <div class="kicker" ${a(0)}>Vision 2026</div>
          <h2 ${a(1)}>Gestionnaire de campagne</h2>
          <p class="lead" ${a(2)}>Un chef d'orchestre de la croissance, pas seulement un pilote de campagnes.</p>
        </div>
        <div class="metier-map">
          <div class="core" ${a(3)}><div class="core-ico">▦</div><b>Gestionnaire<br>de campagne</b><ul><li>Coordonne les expertises</li><li>Détecte les besoins</li><li>Propose des solutions</li></ul><span class="pill">Pilotage full-funnel</span></div>
          <svg class="wires" viewBox="0 0 100 400" preserveAspectRatio="none" ${a(4)}>${[50, 150, 250, 350].map((y) => `<path d="M0 200 C 50 200, 50 ${y}, 100 ${y}" />`).join("")}</svg>
          <div class="levers">${C.LEVERS.map((l, i) => `
            <div class="lever ${l.c}" ${a(5 + i)}><span class="lv-n">${l.n}</span><b>${esc(l.t)}</b><span class="lv-arrow">→</span><span class="lv-up">+ ${esc(l.up)}</span></div>`).join("")}</div>
        </div>
      </div>` },
  { id: "upsell", agenda: "demain", kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Upsell · Mh</div>
        <h2 ${a(1)}>Des besoins à transformer en missions</h2>
        <div class="grid3">${C.UPSELL.map((u, i) => `<article class="tile" ${a(2 + i)}>${tag(u.tag)}<b>${esc(u.t)}</b><p>${esc(u.s)}</p></article>`).join("")}</div>
        <p class="lead center" ${a(9)}>Le métier se justifie par ce qu'on <b class="accent">rend visible</b>.</p>
      </div>` },

  pause("pause1", "pause1", "Pause", "On souffle", 15),

  section("s-jeux", "jeux", "03", "Question pour<br>un Champion SEA", "Petits jeux SEA · animé par Mh", "Formez les équipes."),
  quiz,

  section("s-process", "process", "04", "Process SEA<br>& outils", "Quentin", "Tout le monde peut tout faire. Mais pas n'importe comment."),
  processChaos,
  processFlow,
  processCoince,
  ...decisionSlides,
  conclusion,

  pause("diner", "diner", "Bon appétit", "Dîner à l'extérieur", 0),

  section("s-cruz", "cruz", "05", "SEA Cruz, hub<br>& produit à vendre", "Quentin", "Piloter Google Ads avec Claude via le MCP, puis ce qu'on vend en plus."),
  { id: "cruz", agenda: "cruz", kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Comment ça marche</div>
        <h2 ${a(1)}>Du langage courant à l'API Google Ads</h2>
        <div class="chain">${C.CRUZ.steps.map((s, i) => `<div class="link" ${a(2 + i)}><span class="st-n">${i + 1}</span><b>${esc(s.t)}</b><small>${esc(s.s)}</small></div>`).join("")}</div>
        <div class="two small">
          <div ${a(8)}><div class="kicker">Ce que ça change</div><ul class="plain">${C.CRUZ.pros.map((p) => `<li>+ ${esc(p)}</li>`).join("")}</ul></div>
          <div ${a(9)}><div class="kicker">À cadrer</div><ul class="plain">${C.CRUZ.cons.map((p) => `<li>! ${esc(p)}</li>`).join("")}</ul></div>
        </div>
      </div>` },

  clean,
  hub,
  offre,

  section("s-news", "news", "06", "Nouveautés", "Mh", "Ce qui a changé cette année sur Google, Meta et Microsoft."),
  { id: "news", agenda: "news", kind: "content",
    render: () => `
      <div>
        <div class="kicker" ${a(0)}>Nouveautés 2026</div>
        <h2 ${a(1)}>Ce qui change pour nos comptes</h2>
        <div class="grid3">
          ${[
            ["Google", "AI Max remplace les DSA", "Bascule automatique depuis septembre. À surveiller dans les termes de recherche."],
            ["Google", "Priorisation des canaux", "Allocation de budget par réseau dans PMax (objectif, pas plafond)."],
            ["Google", "Audiences dès 100 utilisateurs", "Les petites listes B2B deviennent activables."],
            ["Meta", "Attribution clic = clic sur lien", "Like, partage → engage-through 1 jour. Le ROAS « clic » baisse, pas les ventes."],
            ["Meta", "Andromeda : la créa cible", "Des angles vraiment différents, pas 20 variantes de couleur."],
            ["Microsoft", "AI Max activé par défaut", "Sur les nouvelles campagnes Search. CPC max supprimé en auto."],
          ].map(([t, h, p], i) => `<article class="tile" ${a(2 + i)}>${tag(t)}<b>${esc(h)}</b><p>${esc(p)}</p></article>`).join("")}
        </div>
      </div>` },

  pause("pause2", "fin", "Pause", "Avant le mot de la fin", 10),
  fin,
];

SLIDES.forEach((s) => { s.notes = C.NOTES[s.id] || (s.id.startsWith("dec_") ? C.NOTES.process : ""); });
