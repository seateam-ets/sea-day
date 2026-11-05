// État partagé du SEA Day (slide courante, tour de table, décisions, quiz…)
// Stockage : Upstash Redis (Vercel Marketplace). Variables : KV_REST_API_URL + KV_REST_API_TOKEN
// (ou UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Mot de passe : SEADAY_PASSWORD.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PASSWORD = process.env.SEADAY_PASSWORD || "seaday2026";
const KEY = "seaday:2026";
const ALLOWED = /^[a-z0-9_:.-]{1,80}$/i;

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).result;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.headers["x-seaday-key"] !== PASSWORD) return res.status(401).json({ error: "unauthorized" });
  if (!URL_ || !TOKEN) return res.status(503).json({ error: "storage_not_configured" });

  try {
    if (req.method === "GET") {
      const flat = (await redis(["HGETALL", KEY])) || [];
      const state = {};
      for (let i = 0; i < flat.length; i += 2) {
        try { state[flat[i]] = JSON.parse(flat[i + 1]); } catch { state[flat[i]] = null; }
      }
      return res.status(200).json(state);
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const entries = Object.entries(body).filter(([k]) => ALLOWED.test(k));
      if (!entries.length) return res.status(400).json({ error: "empty" });
      const del = entries.filter(([, v]) => v === null).map(([k]) => k);
      const set = entries.filter(([, v]) => v !== null).flatMap(([k, v]) => [k, JSON.stringify(v)]);
      if (set.length) await redis(["HSET", KEY, ...set]);
      if (del.length) await redis(["HDEL", KEY, ...del]);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
