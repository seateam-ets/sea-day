// Store partagé : /api/state (Redis) avec repli localStorage + BroadcastChannel.
const LS_KEY = "seaday-state";
const PW_KEY = "seaday-pw";
const listeners = new Set();
let state = {};
let mode = "remote"; // "remote" | "local"
let pending = {}; // écritures locales pas encore confirmées
const bc = "BroadcastChannel" in window ? new BroadcastChannel("seaday") : null;

const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; } };
const writeLocal = (s) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };
const emit = () => listeners.forEach((fn) => fn(state));

export const getPassword = () => { try { return sessionStorage.getItem(PW_KEY) || localStorage.getItem(PW_KEY) || ""; } catch { return ""; } };
export const setPassword = (pw) => { try { sessionStorage.setItem(PW_KEY, pw); localStorage.setItem(PW_KEY, pw); } catch {} };

async function api(method, body) {
  const r = await fetch("/api/state", {
    method,
    headers: { "x-seaday-key": getPassword(), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401) throw Object.assign(new Error("unauthorized"), { code: 401 });
  if (!r.ok) throw Object.assign(new Error("api"), { code: r.status });
  return r.json();
}

// Vérifie le mot de passe. Hors ligne / sans API → mot de passe local par défaut.
export async function checkPassword(pw) {
  setPassword(pw);
  try {
    await api("GET");
    return true;
  } catch (e) {
    if (e.code === 401) return false;
    return pw === "seaday2026"; // mode local (dev, ou stockage non configuré)
  }
}

async function pull() {
  if (mode === "local") return;
  try {
    const s = await api("GET");
    state = { ...s, ...pending };
    emit();
  } catch (e) {
    if (e.code === 503 || e.code === 404 || e.code === undefined || e.code >= 500) {
      mode = "local";
      state = { ...readLocal(), ...state };
      console.info("[seaday] mode local (pas de stockage partagé)");
      emit();
    }
  }
}

export const store = {
  get mode() { return mode; },
  get state() { return state; },
  get(k, d) { return state[k] ?? d; },
  subscribe(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); },
  async set(obj) {
    state = { ...state, ...obj };
    for (const [k, v] of Object.entries(obj)) if (v === null) delete state[k];
    emit();
    if (mode === "local") {
      writeLocal(state);
      bc?.postMessage(obj);
      return;
    }
    Object.assign(pending, obj);
    try { await api("POST", obj); } catch {}
    for (const k of Object.keys(obj)) delete pending[k];
  },
  // toutes les clés avec un préfixe
  prefix(p) {
    return Object.fromEntries(Object.entries(state).filter(([k]) => k.startsWith(p)));
  },
  start(interval = 1200) {
    state = readLocal();
    pull();
    setInterval(pull, interval);
    bc && (bc.onmessage = (ev) => { state = { ...state, ...ev.data }; emit(); });
    window.addEventListener("storage", (ev) => { if (ev.key === LS_KEY && mode === "local") { state = readLocal(); emit(); } });
  },
};

// Écran de mot de passe commun
export async function gate() {
  if (getPassword() && (await checkPassword(getPassword()))) return;
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "gate";
    el.innerHTML = `
      <form class="gate-box">
        <img src="/assets/eteamsys-logo.png" alt="eTeamsys" class="gate-logo">
        <h1>SEA Day</h1>
        <p>Accès réservé à l'équipe SEA</p>
        <input type="password" placeholder="Mot de passe" autocomplete="current-password" autofocus>
        <button type="submit">Entrer</button>
        <small class="gate-err" hidden>Mot de passe incorrect</small>
      </form>`;
    document.body.appendChild(el);
    const input = el.querySelector("input");
    el.querySelector("form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (await checkPassword(input.value.trim())) { el.remove(); resolve(); }
      else { el.querySelector(".gate-err").hidden = false; input.select(); }
    });
  });
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
