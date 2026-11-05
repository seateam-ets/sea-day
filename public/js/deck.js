import { store, gate } from "./store.js";
import { SLIDES, loadQuiz } from "./slides.js";
import { AGENDA } from "./content.js";
import { fx } from "./fx.js";

const stage = document.getElementById("stage");
const viewport = document.getElementById("viewport");
const bar = document.getElementById("progress");
const chip = document.getElementById("chip");
let current = -1;
let cleanup = null;

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}

function show(i) {
  i = Math.max(0, Math.min(SLIDES.length - 1, i | 0));
  if (i === current) return;
  const dir = i > current ? 1 : -1;
  current = i;
  const slide = SLIDES[i];
  cleanup?.(); cleanup = null;
  // une seule slide sortante à la fois : on supprime tout ce qui traîne
  const all = [...stage.querySelectorAll(".slide")];
  const old = all.pop(); // la slide affichée devient la sortante
  all.forEach((s) => s.remove()); // tout le reste disparaît immédiatement
  if (old) { old.classList.remove("in"); old.classList.add(dir > 0 ? "out-left" : "out-right"); setTimeout(() => old.remove(), 300); }
  const el = document.createElement("section");
  el.className = `slide kind-${slide.kind}`;
  el.dataset.id = slide.id;
  el.innerHTML = slide.render();
  stage.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
  const c1 = slide.mount?.(el) || null;
  const c2 = fx(el);
  cleanup = () => { c1?.(); c2?.(); };
  bar.style.width = `${((i + 1) / SLIDES.length) * 100}%`;
  const ag = AGENDA.find((x) => x.id === slide.agenda);
  chip.textContent = ag ? `${ag.icon}  ${ag.title}` : "SEA Day";
  document.body.dataset.kind = slide.kind;
  // agenda : met en avant le bloc à venir
  const next = SLIDES.slice(i + 1).find((s) => s.agenda)?.agenda;
  el.querySelectorAll("[data-ag]").forEach((li) => li.classList.toggle("next", li.dataset.ag === next));
}

const go = (i) => store.set({ slide: Math.max(0, Math.min(SLIDES.length - 1, i)) });

addEventListener("keydown", (ev) => {
  if (ev.target.closest("input, textarea, [contenteditable='true']")) { if (ev.key === "Escape") ev.target.blur(); return; }
  const slide = SLIDES[current];
  if (slide?.key?.(ev)) { ev.preventDefault(); return; }
  if (["ArrowRight", "PageDown"].includes(ev.key) || (ev.key === " " && !slide?.key)) { ev.preventDefault(); go(current + 1); }
  if (["ArrowLeft", "PageUp"].includes(ev.key)) { ev.preventDefault(); go(current - 1); }
  if (ev.key === "Home") go(0);
  if (ev.key === "End") go(SLIDES.length - 1);
  if (ev.key === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  if (ev.key === "g") openNav();
});

// Navigation rapide (touche G ou bouton)
function openNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = SLIDES.map((s, i) => `<button data-i="${i}" class="${i === current ? "on" : ""}">${String(i + 1).padStart(2, "0")} · ${s.title}</button>`).join("");
  nav.hidden = !nav.hidden;
  nav.onclick = (e) => { const b = e.target.closest("[data-i]"); if (b) { go(+b.dataset.i); nav.hidden = true; } };
}
document.getElementById("navbtn").onclick = openNav;
document.getElementById("prev").onclick = () => go(current - 1);
document.getElementById("next").onclick = () => go(current + 1);

addEventListener("resize", fit);
fit();

await gate();
await loadQuiz();
store.start();
store.subscribe((s) => show(s.slide ?? 0));
document.getElementById("mode").textContent = store.mode === "local" ? "local" : "sync";
setInterval(() => { document.getElementById("mode").textContent = store.mode === "local" ? "● local" : "● sync"; document.getElementById("mode").className = store.mode; }, 2000);
