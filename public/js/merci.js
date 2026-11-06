import { store, gate, esc } from "./store.js";
import { PEOPLE } from "./content.js";
import * as R from "./recap.js";

await gate();
store.start(2500);
const $ = (id) => document.getElementById(id);

// ── En-tête ──────────────────────────────────────────────────
$("faces").innerHTML = PEOPLE.map((p, i) => `<figure style="--i:${i}"><img src="/assets/team/${p.photo}.webp" alt=""><figcaption>${esc(p.name)}</figcaption></figure>`).join("");
$("direction").innerHTML = `« ${esc(R.DIRECTION.text)} » <span>${esc(R.DIRECTION.sub)}</span>`;
$("pillars").innerHTML = R.DIRECTION.pillars.map((p) => `<span>${esc(p)}</span>`).join("");
const caseCount = R.ACTIONS.find((a) => a.id === "case_studies")?.d.length || 0;
$("kpis").innerHTML = [
  [R.ACTIONS.length, "actions définies"], [caseCount, "case studies lancées"],
  [R.STUCK.reduce((n, s) => n + s.items.length, 0), "irritants identifiés"], [6, "personnes"],
].map(([n, t]) => `<div><b data-count="${n}">0</b><span>${t}</span></div>`).join("");

// ── Plan d'action priorisable ────────────────────────────────
const PRIOS = [["p1", "P1", "30 jours"], ["p2", "P2", "ce trimestre"], ["p3", "P3", "plus tard"]];
let filter = "all";
const get = (a) => ({ p: store.get(`prio:${a.id}`, ""), o: store.get(`prio:${a.id}:o`, a.owner || ""), d: store.get(`prio:${a.id}:d`, "") });

$("filters").innerHTML = [["all", "Toutes"], ["todo", "À prioriser"], ["p1", "P1"], ["p2", "P2"], ["p3", "P3"]]
  .map(([k, t]) => `<button data-f="${k}" class="${k === "all" ? "on" : ""}">${t}<i data-n="${k}"></i></button>`).join("")
  + `<label class="sort"><input type="checkbox" id="byPrio"> Trier par priorité</label>`;
$("filters").onclick = (e) => { const b = e.target.closest("[data-f]"); if (!b) return; filter = b.dataset.f; $("filters").querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b)); last = ""; draw(); };
$("byPrio").onchange = () => { last = ""; draw(); };

let last = "", tmo;
function draw() {
  if (document.activeElement?.matches(".act input")) return; // ne pas casser une saisie en cours
  const rows = R.ACTIONS.map((a) => ({ a, v: get(a) }));
  const sig = JSON.stringify([filter, $("byPrio").checked, rows.map((r) => r.v)]);
  if (sig === last) return; last = sig;

  const count = { all: rows.length, todo: rows.filter((r) => !r.v.p).length, p1: 0, p2: 0, p3: 0 };
  rows.forEach((r) => r.v.p && count[r.v.p]++);
  $("filters").querySelectorAll("[data-n]").forEach((i) => i.textContent = count[i.dataset.n]);
  const done = rows.length - count.todo;
  $("prioSum").innerHTML = `<div class="ring" style="--k:${done / rows.length}"><b>${done}/${rows.length}</b><span>priorisées</span></div>
    <div class="legend">${PRIOS.map(([k, t, s]) => `<span class="pill ${k}">${t} · ${count[k]}</span><small>${s}</small>`).join("")}</div>`;

  let list = rows.filter((r) => filter === "all" || (filter === "todo" ? !r.v.p : r.v.p === filter));
  if ($("byPrio").checked) list = [...list].sort((x, y) => (x.v.p || "p9").localeCompare(y.v.p || "p9"));
  $("actions").innerHTML = list.map(({ a, v }) => `
    <article class="act ${v.p}" data-id="${a.id}">
      <div class="act-main">
        <span class="theme">${esc(R.THEMES[a.theme])}</span>
        <h3>${esc(a.t)}</h3>
        ${a.d ? `<ul>${a.d.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      </div>
      <div class="act-side">
        <div class="prio">${PRIOS.map(([k, t]) => `<button data-p="${k}" class="${v.p === k ? "on " + k : ""}" title="${t}">${t}</button>`).join("")}</div>
        <label><span>Qui</span><input data-f="o" value="${esc(v.o)}" placeholder="À définir"></label>
        <label><span>Pour quand</span><input data-f="d" value="${esc(v.d)}" placeholder="Date"></label>
      </div>
    </article>`).join("") || `<p class="muted empty">Rien dans ce filtre.</p>`;

  $("actions").querySelectorAll(".act").forEach((card) => {
    const id = card.dataset.id;
    card.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => {
      const cur = store.get(`prio:${id}`, "");
      store.set({ [`prio:${id}`]: cur === b.dataset.p ? null : b.dataset.p }); flash();
    });
    card.querySelectorAll("input").forEach((inp) => {
      const k = `prio:${id}:${inp.dataset.f}`;
      const save = () => { clearTimeout(tmo); store.set({ [k]: inp.value.trim() || null }); flash(); };
      inp.oninput = () => { clearTimeout(tmo); tmo = setTimeout(save, 450); };
      inp.onblur = () => { save(); last = ""; setTimeout(draw, 50); };
      inp.onkeydown = (e) => { if (e.key === "Enter") inp.blur(); };
    });
  });
}
const flash = () => { $("saveState").textContent = "Enregistré ✓"; clearTimeout(flash.t); flash.t = setTimeout(() => $("saveState").textContent = "", 1800); };
store.subscribe(draw);

$("decided").innerHTML = R.DECIDED.map((x) => `<p><b>Tranché :</b> ${esc(x.q)} <span>${esc(x.a)}</span></p>`).join("");

$("exportBtn").onclick = () => {
  const rows = R.ACTIONS.map((a) => ({ a, v: get(a) })).sort((x, y) => (x.v.p || "p9").localeCompare(y.v.p || "p9"));
  let md = `# SEA Day 2026 : plan d'action priorisé\n\n> ${R.DIRECTION.text} ${R.DIRECTION.sub}\n\n`;
  for (const [k, t, s] of [...PRIOS, ["", "À prioriser", ""]]) {
    const g = rows.filter((r) => r.v.p === k); if (!g.length) continue;
    md += `## ${t}${s ? ` (${s})` : ""}\n\n| Action | Qui | Pour quand |\n|---|---|---|\n`;
    for (const { a, v } of g) md += `| ${a.t}${a.d ? " : " + a.d.join(" ; ") : ""} | ${v.o || "—"} | ${v.d || "—"} |\n`;
    md += "\n";
  }
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([md], { type: "text/markdown" })), download: "sea-day-2026-plan-priorise.md" });
  link.click();
};

// ── Sections de synthèse ─────────────────────────────────────
$("heard").innerHTML = R.HEARD.map((h) => `<article><h3>${esc(h.t)}</h3><p>${esc(h.s)}</p>${h.k ? `<em>${esc(h.k)}</em>` : ""}</article>`).join("");
const maxV = Math.max(1, ...R.STUCK.map((s) => s.votes));
$("stuck").innerHTML = R.STUCK.map((s) => `<article style="--h:${s.votes / maxV}"><div class="st-h"><h3>${esc(s.t)}</h3>${s.votes ? `<span>🔥 ${s.votes}</span>` : ""}</div><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></article>`).join("");
$("hubCols").innerHTML = R.HUB.map((c) => `<article class="${c.c}"><h3>${esc(c.t)}</h3><ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></article>`).join("");
$("offer").innerHTML = R.OFFER.map((c) => `<article><h3>${esc(c.t)}</h3><ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></article>`).join("");

// ── Motion : apparition au scroll + compteurs ────────────────
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
  e.target.querySelectorAll?.("[data-count]").forEach((el) => {
    const n = +el.dataset.count, t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}), { threshold: 0, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal, .block, .thanks").forEach((el) => io.observe(el));
