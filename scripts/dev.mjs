// Serveur local : sert public/ et /api/state (sans Redis → le deck passe en mode local)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import handler from "../api/state.js";

const root = new URL("../public/", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const port = +process.env.PORT || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/state") {
    let body = ""; for await (const c of req) body += c; req.body = body;
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    return handler(req, res);
  }
  let p = normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
  if (p.endsWith("/")) p += "index.html";
  if (!extname(p)) p += ".html";
  try { const f = await readFile(join(root, p)); res.setHeader("Content-Type", types[extname(p)] || "application/octet-stream"); res.end(f); }
  catch { res.statusCode = 404; res.end("404"); }
}).listen(port, () => console.log(`SEA Day → http://localhost:${port}`));
