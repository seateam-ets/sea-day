// Convertit content/quiz.md en public/data/quiz.json
// Usage : node scripts/build-quiz.mjs
import { readFileSync, writeFileSync } from "node:fs";

const md = readFileSync(new URL("../content/quiz.md", import.meta.url), "utf8");
const lines = md.split("\n");
const questions = [];
let theme = "";
let q = null;
let field = null;

const push = () => { if (q) questions.push(q); q = null; };

for (const raw of lines) {
  const line = raw.trimEnd();
  let m;
  if ((m = line.match(/^## (.+)/))) { push(); theme = m[1].trim(); continue; }
  if ((m = line.match(/^### Q(\d+)\. (.+)/))) {
    push();
    q = { n: +m[1], theme, text: m[2].trim(), type: "qcm", points: 1, options: [], why: [], answer: "", clear: "", source: "", example: "" };
    field = null;
    continue;
  }
  if (!q) continue;
  if ((m = line.match(/^\*(.+)\((\d) pts?\)\*/))) {
    const t = m[1].toLowerCase();
    q.type = t.includes("ouverte") ? "open" : t.includes("vrai") ? "tf" : "qcm";
    q.points = +m[2];
    continue;
  }
  if ((m = line.match(/^- ([A-D])\. (.+)/))) {
    const correct = m[2].includes("✅");
    q.options.push({ key: m[1], text: m[2].replace("✅", "").trim(), correct });
    continue;
  }
  if ((m = line.match(/^\*\*(En clair|Source|Exemple|Réponse|Pourquoi) :\*\*\s*(.*)/))) {
    const map = { "En clair": "clear", Source: "source", Exemple: "example", "Réponse": "answer", Pourquoi: "why" };
    field = map[m[1]];
    if (field !== "why") q[field] = m[2].trim();
    continue;
  }
  if (field === "why" && (m = line.match(/^\s+- (.+)/))) { q.why.push(m[1].trim()); continue; }
}
push();

writeFileSync(new URL("../public/data/quiz.json", import.meta.url), JSON.stringify(questions, null, 1));
console.log(`${questions.length} questions, ${[...new Set(questions.map(q => q.theme))].length} thèmes`);
